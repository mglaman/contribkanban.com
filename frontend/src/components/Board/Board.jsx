import React from "react";
import { Grid } from "@mui/material";
import BoardList from "./List";

function Board({ board, lists, workItems }) {
  return (
    <Grid
      container
      wrap="nowrap"
      spacing={1}
      sx={{ overflowX: "auto", overflowY: "hidden", height: "100%" }}
    >
      {lists.map((list) => (
        <BoardList
          key={list.id}
          board={board}
          list={list}
          workItems={workItems}
        />
      ))}
    </Grid>
  );
}
export default Board;
