import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { getApiBaseUrl } from "../api";
import useWindowHeight from "../hooks/windowHeight";
import usePageTitle from "../hooks/pageTitle";
import KanbanBoard from "../components/Board/NodeBoard";

const styles = (theme) => ({
  root: {
    position: "relative",
    height: "100%",
  },
});

function NodeBoard({ classes }) {
  const { uuid } = useParams();
  const [currentState, setCurrentState] = useState("LOADING");
  const [board, setBoard] = useState(null);
  const [heightFix, setHeightFix] = useState("100%");
  const windowHeight = useWindowHeight();

  useEffect(() => {
    async function getBoard() {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(
        `${baseUrl}/jsonapi/node_board/node_board/${uuid}`,
        {
          headers: {
            Accept: "application/vnd.api+json",
          },
        }
      );
      if (![200].includes(res.status)) {
        setCurrentState("ERROR");
      } else {
        res
          .json()
          .then((data) => {
            setBoard(data);
            setCurrentState("OK");
          })
          .catch((err) => setCurrentState("ERROR"));
      }
    }
    getBoard();
  }, [uuid]);
  useEffect(() => {
    // toolbar height, offset.
    // @todo keep dynamic based off of styles.
    setHeightFix(windowHeight - 70);
  }, [windowHeight]);

  const boardTitle = board?.data?.attributes.title;
  usePageTitle(boardTitle ? boardTitle : "Board");
  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    return <span>Error!</span>;
  }
  return (
    <div
      className={classes.root}
      style={{
        height: heightFix,
      }}
    >
      <KanbanBoard board={board} />
    </div>
  );
}

export default withStyles(styles)(NodeBoard);
