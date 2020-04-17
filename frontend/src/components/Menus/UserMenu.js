import React from "react";
import {
  AccountCircle as AccountCircleIcon,
  PersonAdd as PersonAddIcon,
  ExitToApp as ExitToAppIcon,
} from "@material-ui/icons";
import AppBoardMenu from "./AppBarMenu";
import { useOAuthTokens } from "../../context/auth";

function UserMenu() {
  const [authTokens] = useOAuthTokens();

  if (authTokens) {
    return (
      <AppBoardMenu
        links={[
          {
            text: "My account",
            to: "/me",
            icon: <AccountCircleIcon />,
          },
          {
            text: "Log out",
            to: "/logout",
            icon: <ExitToAppIcon />,
          },
        ]}
      />
    );
  }

  return (
    <AppBoardMenu
      links={[
        {
          text: "Log in",
          to: "/login",
          icon: <AccountCircleIcon />,
        },
        {
          text: "Register",
          to: "/register",
          icon: <PersonAddIcon />,
        },
      ]}
    />
  );
}
export default UserMenu;
