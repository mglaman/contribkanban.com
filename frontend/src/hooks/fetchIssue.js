import { useState, useEffect } from "react";
import { drupalApiFetch } from "../api";

const useFetchIssue = (nid) => {
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function doFetch() {
      const res = await drupalApiFetch(`/node/${nid}.json`);
      if (!res.ok) {
        setError(true);
      } else {
        const json = await res.json();
        if (json.type === "project_issue") {
          setIssue(json);
        } else {
          setError(true);
        }
      }
    }
    if (nid && nid !== "") {
      doFetch();
    } else {
      setError(false);
      setIssue(null);
    }
  }, [nid]);
  return { error, issue };
};
export default useFetchIssue;
