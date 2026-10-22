import { styled } from "@mui/material/styles";
import MuiToolbar from "@mui/material/Toolbar";

// Also sizes the spacer under the fixed app bar.
export const toolbarHeight = (theme) => ({
  height: 64,
  [theme.breakpoints.up("sm")]: {
    height: 70,
  },
});

const Toolbar = styled(MuiToolbar)(({ theme }) => toolbarHeight(theme));

export default Toolbar;
