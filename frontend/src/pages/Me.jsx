import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Dashboard as FolderIcon, Edit as EditIcon } from "@mui/icons-material";
import { withStyles } from "@mui/styles";
import { useAuth, fetchAsAuthenticated } from "../context/auth";
import CreateIssueCollectionDialog from "../components/Dialogs/CreateIssueCollectionDialog";
import Gravatar from "../components/Gravatar";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    marginBottom: theme.spacing(4),
  },
  accountActions: {
    flexDirection: "column",
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
  const navigate = useNavigate();
  const { authTokens, currentUser } = useAuth();
  const [nodeBoards, setNodeBoards] = useState({
    data: [],
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchBoards() {
      const res = await fetchAsAuthenticated(
        `/node_board/node_board?filter[uid.id]=${currentUser.data.id}`,
        null,
        authTokens
      );
      const json = await res.json();
      if (isMounted) {
        setNodeBoards(json);
      }
    }
    if (currentUser !== null) {
      fetchBoards();
    }
    return () => (isMounted = false);
  }, [currentUser, authTokens]);

  if (currentUser === null) {
    return null;
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <CreateIssueCollectionDialog open={open} handleClose={handleClose} />
      <Grid container spacing={4}>
        <Grid item md={6} lg={4} xl={3}>
          <Card>
            <CardContent className={classes.accountBadge}>
              <Gravatar emailHash={currentUser.data.attributes.mail_hash} />
              <Typography gutterBottom variant="subtitle2">
                {currentUser.data.attributes.mail}
              </Typography>
              <Typography gutterBottom variant="subtitle2">
                {currentUser.data.attributes.drupalorg_username}
              </Typography>
            </CardContent>
            <CardActions className={classes.accountActions}>
              <Button className={classes.acccountButtons}>Edit account</Button>
              <Button className={classes.acccountButtons}>My issues</Button>
              <Button
                className={classes.acccountButtons}
                onClick={() => setOpen(true)}
              >
                New issue collection
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={6} lg={8} xl={9}>
          <Grid>
            <Card>
              <CardActions></CardActions>
              <List>
                {nodeBoards.data.map((board) => {
                  return (
                    <ListItem
                      button
                      key={board.id}
                      onClick={() => navigate(`/node-board/${board.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={board.attributes.title} />
                      <ListItemSecondaryAction
                        onClick={() =>
                          history.push(`/node-board/${board.id}/edit`)
                        }
                      >
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
