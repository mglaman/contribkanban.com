import React from "react";
import { withStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import BoardList from "./List";

const styles = () => ({
  root: {
    overflowX: "auto",
    overflowY: "hidden",
    height: "100%",
  },
});

function Board({ board, lists, workItems, classes }) {
  return (
    <Grid container wrap="nowrap" className={classes.root} spacing={1}>
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
export default withStyles(styles)(Board);
