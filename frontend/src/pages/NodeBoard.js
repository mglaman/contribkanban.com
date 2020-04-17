import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import useWindowHeight from "../hooks/windowHeight";
import usePageTitle from "../hooks/pageTitle";
import KanbanBoard from "../components/Board/NodeBoard";

const styles = (theme) => ({
  root: {
    position: "relative",
    height: "100%",
  },
});

function NodeBoard({ classes, auth }) {
  const { uuid } = useParams();
  const [currentState, setCurrentState] = useState("LOADING");
  const [board, setBoard] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [heightFix, setHeightFix] = useState("100%");
  const windowHeight = useWindowHeight();

  useEffect(() => {
    async function getBoard() {
      const res = await auth.fetchAsAuthenticated(
        `/node_board/node_board/${uuid}`
      );

      const json = await res.json();
      setBoard(json);
      if (!res.ok) {
        setCurrentState("ERROR");
      } else {
        setCanEdit(
          json.data.links.self?.meta?.linkParams?.rel.includes("update")
        );
        setCurrentState("OK");
      }
    }
    getBoard();
  }, [uuid, auth]);
  useEffect(() => {
    // toolbar height, offset.
    // @todo keep dynamic based off of styles.
    let adjustment = 70;
    setHeightFix(windowHeight - adjustment);
  }, [windowHeight, canEdit]);

  const boardTitle = board?.data?.attributes.title;
  usePageTitle(boardTitle ? boardTitle : "Board");
  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    const error = board.errors[0];
    if (["403", "404"].includes(error.status)) {
      return <p>Sorry, this board does not seem to exist.</p>;
    } else {
      console.log(board);
      return <p>Oh no! An error has happened, please inspect the console</p>;
    }
  }

  return (
    <div
      className={classes.root}
      style={{
        height: heightFix,
      }}
    >
      <KanbanBoard board={board} canEdit={canEdit} />
    </div>
  );
}

export default withStyles(styles)(NodeBoard);
