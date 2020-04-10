import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper } from "@material-ui/core";
import qs from "qs";
import { drupalApiFetch } from "../../api";
import KanbanCard from "./Card";

const styles = (theme) => ({
  root: {
    overflowX: "auto",
    overflowY: "hidden",
    height: "100%",
    flexWrap: "nowrap",
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    height: "100%",
    overflow: "scroll",
  },
  item: {
    flex: "0 0 380px",
    maxWidth: "380px",
    position: "relative",
    transform: "translate3d(0, 0, 0)",
    maxHeight: "100%",
  },
});

function NodeBoard({ board, classes }) {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    async function fetchIssues() {
      const nids = board.data.attributes.nids;
      if (nids.length === 0) {
        setIssues([]);
        return;
      }
      const res = await drupalApiFetch(
        `/node.json?${qs.stringify({
          nid: nids,
        })}`
      );
      if (!res.ok) {
        setIssues([]);
      }
      const json = await res.json();
      setIssues(json.list);
    }
    if (board) {
      fetchIssues();
    }
  }, [board]);

  if (!board) {
    return <p>Loading...</p>;
  }

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.item}>
        <Paper elevation={0} className={classes.paper}>
          <Typography variant="subtitle1">Postponed</Typography>
          {issues
            .filter((item) => {
              return [4, 16].includes(parseInt(item.field_issue_status));
            })
            .map((item) => (
              <KanbanCard key={item.nid} data={item} />
            ))}
        </Paper>
      </Grid>
      <Grid item className={classes.item}>
        <Paper elevation={0} className={classes.paper}>
          <Typography variant="subtitle1">Active</Typography>
          {issues
            .filter((item) => {
              return [1].includes(parseInt(item.field_issue_status));
            })
            .map((item) => (
              <KanbanCard key={item.nid} data={item} />
            ))}
        </Paper>
      </Grid>
      <Grid item className={classes.item}>
        <Paper elevation={0} className={classes.paper}>
          <Typography variant="subtitle1">Needs work</Typography>
          {issues
            .filter((item) => {
              return [13].includes(parseInt(item.field_issue_status));
            })
            .map((item) => (
              <KanbanCard key={item.nid} data={item} />
            ))}
        </Paper>
      </Grid>
      <Grid item className={classes.item}>
        <Paper elevation={0} className={classes.paper}>
          <Typography variant="subtitle1">Needs review</Typography>
          {issues
            .filter((item) => {
              return [8].includes(parseInt(item.field_issue_status));
            })
            .map((item) => (
              <KanbanCard key={item.nid} data={item} />
            ))}
        </Paper>
      </Grid>
      <Grid item className={classes.item}>
        <Paper elevation={0} className={classes.paper}>
          <Typography variant="subtitle1">Reviewed & tested</Typography>
          {issues
            .filter((item) => {
              return [14, 15].includes(parseInt(item.field_issue_status));
            })
            .map((item) => (
              <KanbanCard key={item.nid} data={item} />
            ))}
        </Paper>
      </Grid>
      <Grid item className={classes.item}>
        <Paper elevation={0} className={classes.paper}>
          <Typography variant="subtitle1">Fixed</Typography>
          {issues
            .filter((item) => {
              return [2, 7].includes(parseInt(item.field_issue_status));
            })
            .map((item) => (
              <KanbanCard key={item.nid} data={item} />
            ))}
        </Paper>
      </Grid>
    </Grid>
  );
}
export default withStyles(styles)(NodeBoard);
