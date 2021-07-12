import React from "react";
import useProjectInfo from "../../hooks/projectInfo";
import { Chip } from "@material-ui/core";

const ProjectChip = ({ id }) => {
  const project = useProjectInfo(id);
  if (project) {
    return <Chip label={project.title} size="small" />;
  } else {
    return null;
  }
};
export default ProjectChip;
