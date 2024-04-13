import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import BoardList from "./List";

const styles = () => ({
  root: {
    overflowX: "auto",
    overflowY: "hidden",
    height: "100%",
    flexWrap: "nowrap",
  },
});

function Board({ board, lists, classes }) {
  return (
    <Grid container className={classes.root} spacing={1}>
      {lists.map((list) => (
        <BoardList key={list.id} board={board} list={list} />
      ))}
    </Grid>
  );
}
export default withStyles(styles)(Board);
