import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  ButtonGroup,
  TextField,
  FormControl,
  Grid,
} from "@material-ui/core";
import { Folder as FolderIcon } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import qs from "qs";
import { apiFetch } from "../api";

const styles = (theme) => ({
  margin: {
    marginBottom: theme.spacing(2),
  },
});

function BoardListing({ boardType, classes }) {
  const [currentState, setCurrentState] = useState("LOADING");
  const [boards, setBoards] = useState({});
  const [apiSearchUrl, setApiSearchUrl] = useState();
  const [filterName, setFilterName] = useState("");

  function PagerButton({ link, text }) {
    return (
      <Button
        onClick={() => setApiSearchUrl(link.href)}
        disabled={!link || !link.href}
      >
        {text}
      </Button>
    );
  }
  function PagerButtonGroup({ links }) {
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <ButtonGroup variant="text" color="primary">
          <PagerButton link={links?.prev} text={`Previous`} />
          <PagerButton link={links?.next} text={`Next`} />
        </ButtonGroup>
        <ButtonGroup variant="text" color="primary">
          <PagerButton link={links?.last} text={`Last`} />
          <PagerButton link={links?.first} text={`First`} />
        </ButtonGroup>
      </Grid>
    );
  }

  function BoardList({ boards }) {
    if (currentState === "LOADING") {
      return <span>Loading...</span>;
    }
    if (currentState === "ERROR") {
      return <span>Error!</span>;
    }
    if (currentState !== "OK") {
      return <span>Unknown state</span>;
    }
    return (
      <List>
        {boards.data.map((board) => {
          return (
            <ListItem
              button
              key={board.id}
              underline="none"
              color="inherit"
              component={RouterLink}
              to={`/board/${board.attributes.machine_name}`}
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={board.attributes.title} />
            </ListItem>
          );
        })}
      </List>
    );
  }

  useEffect(() => {
    setFilterName("");
    const query = {
      sort: "title",
      page: {
        limit: 10,
      },
    };
    if (boardType) {
      query.filter = {
        board_type: `drupalorg_${boardType}`,
      };
    }
    setApiSearchUrl(`/index/boards?${qs.stringify(query)}`);
  }, [boardType]);

  useEffect(() => {
    async function getBoards() {
      const res = await apiFetch(apiSearchUrl);
      if (res.status !== 200) {
        setCurrentState("ERROR");
      } else {
        const json = await res.json();
        setBoards(json);
        setCurrentState("OK");
      }
    }
    if (apiSearchUrl) {
      getBoards();
    }
  }, [apiSearchUrl]);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (filterName !== "") {
        const query = {
          sort: "title",
          filter: {
            fulltext: filterName,
          },
          page: {
            limit: 10,
          },
        };
        if (boardType) {
          query.filter.board_type = `drupalorg_${boardType}`;
        }
        setApiSearchUrl(`/index/boards?${qs.stringify(query)}`);
      }
    }, 300);
    return () => clearTimeout(typingTimer);
  }, [filterName, boardType]);

  return (
    <section>
      <form>
        <FormControl fullWidth className={classes.margin}>
          <TextField
            label="Search"
            variant="standard"
            value={filterName}
            onChange={(event) => setFilterName(event.target.value)}
          />
        </FormControl>
      </form>
      <PagerButtonGroup links={boards.links} />
      <BoardList boards={boards} />
      <PagerButtonGroup links={boards.links} />
    </section>
  );
}

export default withStyles(styles)(BoardListing);
