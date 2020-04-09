import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
} from "@material-ui/core";
import { Dashboard as FolderIcon, Edit as EditIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { useAuth } from "../context/auth";
import Gravatar from "../components/Gravatar";
import { getApiBaseUrl } from "../api";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    marginBottom: theme.spacing(4),
  },
  acccountButtons: {
    width: "100%",
  },
  accountBadge: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
});

function Me({ classes }) {
  const history = useHistory();
  const { auth, currentUser } = useAuth();
  const [nodeBoards, setNodeBoards] = useState({
    data: [],
  });
  useEffect(() => {
    console.log(currentUser);
    async function fetchBoards() {
      const res = await auth.fetchAsAuthenticated(
        `${getApiBaseUrl()}/jsonapi/node_board/node_board?filter[uid.id]=${
          currentUser.data.id
        }`
      );
      const json = await res.json();
      setNodeBoards(json);
      console.log(json);
    }
    if (currentUser !== null) {
      fetchBoards();
    }
  }, [currentUser, auth]);

  if (currentUser === null) {
    return null;
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <Grid container spacing={4}>
        <Grid item md={6} lg={4} xl={3}>
          <Card>
            <CardContent className={classes.accountBadge}>
              <Gravatar emailHash={"tdodoneedhash"} />
              <Typography gutterBottom variant="subtitle2">
                {currentUser.data.attributes.mail}
              </Typography>
              <Typography gutterBottom variant="subtitle2">
                {currentUser.data.attributes.drupalorg_username}
              </Typography>
            </CardContent>
            <CardActions>
              <Button className={classes.acccountButtons}>Edit account</Button>
              <Button className={classes.acccountButtons}>My issues</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={6} lg={8} xl={9}>
          <Grid>
            <Card>
              <List>
                {nodeBoards.data.map((board) => {
                  return (
                    <ListItem
                      button
                      key={board.id}
                      onClick={() => {
                        history.push(`/node-board/${board.id}`);
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={board.attributes.title} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
export default withStyles(styles)(Me);
