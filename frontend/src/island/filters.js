// Values in the URL, to drupal.org issue category and priority IDs.
export const TYPES = [
  { value: "bug", id: "1", label: "Bugs" },
  { value: "task", id: "2", label: "Tasks" },
  { value: "feature", id: "3", label: "Features" },
  { value: "support", id: "4", label: "Support" },
  { value: "plan", id: "5", label: "Plans" },
];

export const PRIORITIES = [
  { value: "critical", id: "400", label: "Critical" },
  { value: "major", id: "300", label: "Major" },
  { value: "normal", id: "200", label: "Normal" },
  { value: "minor", id: "100", label: "Minor" },
];

// A project's machine name, which drupal.org and GitLab issue URLs include.
const MACHINE_NAME = /^[a-z0-9_]+$/;
const PROJECT_URL = /^https:\/\/(?:www\.drupal\.org|git\.drupalcode\.org)\/project\/([a-z0-9_]+)\//;

function idFor(options, value) {
  return options.find((option) => option.value === value)?.id ?? null;
}

/**
 * Reads the filters from a query string, dropping unknown values.
 *
 * @param {string} search Like `?type=bug&project=token&q=views`.
 * @returns {{type: string|null, priority: string|null, project: string|null, text: string}}
 */
export function readFilters(search) {
  const params = new URLSearchParams(search);
  const type = params.get("type");
  const priority = params.get("priority");
  const project = params.get("project");
  return {
    type: idFor(TYPES, type) ? type : null,
    priority: idFor(PRIORITIES, priority) ? priority : null,
    project: project && MACHINE_NAME.test(project) ? project : null,
    text: params.get("q") ?? "",
  };
}

/**
 * Writes the filters into a query string, keeping other parameters.
 *
 * @param {{type: string|null, priority: string|null, project: string|null, text: string}} filters
 * @param {string} search The current query string.
 * @returns {string} The query string without its leading `?`.
 */
export function writeFilters(filters, search) {
  const params = new URLSearchParams(search);
  const values = {
    type: filters.type,
    priority: filters.priority,
    project: filters.project,
    q: filters.text.trim(),
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  }
  return params.toString();
}

/**
 * Gets the drupal.org IDs for the Type and Priority filters.
 *
 * @param {{type: string|null, priority: string|null}} filters
 * @returns {{category: string|null, priority: string|null}}
 */
export function filterIds(filters) {
  return {
    category: idFor(TYPES, filters.type),
    priority: idFor(PRIORITIES, filters.priority),
  };
}

/**
 * Gets an issue's project machine name from its URL.
 *
 * @param {object} issue An issue from drupal.org, or a work item from toDrupalOrgIssue().
 * @returns {string|null}
 */
export function issueProject(issue) {
  return PROJECT_URL.exec(issue.url ?? "")?.[1] ?? null;
}

/**
 * Checks whether an issue's title or number contains the search text.
 *
 * @param {object} issue
 * @param {string} text
 * @returns {boolean}
 */
export function matchesText(issue, text) {
  const needle = text.trim().toLowerCase().replace(/^#/, "");
  return needle === "" || issue.title.toLowerCase().includes(needle) || issue.nid.startsWith(needle);
}
