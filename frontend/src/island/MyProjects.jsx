import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Board from "./Board";
import { fetchProjectNid } from "./drupalorg";
import { fetchMyProjects, fetchProjectsWorkItems } from "./gitlab";

const STORAGE_KEY = "contribkanban:gitlab-token";

const TOKEN_URL =
  "https://git.drupalcode.org/-/user_settings/personal_access_tokens?name=ContribKanban&scopes=read_api";

const LISTS = [
  { title: "Needs Review", tone: "needs-review", statuses: ["8"] },
  { title: "Needs Work", tone: "needs-work", statuses: ["13"] },
  { title: "Active", tone: "active", statuses: ["1"] },
  { title: "Reviewed & Tested", tone: "rtbc", statuses: ["14", "15"] },
  { title: "Fixed", tone: "fixed", statuses: ["2"] },
  { title: "Postponed", tone: "postponed", statuses: ["4", "16"] },
];

// Storage can be missing or blocked, so the token then lasts until the page
// reloads.
function readToken() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeToken(token) {
  try {
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // The token lasts until the page reloads.
  }
}

/**
 * Finds the viewer's projects, and where each one keeps its issues.
 *
 * Every project has a repository on GitLab, and turning on its work items is
 * what moving its issues does. The rest keep their issues on drupal.org, which
 * needs their node IDs.
 *
 * @param {string|null} token The viewer's GitLab token.
 * @returns {{state: string, machineNames?: string[], gitlabProjects?: string[], nids?: string[], unresolved?: number}}
 *   The state is "loading", "ok", "invalid" if GitLab rejects the token, or "error".
 */
function useMyProjects(token) {
  // Keyed by token, so a new token doesn't see the previous one's result.
  const [result, setResult] = useState({ token: null });
  useEffect(() => {
    if (!token) {
      return undefined;
    }
    const controller = new AbortController();
    fetchMyProjects(token, controller.signal)
      .then(async (projects) => {
        const onDrupalOrg = projects.filter((project) => !project.issuesEnabled);
        const nids = await Promise.allSettled(onDrupalOrg.map((project) => fetchProjectNid(project.machineName)));
        if (controller.signal.aborted) {
          return;
        }
        setResult({
          token,
          state: "ok",
          machineNames: projects.map((project) => project.machineName),
          gitlabProjects: projects.filter((project) => project.issuesEnabled).map((project) => project.path),
          nids: nids.filter(({ status, value }) => status === "fulfilled" && value).map(({ value }) => value),
          unresolved: nids.filter(({ status }) => status === "rejected").length,
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({ token, state: error.status === 401 ? "invalid" : "error" });
        }
      });
    return () => controller.abort();
  }, [token]);
  return result.token === token ? result : { state: "loading" };
}

/**
 * Asks for the viewer's GitLab token.
 */
function TokenForm({ onSubmit, invalid }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="my-projects__form"
      onSubmit={(event) => {
        event.preventDefault();
        if (value.trim()) {
          onSubmit(value.trim());
        }
      }}
    >
      {invalid ? <p className="my-projects__error">GitLab didn't accept that token. It may have expired.</p> : null}
      <div className="form-item">
        <label htmlFor="my-projects-token">GitLab token</label>
        <input
          id="my-projects-token"
          type="password"
          autoComplete="off"
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="description">
          <a href={TOKEN_URL}>Create a token on git.drupalcode.org</a> with the <code>read_api</code> scope.
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="button">
          Show my projects
        </button>
      </div>
      <p className="my-projects__hint">
        Your token stays in this browser and is only sent to git.drupalcode.org. ContribKanban never receives it. It
        can read whatever your account can, so remove it from any computer you share.
      </p>
    </form>
  );
}

/**
 * A board across the projects the viewer maintains.
 *
 * @param {object} props
 * @param {Element|null} props.filtersSlot Where the page wants the filters.
 * @param {Element|null} props.actionsSlot Where the page wants the button that
 *   forgets the token.
 */
function MyProjects({ filtersSlot, actionsSlot }) {
  const [token, setToken] = useState(readToken);
  const projects = useMyProjects(token);
  const [invalid, setInvalid] = useState(false);

  const change = useCallback((next) => {
    writeToken(next);
    setToken(next);
  }, []);

  // A rejected token can't work again, so don't keep it.
  useEffect(() => {
    if (token && projects.state === "invalid") {
      setInvalid(true);
      change(null);
    }
  }, [token, projects.state, change]);

  const loadProjects = useCallback(
    (paths, onPage, signal) => fetchProjectsWorkItems(paths, onPage, signal, token),
    [token]
  );
  const { machineNames, gitlabProjects, nids } = projects;
  const config = useMemo(
    () =>
      gitlabProjects
        ? {
            source: "drupalorg",
            gitlabProject: null,
            gitlabLabel: null,
            gitlabProjects,
            projectNames: machineNames,
            movedProjects: [],
            showProject: true,
            lists: LISTS.map((list) => ({ ...list, projects: nids, tags: [], versions: [], component: null })),
          }
        : null,
    [machineNames, gitlabProjects, nids]
  );

  if (!token) {
    return (
      <TokenForm
        invalid={invalid}
        onSubmit={(next) => {
          setInvalid(false);
          change(next);
        }}
      />
    );
  }

  const forget = (
    <button type="button" className="board-shell__embed" onClick={() => change(null)}>
      Forget my token
    </button>
  );
  const empty = config && gitlabProjects.length === 0 && nids.length === 0;
  return (
    <>
      {actionsSlot ? createPortal(forget, actionsSlot) : forget}
      {projects.state === "loading" || projects.state === "invalid" ? (
        <p className="my-projects__message">Finding your projects…</p>
      ) : null}
      {projects.state === "error" ? (
        <p className="my-projects__error">Couldn't load your projects from GitLab. Reload the page to try again.</p>
      ) : null}
      {empty ? <p className="my-projects__message">This token's account doesn't maintain any projects.</p> : null}
      {projects.unresolved > 0 ? (
        <p className="my-projects__error">
          Couldn't reach drupal.org for {projects.unresolved} of your projects, so their issues are missing.
        </p>
      ) : null}
      {config && !empty ? (
        <div className="board-shell__columns">
          <Board config={config} filtersSlot={filtersSlot} loadProjects={loadProjects} />
        </div>
      ) : null}
    </>
  );
}
export default MyProjects;
