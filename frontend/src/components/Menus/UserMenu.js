// @todo use const { authTokens } = useAuth(); to determine if logged in.
import React from "react";
import {
  AccountCircle as AccountCircleIcon,
  PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import AppBoardMenu from "./AppBarMenu";
import { useAuth } from "../../context/auth";

function UserMenu() {
  const { authTokens } = useAuth();

  if (authTokens) {
    return (
      <AppBoardMenu
        links={[
          {
            text: "My account",
            to: "/me",
            icon: <AccountCircleIcon />,
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
