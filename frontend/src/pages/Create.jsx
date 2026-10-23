import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import usePageTitle from "../hooks/pageTitle";
import CreateProjectDialog from "../components/Dialogs/CreateProjectDialog";
import CreateSprintDialog from "../components/Dialogs/CreateSprintDialog";
import CreateIssueCollectionDialog from "../components/Dialogs/CreateIssueCollectionDialog";
import { useAuth } from "../context/auth";

function DialogFactory({ type, ...rest }) {
  switch (type) {
    case "project":
      return <CreateProjectDialog {...rest} />;
    case "sprint":
      return <CreateSprintDialog {...rest} />;
    case "node_board":
      return <CreateIssueCollectionDialog {...rest} />;
    default:
      return null;
  }
}

function Create() {
  usePageTitle(`Create a new board`);
  const { authTokens } = useAuth();
  const [open, setOpen] = useState(false);
  const [createType, setCreateType] = useState(null);
  const handleClose = () => setOpen(false);

  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Project board
              </Typography>
              <Typography gutterBottom variant="body1" color="text.secondary">
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
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Sprint board
              </Typography>
              <Typography gutterBottom variant="body1" color="text.secondary">
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
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5">
                Issue collection board
              </Typography>
              <Typography gutterBottom variant="body1" color="text.secondary">
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
      </Grid>
      <DialogFactory type={createType} open={open} handleClose={handleClose} />
    </Container>
  );
}

export default Create;
