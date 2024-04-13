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
        { text: "Drupal core", to: "/boards/core", icon: <DashboardIcon /> },
        { text: "Projects", to: "/boards/project", icon: <DashboardIcon /> },
        { text: "Sprints", to: "/boards/sprint", icon: <DashboardIcon /> },
        { text: "Custom", to: "/boards/custom", icon: <DashboardIcon /> },
        { text: "Create", to: "/create", icon: <NoteAddRoundedIcon /> },
      ]}
    />
  );
}
export default BoardMenu;
