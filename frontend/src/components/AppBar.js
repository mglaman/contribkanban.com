import React, { Fragment, useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";
import MuiAppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Toolbar, { styles as toolbarStyles } from "./Toolbar";
import { Divider } from "@material-ui/core";
import BoardMenu from "./Menus/BoardMenu";
import ProjectMenu from "./Menus/ProjectMenu";
import UserMenu from "./Menus/UserMenu";

const styles = (theme) => ({
  title: {
    fontSize: 24,
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

function AppBar({ classes }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);
  useEffect(() => {
    setDrawerOpen(false);
    window.fathom("trackPageview");
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
