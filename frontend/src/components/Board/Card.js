import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  Chip,
  Link,
} from "@material-ui/core";
import {
  BugReport as BugIcon,
  AssignmentTurnedIn as TaskIcon,
  Face as FaceIcon,
  Stars as FeatureRequestIcon,
  Help as SupportIcon,
  Note as PlanIcon,
} from "@material-ui/icons";

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

const categoryToLabel = {
  1: "Bug",
  2: "Task",
  3: "Feature",
  4: "Support",
  5: "Plan",
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
    marginBottom: theme.spacing(1),
    cursor: "pointer",
  },
  actions: {
    flexWrap: "wrap",
  },
  chip: {
    fontSize: theme.typography.pxToRem(12),
    margin: theme.spacing(0.5),
  },
});

function BoardCard({ data, classes }) {
  return (
    <Card
      variant="outlined"
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
      <CardActions className={classes.actions}>
        {categoryToIcon[parseInt(data.field_issue_category)]}
        <Chip
          label={data.field_issue_version}
          size="small"
          className={classes.chip}
        />
        <Chip
          label={priorityToLabel[parseInt(data.field_issue_priority)]}
          size="small"
          className={classes.chip}
        />
        {/* <Chip
          label={data.field_issue_component}
          size="small"
          className={classes.chip}
        /> */}
        {/* <Chip label={data.field_project.id} size="small" /> */}
      </CardActions>
    </Card>
  );
}
export default withStyles(styles)(BoardCard);
