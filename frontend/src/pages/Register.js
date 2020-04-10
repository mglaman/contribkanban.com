import React, { useState, useEffect } from "react";
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
import { apiFetch } from "../api";

const styles = (theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

function RegisterForm({ classes }) {
  usePageTitle("Register");
  const history = useHistory();
  const { auth } = useAuth();
  const [errorMessage, setErrorMessage] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [drupalorgUsername, setDrupalorgUsername] = useState();

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  async function doRegister() {
    const body = {
      type: "user--user",
      attributes: {
        mail: email,
        name: email,
        pass: password,
        drupalorg_username: drupalorgUsername,
      },
    };
    try {
      const res = await apiFetch(`/user/register`, {
        method: "POST",
        body: JSON.stringify({
          data: body,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.log(json.errors);
        setErrorMessage(json.errors[0].detail);
      } else {
        const { success, result } = await auth.usePasswordGrant(
          email,
          password
        );
        if (!success) {
          console.log(result);
          setErrorMessage(result.message);
        } else {
          auth.setAuthTokens(result);
          history.push(`/me`);
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("error, see console");
    }
  }

  return (
    <Container maxWidth="xs">
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (!passwordsMatch) {
            setErrorMessage("Passwords do not match");
          } else {
            doRegister();
          }
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
          type="email"
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirm_password"
          label="Confirm password"
          type="password"
          id="confirm_password"
          autoComplete="new-password"
          error={!passwordsMatch}
          helperText={!passwordsMatch ? `The passwords do not match` : null}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="drupalorg_username"
          label="Drupal.org username"
          helperText="Your Drupal.org username, used to provide a board based on issues you follow."
          value={drupalorgUsername}
          onChange={(event) => setDrupalorgUsername(event.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Create your account
        </Button>
        <Grid container>
          <Grid item>
            <Link component={RouterLink} to={`/login`} variant="body2">
              {"Have an account? Log in"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
export default withStyles(styles)(RegisterForm);
