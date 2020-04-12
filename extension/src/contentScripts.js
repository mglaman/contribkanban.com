import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
} from "@material-ui/core";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";
import { apiFetch, dispatchEvent } from "./shared";

// let authData = null;
// let meData = null;

chrome.storage.onChanged.addListener((changes) => {
  console.log(changes);
  if (changes.hasOwnProperty("authData")) {
    // authData = changes.authData.newValue;
    console.debug("Auth data was updated in the background.");
  }
  if (changes.hasOwnProperty("me")) {
    // meData = changes.me.newValue;
    console.debug("Me data was updated in the background.");
  }
});

dispatchEvent("ENSURE_TOKEN");

// chrome.storage.local.get("authData", (items) => {
//   authData = items.authData;
// });
// chrome.storage.local.get("me", (items) => {
//   meData = items.me;
// });

const useWindowMessage = (subscribedEventName) => {
  const [message, setMessage] = useState();
  useEffect(() => {
    const onMessage = (event) => {
      if (event.source != window) return;
      if (event.data?.event !== subscribedEventName) return;
      setMessage(event.data);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  });
  return message;
};

const useStorageData = (dataKeys) => {
  const [data, setData] = useState({});
  chrome.storage.onChanged.addListener((changes) => {
    const newValues = {
      ...data,
    };
    for (let key in changes) {
      console.log(`${key} changed`);
      newValues[key] = changes[key].newValue;
    }
    setData(newValues);
  });

  useEffect(() => {
    chrome.storage.local.get(dataKeys, (items) => {
      console.log(`useStorageData hook retrieved data`);
      setData(items);
    });
    return () => console.log("useStorageData cleanup");
  }, []);
  return data;
};

const ModalContainer = () => {
  const { me: meData, authData } = useStorageData(["me", "authData"]);
  console.log(meData);
  console.log(authData);
  return <ModalWrapper meData={meData} authData={authData} />;
};

const ModalWrapper = ({ meData, authData }) => {
  const message = useWindowMessage("ADD_ISSUE");
  const [currentState, setCurrentState] = useState("LOADING");
  const [boards, setBoards] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!message) {
      return;
    }
    setOpen(true);
    if (!meData) {
      setCurrentState("NEEDS_AUTH");
      return;
    }
    apiFetch(
      `https://api.contribkanban.com/jsonapi/node_board/node_board?filter[uid.id]=${meData.data.id}`,
      null,
      authData
    )
      .then((res) => {
        if (res.status === 401) {
          setCurrentState("NEEDS_AUTH");
          throw Error("access_token expired");
        }
        return res.json();
      })
      .then((json) => {
        setBoards(json.data);
        setCurrentState("OK");
      })
      .catch((err) => {
        console.log(err);
        if (err.message !== "access_token expired") {
          setCurrentState("ERROR");
        }
      });
  }, [message, meData, authData]);
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      boards={boards}
      message={message}
      currentState={currentState}
      authData={authData}
    />
  );
};

const Modal = ({
  open,
  handleClose,
  boards,
  message,
  currentState,
  authData,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add issue to an issue collection</DialogTitle>

      {currentState === "LOADING" ? (
        <DialogContent>
          <DialogContentText>Loading your boards...</DialogContentText>
        </DialogContent>
      ) : null}
      {currentState === "ERROR" ? (
        <DialogContent>
          <DialogContentText>There was an error :(</DialogContentText>
        </DialogContent>
      ) : null}
      {currentState === "NEEDS_AUTH" ? (
        <DialogContentText>
          Uh, oh! looks like we need to reconnect to ContribKanban
        </DialogContentText>
      ) : null}
      {currentState === "OK" ? (
        <ModalListItems
          message={message}
          boards={boards}
          authData={authData}
          handleClose={handleClose}
        />
      ) : null}

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

const ModalListItems = ({ message, boards, authData, handleClose }) => {
  return (
    <List>
      {boards.map((board) => {
        const nidToAdd = message.payload.issueNid;
        const includesNid = board.attributes.nids.includes(nidToAdd);
        return (
          <ListItem
            button
            disabled={includesNid}
            onClick={() => {
              const patchData = {
                id: board.id,
                type: board.type,
                attributes: {
                  ...board.attributes,
                },
              };
              patchData.attributes.nids.push(nidToAdd);

              let patchSuccess = false;
              apiFetch(
                `https://api.contribkanban.com/jsonapi/node_board/node_board/${board.id}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    data: patchData,
                  }),
                },
                authData
              )
                .then((res) => {
                  patchSuccess = res.ok;
                  return res.json();
                })
                .then((json) => {
                  if (patchSuccess) {
                    window.open(
                      `https://app.contribkanban.com/node-board/${board.id}`
                    );
                    handleClose();
                  } else {
                    alert("Something went wrong, sorry! Check the console");
                    console.log(json);
                  }
                });
            }}
          >
            <ListItemText primary={board.attributes.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="add">
                <AddCircleIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

const IssueCollectionButton = () => {
  // Fetch the current issue nid from the canonical link.
  // This catches anyone going to `/node/{nid}`.
  const issueNid = document
    .querySelector('link[rel="canonical"]')
    .href.split("/")
    .splice(-1, 1)[0];
  return (
    <div
      style={{
        paddingTop: "1em",
      }}
    >
      <button
        className="form-submit"
        data-nid={issueNid}
        style={{
          width: "100%",
          padding: "0.5rem",
        }}
        onClick={() => {
          window.postMessage(
            {
              event: "ADD_ISSUE",
              payload: {
                issueNid,
              },
            },
            "*"
          );
        }}
      >
        Add to issue collection
      </button>
      <ModalContainer />
    </div>
  );
};

(() => {
  if (!document.body.classList.contains("node-type-project-issue")) {
    return;
  }
  const issueMetadataBlock = document.getElementById(
    "block-project-issue-issue-metadata"
  );
  const issueCollectionButton = document.createElement("div");
  issueCollectionButton.id = "cb_issue_collection_button";
  issueMetadataBlock.parentNode.appendChild(issueCollectionButton);
  ReactDOM.render(
    <IssueCollectionButton />,
    document.getElementById("cb_issue_collection_button")
  );
})();
