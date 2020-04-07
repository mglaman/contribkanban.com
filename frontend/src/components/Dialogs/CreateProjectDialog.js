import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { getApiBaseUrl } from "../../api";

function CreateProjectDialog({ open, handleClose }) {
  const history = useHistory();
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

    const projectListRes = await fetch(
      `https://www.drupal.org/api-d7/node.json?field_project_machine_name=${machineName}`
    );
    const projectListJson = await projectListRes.json();
    if (projectListJson.list.length === 0) {
      setCurrentState("ERROR");
      setMessage(`Cannot find a project for "${machineName}"`);
      return;
    }
    const apiUrl = `${getApiBaseUrl()}/api/boards/add/${machineName}`;
    const res = await fetch(apiUrl, {
      method: "POST",
    });
    const json = await res.json();
    console.log(json);
    if (!res.ok) {
      setCurrentState("ERROR");
      setMessage("Error adding board, see console.");
      console.log(res);
    }
    history.push(`/board/${machineName}`);
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
