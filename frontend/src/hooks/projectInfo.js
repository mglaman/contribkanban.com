import { useState, useEffect } from "react";
import { drupalApiFetch } from "../api";

const useProjectInfo = (id) => {
  const [project, setProject] = useState(null);
  useEffect(() => {
    async function doFetch() {
      const res = await drupalApiFetch(`/node/${id}.json`);
      if (!res.ok) {
        setProject(null);
        // there was an error, prevent spamming the API.
      } else {
        const json = await res.json();
        if (json.type === "project_module") {
          setProject(json);
        } else {
          setProject(null);
        }
      }
    }
    if (id && id !== "") {
      if (parseInt(id) === 3060) {
        setProject({
          title: "Drupal core",
        });
      } else {
        doFetch();
      }
    }
  }, [id]);
  return project;
};
export default useProjectInfo;
