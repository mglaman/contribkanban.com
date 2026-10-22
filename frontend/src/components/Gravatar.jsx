import React from "react";
import qs from "qs";
import { Avatar } from "@mui/material";

function Gravatar({ emailHash }) {
  const imgUrl = `https://www.gravatar.com/avatar/${emailHash}?${qs.stringify({
    s: 128,
    r: "g",
    d: "identicon",
  })}`;
  return <Avatar alt="Avatar" src={imgUrl} sx={{ width: 128, height: 128, mb: 2 }} />;
}
export default Gravatar;
