import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Board from "../Board";

const LISTS = [
  { title: "Active", tone: "active", statuses: ["1"], projects: ["17345"], tags: [], versions: [], component: null },
  { title: "Needs review", tone: "needs-review", statuses: ["8"], projects: ["17345"], tags: [], versions: [], component: null },
];

const ISSUES = [
  { nid: "101", title: "Bug in active", field_issue_status: "1", field_issue_category: "1", field_issue_priority: "300", field_issue_assigned: null },
  { nid: "102", title: "Task in active", field_issue_status: "1", field_issue_category: "2", field_issue_priority: "200", field_issue_assigned: { id: "1" } },
  { nid: "103", title: "Feature needing review", field_issue_status: "8", field_issue_category: "3", field_issue_priority: "400", field_issue_assigned: null },
].map((issue) => ({ ...issue, url: `https://www.drupal.org/node/${issue.nid}` }));

function jsonResponse(body, headers = {}) {
  return { ok: true, headers: new Headers(headers), json: async () => body };
}

// Answers api-d7 queries by status and category, like drupal.org does.
function drupalOrgFetch(url) {
  const params = new URL(url).searchParams;
  const status = params.get("field_issue_status[value][0]");
  const category = params.get("field_issue_category");
  const list = ISSUES.filter(
    (issue) => issue.field_issue_status === status && (!category || issue.field_issue_category === category)
  );
  return Promise.resolve(jsonResponse({ list }));
}

function column(name) {
  return screen.getByRole("region", { name: new RegExp(`^${name}`) });
}

describe("Board", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/board/pathauto");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads each list from drupal.org", async () => {
    const fetch = vi.fn(drupalOrgFetch);
    vi.stubGlobal("fetch", fetch);
    render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: LISTS }} filtersSlot={null} />);

    expect(await within(column("Active")).findByText("Bug in active")).toBeInTheDocument();
    expect(within(column("Active")).getByText("Task in active")).toBeInTheDocument();
    expect(await within(column("Needs review")).findByText("Feature needing review")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[0][0]).toContain("field_project%5Btarget_id%5D%5B0%5D=17345");
  });

  it("shows priority only when it needs attention", async () => {
    vi.stubGlobal("fetch", vi.fn(drupalOrgFetch));
    render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: LISTS }} filtersSlot={null} />);

    const bug = (await screen.findByText("Bug in active")).closest("article");
    expect(within(bug).getByText("Major")).toBeInTheDocument();
    expect(within(bug).getByText("Bug")).toHaveClass("issue-card__category--bug");
    const task = screen.getByText("Task in active").closest("article");
    expect(within(task).queryByText("Normal")).not.toBeInTheDocument();
    expect(within(task).getByRole("img", { name: "Assigned" })).toBeInTheDocument();
  });

  it("queries drupal.org again when the type changes and writes it to the URL", async () => {
    const fetch = vi.fn(drupalOrgFetch);
    vi.stubGlobal("fetch", fetch);
    render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: LISTS }} filtersSlot={null} />);
    await screen.findByText("Task in active");

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Type" }), "bug");

    await waitFor(() => expect(screen.queryByText("Task in active")).not.toBeInTheDocument());
    expect(screen.getByText("Bug in active")).toBeInTheDocument();
    expect(fetch.mock.calls.at(-1)[0]).toContain("field_issue_category=1");
    expect(window.location.search).toBe("?type=bug");
  });

  it("filters cards by search text from the URL", async () => {
    window.history.replaceState(null, "", "/board/pathauto?q=%23102");
    vi.stubGlobal("fetch", vi.fn(drupalOrgFetch));
    render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: LISTS }} filtersSlot={null} />);

    expect(await screen.findByText("Task in active")).toBeInTheDocument();
    expect(screen.queryByText("Bug in active")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Find a card" })).toHaveValue("#102");
    expect(within(column("Needs review")).getByText("Nothing here right now")).toBeInTheDocument();
  });

  it("shows a plus when drupal.org has more pages", async () => {
    const page = Array.from({ length: 50 }, (_, index) => ({ ...ISSUES[0], nid: String(1000 + index) }));
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            list: page,
            next: "https://www.drupal.org/api-d7/node?page=1",
            last: "https://www.drupal.org/api-d7/node?page=3",
          })
        )
      )
    );
    render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: [LISTS[0]] }} filtersSlot={null} />);

    expect(await within(column("Active")).findByText("150+")).toBeInTheDocument();
    expect(within(column("Active")).getAllByRole("article")).toHaveLength(20);
    await userEvent.click(screen.getByRole("button", { name: "Show 20 more" }));
    expect(within(column("Active")).getAllByRole("article")).toHaveLength(40);
  });

  it("loads GitLab work items once for every list", async () => {
    const workItem = (iid, state, category) => ({
      iid,
      title: `Work item ${iid}`,
      web_url: `https://git.drupalcode.org/project/canvas/-/work_items/${iid}`,
      labels: [`state::${state}`, `category::${category}`],
      assignees: [],
    });
    const fetch = vi.fn(() =>
      Promise.resolve(
        jsonResponse([workItem(1, "active", "bug"), workItem(2, "needsReview", "task"), workItem(3, "active", "task")], {
          "X-Total-Pages": "1",
        })
      )
    );
    vi.stubGlobal("fetch", fetch);
    render(<Board config={{ source: "gitlab", gitlabProject: "project/canvas", lists: LISTS }} filtersSlot={null} />);

    expect(await within(column("Active")).findByText("Work item 1")).toBeInTheDocument();
    expect(within(column("Active")).getByText("Work item 3")).toBeInTheDocument();
    expect(within(column("Needs review")).getByText("Work item 2")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("/projects/project%2Fcanvas/issues");

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Type" }), "bug");
    expect(screen.queryByText("Work item 3")).not.toBeInTheDocument();
    expect(within(column("Active")).getByText("1")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("renders the filters into the board shell's slot", async () => {
    vi.stubGlobal("fetch", vi.fn(drupalOrgFetch));
    const slot = document.createElement("div");
    document.body.append(slot);
    render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: LISTS }} filtersSlot={slot} />);

    expect(within(slot).getByRole("search")).toBeInTheDocument();
    await screen.findByText("Feature needing review");
    slot.remove();
  });
});
