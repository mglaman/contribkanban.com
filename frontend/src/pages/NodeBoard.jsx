import React, { useState, useEffect } from "react";
import { Box, IconButton, Grid, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { Link } from "react-router";
import { useParams } from "react-router";
import { useAuth, fetchAsAuthenticated } from "../context/auth";
import useWindowHeight from "../hooks/windowHeight";
import usePageTitle from "../hooks/pageTitle";
import KanbanBoard from "../components/Board/NodeBoard";
import { useAppBar } from "../context/appBar";

function NodeBoard() {
  const { uuid } = useParams();
  const { authTokens } = useAuth();
  const { setActions } = useAppBar();
  const [currentState, setCurrentState] = useState("LOADING");
  const [board, setBoard] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [heightFix, setHeightFix] = useState("100%");
  const windowHeight = useWindowHeight();

  useEffect(() => {
    async function getBoard() {
      const res = await fetchAsAuthenticated(
        `/node_board/node_board/${uuid}`,
        null,
        authTokens
      );

      const json = await res.json();
      setBoard(json);
      if (!res.ok) {
        setCurrentState("ERROR");
      } else {
        if (json.data.links.self?.meta?.linkParams?.rel.includes("update")) {
          setCanEdit(true);
          setActions([
            <IconButton
              component={Link}
              to={`/node-board/${uuid}/edit`}
              color="inherit"
              size="small"
              aria-label="edit"
              key="edit-node-board"
            >
              <EditIcon />
            </IconButton>,
          ]);
        }
        setCurrentState("OK");
      }
    }
    getBoard();
  }, [uuid, authTokens, setActions]);
  useEffect(() => {
    // toolbar height, offset.
    // @todo keep dynamic based off of styles.
    setHeightFix(windowHeight - 70 - 36 - 40);
  }, [windowHeight, canEdit]);

  const boardTitle = board?.data?.attributes.title;
  usePageTitle(boardTitle ? boardTitle : "Board");
  if (currentState === "LOADING") {
    return <span>Loading...</span>;
  }
  if (currentState === "ERROR") {
    const error = board.errors[0];
    if (["403", "404"].includes(error.status)) {
      return <p>Sorry, this board does not seem to exist.</p>;
    } else {
      console.log(board);
      return <p>Oh no! An error has happened, please inspect the console</p>;
    }
  }

  return (
    <Box sx={{ position: "relative", height: heightFix }}>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          px: 2,
        }}
      >
        <Grid>
          <Typography component="h2" variant="h6">
            {boardTitle}
          </Typography>
        </Grid>
      </Grid>
      <KanbanBoard board={board} canEdit={canEdit} />
    </Box>
  );
}

export default NodeBoard;
