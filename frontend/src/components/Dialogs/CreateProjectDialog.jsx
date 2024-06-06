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

function CreateProjectDialog({ open, handleClose }) {
  const navigate = useNavigate();
  const [machineName, setMachineName] = useState("");
  const [currentState, setCurrentState] = useState("OK");
  const [message, setMessage] = useState(null);

  async function addBoard() {
    if (machineName === "") {
      setCurrentState("ERROR");
      setMessage("Machine name cannot be empty.");
      return;
    }
    setCurrentState("LOADING");
    setMessage(null);

    const projectListRes = await drupalApiFetch(
      `/node.json?field_project_machine_name=${machineName}`
    );
    const projectListJson = await projectListRes.json();
    if (projectListJson.list.length === 0) {
      setCurrentState("ERROR");
      setMessage(`Cannot find a project for "${machineName}"`);
      return;
    }

    try {
      const res = await legacyApiFetch(`/api/boards/add/${machineName}`, {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok) {
        navigate(`/board/${machineName}`);
      } else {
        setCurrentState("ERROR");
        setMessage("Error adding board, see console.");
        console.log(json);
      }
    } catch (error) {
      setCurrentState("ERROR");
      setMessage("Error adding board, see console.");
      console.log(error);
    }
  }

  useEffect(() => {
    setCurrentState("OK");
    setMessage(null);
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <DialogTitle>Create project board</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a board for a specific Drupal.org project by entering in its{" "}
          <em>machine name</em> below.
        </DialogContentText>
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
            label="Project machine name"
            fullWidth
            value={machineName}
            onChange={(event) => setMachineName(event.target.value)}
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
export default CreateProjectDialog;
