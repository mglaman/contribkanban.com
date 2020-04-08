import React from "react";
import { Container, TextField, Button, Grid, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import usePageTitle from "../hooks/pageTitle";

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
  return (
    <Container maxWidth="xs">
      <form className={classes.form}>
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
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="drupalorg_username"
          label="Drupal.org username"
          helperText="Your Drupal.org username, used to provide a board based on issues you follow."
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
