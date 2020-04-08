import React from "react";
import qs from "qs";
import { Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
});

function Gravatar({ emailHash, classes }) {
  const imgUrl = `https://www.gravatar.com/avatar/${emailHash}${qs.stringify({
    s: 128,
    r: "g",
    d: "identicon",
  })}`;
  return <Avatar alt="Avatar" src={imgUrl} className={classes.root} />;
}
export default withStyles(styles)(Gravatar);
