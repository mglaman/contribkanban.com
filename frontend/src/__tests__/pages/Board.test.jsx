import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, within, waitFor } from "@testing-library/react";
import {
  renderApp,
  mockFetch,
  jsonResponse,
  requestedUrls,
  currentPath,
} from "../../test-utils";

const LIST_TYPE = "board_list--drupalorg_project";

function boardDocument({ gitlab = false } = {}) {
  const lists = [
    { id: "l-active", title: "Active", statuses: ["1"] },
    { id: "l-review", title: "Needs Review", statuses: ["8"] },
    { id: "l-rtbc", title: "Reviewed & Tested", statuses: ["14", "15"] },
  ];
  return {
    data: [
      {
        type: "board--drupalorg_project",
        id: "board-uuid",
        attributes: {
          title: "Pathauto",
          machine_name: "pathauto",
          project_nid: ["17345"],
          tag: [],
          version: [],
          parent_issue: null,
          gitlab_work_items: gitlab,
        },
        relationships: {
          lists: {
            data: lists.map(({ id }) => ({ type: LIST_TYPE, id })),
          },
        },
      },
    ],
    included: lists.map(({ id, title, statuses }) => ({
      type: LIST_TYPE,
      id,
      attributes: {
        title,
        statuses,
        project_nid: [],
        tag: [],
        version: [],
        parent_issue: null,
        category: null,
        component: null,
        priority: null,
      },
    })),
  };
}

const DRUPALORG_ISSUES = [
  { nid: "101", title: "Bug in active", field_issue_status: "1", field_issue_category: "1", field_issue_priority: "300" },
  { nid: "102", title: "Task in active", field_issue_status: "1", field_issue_category: "2", field_issue_priority: "200" },
  { nid: "103", title: "Feature needing review", field_issue_status: "8", field_issue_category: "3", field_issue_priority: "200" },
].map((issue) => ({ ...issue, url: `https://www.drupal.org/node/${issue.nid}` }));

// Answers api-d7 issue queries by status and category, like drupal.org does.
function drupalOrgIssues(url) {
  const params = new URL(url).searchParams;
  const statuses = [...params.entries()]
    .filter(([key]) => key.startsWith("field_issue_status[value]"))
    .map(([, value]) => value);
  const category = params.get("field_issue_category");
  return jsonResponse({
    list: DRUPALORG_ISSUES.filter(
      (issue) =>
        statuses.includes(issue.field_issue_status) &&
        (!category || issue.field_issue_category === category)
    ),
  });
}

const boardRoute = (document) => ({
  url: /\/jsonapi\/index\/boards\?filter\[machine_name\]=pathauto&include=lists$/,
  respond: () => jsonResponse(document),
});

function column(title) {
  return screen.getByText(new RegExp(`^${title} \\(\\d+\\)$`)).closest(
    ".MuiPaper-root"
  );
}

describe("Board page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a Drupal.org board's lists and cards", async () => {
    const fetchMock = mockFetch([
      boardRoute(boardDocument()),
      { url: /www\.drupal\.org\/api-d7\/node\.json/, respond: drupalOrgIssues },
    ]);
    renderApp("/board/pathauto");

    expect(
      await screen.findByRole("heading", { name: "Pathauto" })
    ).toBeInTheDocument();
    expect(await screen.findByText("Active (2)")).toBeInTheDocument();
    expect(await screen.findByText("Needs Review (1)")).toBeInTheDocument();
    expect(screen.getByText("Reviewed & Tested (0)")).toBeInTheDocument();
    expect(
      within(column("Active")).getByText("Bug in active")
    ).toBeInTheDocument();
    expect(
      within(column("Needs Review")).getByText("Feature needing review")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Work items from git.drupalcode.org")
    ).not.toBeInTheDocument();
    expect(document.title).toBe("Pathauto - ContribKanban");

    const urls = requestedUrls(fetchMock);
    expect(urls).toContainEqual(
      expect.stringContaining("field_project[target_id][0]=17345")
    );
    expect(urls.some((url) => url.includes("git.drupalcode.org"))).toBe(false);
  });

  it("filters Drupal.org lists by issue type", async () => {
    const fetchMock = mockFetch([
      boardRoute(boardDocument()),
      { url: /www\.drupal\.org\/api-d7\/node\.json/, respond: drupalOrgIssues },
    ]);
    const { user } = renderApp("/board/pathauto");
    expect(await screen.findByText("Active (2)")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Type" }));
    await user.click(await screen.findByRole("option", { name: "Bug" }));

    expect(await screen.findByText("Active (1)")).toBeInTheDocument();
    expect(screen.queryByText("Task in active")).not.toBeInTheDocument();
    expect(requestedUrls(fetchMock)).toContainEqual(
      expect.stringContaining("field_issue_category=1")
    );
  });

  it("loads GitLab work items when the board is flagged", async () => {
    const fetchMock = mockFetch([
      boardRoute(boardDocument({ gitlab: true })),
      {
        url: /git\.drupalcode\.org\/api\/v4\/projects\/project\/pathauto\/issues/,
        respond: () =>
          jsonResponse(
            [
              { iid: 1, title: "Work item in review", web_url: "https://git.drupalcode.org/project/pathauto/-/work_items/1", labels: ["state::needsReview", "priority::major"], assignees: [] },
              { iid: 2, title: "Work item RTBC", web_url: "https://git.drupalcode.org/project/pathauto/-/work_items/2", labels: ["state::rtbc"], assignees: [] },
              { iid: 3, title: "Untriaged work item", web_url: "https://git.drupalcode.org/project/pathauto/-/work_items/3", labels: [], assignees: [] },
            ],
            200,
            { "X-Total-Pages": "1" }
          ),
      },
    ]);
    renderApp("/board/pathauto");

    expect(
      await screen.findByText("Work items from git.drupalcode.org")
    ).toBeInTheDocument();
    expect(await screen.findByText("Needs Review (1)")).toBeInTheDocument();
    expect(screen.getByText("Reviewed & Tested (1)")).toBeInTheDocument();
    expect(screen.getByText("Active (1)")).toBeInTheDocument();
    expect(
      within(column("Needs Review")).getByText("Work item in review")
    ).toBeInTheDocument();
    expect(
      requestedUrls(fetchMock).some((url) => url.includes("www.drupal.org"))
    ).toBe(false);
  });

  it("shows an error in each list when GitLab fails", async () => {
    mockFetch([
      boardRoute(boardDocument({ gitlab: true })),
      {
        url: /git\.drupalcode\.org/,
        respond: () => jsonResponse({}, 500),
      },
    ]);
    renderApp("/board/pathauto");
    await waitFor(() =>
      expect(screen.getAllByText("Could not load issues.")).toHaveLength(3)
    );
  });

  it("offers to create a board that does not exist", async () => {
    mockFetch([
      {
        url: /filter\[machine_name\]=nope/,
        respond: () => jsonResponse({ data: [] }),
      },
      {
        url: /\/jsonapi\/index\/boards\?sort=title/,
        respond: () => jsonResponse({ data: [], links: {} }),
      },
    ]);
    const { user } = renderApp("/board/nope");

    expect(
      await screen.findByText('Board "nope" not found')
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("link", { name: "Click here to create it." })
    );
    expect(currentPath()).toBe("/create");
  });
});
