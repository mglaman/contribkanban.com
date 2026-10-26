import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import Card from "./Card";

// Large projects have hundreds of issues per status, so cards render in steps.
const STEP = 20;

const STORAGE_PREFIX = "contribkanban:collapsed:";

/**
 * Which columns the viewer collapsed, by list title.
 */
export const CollapsedColumns = createContext({ collapsed: new Set(), toggle: () => {} });

function readCollapsed(key) {
  try {
    const titles = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return new Set(Array.isArray(titles) ? titles.filter((title) => typeof title === "string") : []);
  } catch {
    return new Set();
  }
}

/**
 * Keeps the viewer's collapsed columns for one board in localStorage.
 *
 * Storage can be missing or blocked, so the board then starts with every
 * column open and forgets the choice on reload.
 *
 * @param {string} board The board's path, which keys its stored columns.
 * @returns {{collapsed: Set<string>, toggle: (title: string) => void}}
 */
export function useCollapsedColumns(board) {
  const key = `${STORAGE_PREFIX}${board}`;
  const [collapsed, setCollapsed] = useState(() => readCollapsed(key));
  const changed = useRef(false);
  useEffect(() => {
    if (!changed.current) {
      return;
    }
    try {
      if (collapsed.size) {
        window.localStorage.setItem(key, JSON.stringify([...collapsed]));
      } else {
        window.localStorage.removeItem(key);
      }
    } catch {
      // The choice lasts until the page reloads.
    }
  }, [key, collapsed]);
  const toggle = useCallback((title) => {
    changed.current = true;
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (!next.delete(title)) {
        next.add(title);
      }
      return next;
    });
  }, []);
  return useMemo(() => ({ collapsed, toggle }), [collapsed, toggle]);
}

/**
 * One list on the board.
 *
 * Its header collapses it to a narrow strip that keeps the title and count.
 *
 * @param {object} props
 * @param {object} props.list The list from the board configuration.
 * @param {"loading"|"ok"|"error"} props.state
 * @param {object[]} props.issues The list's issues after filtering.
 * @param {number} props.total The count to show in the header.
 * @param {boolean} props.partial Whether there are more issues than `total`.
 * @param {boolean} [props.showProject] Whether cards name their project.
 */
function Column({ list, state, issues, total, partial, showProject = false }) {
  const headingId = useId();
  const [shown, setShown] = useState(STEP);
  const { collapsed: collapsedTitles, toggle } = useContext(CollapsedColumns);
  const collapsed = collapsedTitles.has(list.title);
  const remaining = issues.length - Math.min(shown, issues.length);
  return (
    <section
      className={`board-column${collapsed ? " board-column--collapsed" : ""}`}
      aria-labelledby={headingId}
      aria-busy={state === "loading"}
    >
      <h2 id={headingId} className={`board-column__header board-column__header--${list.tone}`}>
        <button
          type="button"
          className="board-column__toggle"
          aria-expanded={!collapsed}
          onClick={() => toggle(list.title)}
        >
          <span className="board-column__title">{list.title}</span>
          {state === "ok" ? (
            <span className="board-column__count">
              {total}
              {partial ? "+" : ""}
            </span>
          ) : null}
          <svg className="board-column__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h2>
      {collapsed ? null : (
        <>
          {state === "loading" ? <p className="board-column__status">Loading issues…</p> : null}
          {state === "error" ? <p className="board-column__status">Couldn't load issues.</p> : null}
          {state === "ok" && issues.length === 0 ? (
            <p className="board-column__empty">Nothing here right now</p>
          ) : null}
          {issues.slice(0, shown).map((issue) => (
            <Card key={issue.url ?? issue.nid} issue={issue} showProject={showProject} />
          ))}
          {remaining > 0 ? (
            <button type="button" className="board-column__more" onClick={() => setShown(shown + STEP)}>
              Show {Math.min(remaining, STEP)} more
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
export default Column;
