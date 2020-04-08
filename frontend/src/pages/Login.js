import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Link as RouterLink, useHistory } from "react-router-dom";
import usePageTitle from "../hooks/pageTitle";
import { useAuth } from "../context/auth";
import { getApiBaseUrl } from "../api";
import qs from "querystring";

const styles = (theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

function LoginForm({ classes }) {
  usePageTitle("Login");
  const history = useHistory();
  const { setAuthTokens } = useAuth();
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  async function doLogin() {
    setErrorMessage(null);
    const res = await fetch(`${getApiBaseUrl()}/oauth/token`, {
      method: "POST",
      body: qs.stringify({
        grant_type: "password",
        client_id: "d4f7c501-cff9-4a3f-bae7-aec1db19456c",
        username: authUsername,
        password: authPassword,
      }),
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
    const json = await res.json();

    if (!res.ok) {
      console.log(json);
      setErrorMessage(json.message);
    } else {
      setAuthTokens(json);
      history.push(`/me`);
    }
  }

  return (
    <Container maxWidth="xs">
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault();
          doLogin();
        }}
      >
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
          autoFocus
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link
              component={RouterLink}
              to={`/forgot-password`}
              variant="body2"
            >
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to={`/register`} variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
export default withStyles(styles)(LoginForm);
