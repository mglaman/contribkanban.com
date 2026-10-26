const API_URL = "https://www.drupal.org/api-d7/node.json";

// api-d7 returns at most 50 issues per request, whatever the limit says.
export const PAGE_SIZE = 50;

function appendAll(params, key, values) {
  values.forEach((value, index) => params.append(`${key}[${index}]`, value));
}

/**
 * Builds the api-d7 query for one list.
 *
 * @param {object} list The list from the board configuration.
 * @param {{category: string|null, priority: string|null, project?: string|null}} filters
 *   Issue IDs for the Type and Priority filters, and a project's node ID
 *   that replaces the list's projects.
 * @returns {string}
 */
export function listQuery(list, { category, priority, project = null }) {
  const params = new URLSearchParams({
    type: "project_issue",
    limit: String(PAGE_SIZE),
    sort: "field_issue_priority",
    direction: "DESC",
  });
  appendAll(params, "field_project[target_id]", project ? [project] : list.projects);
  appendAll(params, "field_issue_status[value]", list.statuses);
  appendAll(params, "taxonomy_vocabulary_9[tid]", list.tags);
  appendAll(params, "field_issue_version[value]", list.versions);
  if (list.component) {
    params.set("field_issue_component", list.component);
  }
  if (category) {
    params.set("field_issue_category", category);
  }
  if (priority) {
    params.set("field_issue_priority", priority);
  }
  return params.toString();
}

/**
 * Fetches the first page of a list's issues.
 *
 * @param {object} list The list from the board configuration.
 * @param {{category: string|null, priority: string|null, project?: string|null}} filters
 * @param {AbortSignal} [signal]
 * @returns {Promise<{issues: object[], total: number, partial: boolean}>}
 *   When there are more pages, `total` is the lower bound from the last page
 *   number and `partial` is true.
 */
export async function fetchListIssues(list, filters, signal) {
  const res = await fetch(`${API_URL}?${listQuery(list, filters)}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) {
    throw new Error(`drupal.org responded ${res.status}`);
  }
  const data = await res.json();
  if (!data.next) {
    return { issues: data.list, total: data.list.length, partial: false };
  }
  const lastPage = Number(new URL(data.last).searchParams.get("page"));
  return { issues: data.list, total: lastPage * PAGE_SIZE, partial: true };
}

/**
 * Fetches issues by node ID, for an issue collection.
 *
 * api-d7 returns 50 issues per request, so larger collections load in chunks.
 *
 * @param {string[]} nids
 * @param {AbortSignal} [signal]
 * @returns {Promise<object[]>} The issues, highest priority first.
 */
export async function fetchIssuesByNid(nids, signal) {
  const chunks = [];
  for (let start = 0; start < nids.length; start += PAGE_SIZE) {
    chunks.push(nids.slice(start, start + PAGE_SIZE));
  }
  const pages = await Promise.all(
    chunks.map(async (chunk) => {
      const params = new URLSearchParams({ type: "project_issue", limit: String(PAGE_SIZE) });
      appendAll(params, "nid", chunk);
      const res = await fetch(`${API_URL}?${params}`, { headers: { Accept: "application/json" }, signal });
      if (!res.ok) {
        throw new Error(`drupal.org responded ${res.status}`);
      }
      return (await res.json()).list;
    })
  );
  return pages.flat().sort((a, b) => Number(b.field_issue_priority) - Number(a.field_issue_priority));
}


// Project node IDs by machine name, shared by every list on the page.
const projectNids = new Map();

/**
 * Looks up a project's node ID by machine name, once per page.
 *
 * @param {string} machineName
 * @returns {Promise<string|null>} The node ID, or null if drupal.org has no
 *   such project.
 */
export function fetchProjectNid(machineName) {
  if (!projectNids.has(machineName)) {
    const params = new URLSearchParams({ field_project_machine_name: machineName, limit: "1" });
    const lookup = fetch(`${API_URL}?${params}`, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`drupal.org responded ${res.status}`);
        }
        return res.json();
      })
      .then((data) => data.list[0]?.nid ?? null);
    // Forget failures, so the next lookup tries again.
    lookup.catch(() => projectNids.delete(machineName));
    projectNids.set(machineName, lookup);
  }
  return projectNids.get(machineName);
}
