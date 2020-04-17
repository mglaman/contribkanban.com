import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { DeleteOutline as DeleteOutlineIcon } from "@material-ui/icons";
import { useParams, useHistory } from "react-router-dom";
import useFetchIssue from "../hooks/fetchIssue";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  collaboration: {
    marginTop: theme.spacing(2),
  },
});
function NodeBoardEditForm({ classes, auth }) {
  const nidRefs = [];
  const history = useHistory();
  const { uuid } = useParams();
  const [boardTitle, setBoardTitle] = useState("");
  const [collaboration, setCollaboration] = useState("private");
  const [nids, setNids] = useState([]);
  const [currentState, setCurrentState] = useState("LOADING");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function getBoard() {
      const res = await auth.fetchAsAuthenticated(
        `/node_board/node_board/${uuid}`
      );
      if (!res.ok) {
        setCurrentState("ERROR");
      } else {
        res
          .json()
          .then((data) => {
            const { title, collaboration, nids } = data.data.attributes;
            setBoardTitle(title);
            setCollaboration(collaboration);
            if (nids.length === 0) {
              nids.push("");
            }
            setNids(nids);
            setCurrentState("OK");
          })
          .catch((err) => setCurrentState("ERROR"));
      }
    }
    getBoard();
  }, [auth, uuid]);

  const setRef = (nid, ref) => {
    const index = nids.indexOf(nid);
    nidRefs[index] = ref;
  };
  function removeNid(v) {
    nidRefs.splice(v, 1);
    const newNids = nids.slice();
    newNids.splice(v, 1);
    setNids(newNids);
  }
  function addNid() {
    const newNids = nids.slice();
    const hasNew = newNids.indexOf("");
    if (hasNew === -1) {
      newNids.push("");
    }
    setNids(newNids);
  }
  function updateNids() {
    const newNids = nidRefs.map((ref) => ref.value);
    setNids(newNids);
  }

  async function doBoardUpdate() {
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
        id: uuid,
        attributes: {
          title: boardTitle,
          collaboration,
          nids,
        },
      },
    };
    try {
      const res = await auth.fetchAsAuthenticated(
        `/node_board/node_board/${uuid}`,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      console.log(json);
      if (!res.ok) {
        setCurrentState("ERROR");
        setMessage(json.errors[0].detail);
      } else {
        setCurrentState("OK");
        history.push(`/node-board/${json.data.id}`);
      }
    } catch (error) {
      setCurrentState("ERROR");
      setMessage("error, see console");
      console.log(error);
    }
  }

  return (
    <Container className={classes.root}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          doBoardUpdate();
        }}
      >
        <Grid container spacing={4}>
          <Grid item md={12}>
            {message ? <Typography color="error">{message}</Typography> : null}
          </Grid>
          <Grid item md={5}>
            <Card>
              <CardContent>
                <TextField
                  margin="dense"
                  id="name"
                  label="Board name"
                  fullWidth
                  value={boardTitle}
                  onChange={(event) => setBoardTitle(event.target.value)}
                  disabled={currentState === "LOADING"}
                />
                <FormControl
                  component="fieldset"
                  className={classes.collaboration}
                >
                  <FormLabel component="legend">Collaboration</FormLabel>
                  <RadioGroup
                    value={collaboration}
                    onChange={(event) => setCollaboration(event.target.value)}
                  >
                    <FormControlLabel
                      value="private"
                      control={<Radio disabled={currentState === "LOADING"} />}
                      label="Private: only accessible to you, when logged in"
                    />
                    <FormControlLabel
                      value="shared"
                      control={<Radio disabled={currentState === "LOADING"} />}
                      label="Shared: only you may edit, but anyone can view via link access"
                    />
                    <FormControlLabel
                      value="public"
                      control={<Radio disabled={currentState === "LOADING"} />}
                      label="Public: anyone with the link can view and edit"
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
              <CardActions>
                <Button color="secondary" onClick={() => history.push(`/me`)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={currentState === "LOADING"}
                >
                  Save
                </Button>
                <Button color="primary" disabled={currentState === "LOADING"}>
                  Removed closed issues
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item md={7}>
            <Paper>
              <List>
                {nids.map((nid, k) => {
                  return (
                    <ListItem key={k}>
                      <IssueTextField
                        setRef={setRef}
                        nid={nid}
                        onBlur={updateNids}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => removeNid(k)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
              <CardActions>
                <Button
                  color="primary"
                  disabled={currentState === "LOADING"}
                  onClick={() => addNid()}
                >
                  Add issue
                </Button>
              </CardActions>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

function IssueTextField({ onBlur, setRef, nid }) {
  const [value, setValue] = useState(nid);
  const { error, issue } = useFetchIssue(nid);
  return (
    <TextField
      inputRef={(ref) => setRef(nid, ref)}
      value={value}
      name={nid}
      fullWidth
      InputProps={{
        onBlur,
      }}
      placeholder={"Issue ID"}
      onChange={(event) => setValue(event.target.value)}
      helperText={error ? `Invalid issue ID` : issue?.title}
    />
  );
}

export default withStyles(styles)(NodeBoardEditForm);
