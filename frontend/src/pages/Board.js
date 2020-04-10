import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import {
  apiFetch,
  getMappedIncludes,
  getRelationshipFromMappedIncludes,
} from "../api";
import useWindowHeight from "../hooks/windowHeight";
import usePageTitle from "../hooks/pageTitle";
import KanbanBoard from "../components/Board/Board";

const styles = () => ({
  root: {
    position: "relative",
    height: "100%",
  },
});

function Board({ classes }) {
  const { machineName } = useParams();
  const [currentState, setCurrentState] = useState("LOADING");
  const [board, setBoard] = useState(null);
  const [heightFix, setHeightFix] = useState("100%");
  const windowHeight = useWindowHeight();

  useEffect(() => {
    async function getBoard() {
      const res = await apiFetch(
        `/index/boards?filter[machine_name]=${machineName}&include=lists`
      );
      if (!res.ok) {
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
  }, [machineName]);
  useEffect(() => {
    // toolbar height, offset.
    // @todo keep dynamic based off of styles.
    setHeightFix(windowHeight - 70);
  }, [windowHeight]);

  const boardTitle = board?.data?.[0].attributes.title;
  usePageTitle(boardTitle ? boardTitle : "Board");
  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    return <span>Error!</span>;
  }
  const mappedIncludes = getMappedIncludes(board);
  const lists = getRelationshipFromMappedIncludes(
    board.data[0],
    "lists",
    mappedIncludes
  );
  return (
    <div
      className={classes.root}
      style={{
        height: heightFix,
      }}
    >
      <KanbanBoard board={board.data[0]} lists={lists} />
    </div>
  );
}

export default withStyles(styles)(Board);
