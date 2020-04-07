import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import BoardList from "./List";

const styles = (theme) => ({
  root: {
    position: "relative",
    height: "100%",
  },
  gridContainer: {
    overflowX: "auto",
    overflowY: "hidden",
    height: "100%",
    flexWrap: "nowrap",
  },
  gridItem: {
    flex: "0 0 380px",
    position: "relative",
    transform: "translate3d(0, 0, 0)",
    maxHeight: "100%",
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    height: "100%",
  },
});

function Board({ board, lists, classes }) {
  return (
    <Grid container className={classes.gridContainer}>
      {lists.map((list) => (
        <BoardList key={list.id} board={board} list={list.attributes} />
      ))}
    </Grid>
  );
}
export default withStyles(styles)(Board);
