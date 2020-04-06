import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Dashboard";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";

import { Link as RouterLink } from "react-router-dom";
import { FormControl } from "@material-ui/core";
import { getApiHostname } from "../api";

const styles = (theme) => ({
  margin: {
    marginBottom: theme.spacing(2),
  },
});

function BoardListing({ classes }) {
  const baseApiSearchUrl = `https://${getApiHostname()}/jsonapi/index/boards?sort=title`;
  const [currentState, setCurrentState] = useState("LOADING");
  const [boards, setBoards] = useState({});
  const [apiSearchUrl, setApiSearchUrl] = useState(baseApiSearchUrl);
  const [filterName, setFilterName] = useState("");

  function PagerButton({ link, text }) {
    return (
      <Button
        disableRipple
        onClick={() => setApiSearchUrl(link.href)}
        disabled={!link || !link.href}
      >
        {text}
      </Button>
    );
  }
  function PagerButtonGroup({ links }) {
    return (
      <React.Fragment>
        <ButtonGroup variant="text" color="primary">
          <PagerButton link={links.next} text={`Next`} />
          <PagerButton link={links.prev} text={`Previous`} />
        </ButtonGroup>
        <ButtonGroup variant="text" color="primary">
          <PagerButton link={links.first} text={`First`} />
          <PagerButton link={links.last} text={`Last`} />
        </ButtonGroup>
      </React.Fragment>
    );
  }
  async function getBoards() {
    const res = await fetch(apiSearchUrl, {
      headers: {
        Accept: "application/vnd.api+json",
      },
    });
    if (![200, 201, 204].includes(res.status)) {
      setCurrentState("ERROR");
    } else {
      res
        .json()
        .then((data) => {
          setBoards(data);
          setCurrentState("OK");
        })
        .catch((err) => setCurrentState("ERROR"));
    }
  }

  useEffect(() => {
    getBoards();
  }, [apiSearchUrl]);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setApiSearchUrl(`${baseApiSearchUrl}&filter[fulltext]=${filterName}`);
    }, 300);
    return () => clearTimeout(typingTimer);
  }, [filterName]);

  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    return <span>Error!</span>;
  }
  if (currentState === "OK") {
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
        <List>
          {boards.data.map((board) => {
            return (
              <ListItem
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
        <PagerButtonGroup links={boards.links} />
      </section>
    );
  }
  return <span>Unknown state</span>;
}

export default withStyles(styles)(BoardListing);
