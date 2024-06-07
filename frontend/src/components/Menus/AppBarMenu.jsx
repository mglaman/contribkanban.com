import React from "react";
import {
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Link,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { Link as RouterLink } from "react-router-dom";

const styles = (theme) => ({
  drawerList: {
    width: 250,
  },
});
function AppBarMenu({ classes, links }) {
  return (
    <List className={classes.drawerList}>
      {links.map((link) => (
        <ListItem
          button
          component={link.to ? RouterLink : Link}
          to={link.to}
          href={link.href}
          key={link.text}
        >
          <ListItemIcon>{link.icon}</ListItemIcon>
          <ListItemText primary={link.text} />
        </ListItem>
      ))}
    </List>
  );
}
export default withStyles(styles)(AppBarMenu);
