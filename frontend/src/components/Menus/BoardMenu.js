import React from "react";
import AppBoardMenu from "./AppBarMenu";
import {
  Dashboard as DashboardIcon,
  NoteAddRounded as NoteAddRoundedIcon,
} from "@material-ui/icons";
function BoardMenu() {
  return (
    <AppBoardMenu
      links={[
        { text: "All", to: "/", icon: <DashboardIcon /> },
        { text: "Drupal core", to: "/core", icon: <DashboardIcon /> },
        { text: "Projects", to: "/projects", icon: <DashboardIcon /> },
        { text: "Sprints", to: "/sprints", icon: <DashboardIcon /> },
        { text: "Create", to: "/create", icon: <NoteAddRoundedIcon /> },
      ]}
    />
  );
}
export default BoardMenu;
