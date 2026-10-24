import { useState, useEffect } from "react";
import { fetchOpenWorkItems } from "../island/gitlab";

const LOADING = { state: "LOADING", issues: [] };

/**
 * Loads a project board's issues from GitLab when the board is set to use them.
 *
 * Project boards are named after the project's machine name, which is also its
 * path on git.drupalcode.org.
 *
 * @param {object|undefined} board The board's JSON:API resource.
 * @returns {null|{state: string, issues: object[]}} Null when the board should
 *   query Drupal.org, otherwise the GitLab issues and their loading state.
 */
const useProjectWorkItems = (board) => {
  const machineName =
    board?.type === "board--drupalorg_project" &&
    board.attributes.gitlab_work_items
      ? board.attributes.machine_name
      : undefined;
  // Keyed by project so a new board never sees the previous board's result.
  const [result, setResult] = useState({ machineName: undefined, workItems: LOADING });

  useEffect(() => {
    if (!machineName) {
      return;
    }
    const controller = new AbortController();
    const resolve = (workItems) => {
      if (!controller.signal.aborted) {
        setResult({ machineName, workItems });
      }
    };
    fetchOpenWorkItems(
      `project/${machineName}`,
      (issues) => resolve({ state: "OK", issues }),
      controller.signal
    ).catch(() => resolve({ state: "ERROR", issues: [] }));
    return () => controller.abort();
  }, [machineName]);

  if (!machineName) {
    return null;
  }
  return result.machineName === machineName ? result.workItems : LOADING;
};
export default useProjectWorkItems;
