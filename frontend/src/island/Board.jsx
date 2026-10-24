import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Column from "./Column";
import Filters from "./Filters";
import { fetchListIssues } from "./drupalorg";
import { filterIds, matchesText, readFilters, writeFilters } from "./filters";
import { fetchOpenWorkItems, filterIssues } from "./gitlab";

const LOADING = { state: "loading", issues: [], total: 0, partial: false };

/**
 * A list that queries drupal.org.
 *
 * Type and Priority go into the query, since a list only loads its first page.
 * The search text filters the loaded issues.
 */
function DrupalOrgColumn({ list, category, priority, text }) {
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
      .then((data) => resolve({ state: "ok", ...data }))
      .catch(() => resolve({ ...LOADING, state: "error" }));
    return () => controller.abort();
  }, [list, key, category, priority]);

  const current = result.key === key ? result : LOADING;
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
 * Loads every open work item in a GitLab project once.
 *
 * @param {string} project The project path, like `project/canvas`.
 * @returns {{state: string, issues: object[]}}
 */
function useWorkItems(project) {
  const [result, setResult] = useState(LOADING);
  useEffect(() => {
    const controller = new AbortController();
    const resolve = (value) => {
      if (!controller.signal.aborted) {
        setResult(value);
      }
    };
    fetchOpenWorkItems(project, (issues) => resolve({ state: "ok", issues }), controller.signal).catch(
      () => resolve({ ...LOADING, state: "error" })
    );
    return () => controller.abort();
  }, [project]);
  return result;
}

/**
 * Every list on a board that reads GitLab, sharing one load.
 */
function GitLabColumns({ project, lists, category, priority, text }) {
  const workItems = useWorkItems(project);
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
      {config.source === "gitlab" ? (
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
