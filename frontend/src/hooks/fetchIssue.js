import { useState, useEffect } from "react";

const useFetchIssue = (nid) => {
  const [issue, setIssue] = useState(null);
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
        setIssue(null);
      } else {
        const json = await res.json();
        setIssue(json);
      }
    }
    if (nid && nid !== "") {
      doFetch();
    }
  }, [nid]);
  return issue;
};
export default useFetchIssue;
