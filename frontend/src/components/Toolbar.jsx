import { withStyles } from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";

export const styles = (theme) => ({
  root: {
    height: 64,
    [theme.breakpoints.up("sm")]: {
      height: 70,
    },
  },
});

export default withStyles(styles)(Toolbar);
