import React from "react";
import { useParams } from 'react-router-dom';

import { Box, Grid, Container, Paper, Typography, Link } from "@mui/material";
import amazeeHosting from "./amazeeio-hosted-badge.png";
import BoardListing from "../components/BoardListing";
import usePageTitle from "../hooks/pageTitle";

const paperSx = {
  p: 2,
  mb: 4,
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
};

function Home() {
  const { boardType } = useParams();
  usePageTitle(`All boards`);
  return (
    <Box component="section" sx={{ display: "flex", mt: 2 }}>
      <Container sx={{ display: "flex", position: "relative" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={paperSx}>
              <BoardListing boardType={boardType || null} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={paperSx}>
              <Typography gutterBottom variant="h5">
                Welcome to Contrib Kanban!
              </Typography>
              <Typography gutterBottom variant="body1">
                This is a tool built by{" "}
                <Link href="https://mglaman.dev">Matt Glaman</Link>
              </Typography>
              <Typography variant="body1">
                The goal is to provide the{" "}
                <Link href="http://www.drupal.org">Drupal.org</Link> community with a
                simpler way to contribute to Drupal projects.
              </Typography>
            </Paper>
            <Paper sx={paperSx}>
              <Link href={`https://www.amazee.io/`}>
                <img src={amazeeHosting} alt="hosting provided by amazee.io" />
              </Link>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
export default Home;
