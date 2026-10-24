import { useId, useState } from "react";
import Card from "./Card";

// Large projects have hundreds of issues per status, so cards render in steps.
const STEP = 20;

/**
 * One list on the board.
 *
 * @param {object} props
 * @param {object} props.list The list from the board configuration.
 * @param {"loading"|"ok"|"error"} props.state
 * @param {object[]} props.issues The list's issues after filtering.
 * @param {number} props.total The count to show in the header.
 * @param {boolean} props.partial Whether there are more issues than `total`.
 */
function Column({ list, state, issues, total, partial }) {
  const headingId = useId();
  const [shown, setShown] = useState(STEP);
  const remaining = issues.length - Math.min(shown, issues.length);
  return (
    <section className="board-column" aria-labelledby={headingId} aria-busy={state === "loading"}>
      <h2 id={headingId} className={`board-column__header board-column__header--${list.tone}`}>
        {list.title}
        {state === "ok" ? (
          <span className="board-column__count">
            {total}
            {partial ? "+" : ""}
          </span>
        ) : null}
      </h2>
      {state === "loading" ? <p className="board-column__status">Loading issues…</p> : null}
      {state === "error" ? <p className="board-column__status">Couldn't load issues.</p> : null}
      {state === "ok" && issues.length === 0 ? (
        <p className="board-column__empty">Nothing here right now</p>
      ) : null}
      {issues.slice(0, shown).map((issue) => (
        <Card key={issue.nid} issue={issue} />
      ))}
      {remaining > 0 ? (
        <button type="button" className="board-column__more" onClick={() => setShown(shown + STEP)}>
          Show {Math.min(remaining, STEP)} more
        </button>
      ) : null}
    </section>
  );
}
export default Column;
