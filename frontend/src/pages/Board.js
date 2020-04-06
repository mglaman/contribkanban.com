import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import {
  getApiBaseUrl,
  getMappedIncludes,
  getRelationshipFromMappedIncludes,
} from "../api";
import { Grid, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import useWindowHeight from "../hooks/windowHeight";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";

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
    flex: "0 0 340px",
    position: "relative",
    transform: "translate3d(0, 0, 0)",
    maxHeight: "100%",
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(0.5),
    height: "100%",
  },
});

function Board({ classes }) {
  const { machineName } = useParams();
  const [currentState, setCurrentState] = useState("LOADING");
  const [board, setBoard] = useState(null);
  const [heightFix, setHeightFix] = useState("100%");
  const windowHeight = useWindowHeight();

  async function getBoard() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(
      `${baseUrl}/jsonapi/index/boards?filter[machine_name]=${machineName}&include=lists`,
      {
        headers: {
          Accept: "application/vnd.api+json",
        },
      }
    );
    if (![200, 201, 204].includes(res.status)) {
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
  useEffect(() => {
    getBoard();
  }, [machineName]);
  useEffect(() => {
    // toolbar height, offset.
    // @todo keep dynamic based off of styles.
    setHeightFix(windowHeight - 70 - 32);
  }, [windowHeight]);

  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    return <span>Error!</span>;
  }

  const mappedIncludes = getMappedIncludes(board);
  const lists = getRelationshipFromMappedIncludes(
    board.data[0],
    "lists",
    mappedIncludes
  );
  return (
    <div
      className={classes.root}
      style={{
        height: heightFix,
      }}
    >
      <Grid container className={classes.gridContainer}>
        {lists.map((list) => {
          return (
            <Grid item key={list.id} className={classes.gridItem}>
              <Paper className={classes.paper}>
                <Typography variant="subtitle1">
                  {list.attributes.title} ()
                </Typography>
                <Card variant="outlined">
                  <CardContent>Issue summary</CardContent>
                  <CardActions>
                    <Chip label="BRANCH" size="small" />
                    <Chip label="PRIORITY" size="small" />
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Board);
