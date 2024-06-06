import React from "react";
import { withStyles } from "@mui/styles";
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  Chip,
  Link,
} from "@mui/material";
import {
  BugReport as BugIcon,
  AssignmentTurnedIn as TaskIcon,
  Stars as FeatureRequestIcon,
  Help as SupportIcon,
  Note as PlanIcon,
} from "@mui/icons-material";

const statusToColor = {
  1: "#fcfcfc",
  2: "#d7ffd8",
  3: "#fddddd",
  4: "#eff1f3",
  5: "#fddddd",
  6: "#fddddd",
  7: "#fddddd",
  8: "#ffffdd",
  13: "#ffece8",
  14: "#d7ffd8",
  15: "#d7ffd8",
  16: "#eff1f3",
  18: "#fddddd",
};

const priorityToLabel = {
  400: "Critical",
  300: "Major",
  200: "Normal",
  100: "Minor",
};

const categoryToIcon = {
  1: <BugIcon titleAccess="Bug report" fontSize="small" color="error" />,
  2: <TaskIcon titleAccess="Task" fontSize="small" htmlColor="#4CC27B" />,
  3: <FeatureRequestIcon titleAccess="Feature request" fontSize="small" />,
  4: <SupportIcon titleAccess="Support question" fontSize="small" />,
  5: <PlanIcon titleAccess="Plan" fontSize="small" />,
};

const styles = (theme) => ({
  root: {
    cursor: "pointer",
    transition: "transform 0.1s ease",
    transform: "translateZ(0)",
    "&:hover": {
      transform: "translate(0, -2px)",
    },
  },
});

function BoardCard({ data, classes }) {
  return (
    <Card
      variant="outlined"
      sx={{ mb: 1}}
      className={classes.root}
      onClick={() => {
        window.open(data.url);
      }}
      style={{
        backgroundColor: statusToColor[parseInt(data.field_issue_status)],
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="body2">
          {data.title}{" "}
          <Link color="inherit" href={data.url} target={`_blank`}>
            #{data.nid}
          </Link>
        </Typography>
      </CardContent>
      <CardActions sx={{ flexWrap: "wrap" }}>
        {categoryToIcon[parseInt(data.field_issue_category)]}
        {data.field_issue_version ? (
          <Chip
            label={data.field_issue_version}
            size="small"
          />
        ) : null}
        <Chip
          label={priorityToLabel[parseInt(data.field_issue_priority)]}
          size="small"
        />
        {data.field_issue_assigned ? (
          <Chip label="Assigned" size="small" className={classes.chip} />
        ) : null}
        {/* <Chip
          label={data.field_issue_component}
          size="small"
        /> */}
        {/* <Chip label={data.field_project.id} size="small" /> */}
      </CardActions>
    </Card>
  );
}
export default withStyles(styles)(BoardCard);
