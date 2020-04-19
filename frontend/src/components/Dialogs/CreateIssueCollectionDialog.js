import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useAuth, fetchAsAuthenticated } from "../../context/auth";

const styles = (theme) => ({
  collaboration: {
    marginTop: theme.spacing(2),
  },
});

function CreateIssueCollectionDialog({ classes, open, handleClose }) {
  const history = useHistory();
  const { authTokens } = useAuth();
  const [boardTitle, setBoardTitle] = useState();
  const [collaboration, setCollaboration] = useState("private");
  const [currentState, setCurrentState] = useState("OK");
  const [message, setMessage] = useState(null);

  async function addBoard() {
    if (!boardTitle || boardTitle === "") {
      setCurrentState("ERROR");
      setMessage("Board name cannot be empty.");
      return;
    }
    setCurrentState("LOADING");
    setMessage(null);

    const body = {
      data: {
        type: `node_board--node_board`,
        attributes: {
          title: boardTitle,
          collaboration,
          nids: [],
        },
      },
    };
    try {
      const res = await fetchAsAuthenticated(
        `/node_board/node_board`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        authTokens
      );
      const json = await res.json();
      if (!res.ok) {
        setCurrentState("ERROR");
        setMessage(json.errors[0].detail);
      } else {
        setCurrentState("OK");
        history.push(`/node-board/${json.data.id}/edit`);
      }
    } catch (error) {
      setCurrentState("ERROR");
      setMessage("error, see console");
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <DialogTitle>Create issue collection</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create an issue collection board, this will display specific issues in
          a kanban board.
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
            label="Board name"
            fullWidth
            value={boardTitle}
            onChange={(event) => setBoardTitle(event.target.value)}
            disabled={currentState === "LOADING"}
          />
          <FormControl component="fieldset" className={classes.collaboration}>
            <FormLabel component="legend">Collaboration</FormLabel>
            <RadioGroup
              value={collaboration}
              onChange={(event) => setCollaboration(event.target.value)}
            >
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="Private: only accessible to you, when logged in"
              />
              <FormControlLabel
                value="shared"
                control={<Radio />}
                label="Shared: only you may edit, but anyone can view via link access"
              />
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="Public: anyone with the link can view and edit"
              />
            </RadioGroup>
          </FormControl>
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
export default withStyles(styles)(CreateIssueCollectionDialog);
