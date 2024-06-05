import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography } from "@material-ui/core";
import qs from "qs";
import { drupalApiFetch } from "../../api";
import KanbanCard from "./Card";

const styles = (theme) => ({
  gridItem: {
    flex: "0 0 320px",
    maxWidth: "320px",
    position: "relative",
    transform: "translate3d(0, 0, 0)",
    maxHeight: "100%",
  },
  paper: {
    padding: theme.spacing(1),
    // margin: theme.spacing(1),
    height: "100%",
    overflow: "scroll",
  },
});

function BoardList({ board, list, classes }) {
  const [currentState, setCurrentState] = useState("LOADING");
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    async function fetchListItems() {
      const filterData = {
        ...list.attributes,
        project_nid: list.attributes.project_nid.concat(
          board.attributes.project_nid
        ),
        tag: list.attributes.tag.concat(board.attributes.tag),
        parent_issue: board.attributes.parent_issue
          ? board.attributes.parent_issue
          : list.attributes.parent_issue,
        version: list.attributes.version
          .concat(board.attributes.version)
          .map((version) =>
            version.substr(-2) === ".x" ? `${version}-dev` : version
          ),
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
          value: filterData.version,
        };
      }
      if (filterData.category !== null) {
        queryString["field_issue_category"] = filterData.category;
      }
      if (filterData.component !== null) {
        queryString["field_issue_component"] = filterData.component;
      }
      if (filterData.parent_issue && filterData.parent_issue.trim()) {
        queryString["field_issue_parent"] = {
          target_id: filterData.parent_issue.trim().split(","),
        };
      }
      if (filterData.priority !== null) {
        queryString["field_issue_priority"] = filterData.priority;
      }

      const res = await drupalApiFetch(
        `/node.json?${qs.stringify(queryString)}`
      );
      if (!res.ok) {
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
    setListItems([]);
    setCurrentState("LOADING");
    fetchListItems();
  }, [board, list]);

  return (
    <Grid item key={list.id} className={classes.gridItem}>
      <Paper elevation={0} className={classes.paper}>
        <Typography gutterBottom variant="subtitle1">
          {list.attributes.title} ({listItems.length})
        </Typography>
        {currentState !== "OK"
          ? [<span key={list.id}>Loading...</span>]
          : listItems.map((item) => <KanbanCard key={item.nid} data={item} />)}
      </Paper>
    </Grid>
  );
}
export default withStyles(styles)(BoardList);
