import { useState, useEffect } from "react";
import { drupalApiFetch } from "../api";
import { fetchOpenWorkItems } from "../api/gitlab";

// Before the project is checked, the board does not know its issue source.
const RESOLVING = { state: "RESOLVING", issues: [] };

async function fetchProject(nid) {
  try {
    const res = await drupalApiFetch(`/node/${nid}.json`);
    return res.ok ? await res.json() : null;
  } catch (err) {
    return null;
  }
}

/**
 * Loads a project board's issues from GitLab when the project has moved there.
 *
 * Drupal.org keeps listing a migrated project's issues as they were at
 * migration time, so those boards must read work items from GitLab instead.
 *
 * @param {object|undefined} board The board's JSON:API resource.
 * @returns {null|{state: string, issues: object[]}} Null when the board should
 *   query Drupal.org, otherwise the GitLab issues and their loading state.
 */
const useProjectWorkItems = (board) => {
  const projectNid =
    board?.type === "board--drupalorg_project"
      ? board.attributes.project_nid[0]
      : undefined;
  // Keyed by project so a new board never sees the previous board's result.
  const [result, setResult] = useState({ projectNid: undefined, workItems: null });

  useEffect(() => {
    if (!projectNid) {
      return;
    }
    const controller = new AbortController();
    const resolve = (workItems) => {
      if (!controller.signal.aborted) {
        setResult({ projectNid, workItems });
      }
    };
    async function load() {
      const project = await fetchProject(projectNid);
      if (project?.field_project_has_issue_queue !== false) {
        resolve(null);
        return;
      }
      resolve({ state: "LOADING", issues: [] });
      try {
        await fetchOpenWorkItems(
          `project/${project.field_project_machine_name}`,
          (issues) => resolve({ state: "OK", issues }),
          controller.signal
        );
      } catch (err) {
        resolve({ state: "ERROR", issues: [] });
      }
    }
    load();
    return () => controller.abort();
  }, [projectNid]);

  if (!projectNid) {
    return null;
  }
  return result.projectNid === projectNid ? result.workItems : RESOLVING;
};
export default useProjectWorkItems;
