import React, { Fragment, useState, useEffect } from "react";
import Link from "@mui/material/Link";
import { withStyles } from "@mui/styles";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Toolbar, { styles as toolbarStyles } from "./Toolbar";
import { Divider } from "@mui/material";
import BoardMenu from "./Menus/BoardMenu";
import ProjectMenu from "./Menus/ProjectMenu";
import UserMenu from "./Menus/UserMenu";

const styles = (theme) => ({
  title: {
    fontSize: 24,
  },
  grow: {
    flexGrow: 1,
  },
  placeholder: toolbarStyles(theme).root,
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

function AppBar({ classes, actions }) {
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
            size="large">
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
          <div className={classes.grow} />
          {Array.isArray(actions) ? actions.map((action) => action) : null}
        </Toolbar>
      </MuiAppBar>
      <Drawer onClose={handleDrawerClose} open={drawerOpen}>
        <BoardMenu />
        <Divider />
        <UserMenu />
        <Divider />
        <ProjectMenu />
      </Drawer>
      <div className={classes.placeholder} />
    </Fragment>
  );
}
export default withStyles(styles)(AppBar);
