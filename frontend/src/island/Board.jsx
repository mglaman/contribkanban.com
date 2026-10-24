import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Column from "./Column";
import Filters from "./Filters";
import { fetchIssuesByNid, fetchListIssues, fetchMovedProjects } from "./drupalorg";
import { filterIds, matchesText, readFilters, writeFilters } from "./filters";
import { fetchLabeledWorkItems, fetchOpenWorkItems, filterIssues } from "./gitlab";

const LOADING = { state: "loading", issues: [], total: 0, partial: false };

const byPriority = (a, b) => Number(b.field_issue_priority) - Number(a.field_issue_priority);

/**
 * Drops issues from projects whose issues moved to GitLab.
 *
 * @param {{issues: object[], total: number, partial: boolean}} data
 * @returns {Promise<{issues: object[], total: number, partial: boolean}>}
 */
async function withoutMovedProjects(data) {
  const moved = await fetchMovedProjects(data.issues.map((issue) => issue.field_project?.id).filter(Boolean));
  const issues = data.issues.filter((issue) => !moved.has(issue.field_project?.id));
  return { ...data, issues, total: data.total - (data.issues.length - issues.length) };
}

/**
 * Loads a list's first page from drupal.org.
 *
 * Type and Priority go into the query, since a list only loads its first page.
 *
 * @param {object} list The list from the board configuration.
 * @param {string|null} category
 * @param {string|null} priority
 * @param {boolean} dropMoved Whether to drop issues from projects on GitLab.
 * @returns {{state: string, issues: object[], total: number, partial: boolean}}
 */
function useListIssues(list, category, priority, dropMoved) {
  const key = `${category}:${priority}`;
  // Keyed by query so a changed filter shows loading, not the previous result.
  const [result, setResult] = useState({ key: null });

  useEffect(() => {
    const controller = new AbortController();
    const resolve = (value) => {
      if (!controller.signal.aborted) {
        setResult({ key, ...value });
      }
    };
    fetchListIssues(list, { category, priority }, controller.signal)
      .then((data) => (dropMoved ? withoutMovedProjects(data) : data))
      .then((data) => resolve({ state: "ok", ...data }))
      .catch(() => resolve({ ...LOADING, state: "error" }));
    return () => controller.abort();
  }, [list, key, category, priority, dropMoved]);

  return result.key === key ? result : LOADING;
}

/**
 * A list that queries drupal.org. The search text filters the loaded issues.
 */
function DrupalOrgColumn({ list, category, priority, text }) {
  const current = useListIssues(list, category, priority, false);
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
 * those come from GitLab only.
 */
function TagColumn({ list, workItems, category, priority, text }) {
  const drupalorg = useListIssues(list, category, priority, true);
  const gitlab = filterIssues(workItems.issues, {
    statuses: list.statuses,
    category,
    priority,
    version: list.versions,
  });
  const gitlabNids = new Set(gitlab.map((issue) => issue.nid));
  const fromDrupalOrg = drupalorg.issues.filter((issue) => !gitlabNids.has(issue.nid));
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
    />
  );
}

/**
 * Every list on a tag board, sharing one load of the label's work items.
 */
function TagColumns({ label, lists, category, priority, text }) {
  const workItems = useWorkItems(fetchLabeledWorkItems, label);
  return lists.map((list, index) => (
    <TagColumn
      key={index}
      list={list}
      workItems={workItems}
      category={category}
      priority={priority}
      text={text}
    />
  ));
}

/**
 * Loads an issue collection's issues once.
 *
 * @param {string[]} nids
 * @returns {{state: string, issues: object[]}}
 */
function useCollection(nids) {
  const [result, setResult] = useState(LOADING);
  useEffect(() => {
    if (nids.length === 0) {
      setResult({ ...LOADING, state: "ok" });
      return undefined;
    }
    const controller = new AbortController();
    const resolve = (value) => {
      if (!controller.signal.aborted) {
        setResult(value);
      }
    };
    fetchIssuesByNid(nids, controller.signal)
      .then((issues) => resolve({ state: "ok", issues }))
      .catch(() => resolve({ ...LOADING, state: "error" }));
    return () => controller.abort();
  }, [nids]);
  return result;
}

/**
 * Every list on an issue collection, sharing one load.
 */
function CollectionColumns({ nids, lists, category, priority, text }) {
  const collection = useCollection(nids);
  return lists.map((list, index) => {
    const issues = collection.issues.filter(
      (issue) =>
        list.statuses.includes(issue.field_issue_status) &&
        (!category || issue.field_issue_category === category) &&
        (!priority || issue.field_issue_priority === priority) &&
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
      />
    );
  });
}

/**
 * The board island.
 *
 * @param {object} props
 * @param {object} props.config The board configuration from the board shell.
 * @param {Element|null} props.filtersSlot Where the board shell wants the filters.
 */
function Board({ config, filtersSlot }) {
  const [filters, setFilters] = useState(() => readFilters(window.location.search));

  // Filters live in the URL, so a filtered board can be shared.
  useEffect(() => {
    const query = writeFilters(filters, window.location.search);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", url);
  }, [filters]);

  const { category, priority } = filterIds(filters);
  const toolbar = <Filters filters={filters} onChange={setFilters} />;
  return (
    <>
      {filtersSlot ? createPortal(toolbar, filtersSlot) : toolbar}
      {config.nids ? (
        <CollectionColumns
          nids={config.nids}
          lists={config.lists}
          category={category}
          priority={priority}
          text={filters.text}
        />
      ) : config.gitlabLabel ? (
        <TagColumns
          label={config.gitlabLabel}
          lists={config.lists}
          category={category}
          priority={priority}
          text={filters.text}
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
