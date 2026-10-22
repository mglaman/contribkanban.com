import React from "react";
import {
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function AppBarMenu({ links }) {
  return (
    <List sx={{ width: 250 }}>
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
export default AppBarMenu;
