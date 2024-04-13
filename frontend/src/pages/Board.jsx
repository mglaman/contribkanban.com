import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  apiFetch,
  getMappedIncludes,
  getRelationshipFromMappedIncludes,
} from "../api";
import KanbanBoard from "../components/Board/Board";
import usePageTitle from "../hooks/pageTitle";
import useWindowHeight from "../hooks/windowHeight";

const styles = (theme) => ({
  root: {
    position: "relative",
    height: "100%",
  },
  boardBar: {
    padding: theme.spacing(1, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});

function Board({ classes }) {
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
            setBoard(data);
            setCurrentState("OK");
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

  const boardTitle = board?.data?.[0]?.attributes.title;
  usePageTitle(boardTitle ? boardTitle : "Board");
  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    return <span>Error!</span>;
  }
  return (
    <div
      className={classes.root}
      style={{
        height: heightFix,
      }}
    >
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.boardBar}
      >
        <Grid item>
          <Typography component="h2" variant="h6">
            {boardTitle}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            size="small"
          >
            <InputLabel>Type</InputLabel>
            <Select
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
            variant="outlined"
            className={classes.formControl}
            size="small"
          >
            <InputLabel>Priority</InputLabel>
            <Select
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
      <KanbanBoard board={board.data[0]} lists={lists} />
    </div>
  );
}

export default withStyles(styles)(Board);
