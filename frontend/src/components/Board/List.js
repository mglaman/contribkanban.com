import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import qs from "qs";
import { Grid, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import KanbanCard from "./Card";

const styles = (theme) => ({
  gridItem: {
    flex: "0 0 380px",
    maxWidth: "380px",
    position: "relative",
    transform: "translate3d(0, 0, 0)",
    maxHeight: "100%",
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    height: "100%",
    overflow: "scroll",
  },
});

function BoardList({ board, list, classes }) {
  const [currentState, setCurrentState] = useState("LOADING");
  const [listItems, setListItems] = useState([]);

  async function fetchListItems() {
    const filterData = {
      ...list,
      project_nid: list.project_nid.concat(board.attributes.project_nid),
      tag: list.tag.concat(board.attributes.tag),
      parent_issue: board.attributes.parent_issue
        ? board.attributes.parent_issue
        : list.parent_issue,
      version: list.version.concat(board.attributes.version),
    };
    const queryString = {
      limit: 100,
      type: "project_issue",
      sort: "field_issue_priority",
      direction: "DESC",
      field_project: {
        target_id: filterData.project_nid,
      },
      field_issue_status: {
        value: filterData.statuses,
      },
    };

    if (filterData.tag.length > 0) {
      queryString["taxonomy_vocabulary_9"] = {
        tid: filterData.tag,
      };
    }
    if (filterData.version.length > 0) {
      queryString["field_issue_version"] = {
        value: filterData.tag,
      };
    }
    if (filterData.category !== null) {
      queryString["field_issue_category"] = filterData.category;
    }
    if (filterData.component !== null) {
      queryString["field_issue_component"] = filterData.component;
    }
    if (filterData.parent_issue !== null) {
      queryString["field_issue_parent"] = filterData.parent_issue;
    }
    if (filterData.priority !== null) {
      queryString["field_issue_priority"] = filterData.priority;
    }

    const apiUrl = `https://www.drupal.org/api-d7/node.json?${qs.stringify(
      queryString
    )}`;
    console.log(apiUrl);

    const res = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
    });
    if (![200].includes(res.status)) {
      setCurrentState("ERROR");
      setListItems([]);
    } else {
      res
        .json()
        .then((data) => {
          setListItems(data.list);
          setCurrentState("OK");
        })
        .catch((err) => {
          setCurrentState("ERROR");
          setListItems([]);
        });
    }
  }

  useEffect(() => {
    fetchListItems();
  }, [board, list]);

  return (
    <Grid item key={list.id} className={classes.gridItem}>
      <Paper elevation={0} className={classes.paper}>
        <Typography variant="subtitle1">
          {list.title} ({listItems.length})
        </Typography>
        {currentState !== "OK"
          ? [<span>Loading...</span>]
          : listItems.map((item) => <KanbanCard key={item.nid} data={item} />)}
      </Paper>
    </Grid>
  );
}
export default withStyles(styles)(BoardList);
