import { PRIORITIES, TYPES } from "./filters";

/**
 * The Type, Priority, and search filters.
 *
 * Not a form: everything applies as it changes, so there is nothing to submit.
 */
function Filters({ filters, onChange }) {
  return (
    <div className="board-filters" role="search" aria-label="Filter cards">
      <label className="board-filters__field">
        Type
        <select
          className="board-filters__select"
          value={filters.type ?? ""}
          onChange={(event) => onChange({ ...filters, type: event.target.value || null })}
        >
          <option value="">Everything</option>
          {TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="board-filters__field">
        Priority
        <select
          className="board-filters__select"
          value={filters.priority ?? ""}
          onChange={(event) => onChange({ ...filters, priority: event.target.value || null })}
        >
          <option value="">Any</option>
          {PRIORITIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="board-filters__search">
        <span className="visually-hidden">Find a card</span>
        <input
          className="board-filters__input"
          type="search"
          placeholder="Find a card"
          value={filters.text}
          onChange={(event) => onChange({ ...filters, text: event.target.value })}
        />
      </label>
    </div>
  );
}
export default Filters;
