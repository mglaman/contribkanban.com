import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import qs from "qs";
import { drupalApiFetch } from "../../api";
import { filterIssues } from "../../island/gitlab";
import KanbanCard from "./Card";

function BoardList({ board, list, workItems }) {
  const [currentState, setCurrentState] = useState("LOADING");
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    if (workItems) {
      setCurrentState(workItems.state);
      setListItems(filterIssues(workItems.issues, list.attributes));
      return;
    }
    async function fetchListItems() {
      const filterData = {
        ...list.attributes,
        project_nid: list.attributes.project_nid.concat(
          board.attributes.project_nid
        ),
        tag: list.attributes.tag.concat(board.attributes.tag),
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
  }, [board, list, workItems]);

  return (
    <Grid
      key={list.id}
      sx={{
        flex: "0 0 320px",
        maxWidth: "320px",
        position: "relative",
        transform: "translate3d(0, 0, 0)",
        maxHeight: "100%",
      }}
    >
      <Paper
        elevation={0}
        sx={{ p: 1, height: "100%", overflow: "scroll" }}
      >
        <Typography gutterBottom variant="subtitle1">
          {list.attributes.title} ({listItems.length})
        </Typography>
        {currentState === "ERROR" ? (
          <span>Could not load issues.</span>
        ) : currentState !== "OK" ? (
          <span>Loading...</span>
        ) : (
          listItems.map((item) => <KanbanCard key={item.nid} data={item} />)
        )}
      </Paper>
    </Grid>
  );
}
export default BoardList;
