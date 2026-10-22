import React, { Fragment, useState, useEffect } from "react";
import Link from "@mui/material/Link";
import MuiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import { Link as RouterLink, useLocation } from "react-router";
import Toolbar, { toolbarHeight } from "./Toolbar";
import { Box, Divider } from "@mui/material";
import BoardMenu from "./Menus/BoardMenu";
import ProjectMenu from "./Menus/ProjectMenu";
import UserMenu from "./Menus/UserMenu";

function AppBar({ actions }) {
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
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            sx={{ mr: 2 }}
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
            sx={{ fontSize: 24 }}
            to="/"
          >
            {"ContribKanban"}
          </Link>
          <Box sx={{ flexGrow: 1 }} />
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
      <Box sx={toolbarHeight} />
    </Fragment>
  );
}
export default AppBar;
