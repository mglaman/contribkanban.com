import React from "react";
import {
  ListItemText,
  ListItemIcon,
  ListItem,
  ListItemButton,
  List,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

function AppBarMenu({ links }) {
  return (
    <List sx={{ width: 250 }}>
      {links.map((link) => (
        <ListItem disablePadding key={link.text}>
          <ListItemButton
            component={link.to ? RouterLink : Link}
            to={link.to}
            href={link.href}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
export default AppBarMenu;
