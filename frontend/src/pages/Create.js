import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import usePageTitle from "../hooks/pageTitle";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  paper: {
    height: "100%",
    padding: theme.spacing(2),
  },
});

function Create({ classes }) {
  usePageTitle(`Create a new board`);
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
              <Button size="small" disabled>
                Create
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
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>Create {createType}</DialogTitle>
        <DialogContent>
          <DialogContentText>Instructions will go here</DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Foo" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Add board
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default withStyles(styles)(Create);
