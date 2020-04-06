import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import amazeeHosting from "./amazeeio-hosted-badge.png";
import BoardListing from "../components/BoardListing";

const styles = (theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
  },
  container: {
    // marginTop: theme.spacing(15),
    // marginBottom: theme.spacing(30),
    display: "flex",
    position: "relative",
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
});

function Home({ classes }) {
  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper className={classes.paper}>
              <BoardListing />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Welcome to Contrib Kanban!</Typography>
              <Typography variant="body1">
                This is a tool built by{" "}
                <a href="http://glamanate.com">Matt Glaman</a>
              </Typography>
              <Typography variant="body1">
                The goal is to provide the{" "}
                <a href="http://www.drupal.org">Drupal.org</a> community with a
                simpler way to contribute to Drupal projects.
              </Typography>
            </Paper>
            <Paper className={classes.paper}>
              <a href={`https://www.amazee.io/`}>
                <img src={amazeeHosting} alt="hosting provided by amazee.io" />
              </a>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}
export default withStyles(styles)(Home);
