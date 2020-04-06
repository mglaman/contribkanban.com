import React from "react";
import { Container, Paper, Grid } from "@material-ui/core";
import usePageTitle from "../hooks/pageTitle";

function Create() {
  usePageTitle(`Create a new board`);
  return (
    <Container>
      <Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            Test
          </Grid>
          <Grid item xs={12} md={4}>
            <p>
              <strong>Project</strong> a board for a single project on
              Drupal.org
            </p>
            <p>
              <strong>Sprint</strong> a board for an issue tag
            </p>
            <p>
              <strong>Custom</strong> a custom board, coming soon and requires
              an account.
            </p>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Create;
