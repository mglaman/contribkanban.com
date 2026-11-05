// The GraphQL endpoint does not send CORS headers, so browsers must use REST.
const GITLAB_API_URL = "https://git.drupalcode.org/api/v4";

// Each page is one request against the anonymous rate limit of 180 requests
// per minute, so very large projects only show their first 2,000 items.
const MAX_PAGES = 20;

// Projects a board spanning many projects loads at once.
const PROJECT_CONCURRENCY = 6;

// GitLab `state::` values to Drupal.org issue status IDs. GitLab added triage
// states with no Drupal.org equivalent, and those count as Active.
const STATE_TO_STATUS = {
  active: "1",
  accepted: "1",
  new: "1",
  tobetriaged: "1",
  planned: "1",
  readyforwork: "1",
  inprogress: "1",
  fixed: "2",
  postponed: "4",
  blocked: "4",
  closed: "7",
  needsreview: "8",
  needswork: "13",
  rtbc: "14",
  tobeported: "15",
};

const CATEGORY_TO_ID = {
  bug: "1",
  task: "2",
  feature: "3",
  support: "4",
  plan: "5",
};

const PRIORITY_TO_ID = {
  critical: "400",
  major: "300",
  normal: "200",
  minor: "100",
};

/**
 * Returns the value of a scoped label, like `needsreview` for `state::needsReview`.
 *
 * Labels are per project and their spelling drifts, such as
 * `state::needsReview` and `state::needs review`, so values are lowercased
 * with everything but letters and digits removed.
 *
 * @param {string[]} labels
 * @param {string} scope
 * @returns {string|null}
 */
export function scopedLabelValue(labels, scope) {
  const prefix = `${scope}::`;
  const label = labels.find((title) => title.toLowerCase().startsWith(prefix));
  if (!label) {
    return null;
  }
  return label
    .slice(prefix.length)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Maps a work item's state to a Drupal.org issue status ID.
 *
 * A closed work item is closed whatever its `state::` label says, and counts
 * as Closed (fixed) unless the label says Fixed.
 *
 * @param {object} workItem A work item from the REST issues API.
 * @returns {string}
 */
function issueStatus(workItem) {
  const status = STATE_TO_STATUS[scopedLabelValue(workItem.labels, "state")];
  if (workItem.state === "closed") {
    return status === "2" ? "2" : "7";
  }
  return status ?? "1";
}

/**
 * Converts a GitLab work item into the Drupal.org issue shape cards and lists use.
 *
 * @param {object} workItem A work item from the REST issues API.
 * @returns {object}
 */
export function toDrupalOrgIssue(workItem) {
  const labels = workItem.labels;
  const version = labels.find((title) => /^v\d/.test(title));
  const [assignee] = workItem.assignees;
  return {
    nid: String(workItem.iid),
    title: workItem.title,
    url: workItem.web_url,
    field_issue_status: issueStatus(workItem),
    field_issue_category: CATEGORY_TO_ID[scopedLabelValue(labels, "category")] ?? null,
    field_issue_priority: PRIORITY_TO_ID[scopedLabelValue(labels, "priority")] ?? "200",
    field_issue_version: version ? version.slice(1) : null,
    field_issue_assigned: assignee ? assignee.username : null,
    // Drupal.org's API has no user pictures, but GitLab's has avatars.
    assignee: assignee ? { username: assignee.username, avatarUrl: assignee.avatar_url ?? null } : null,
    milestone: workItem.milestone?.title ?? null,
  };
}

/**
 * Applies a board list's filters to issues, matching the Drupal.org API query.
 *
 * @param {object[]} issues Issues from toDrupalOrgIssue().
 * @param {object} filter The list's statuses, category, priority, and version,
 *   and optionally a milestone title.
 * @returns {object[]}
 */
export function filterIssues(issues, filter) {
  return issues
    .filter(
      (issue) =>
        filter.statuses.includes(issue.field_issue_status) &&
        (filter.category === null || String(filter.category) === issue.field_issue_category) &&
        (filter.priority === null || String(filter.priority) === issue.field_issue_priority) &&
        (filter.version.length === 0 || filter.version.includes(issue.field_issue_version)) &&
        (!filter.milestone || issue.milestone === filter.milestone)
    )
    .sort((a, b) => Number(b.field_issue_priority) - Number(a.field_issue_priority));
}

async function fetchPage(url, page, signal, token) {
  const options = token ? { signal, headers: { "PRIVATE-TOKEN": token } } : { signal };
  const res = await fetch(`${url}&page=${page}`, options);
  if (!res.ok) {
    const error = new Error(`GitLab responded ${res.status} for ${url}`);
    error.status = res.status;
    throw error;
  }
  return res;
}

/**
 * Fetches every open work item from an issues endpoint.
 *
 * The first page reports the page count, then the remaining pages load in
 * parallel.
 *
 * @param {string} url The endpoint, with a query string.
 * @param {(issues: object[]) => void} onPage Called with the issues loaded so far.
 * @param {AbortSignal} [signal]
 * @param {string} [token] A GitLab token to send, for a viewer's own requests.
 * @returns {Promise<void>}
 */
async function fetchAllPages(url, onPage, signal, token) {
  const first = await fetchPage(url, 1, signal, token);
  const firstItems = (await first.json()).map(toDrupalOrgIssue);
  onPage(firstItems);

  // GitLab omits the header past 10,000 results, far beyond MAX_PAGES.
  const totalPages = Math.min(Number(first.headers.get("X-Total-Pages")) || 1, MAX_PAGES);
  if (totalPages === 1) {
    return;
  }
  const pages = [];
  for (let page = 2; page <= totalPages; page++) {
    pages.push(fetchPage(url, page, signal, token).then((res) => res.json()));
  }
  const rest = (await Promise.all(pages)).flat().map(toDrupalOrgIssue);
  onPage(firstItems.concat(rest));
}

/**
 * Fetches every open work item in a project.
 *
 * @param {string} fullPath The GitLab project path, like `project/tool`.
 * @param {(issues: object[]) => void} onPage Called with the issues loaded so far.
 * @param {AbortSignal} [signal]
 * @param {string} [token] A GitLab token to send, for a viewer's own requests.
 * @returns {Promise<void>}
 */
export function fetchOpenWorkItems(fullPath, onPage, signal, token) {
  return fetchAllPages(
    `${GITLAB_API_URL}/projects/${encodeURIComponent(fullPath)}/issues?state=opened&per_page=100`,
    onPage,
    signal,
    token
  );
}

/**
 * Fetches the drupal.org projects a token's account maintains.
 *
 * Access level 30 is GitLab's Developer role. Some co-maintainers only have
 * that, so asking for the Maintainer role would miss their projects. Scoping
 * to the `project` group leaves out their issue forks and sandboxes.
 *
 * @param {string} token The viewer's GitLab token.
 * @param {AbortSignal} [signal]
 * @returns {Promise<{path: string, machineName: string, issuesEnabled: boolean}[]>}
 * @throws {Error} With a `status` of 401 when GitLab rejects the token.
 */
export async function fetchMyProjects(token, signal) {
  const url = `${GITLAB_API_URL}/groups/project/projects?min_access_level=30&per_page=100`;
  const first = await fetchPage(url, 1, signal, token);
  const pages = [first.json()];
  const totalPages = Number(first.headers.get("X-Total-Pages")) || 1;
  for (let page = 2; page <= totalPages; page++) {
    pages.push(fetchPage(url, page, signal, token).then((res) => res.json()));
  }
  return (await Promise.all(pages)).flat().map((project) => ({
    path: project.path_with_namespace,
    machineName: project.path,
    issuesEnabled: project.issues_enabled === true,
  }));
}

/**
 * Fetches every open work item in many projects.
 *
 * GitLab's REST API can't filter issues by a list of projects, so each project
 * takes at least one request. A maintainer's board can be over 100 requests,
 * so only a few run at once. A project that fails leaves the others in place,
 * and only counts as a failed load if every project fails.
 *
 * @param {string[]} paths GitLab project paths, like `project/tool`.
 * @param {(issues: object[], partial: boolean) => void} onPage Called with the
 *   issues loaded so far, and whether any project is missing from them.
 * @param {AbortSignal} [signal]
 * @param {string} [token] A GitLab token to send, for a viewer's own requests.
 * @returns {Promise<void>}
 */
export async function fetchProjectsWorkItems(paths, onPage, signal, token) {
  const loaded = new Map();
  const queue = [...paths];
  let pending = paths.length;
  let failed = 0;
  const publish = () => onPage([...loaded.values()].flat(), pending > 0 || failed > 0);

  const worker = async () => {
    for (let path = queue.shift(); path; path = queue.shift()) {
      try {
        await fetchOpenWorkItems(
          path,
          (issues) => {
            loaded.set(path, issues);
            publish();
          },
          signal,
          token
        );
      } catch (error) {
        if (signal?.aborted) {
          throw error;
        }
        failed++;
      }
      pending--;
    }
  };
  await Promise.all(Array.from({ length: PROJECT_CONCURRENCY }, worker));

  if (paths.length > 0 && failed === paths.length) {
    throw new Error(`GitLab failed for all ${failed} projects`);
  }
  publish();
}

/**
 * Fetches every open work item with a label, across drupal.org's projects.
 *
 * Labels are case-sensitive, and drupal.org issue tags became labels with the
 * same name.
 *
 * @param {string} label The label, like `Novice`.
 * @param {(issues: object[]) => void} onPage Called with the issues loaded so far.
 * @param {AbortSignal} [signal]
 * @returns {Promise<void>}
 */
export function fetchLabeledWorkItems(label, onPage, signal) {
  const params = new URLSearchParams({ labels: label, state: "opened", per_page: "100" });
  return fetchAllPages(`${GITLAB_API_URL}/groups/project/issues?${params}`, onPage, signal);
}

/**
 * Fetches work items by IID from one project, open or closed.
 *
 * Migrated drupal.org issues keep their node ID as their IID.
 *
 * @param {string} fullPath The GitLab project path, like `project/tool`.
 * @param {string[]} iids
 * @param {AbortSignal} [signal]
 * @returns {Promise<object[]>} Issues from toDrupalOrgIssue().
 */
export async function fetchWorkItemsByIid(fullPath, iids, signal) {
  const pages = [];
  for (let start = 0; start < iids.length; start += 100) {
    const params = new URLSearchParams({ state: "all", per_page: "100" });
    iids.slice(start, start + 100).forEach((iid) => params.append("iids[]", iid));
    const url = `${GITLAB_API_URL}/projects/${encodeURIComponent(fullPath)}/issues?${params}`;
    pages.push(
      fetch(url, { signal }).then((res) => {
        if (!res.ok) {
          throw new Error(`GitLab responded ${res.status} for ${fullPath}`);
        }
        return res.json();
      })
    );
  }
  return (await Promise.all(pages)).flat().map(toDrupalOrgIssue);
}

