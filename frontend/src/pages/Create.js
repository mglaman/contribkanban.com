import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import usePageTitle from "../hooks/pageTitle";
import CreateProjectDialog from "../components/Dialogs/CreateProjectDialog";
import CreateSprintDialog from "../components/Dialogs/CreateSprintDialog";
import CreateIssueCollectionDialog from "../components/Dialogs/CreateIssueCollectionDialog";
import { useAuth } from "../context/auth";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  paper: {
    height: "100%",
    padding: theme.spacing(2),
  },
});

function DialogFactory({ type, ...rest }) {
  switch (type) {
    case "project":
      return <CreateProjectDialog {...rest} />;
    case "sprint":
      return <CreateSprintDialog {...rest} />;
    case "node_board":
      return <CreateIssueCollectionDialog {...rest} />;
    case "custom":
      return null;
    default:
      return null;
  }
}

function Create({ classes }) {
  usePageTitle(`Create a new board`);
  const { authTokens } = useAuth();
  const [open, setOpen] = useState(false);
  const [createType, setCreateType] = useState(null);
  const handleClose = () => setOpen(false);

  return (
    <Container className={classes.root}>
      <Grid container justify="space-between" spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Project board
              </Typography>
              <Typography gutterBottom variant="body1" color="textSecondary">
                a board for a single project on Drupal.org
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOpen(true);
                  setCreateType("project");
                }}
              >
                Create
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Sprint board
              </Typography>
              <Typography gutterBottom variant="body1" color="textSecondary">
                a board for an issue tag
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOpen(true);
                  setCreateType("sprint");
                }}
              >
                Create
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Issue collection board
              </Typography>
              <Typography gutterBottom variant="body1" color="textSecondary">
                create a kanban board for a specific list of issues
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  setOpen(true);
                  setCreateType("node_board");
                }}
                disabled={!authTokens}
              >
                {authTokens ? `Create` : `Log in to create`}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Custom board
              </Typography>
              <Typography gutterBottom variant="body1" color="textSecondary">
                a custom board, (coming soon)
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" disabled>
                Create
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <DialogFactory type={createType} open={open} handleClose={handleClose} />
    </Container>
  );
}

export default withStyles(styles)(Create);
