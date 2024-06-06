import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { legacyApiFetch, drupalApiFetch } from "../../api";

function CreateSprintDialog({ open, handleClose }) {
  const navigate = useNavigate();
  const [tagName, setTagName] = useState("");
  const [currentState, setCurrentState] = useState("OK");
  const [message, setMessage] = useState(null);

  async function addBoard() {
    if (tagName === "") {
      setCurrentState("ERROR");
      setMessage("Machine name cannot be empty.");
      return;
    }
    setCurrentState("LOADING");
    setMessage(null);

    const projectListRes = await drupalApiFetch(
      `/taxonomy_term.json?name=${tagName}`
    );
    const projectListJson = await projectListRes.json();
    if (projectListJson.list.length === 0) {
      setCurrentState("ERROR");
      setMessage(`Cannot find a project for "${tagName}"`);
      return;
    }

    legacyApiFetch(`/api/boards/add/tag/${tagName}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then(() => useNavigate(`/board/${tagName}`))
      .catch((err) => {
        setCurrentState("ERROR");
        setMessage("Error adding board, see console.");
        console.log(err);
      });
  }

  useEffect(() => {
    setCurrentState("OK");
    setMessage(null);
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <DialogTitle>Create sprint board</DialogTitle>
      <DialogContent>
        <DialogContentText>Create a board for an issue tag.</DialogContentText>
        {message ? (
          <DialogContentText color="error">{message}</DialogContentText>
        ) : null}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addBoard();
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tag name"
            fullWidth
            value={tagName}
            onChange={(event) => setTagName(event.target.value)}
            disabled={currentState === "LOADING"}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={currentState === "LOADING"}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={addBoard}
          disabled={currentState === "LOADING"}
          color="primary"
        >
          Add board
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default CreateSprintDialog;
