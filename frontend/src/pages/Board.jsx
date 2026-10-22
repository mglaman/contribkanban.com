import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useParams, Link } from "react-router";
import {
  apiFetch,
  getMappedIncludes,
  getRelationshipFromMappedIncludes,
} from "../api";
import useWindowHeight from "../hooks/windowHeight";
import usePageTitle from "../hooks/pageTitle";
import useProjectWorkItems from "../hooks/projectWorkItems";
import KanbanBoard from "../components/Board/Board";

function Board() {
  const { machineName } = useParams();
  const [currentState, setCurrentState] = useState("LOADING");
  const [board, setBoard] = useState(null);
  const [lists, setBoardLists] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
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
            if (data.data && data.data.length === 0) {
              setCurrentState("NOT_FOUND");
            } else {
              setBoard(data);
              setCurrentState("OK");
            }
          })
          .catch((err) => setCurrentState("ERROR"));
      }
    }
    getBoard();
  }, [machineName]);
  useEffect(() => {
    // toolbar height, offset. filters.
    // @todo keep dynamic based off of styles.
    setHeightFix(windowHeight - 70 - 36 - 40);
  }, [windowHeight]);

  useEffect(() => {
    if (board !== null) {
      const mappedIncludes = getMappedIncludes(board);
      const lists = getRelationshipFromMappedIncludes(
        board.data[0],
        "lists",
        mappedIncludes
      );
      const newLists = lists.map((item) => ({
        ...item,
        attributes: {
          ...item.attributes,
          category: filterCategory === "" ? null : filterCategory,
          priority: filterPriority === "" ? null : filterPriority,
        },
      }));

      setBoardLists(newLists);
    }
  }, [board, filterCategory, filterPriority]);

  const workItems = useProjectWorkItems(board?.data?.[0]);
  const boardTitle = board?.data?.[0].attributes.title;
  usePageTitle(boardTitle ? boardTitle : "Board");
  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    return <span>Error!</span>;
  }
  if (currentState === "NOT_FOUND") {
    return (
      <Grid
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          p: 5,
        }}
      >
        <Grid style={{ textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Board "{machineName}" not found
          </Typography>
          <Typography variant="body1">
            <Link to="/create">Click here to create it.</Link>
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <Box sx={{ position: "relative", height: heightFix }}>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          px: 2,
        }}
      >
        <Grid>
          <Typography component="h2" variant="h6">
            {boardTitle}
          </Typography>
          {workItems ? (
            <Typography variant="caption" color="text.secondary">
              Work items from git.drupalcode.org
            </Typography>
          ) : null}
        </Grid>
        <Grid>
          <FormControl
          sx={{ m: 1, minWidth: 120 }}
            variant="outlined"
            size="small"
          >
            <InputLabel id="filter-type-label">Type</InputLabel>
            <Select
              labelId="filter-type-label"
              label="Type"
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value={1}>Bug</MenuItem>
              <MenuItem value={2}>Task</MenuItem>
              <MenuItem value={3}>Feature</MenuItem>
              <MenuItem value={4}>Support</MenuItem>
              <MenuItem value={5}>Plan</MenuItem>
            </Select>
          </FormControl>
          <FormControl
          sx={{ m: 1, minWidth: 120 }}
            variant="outlined"
            size="small"
          >
            <InputLabel id="filter-priority-label">Priority</InputLabel>
            <Select
              labelId="filter-priority-label"
              label="Priority"
              value={filterPriority}
              onChange={(event) => setFilterPriority(event.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value={400}>Critical</MenuItem>
              <MenuItem value={300}>Major</MenuItem>
              <MenuItem value={200}>Normal</MenuItem>
              <MenuItem value={100}>Minor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <KanbanBoard
        board={board.data[0]}
        lists={lists}
        workItems={workItems}
      />
    </Box>
  );
}

export default Board;
