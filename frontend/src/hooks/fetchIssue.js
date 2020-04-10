import { useState, useEffect } from "react";

const useFetchIssue = (nid) => {
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function doFetch() {
      const res = await fetch(
        `https://www.drupal.org/api-d7/node/${nid}.json`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
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
