import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Column from "./Column";
import Filters from "./Filters";
import { fetchIssuesByNid, fetchListIssues, fetchProjectNid } from "./drupalorg";
import { filterIds, issueProject, matchesText, readFilters, writeFilters } from "./filters";
import { fetchLabeledWorkItems, fetchOpenWorkItems, fetchWorkItemsByIid, filterIssues } from "./gitlab";

const LOADING = { state: "loading", issues: [], total: 0, partial: false };
const EMPTY = { ...LOADING, state: "ok" };

// Stable defaults, so an absent list doesn't reload the board on each render.
const NO_PROJECTS = [];
const NO_WORK_ITEMS = [];

const byPriority = (a, b) => Number(b.field_issue_priority) - Number(a.field_issue_priority);

const inProject = (project) => (issue) => !project || issueProject(issue) === project;

/**
 * Loads a list's first page from drupal.org.
 *
 * Type, Priority, and Project go into the query, since a list only loads its
 * first page.
 *
 * @param {object} list The list from the board configuration.
 * @param {string|null} category
 * @param {string|null} priority
 * @param {string|null} [project] A project's node ID, replacing the list's.
 * @param {boolean} [enabled] Whether to load; false while a project is looked up.
 * @returns {{state: string, issues: object[], total: number, partial: boolean}}
 */
function useListIssues(list, category, priority, project = null, enabled = true) {
  const key = `${category}:${priority}:${project}`;
  // Keyed by query so a changed filter shows loading, not the previous result.
  const [result, setResult] = useState({ key: null });

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const controller = new AbortController();
    const resolve = (value) => {
      if (!controller.signal.aborted) {
        setResult({ key, ...value });
      }
    };
    fetchListIssues(list, { category, priority, project }, controller.signal)
      .then((data) => resolve({ state: "ok", ...data }))
      .catch(() => resolve({ ...LOADING, state: "error" }));
    return () => controller.abort();
  }, [list, key, category, priority, project, enabled]);

  return result.key === key ? result : LOADING;
}

/**
 * Looks up the node ID of the project filter on drupal.org.
 *
 * @param {string|null} project A project's machine name.
 * @returns {{state: string, nid: string|null}} A null `nid` once loaded means
 *   drupal.org has no such project.
 */
function useProjectNid(project) {
  const [result, setResult] = useState({ project: null });
  useEffect(() => {
    if (!project) {
      return undefined;
    }
    let active = true;
    fetchProjectNid(project).then(
      (nid) => active && setResult({ project, state: "ok", nid }),
      () => active && setResult({ project, state: "error", nid: null })
    );
    return () => {
      active = false;
    };
  }, [project]);
  if (!project) {
    return { state: "ok", nid: null };
  }
  return result.project === project ? result : { state: "loading", nid: null };
}

/**
 * A list that queries drupal.org. The search text filters the loaded issues.
 */
function DrupalOrgColumn({ list, category, priority, text }) {
  const current = useListIssues(list, category, priority);
  const issues = current.issues.filter((issue) => matchesText(issue, text));
  return (
    <Column
      list={list}
      state={current.state}
      issues={issues}
      total={text ? issues.length : current.total}
      partial={!text && current.partial}
    />
  );
}

/**
 * Loads every open work item from GitLab once.
 *
 * @param {Function} load fetchOpenWorkItems or fetchLabeledWorkItems.
 * @param {string} source The project path or label to load.
 * @returns {{state: string, issues: object[]}}
 */
function useWorkItems(load, source) {
  const [result, setResult] = useState(LOADING);
  useEffect(() => {
    const controller = new AbortController();
    const resolve = (value) => {
      if (!controller.signal.aborted) {
        setResult(value);
      }
    };
    load(source, (issues) => resolve({ state: "ok", issues }), controller.signal).catch(() =>
      resolve({ ...LOADING, state: "error" })
    );
    return () => controller.abort();
  }, [load, source]);
  return result;
}

/**
 * Every list on a board that reads GitLab, sharing one load.
 */
function GitLabColumns({ project, lists, category, priority, text }) {
  const workItems = useWorkItems(fetchOpenWorkItems, project);
  return lists.map((list, index) => {
    const issues = filterIssues(workItems.issues, {
      statuses: list.statuses,
      category,
      priority,
      version: list.versions,
    }).filter((issue) => matchesText(issue, text));
    return (
      <Column
        key={index}
        list={list}
        state={workItems.state}
        issues={issues}
        total={issues.length}
        partial={false}
      />
    );
  });
}

/**
 * A tag board list: drupal.org issues merged with GitLab work items.
 *
 * Projects that moved to GitLab leave their issues on drupal.org, frozen, so
 * those come from GitLab only. Drupal lists the moved projects.
 *
 * The Project filter queries drupal.org by the project's node ID, and filters
 * the loaded work items by the project in their URL.
 */
function TagColumn({ list, workItems, movedProjects, category, priority, project, projectNid, text, showProject, onIssues }) {
  // A project drupal.org doesn't know has no drupal.org issues to load.
  const enabled = !project || projectNid.nid !== null;
  const loaded = useListIssues(list, category, priority, projectNid.nid, enabled);
  const drupalorg = enabled ? loaded : projectNid.state === "ok" ? EMPTY : { ...LOADING, state: projectNid.state };
  useEffect(() => {
    onIssues(drupalorg.issues.filter((issue) => !movedProjects.has(issue.field_project?.id)));
  }, [drupalorg.issues, movedProjects, onIssues]);
  const gitlab = filterIssues(workItems.issues, {
    statuses: list.statuses,
    category,
    priority,
    version: list.versions,
  }).filter(inProject(project));
  const gitlabNids = new Set(gitlab.map((issue) => issue.nid));
  const fromDrupalOrg = drupalorg.issues.filter(
    (issue) => !gitlabNids.has(issue.nid) && !movedProjects.has(issue.field_project?.id)
  );
  const issues = gitlab
    .concat(fromDrupalOrg)
    .sort(byPriority)
    .filter((issue) => matchesText(issue, text));
  const states = [drupalorg.state, workItems.state];
  const state = states.includes("error") ? "error" : states.includes("loading") ? "loading" : "ok";
  const total = gitlab.length + drupalorg.total - (drupalorg.issues.length - fromDrupalOrg.length);
  return (
    <Column
      list={list}
      state={state}
      issues={issues}
      total={text ? issues.length : total}
      partial={!text && drupalorg.partial}
      showProject={showProject}
    />
  );
}

/**
 * Every list on a tag board, sharing one load of the label's work items.
 */
function TagColumns({ label, movedProjects, lists, category, priority, project, text, showProject, onIssues }) {
  const workItems = useWorkItems(fetchLabeledWorkItems, label);
  const moved = useMemo(() => new Set(movedProjects.map(String)), [movedProjects]);
  const projectNid = useProjectNid(project);
  useEffect(() => {
    onIssues(workItems.issues);
  }, [workItems.issues, onIssues]);
  return lists.map((list, index) => (
    <TagColumn
      key={index}
      list={list}
      workItems={workItems}
      movedProjects={moved}
      category={category}
      priority={priority}
      project={project}
      projectNid={projectNid}
      text={text}
      showProject={showProject}
      onIssues={onIssues}
    />
  ));
}

// A drupal.org issue URL names its project, which is also its GitLab path.
const ISSUE_PROJECT = /^https:\/\/www\.drupal\.org\/project\/([^/]+)\/issues\//;

/**
 * Replaces issues from projects that moved to GitLab with their work items.
 *
 * Drupal.org keeps moved issues frozen, and each keeps its node ID as its
 * IID. A project that GitLab can't answer for keeps its drupal.org copies.
 *
 * @param {object[]} issues Issues from drupal.org.
 * @param {Set<string>} movedProjects Node IDs of projects on GitLab.
 * @param {AbortSignal} signal
 * @returns {Promise<object[]>}
 */
async function withGitLabWorkItems(issues, movedProjects, signal) {
  const iidsByProject = new Map();
  for (const issue of issues) {
    const match = ISSUE_PROJECT.exec(issue.url ?? "");
    if (match && movedProjects.has(issue.field_project?.id)) {
      const path = `project/${match[1]}`;
      iidsByProject.set(path, [...(iidsByProject.get(path) ?? []), issue.nid]);
    }
  }
  const workItems = await Promise.all(
    [...iidsByProject].map(([path, iids]) => fetchWorkItemsByIid(path, iids, signal).catch(() => []))
  );
  const byNid = new Map(workItems.flat().map((issue) => [issue.nid, issue]));
  return issues.map((issue) => byNid.get(issue.nid) ?? issue).sort(byPriority);
}

/**
 * Fetches work items by IID, one request per project.
 *
 * @param {{path: string, iid: string}[]} workItems
 * @param {AbortSignal} signal
 * @returns {Promise<object[]>}
 */
async function fetchWorkItems(workItems, signal) {
  const iidsByProject = new Map();
  for (const { path, iid } of workItems) {
    iidsByProject.set(path, [...(iidsByProject.get(path) ?? []), iid]);
  }
  const issues = await Promise.all(
    [...iidsByProject].map(([path, iids]) => fetchWorkItemsByIid(path, iids, signal))
  );
  return issues.flat();
}

/**
 * Loads an issue collection's issues once.
 *
 * @param {string[]} nids Drupal.org issue node IDs.
 * @param {{path: string, iid: string}[]} workItems GitLab work items.
 * @param {Set<string>} movedProjects Node IDs of projects on GitLab.
 * @returns {{state: string, issues: object[]}}
 */
function useCollection(nids, workItems, movedProjects) {
  const [result, setResult] = useState(LOADING);
  useEffect(() => {
    if (nids.length === 0 && workItems.length === 0) {
      setResult({ ...LOADING, state: "ok" });
      return undefined;
    }
    const controller = new AbortController();
    const resolve = (value) => {
      if (!controller.signal.aborted) {
        setResult(value);
      }
    };
    const fromDrupalOrg = nids.length
      ? fetchIssuesByNid(nids, controller.signal).then((issues) =>
          withGitLabWorkItems(issues, movedProjects, controller.signal)
        )
      : Promise.resolve([]);
    Promise.all([fromDrupalOrg, fetchWorkItems(workItems, controller.signal)])
      .then(([issues, gitlab]) => {
        // A moved drupal.org issue and its work item can both be listed.
        const byUrl = new Map(issues.concat(gitlab).map((issue) => [issue.url, issue]));
        resolve({ state: "ok", issues: [...byUrl.values()].sort(byPriority) });
      })
      .catch(() => resolve({ ...LOADING, state: "error" }));
    return () => controller.abort();
  }, [nids, workItems, movedProjects]);
  return result;
}

/**
 * Every list on an issue collection, sharing one load.
 */
function CollectionColumns({ nids, workItems, movedProjects, lists, category, priority, project, text, showProject, onIssues }) {
  const moved = useMemo(() => new Set(movedProjects.map(String)), [movedProjects]);
  const collection = useCollection(nids, workItems, moved);
  useEffect(() => {
    onIssues(collection.issues);
  }, [collection.issues, onIssues]);
  return lists.map((list, index) => {
    const issues = collection.issues.filter(
      (issue) =>
        list.statuses.includes(issue.field_issue_status) &&
        (!category || issue.field_issue_category === category) &&
        (!priority || issue.field_issue_priority === priority) &&
        inProject(project)(issue) &&
        matchesText(issue, text)
    );
    return (
      <Column
        key={index}
        list={list}
        state={collection.state}
        issues={issues}
        total={issues.length}
        partial={false}
        showProject={showProject}
      />
    );
  });
}

/**
 * Collects the projects of every issue the board has loaded.
 *
 * Projects stay once seen, so filtering by one keeps the others to pick.
 *
 * @returns {{names: string[], add: (issues: object[]) => void}}
 */
function useProjects() {
  const [names, setNames] = useState(() => new Set());
  const add = useCallback((issues) => {
    setNames((previous) => {
      let next = previous;
      for (const issue of issues) {
        const name = issueProject(issue);
        if (name && !next.has(name)) {
          next = next === previous ? new Set(previous) : next;
          next.add(name);
        }
      }
      return next;
    });
  }, []);
  return { names: useMemo(() => [...names].sort(), [names]), add };
}

/**
 * The board island.
 *
 * @param {object} props
 * @param {object} props.config The board configuration from the board shell.
 * @param {Element|null} props.filtersSlot Where the board shell wants the filters.
 */
function Board({ config, filtersSlot }) {
  const showProject = config.showProject ?? false;
  const [filters, setFilters] = useState(() => {
    const read = readFilters(window.location.search);
    // Only boards that span projects filter by project.
    return showProject ? read : { ...read, project: null };
  });
  const projects = useProjects();

  // Filters live in the URL, so a filtered board can be shared.
  useEffect(() => {
    const query = writeFilters(filters, window.location.search);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", url);
  }, [filters]);

  const { category, priority } = filterIds(filters);
  const toolbar = (
    <Filters filters={filters} onChange={setFilters} projects={showProject ? projects.names : null} />
  );
  return (
    <>
      {filtersSlot ? createPortal(toolbar, filtersSlot) : toolbar}
      {config.nids ? (
        <CollectionColumns
          nids={config.nids}
          workItems={config.workItems ?? NO_WORK_ITEMS}
          movedProjects={config.movedProjects ?? NO_PROJECTS}
          lists={config.lists}
          category={category}
          priority={priority}
          project={filters.project}
          text={filters.text}
          showProject={showProject}
          onIssues={projects.add}
        />
      ) : config.gitlabLabel ? (
        <TagColumns
          label={config.gitlabLabel}
          movedProjects={config.movedProjects ?? NO_PROJECTS}
          lists={config.lists}
          category={category}
          priority={priority}
          project={filters.project}
          text={filters.text}
          showProject={showProject}
          onIssues={projects.add}
        />
      ) : config.source === "gitlab" ? (
        <GitLabColumns
          project={config.gitlabProject}
          lists={config.lists}
          category={category}
          priority={priority}
          text={filters.text}
        />
      ) : (
        config.lists.map((list, index) => (
          <DrupalOrgColumn
            key={index}
            list={list}
            category={category}
            priority={priority}
            text={filters.text}
          />
        ))
      )}
    </>
  );
}
export default Board;
