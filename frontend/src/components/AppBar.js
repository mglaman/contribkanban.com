import React, { Fragment, useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
import MuiAppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {
  Dashboard as DashboardIcon,
  GitHub as GitHubIcon,
  BugReport as BugReportIcon,
  AccountCircle as AccountCircleIcon,
  NoteAddRounded as NoteAddRoundedIcon,
} from "@material-ui/icons";

import { Link as RouterLink, useLocation } from "react-router-dom";
import Toolbar, { styles as toolbarStyles } from "./Toolbar";
import {
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Divider,
} from "@material-ui/core";

const styles = (theme) => ({
  title: {
    fontSize: 24,
    flexGrow: 1,
  },
  placeholder: toolbarStyles(theme).root,
  offset: {
    marginBottom: theme.spacing(4),
  },
  toolbar: {
    justifyContent: "space-between",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawerList: {
    width: 250,
  },
});

function AppBar({ classes }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  return (
    <Fragment>
      <MuiAppBar elevation={0} position="fixed">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Link
            variant="h6"
            component={RouterLink}
            underline="none"
            color="inherit"
            className={classes.title}
            to="/"
          >
            {"ContribKanban"}
          </Link>
        </Toolbar>
      </MuiAppBar>
      <Drawer onClose={handleDrawerClose} open={drawerOpen}>
        <List className={classes.drawerList}>
          {["All", "Drupal core", "Projects", "Sprints"].map((text, index) => (
            <ListItem button component={RouterLink} to="/" key={text}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <ListItem button component={RouterLink} to="/create">
            <ListItemIcon>
              <NoteAddRoundedIcon />
            </ListItemIcon>
            <ListItemText primary={`Add a board`} />
          </ListItem>
        </List>
        <Divider />
        <List className={classes.drawerList}>
          <ListItem button>
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary={`GitHub`} />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText primary={`Report a bug`} />
          </ListItem>
        </List>
        <Divider />
        <List className={classes.drawerList}>
          <ListItem button component={RouterLink} to="/login">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={`Log in`} />
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.placeholder} />
      <div className={classes.offset} />
    </Fragment>
  );
}
export default withStyles(styles)(AppBar);
