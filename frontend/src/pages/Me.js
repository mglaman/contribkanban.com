import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useAuth } from "../context/auth";
import Gravatar from "../components/Gravatar";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    marginBottom: theme.spacing(4),
  },
  acccountButtons: {
    width: "100%",
  },
});

function Me({ classes }) {
  const { currentUser } = useAuth();
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  if (currentUser === null) {
    return null;
  }
  return (
    <Container maxWidth="md" className={classes.root}>
      <Grid container spacing={4}>
        <Grid item md={6} lg={4} xl={3}>
          <Card>
            <CardContent>
              <Gravatar emailHash={"tdodoneedhash"} />
              <Typography variant="body2">
                {currentUser.data.attributes.mail}
              </Typography>
            </CardContent>
            <CardActions>
              <Button className={classes.acccountButtons}>Edit account</Button>
              <Button className={classes.acccountButtons}>My issues</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={6} lg={8} xl={9}>
          others
        </Grid>
      </Grid>
    </Container>
  );
}
export default withStyles(styles)(Me);
