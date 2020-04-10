import React from "react";
import AppBoardMenu from "./AppBarMenu";
import {
  GitHub as GitHubIcon,
  BugReport as BugReportIcon,
  Launch as LaunchIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@material-ui/icons";
function ProjectMenu() {
  return (
    <AppBoardMenu
      links={[
        {
          text: "GitHub",
          href: "https://github.com/mglaman/contribkanban.com",
          icon: <GitHubIcon />,
        },
        { text: "Report a bug", href: "/", icon: <BugReportIcon /> },
        {
          text: "Open Collective",
          href: "https://opencollective.com/contribkanban",
          icon: <LaunchIcon />,
        },
        {
          text: "Sponsor",
          href: "https://github.com/sponsors/mglaman",
          icon: <FavoriteBorderIcon />,
        },
      ]}
    />
  );
}
export default ProjectMenu;
