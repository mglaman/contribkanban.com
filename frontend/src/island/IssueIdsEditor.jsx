import { useEffect, useMemo, useRef, useState } from "react";
import { withGitLabWorkItems } from "./Board";
import { fetchIssuesByNid } from "./drupalorg";
import { issueProject } from "./filters";
import { fetchWorkItemsByIid } from "./gitlab";

// Drupal.org's issue statuses. GitLab work items map onto them.
const STATUSES = {
  1: "Active",
  2: "Fixed",
  3: "Closed (duplicate)",
  4: "Postponed",
  5: "Closed (won't fix)",
  6: "Closed (works as designed)",
  7: "Closed (fixed)",
  8: "Needs review",
  13: "Needs work",
  14: "Reviewed & tested",
  15: "Patch (to be ported)",
  16: "Postponed (needs info)",
  17: "Closed (outdated)",
  18: "Closed (cannot reproduce)",
};

// Fixed and closed issues, which are done and can come off the collection.
const DONE = new Set(["2", "3", "5", "6", "7", "17", "18"]);

// Waits for typing or pasting to stop before loading new lines.
const LOAD_DELAY_MS = 300;

/**
 * Reads an issue ID from a line, like IssueIdsWidget::parseIssue().
 *
 * @param {string} line A drupal.org issue URL or number, or a GitLab work item URL.
 * @returns {string|null} A drupal.org node ID, a GitLab `project/name#iid`, or
 *   null if the line isn't an issue.
 */
export function parseIssue(line) {
  let match = /^#?(\d+)$/.exec(line);
  if (match) {
    return match[1].replace(/^0+/, "") || null;
  }
  match = /^https?:\/\/(?:www\.)?drupal\.org\/(?:project\/[^/]+\/issues|node|i)\/(\d+)(?:[/?#]|$)/.exec(line);
  if (match) {
    return match[1];
  }
  match =
    /^https?:\/\/git\.drupalcode\.org\/(project\/[a-z0-9_]+)\/-\/(?:issues|work_items)\/(\d+)(?:[/?#]|$)/.exec(line) ??
    /^(project\/[a-z0-9_]+)#(\d+)$/.exec(line);
  return match ? `${match[1]}#${match[2]}` : null;
}

/**
 * Splits the textarea's value into its non-empty lines and their issue IDs.
 *
 * @param {string} value
 * @returns {{line: string, id: string|null}[]}
 */
function readLines(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ line, id: parseIssue(line) }));
}

/**
 * Loads issues by ID, from drupal.org and GitLab.
 *
 * @param {string[]} ids Issue IDs from parseIssue().
 * @param {Set<string>} movedProjects Node IDs of projects on GitLab, whose
 *   drupal.org issues are frozen.
 * @param {AbortSignal} signal
 * @returns {Promise<Map<string, object|null>>} Each ID's issue, or null if
 *   there is none.
 */
async function loadIssues(ids, movedProjects, signal) {
  const found = new Map(ids.map((id) => [id, null]));
  const nids = ids.filter((id) => !id.includes("#"));
  const iidsByProject = new Map();
  for (const id of ids.filter((value) => value.includes("#"))) {
    const [path, iid] = id.split("#");
    iidsByProject.set(path, [...(iidsByProject.get(path) ?? []), iid]);
  }
  const [issues, ...workItems] = await Promise.all([
    nids.length
      ? fetchIssuesByNid(nids, signal).then((loaded) => withGitLabWorkItems(loaded, movedProjects, signal))
      : [],
    ...[...iidsByProject].map(([path, iids]) =>
      fetchWorkItemsByIid(path, iids, signal).then((loaded) => loaded.map((issue) => [`${path}#${issue.nid}`, issue]))
    ),
  ]);
  // A moved issue's work item keeps its drupal.org node ID as its IID.
  for (const issue of issues) {
    found.set(issue.nid, issue);
  }
  for (const [id, issue] of workItems.flat()) {
    found.set(id, issue);
  }
  return found;
}

/**
 * Loads the issues for IDs not loaded yet.
 *
 * @param {string[]} ids
 * @param {Set<string>} movedProjects
 * @returns {Map<string, object|null|"error">} Loaded IDs: the issue, null if
 *   there is none, or "error" if it couldn't load.
 */
function useIssues(ids, movedProjects) {
  const [found, setFound] = useState(() => new Map());
  useEffect(() => {
    const missing = [...new Set(ids)].filter((id) => !found.has(id));
    if (missing.length === 0) {
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      loadIssues(missing, movedProjects, controller.signal)
        .catch(() => new Map(missing.map((id) => [id, "error"])))
        .then((loaded) => {
          if (!controller.signal.aborted) {
            setFound((previous) => new Map([...previous, ...loaded]));
          }
        });
    }, LOAD_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [ids, found, movedProjects]);
  return found;
}

/**
 * Sets the textarea's value the way typing would, so Drupal and the editor
 * both see it.
 *
 * @param {HTMLTextAreaElement} textarea
 * @param {string} value
 */
function setValue(textarea, value) {
  textarea.value = value;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Lists an issue collection's issues under its textarea, to triage them.
 *
 * Each line shows its issue's title, project, and status, with a button to
 * remove it. The textarea stays what the form saves, and the buttons edit its
 * lines.
 *
 * @param {object} props
 * @param {HTMLTextAreaElement} props.textarea The collection's issue IDs field.
 * @param {number[]} props.movedProjects Node IDs of projects on GitLab.
 */
function IssueIdsEditor({ textarea, movedProjects }) {
  const [value, setTextValue] = useState(textarea.value);
  const [announcement, setAnnouncement] = useState("");
  const [focusIndex, setFocusIndex] = useState(null);
  const list = useRef(null);
  const moved = useMemo(() => new Set(movedProjects.map(String)), [movedProjects]);
  const lines = useMemo(() => readLines(value), [value]);
  const ids = useMemo(() => lines.map(({ id }) => id).filter(Boolean), [lines]);
  const issues = useIssues(ids, moved);

  useEffect(() => {
    const onInput = () => setTextValue(textarea.value);
    textarea.addEventListener("input", onInput);
    return () => textarea.removeEventListener("input", onInput);
  }, [textarea]);

  // Removing a line moves focus to the next line's button, or the textarea.
  useEffect(() => {
    if (focusIndex !== null) {
      const buttons = list.current?.querySelectorAll(".issue-ids__remove") ?? [];
      (buttons[Math.min(focusIndex, buttons.length - 1)] ?? textarea).focus();
      setFocusIndex(null);
    }
  }, [focusIndex, textarea]);

  const done = lines.filter(({ id }) => DONE.has(issues.get(id)?.field_issue_status));

  function remove(keep, message, index) {
    setValue(
      textarea,
      readLines(textarea.value)
        .filter(keep)
        .map(({ line }) => line)
        .join("\n")
    );
    setAnnouncement(message);
    setFocusIndex(index);
  }

  if (lines.length === 0) {
    return null;
  }
  return (
    <div className="issue-ids">
      <p className="issue-ids__summary">
        {lines.length === 1 ? "1 issue" : `${lines.length} issues`}
        {done.length > 0 ? (
          <button
            type="button"
            className="issue-ids__remove-done"
            onClick={() =>
              remove(
                ({ id }) => !DONE.has(issues.get(id)?.field_issue_status),
                `Removed ${done.length === 1 ? "1 fixed or closed issue" : `${done.length} fixed or closed issues`}.`,
                0
              )
            }
          >
            {done.length === 1 ? "Remove 1 fixed or closed" : `Remove ${done.length} fixed or closed`}
          </button>
        ) : null}
      </p>
      <ul className="issue-ids__list" ref={list}>
        {lines.map(({ line, id }, index) => {
          const issue = id ? issues.get(id) : null;
          const loaded = issue && issue !== "error";
          const status = loaded ? issue.field_issue_status : null;
          const name = loaded ? issue.title : line;
          let detail;
          if (!id) {
            detail = "Not a drupal.org issue or GitLab work item";
          } else if (issue === undefined) {
            detail = "Loading…";
          } else if (issue === "error") {
            detail = "Couldn't load it";
          } else if (issue === null) {
            detail = id.includes("#") ? "GitLab has no work item with this number" : "drupal.org has no issue with this number";
          }
          return (
            <li
              key={`${index}:${line}`}
              className={`issue-ids__item${DONE.has(status) ? " issue-ids__item--done" : ""}${loaded ? "" : " issue-ids__item--unknown"}`}
            >
              <div className="issue-ids__text">
                {loaded ? (
                  <a className="issue-ids__title" href={issue.url} target="_blank" rel="noreferrer">
                    {issue.title}
                  </a>
                ) : (
                  <span className="issue-ids__title">{line}</span>
                )}
                <span className="issue-ids__meta">
                  {loaded ? (
                    <>
                      <span className="issue-ids__project">{issueProject(issue)}</span>
                      <span className="issue-ids__status">{STATUSES[status] ?? "Unknown status"}</span>
                    </>
                  ) : (
                    detail
                  )}
                </span>
              </div>
              <button
                type="button"
                className="issue-ids__remove"
                aria-label={`Remove ${name}`}
                onClick={() =>
                  remove((_, lineIndex) => lineIndex !== index, `Removed ${name}.`, index)
                }
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
      <span className="visually-hidden" role="status">
        {announcement}
      </span>
    </div>
  );
}

export default IssueIdsEditor;
