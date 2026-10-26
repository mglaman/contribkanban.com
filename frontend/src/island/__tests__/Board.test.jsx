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

  it("loads an issue collection in chunks and sorts it into lists by status", async () => {
    const nids = Array.from({ length: 60 }, (_, index) => String(5000 + index));
    const issueFor = (nid) => ({
      ...ISSUES[0],
      nid,
      title: `Issue ${nid}`,
      url: `https://www.drupal.org/node/${nid}`,
      field_issue_status: nid === "5059" ? "8" : "1",
      field_issue_category: nid === "5001" ? "2" : "1",
    });
    const fetch = vi.fn((url) => {
      const params = new URL(url).searchParams;
      const requested = [...params.entries()].filter(([key]) => key.startsWith("nid[")).map(([, nid]) => nid);
      return Promise.resolve(jsonResponse({ list: requested.map(issueFor) }));
    });
    vi.stubGlobal("fetch", fetch);
    render(<Board config={{ source: "drupalorg", gitlabProject: null, nids, lists: LISTS }} filtersSlot={null} />);

    expect(await within(column("Active")).findByText("59")).toBeInTheDocument();
    expect(within(column("Needs review")).getByText("Issue 5059")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][0]).toContain("nid%5B0%5D=5050");

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Type" }), "task");
    expect(within(column("Active")).getByText("Issue 5001")).toBeInTheDocument();
    expect(within(column("Active")).getByText("1")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("loads a collection's issues from GitLab when their project moved", async () => {
    const issue = (nid, project, status) => ({
      ...ISSUES[0],
      nid,
      title: `Drupal.org ${nid}`,
      url: `https://www.drupal.org/project/${project}/issues/${nid}`,
      field_issue_status: status,
      field_project: { id: project === "copyscape" ? "2350161" : "17345" },
    });
    const fetch = vi.fn((url) => {
      if (url.startsWith("https://git.drupalcode.org")) {
        return Promise.resolve(
          jsonResponse([
            {
              iid: 3549178,
              title: "GitLab 3549178",
              web_url: "https://git.drupalcode.org/project/copyscape/-/work_items/3549178",
              labels: ["state::needsReview"],
              assignees: [],
              state: "opened",
            },
          ])
        );
      }
      return Promise.resolve(
        jsonResponse({ list: [issue("3549178", "copyscape", "13"), issue("101", "pathauto", "1")] })
      );
    });
    vi.stubGlobal("fetch", fetch);
    render(
      <Board
        config={{
          source: "drupalorg",
          gitlabProject: null,
          movedProjects: [2350161],
          nids: ["3549178", "101"],
          lists: [...LISTS, { ...LISTS[0], title: "Needs work", tone: "needs-work", statuses: ["13"] }],
        }}
        filtersSlot={null}
      />
    );

    // The frozen drupal.org copy says Needs work; GitLab says Needs review.
    expect(await within(column("Needs review")).findByText("GitLab 3549178")).toBeInTheDocument();
    expect(within(column("Active")).getByText("Drupal.org 101")).toBeInTheDocument();
    expect(screen.queryByText("Drupal.org 3549178")).not.toBeInTheDocument();
    const gitlab = fetch.mock.calls.map(([url]) => url).filter((url) => url.includes("drupalcode"));
    expect(gitlab).toEqual([
      "https://git.drupalcode.org/api/v4/projects/project%2Fcopyscape/issues?state=all&per_page=100&iids%5B%5D=3549178",
    ]);
  });

  it("loads a collection's GitLab work items by project and IID", async () => {
    const workItem = (iid, project, state) => ({
      iid,
      title: `GitLab ${project} ${iid}`,
      web_url: `https://git.drupalcode.org/project/${project}/-/work_items/${iid}`,
      labels: [`state::${state}`],
      assignees: [],
      state: "opened",
    });
    const fetch = vi.fn((url) => {
      if (url.includes("project%2Ftool")) {
        return Promise.resolve(jsonResponse([workItem(3583123, "tool", "active"), workItem(3583122, "tool", "needsReview")]));
      }
      if (url.includes("project%2Fmcp")) {
        return Promise.resolve(jsonResponse([workItem(3587791, "mcp", "active")]));
      }
      return Promise.resolve(jsonResponse({ list: [ISSUES[0]] }));
    });
    vi.stubGlobal("fetch", fetch);
    render(
      <Board
        config={{
          source: "drupalorg",
          gitlabProject: null,
          nids: ["101"],
          workItems: [
            { path: "project/tool", iid: "3583123" },
            { path: "project/mcp", iid: "3587791" },
            { path: "project/tool", iid: "3583122" },
          ],
          lists: LISTS,
        }}
        filtersSlot={null}
      />
    );

    expect(await within(column("Active")).findByText("GitLab tool 3583123")).toBeInTheDocument();
    expect(within(column("Active")).getByText("GitLab mcp 3587791")).toBeInTheDocument();
    expect(within(column("Active")).getByText("Bug in active")).toBeInTheDocument();
    expect(within(column("Needs review")).getByText("GitLab tool 3583122")).toBeInTheDocument();
    const gitlab = fetch.mock.calls.map(([url]) => url).filter((url) => url.includes("drupalcode"));
    expect(gitlab).toEqual([
      "https://git.drupalcode.org/api/v4/projects/project%2Ftool/issues?state=all&per_page=100&iids%5B%5D=3583123&iids%5B%5D=3583122",
      "https://git.drupalcode.org/api/v4/projects/project%2Fmcp/issues?state=all&per_page=100&iids%5B%5D=3587791",
    ]);
  });

  it("shows empty lists for an empty issue collection", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<Board config={{ source: "drupalorg", gitlabProject: null, nids: [], lists: LISTS }} filtersSlot={null} />);

    expect(within(column("Active")).getByText("Nothing here right now")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("merges a tag's GitLab work items with drupal.org issues from projects that didn't move", async () => {
    const tagLists = LISTS.map((list) => ({ ...list, projects: [], tags: ["772"] }));
    const doIssue = (nid, project, status) => ({
      ...ISSUES[0],
      nid,
      title: `Drupal.org ${nid}`,
      field_issue_status: status,
      field_project: { id: project },
    });
    const drupalOrgIssues = [doIssue("100", "10", "1"), doIssue("200", "20", "1"), doIssue("300", "20", "8")];
    const workItem = (iid, state) => ({
      iid,
      title: `GitLab ${iid}`,
      web_url: `https://git.drupalcode.org/project/moved/-/work_items/${iid}`,
      labels: ["Novice", `state::${state}`],
      assignees: [],
    });
    const fetch = vi.fn((url) => {
      if (url.startsWith("https://git.drupalcode.org")) {
        return Promise.resolve(jsonResponse([workItem(300, "active"), workItem(400, "needsReview")]));
      }
      const status = new URL(url).searchParams.get("field_issue_status[value][0]");
      return Promise.resolve(
        jsonResponse({ list: drupalOrgIssues.filter((issue) => issue.field_issue_status === status) })
      );
    });
    vi.stubGlobal("fetch", fetch);
    render(
      <Board
        config={{ source: "drupalorg", gitlabProject: null, gitlabLabel: "Novice", movedProjects: [20], lists: tagLists }}
        filtersSlot={null}
      />
    );

    expect(await within(column("Active")).findByText("Drupal.org 100")).toBeInTheDocument();
    // Frozen copies from the moved project give way to GitLab.
    expect(within(column("Active")).getByText("GitLab 300")).toBeInTheDocument();
    expect(screen.queryByText("Drupal.org 200")).not.toBeInTheDocument();
    expect(screen.queryByText("Drupal.org 300")).not.toBeInTheDocument();
    expect(within(column("Needs review")).getByText("GitLab 400")).toBeInTheDocument();
    expect(within(column("Active")).getByText("2")).toBeInTheDocument();
    expect(fetch.mock.calls.filter(([url]) => url.includes("labels=Novice"))).toHaveLength(1);
    // Two lists from drupal.org and one GitLab load; Drupal lists the moved projects.
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("names each card's project on boards that span projects", async () => {
    const tagLists = LISTS.map((list) => ({ ...list, projects: [], tags: ["772"] }));
    const fetch = vi.fn((url) => {
      if (url.startsWith("https://git.drupalcode.org")) {
        return Promise.resolve(
          jsonResponse([
            {
              iid: 400,
              title: "GitLab 400",
              web_url: "https://git.drupalcode.org/project/canvas/-/work_items/400",
              labels: ["Novice", "state::needsReview"],
              assignees: [],
            },
          ])
        );
      }
      const status = new URL(url).searchParams.get("field_issue_status[value][0]");
      const list = status === "1" ? [{ ...ISSUES[0], url: "https://www.drupal.org/project/token/issues/101" }] : [];
      return Promise.resolve(jsonResponse({ list }));
    });
    vi.stubGlobal("fetch", fetch);
    render(
      <Board
        config={{ source: "drupalorg", gitlabProject: null, gitlabLabel: "Novice", showProject: true, lists: tagLists }}
        filtersSlot={null}
      />
    );

    expect(await within(column("Active")).findByText("token")).toBeInTheDocument();
    expect(await within(column("Needs review")).findByText("canvas")).toBeInTheDocument();
  });

  describe("Project filter", () => {
    const tagLists = LISTS.map((list) => ({ ...list, projects: [], tags: ["772"] }));
    const tagConfig = { source: "drupalorg", gitlabProject: null, gitlabLabel: "Novice", showProject: true, lists: tagLists };
    const doIssue = (nid, project, projectNid) => ({
      ...ISSUES[0],
      nid,
      title: `Drupal.org ${nid}`,
      url: `https://www.drupal.org/project/${project}/issues/${nid}`,
      field_project: { id: projectNid },
    });
    const workItem = (iid, project) => ({
      iid,
      title: `GitLab ${iid}`,
      web_url: `https://git.drupalcode.org/project/${project}/-/work_items/${iid}`,
      labels: ["Novice", "state::active"],
      assignees: [],
    });

    // Answers api-d7 project lookups and issue queries, and GitLab label queries.
    function tagFetch({ projects, issues, workItems }) {
      return vi.fn((url) => {
        if (url.startsWith("https://git.drupalcode.org")) {
          return Promise.resolve(jsonResponse(workItems));
        }
        const params = new URL(url).searchParams;
        const machineName = params.get("field_project_machine_name");
        if (machineName) {
          return Promise.resolve(jsonResponse({ list: projects[machineName] ? [{ nid: projects[machineName] }] : [] }));
        }
        if (params.get("field_issue_status[value][0]") !== "1") {
          return Promise.resolve(jsonResponse({ list: [] }));
        }
        const projectNid = params.get("field_project[target_id][0]");
        return Promise.resolve(
          jsonResponse({ list: issues.filter((issue) => !projectNid || issue.field_project.id === projectNid) })
        );
      });
    }

    it("lists every project on a tag board and queries drupal.org for the one picked", async () => {
      const fetch = tagFetch({
        projects: { webform: "7404" },
        issues: [doIssue("101", "webform", "7404"), doIssue("102", "pathauto", "17345")],
        workItems: [workItem(300, "canvas")],
      });
      vi.stubGlobal("fetch", fetch);
      render(<Board config={tagConfig} filtersSlot={null} />);

      expect(await within(column("Active")).findByText("Drupal.org 102")).toBeInTheDocument();
      const select = screen.getByRole("combobox", { name: "Project" });
      await waitFor(() =>
        expect(within(select).getAllByRole("option").map((option) => option.textContent)).toEqual([
          "All",
          "canvas",
          "pathauto",
          "webform",
        ])
      );

      await userEvent.selectOptions(select, "webform");

      expect(await within(column("Active")).findByText("Drupal.org 101")).toBeInTheDocument();
      expect(within(column("Active")).queryByText("Drupal.org 102")).not.toBeInTheDocument();
      expect(within(column("Active")).queryByText("GitLab 300")).not.toBeInTheDocument();
      expect(fetch.mock.calls.some(([url]) => url.includes("field_project%5Btarget_id%5D%5B0%5D=7404"))).toBe(true);
      expect(window.location.search).toBe("?project=webform");
      // Every project stays pickable while one is picked.
      expect(within(select).getAllByRole("option")).toHaveLength(4);
    });

    it("skips drupal.org for a project from the URL that drupal.org doesn't have", async () => {
      window.history.replaceState(null, "", "/sprint/Novice?project=canvas_new");
      const fetch = tagFetch({
        projects: {},
        issues: [doIssue("102", "pathauto", "17345")],
        workItems: [workItem(300, "canvas_new"), workItem(301, "other")],
      });
      vi.stubGlobal("fetch", fetch);
      render(<Board config={tagConfig} filtersSlot={null} />);

      expect(await within(column("Active")).findByText("GitLab 300")).toBeInTheDocument();
      expect(within(column("Active")).queryByText("GitLab 301")).not.toBeInTheDocument();
      expect(within(column("Active")).queryByText("Drupal.org 102")).not.toBeInTheDocument();
      expect(screen.getByRole("combobox", { name: "Project" })).toHaveValue("canvas_new");
      expect(fetch.mock.calls.some(([url]) => url.includes("field_issue_status"))).toBe(false);
    });

    it("filters an issue collection by project", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve(jsonResponse({ list: [doIssue("101", "webform", "7404"), doIssue("102", "pathauto", "17345")] }))
        )
      );
      render(
        <Board
          config={{ source: "drupalorg", gitlabProject: null, showProject: true, nids: ["101", "102"], lists: LISTS }}
          filtersSlot={null}
        />
      );

      expect(await within(column("Active")).findByText("Drupal.org 102")).toBeInTheDocument();
      await userEvent.selectOptions(screen.getByRole("combobox", { name: "Project" }), "webform");

      expect(within(column("Active")).getByText("Drupal.org 101")).toBeInTheDocument();
      expect(within(column("Active")).queryByText("Drupal.org 102")).not.toBeInTheDocument();
    });

    it("isn't offered on a project board", async () => {
      window.history.replaceState(null, "", "/board/pathauto?project=token");
      vi.stubGlobal("fetch", vi.fn(drupalOrgFetch));
      render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: LISTS }} filtersSlot={null} />);

      expect(await within(column("Active")).findByText("Bug in active")).toBeInTheDocument();
      expect(screen.queryByRole("combobox", { name: "Project" })).not.toBeInTheDocument();
      expect(window.location.search).toBe("");
    });
  });

  it("doesn't name the project on a project board", async () => {
    const issues = ISSUES.map((issue) => ({ ...issue, url: `https://www.drupal.org/project/pathauto/issues/${issue.nid}` }));
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        const status = new URL(url).searchParams.get("field_issue_status[value][0]");
        return Promise.resolve(jsonResponse({ list: issues.filter((issue) => issue.field_issue_status === status) }));
      })
    );
    render(<Board config={{ source: "drupalorg", gitlabProject: null, lists: LISTS }} filtersSlot={null} />);

    expect(await within(column("Active")).findByText("Bug in active")).toBeInTheDocument();
    expect(screen.queryByText("pathauto")).not.toBeInTheDocument();
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
