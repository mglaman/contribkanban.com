/* global chrome */
import React, { useState, seEffect, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
} from "@material-ui/core";
import {
  clientId,
  getAuthData,
  setAuthData as setAuthDataStorage,
  dispatchEvent,
} from "./shared";

const LoginForm = ({ setAuthData }) => {
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    let success = false;
    fetch(`https://api.contribkanban.com/oauth/token`, {
      method: "POST",
      body: `grant_type=password&client_id=${clientId}&password=${authPassword}&username=${authUsername}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        success = res.ok;
        return res.json();
      })
      .then((json) => {
        if (!success) {
          setErrorMessage(json.message);
        } else {
          setAuthDataStorage(json, () => setAuthData(json));
          dispatchEvent("LOGGED_IN", json);
        }
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      {errorMessage ? (
        <Typography color="error">{errorMessage}</Typography>
      ) : null}
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={authUsername}
        onChange={(event) => setAuthUsername(event.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={authPassword}
        onChange={(event) => setAuthPassword(event.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Connect
      </Button>
    </form>
  );
};

const Connected = ({ setAuthData }) => {
  return (
    <React.Fragment>
      <Typography gutterBottom display="block" variant="body2">
        You're connected! When browsing Drupal.org, you can now interact with
        ContribKanban.
      </Typography>
      <Button
        onClick={() => {
          setAuthData(null);
          dispatchEvent("LOGGED_OUT", null);
        }}
      >
        Disconnect
      </Button>
    </React.Fragment>
  );
};

const Popup = ({ authData, setAuthData }) => {
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5">
          ContribKanban
        </Typography>
        <Typography gutterBottom variant="body2">
          This extension allows you to connect with ContribKanban to allow
          integration with Drupal.org
        </Typography>
        <Divider />
        {!authData ? (
          <LoginForm setAuthData={setAuthData} />
        ) : (
          <Connected setAuthData={setAuthData} />
        )}
      </CardContent>
    </Card>
  );
};
const PopupContainer = () => {
  const [authData, setAuthData] = useState(null);
  useEffect(() => {
    getAuthData((items) => setAuthData(items.authData));
  });
  return <Popup authData={authData} setAuthData={setAuthData} />;
};

ReactDOM.render(<PopupContainer />, document.getElementById("root"));
