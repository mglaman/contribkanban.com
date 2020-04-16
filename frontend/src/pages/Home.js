import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Container, Paper, Typography, Link } from "@material-ui/core";
import amazeeHosting from "./amazeeio-hosted-badge.png";
import BoardListing from "../components/BoardListing";
import usePageTitle from "../hooks/pageTitle";
const styles = (theme) => ({
  root: {
    display: "flex",
    marginTop: theme.spacing(2),
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

function Home({ match, classes }) {
  const { boardType } = match.params;
  usePageTitle(`All boards`);
  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper className={classes.paper}>
              <BoardListing boardType={boardType || null} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>
              <Typography gutterBottom variant="h5">
                Welcome to Contrib Kanban!
              </Typography>
              <Typography gutterBottom variant="body1">
                This is a tool built by{" "}
                <Link href="http://glamanate.com">Matt Glaman</Link>
              </Typography>
              <Typography variant="body1">
                The goal is to provide the{" "}
                <Link href="http://www.drupal.org">Drupal.org</Link> community with a
                simpler way to contribute to Drupal projects.
              </Typography>
            </Paper>
            <Paper className={classes.paper}>
              <Link href={`https://www.amazee.io/`}>
                <img src={amazeeHosting} alt="hosting provided by amazee.io" />
              </Link>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}
export default withStyles(styles)(Home);
