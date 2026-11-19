import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  scopedLabelValue,
  toDrupalOrgIssue,
  filterIssues,
  fetchOpenWorkItems,
  fetchLabeledWorkItems,
  fetchProjectsWorkItems,
  fetchMyProjects,
} from "../gitlab";

function makeWorkItem(iid, labels, assignees = [], milestone = null) {
  return {
    iid,
    title: `Work item ${iid}`,
    web_url: `https://git.drupalcode.org/project/tool/-/work_items/${iid}`,
    labels,
    assignees: assignees.map((username) => ({ username, avatar_url: `https://git.drupalcode.org/uploads/${username}.png` })),
    milestone: milestone ? { title: milestone } : null,
  };
}

function makePage(workItems, totalPages = 1) {
  return {
    ok: true,
    headers: new Headers({ "X-Total-Pages": String(totalPages) }),
    json: async () => workItems,
  };
}

describe("scopedLabelValue", () => {
  it.each([
    ["state::needsReview", "needsreview"],
    ["state::needs review", "needsreview"],
    ["state::In Progress", "inprogress"],
    ["State::RTBC", "rtbc"],
  ])("normalizes %s to %s", (label, value) => {
    expect(scopedLabelValue(["code", label], "state")).toBe(value);
  });

  it("returns null when the scope is missing", () => {
    expect(scopedLabelValue(["Rosetta"], "state")).toBeNull();
  });
});

describe("toDrupalOrgIssue", () => {
  it("maps scoped labels to Drupal.org field values", () => {
    const issue = toDrupalOrgIssue(
      makeWorkItem(
        3583120,
        ["category::bug", "priority::major", "state::needsWork", "v1.0.x-dev"],
        ["mglaman"],
        "1.0.0-rc1"
      )
    );
    expect(issue).toEqual({
      nid: "3583120",
      title: "Work item 3583120",
      url: "https://git.drupalcode.org/project/tool/-/work_items/3583120",
      field_issue_status: "13",
      field_issue_category: "1",
      field_issue_priority: "300",
      field_issue_version: "1.0.x-dev",
      field_issue_assigned: "mglaman",
      assignee: { username: "mglaman", avatarUrl: "https://git.drupalcode.org/uploads/mglaman.png" },
      milestone: "1.0.0-rc1",
    });
  });

  it.each([["state::accepted"], ["state::toBeTriaged"], ["state::somethingNew"]])(
    "puts %s in Active",
    (label) => {
      expect(toDrupalOrgIssue(makeWorkItem(1, [label])).field_issue_status).toBe("1");
    }
  );

  it("puts unlabeled work items in Active with normal priority", () => {
    const issue = toDrupalOrgIssue(makeWorkItem(1, ["Rosetta"]));
    expect(issue.field_issue_status).toBe("1");
    expect(issue.field_issue_priority).toBe("200");
    expect(issue.field_issue_category).toBeNull();
    expect(issue.field_issue_assigned).toBeNull();
    expect(issue.assignee).toBeNull();
  });
});

describe("closed work items", () => {
  it("count as Closed (fixed), or Fixed when labeled", () => {
    const closed = (labels) => toDrupalOrgIssue({ ...makeWorkItem(1, labels), state: "closed" });
    expect(closed(["state::needsReview"]).field_issue_status).toBe("7");
    expect(closed([]).field_issue_status).toBe("7");
    expect(closed(["state::fixed"]).field_issue_status).toBe("2");
  });
});

describe("filterIssues", () => {
  const issues = [
    makeWorkItem(1, ["state::needsReview", "priority::minor", "category::task"], [], "1.0.0-rc1"),
    makeWorkItem(2, ["state::needsReview", "priority::critical", "category::bug"]),
    makeWorkItem(3, ["state::rtbc", "priority::normal", "category::bug"]),
  ].map(toDrupalOrgIssue);
  const filter = { statuses: ["8"], category: null, priority: null, version: [] };

  it("matches the list statuses, highest priority first", () => {
    expect(filterIssues(issues, filter).map((i) => i.nid)).toEqual(["2", "1"]);
  });

  it("applies the board category filter", () => {
    expect(
      filterIssues(issues, { ...filter, category: 1 }).map((i) => i.nid)
    ).toEqual(["2"]);
  });

  it("applies the board priority filter", () => {
    expect(
      filterIssues(issues, { ...filter, priority: 100 }).map((i) => i.nid)
    ).toEqual(["1"]);
  });

  it("applies the milestone filter", () => {
    expect(filterIssues(issues, { ...filter, milestone: "1.0.0-rc1" }).map((i) => i.nid)).toEqual(["1"]);
  });
});

describe("fetchOpenWorkItems", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the remaining pages after the first", async () => {
    fetchMock
      .mockResolvedValueOnce(makePage([makeWorkItem(1, [])], 3))
      .mockResolvedValueOnce(makePage([makeWorkItem(2, [])], 3))
      .mockResolvedValueOnce(makePage([makeWorkItem(3, [])], 3));
    const onPage = vi.fn();

    await fetchOpenWorkItems("project/tool", onPage);

    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      "https://git.drupalcode.org/api/v4/projects/project%2Ftool/issues?state=opened&per_page=100&page=1",
      "https://git.drupalcode.org/api/v4/projects/project%2Ftool/issues?state=opened&per_page=100&page=2",
      "https://git.drupalcode.org/api/v4/projects/project%2Ftool/issues?state=opened&per_page=100&page=3",
    ]);
    expect(onPage).toHaveBeenCalledTimes(2);
    expect(onPage.mock.calls[0][0].map((i) => i.nid)).toEqual(["1"]);
    expect(onPage.mock.calls[1][0].map((i) => i.nid)).toEqual(["1", "2", "3"]);
  });

  it("stops after one page when there is only one", async () => {
    fetchMock.mockResolvedValueOnce(makePage([makeWorkItem(1, [])]));
    await fetchOpenWorkItems("project/tool", vi.fn());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws when GitLab responds with an error", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchOpenWorkItems("project/nope", vi.fn())).rejects.toThrow(
      "404"
    );
  });
});

describe("fetchLabeledWorkItems", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("searches drupal.org's project group by label", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(makePage([makeWorkItem(1, [])]));
    vi.stubGlobal("fetch", fetchMock);
    const onPage = vi.fn();

    await fetchLabeledWorkItems("Coding standards", onPage);

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://git.drupalcode.org/api/v4/groups/project/issues?labels=Coding+standards&state=opened&per_page=100&page=1"
    );
    expect(onPage.mock.calls[0][0].map((i) => i.nid)).toEqual(["1"]);
  });
});

describe("fetchProjectsWorkItems", () => {
  const pathOf = (url) => decodeURIComponent(new URL(url).pathname).replace("/api/v4/projects/", "").replace("/issues", "");

  afterEach(() => vi.unstubAllGlobals());

  it("merges every project's work items", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve(makePage([makeWorkItem(pathOf(url) === "project/one" ? 1 : 2, ["state::active"])]))
      )
    );
    const onPage = vi.fn();

    await fetchProjectsWorkItems(["project/one", "project/two"], onPage);

    const [issues, partial] = onPage.mock.lastCall;
    expect(issues.map((issue) => issue.nid).sort()).toEqual(["1", "2"]);
    expect(partial).toBe(false);
  });

  it("marks results partial until every project loads", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(makePage([makeWorkItem(1, [])]))));
    const onPage = vi.fn();

    await fetchProjectsWorkItems(["project/one", "project/two"], onPage);

    expect(onPage.mock.calls[0][1]).toBe(true);
  });

  it("keeps the other projects when one fails, and marks the result partial", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve(
          pathOf(url) === "project/bad"
            ? { ok: false, status: 429, headers: new Headers() }
            : makePage([makeWorkItem(1, [])])
        )
      )
    );
    const onPage = vi.fn();

    await fetchProjectsWorkItems(["project/bad", "project/good"], onPage);

    const [issues, partial] = onPage.mock.lastCall;
    expect(issues.map((issue) => issue.nid)).toEqual(["1"]);
    expect(partial).toBe(true);
  });

  it("fails when every project fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 429, headers: new Headers() })));

    await expect(fetchProjectsWorkItems(["project/one", "project/two"], vi.fn())).rejects.toThrow("all 2 projects");
  });

  it("finishes with no projects, and makes no requests", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const onPage = vi.fn();

    await fetchProjectsWorkItems([], onPage);

    expect(onPage).toHaveBeenCalledWith([], false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("loads only a few projects at once", async () => {
    let active = 0;
    let most = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        active++;
        most = Math.max(most, active);
        await new Promise((resolve) => setTimeout(resolve, 1));
        active--;
        return makePage([]);
      })
    );

    await fetchProjectsWorkItems(Array.from({ length: 20 }, (_, index) => `project/p${index}`), vi.fn());

    expect(most).toBe(6);
  });

  it("sends the viewer's token with each request", async () => {
    const fetch = vi.fn(() => Promise.resolve(makePage([makeWorkItem(1, [])])));
    vi.stubGlobal("fetch", fetch);

    await fetchProjectsWorkItems(["project/one"], vi.fn(), undefined, "secret");

    expect(fetch.mock.calls[0][1].headers).toEqual({ "PRIVATE-TOKEN": "secret" });
  });
});

describe("fetchMyProjects", () => {
  afterEach(() => vi.unstubAllGlobals());

  const gitlabProject = (path, issuesEnabled) => ({
    path,
    path_with_namespace: `project/${path}`,
    issues_enabled: issuesEnabled,
  });

  it("lists the projects and where their issues live, across pages", async () => {
    const fetch = vi.fn((url) =>
      Promise.resolve(
        new URL(url).searchParams.get("page") === "1"
          ? makePage([gitlabProject("canvas", true)], 2)
          : makePage([gitlabProject("entity", false)], 2)
      )
    );
    vi.stubGlobal("fetch", fetch);

    await expect(fetchMyProjects("secret")).resolves.toEqual([
      { path: "project/canvas", machineName: "canvas", issuesEnabled: true },
      { path: "project/entity", machineName: "entity", issuesEnabled: false },
    ]);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain("/groups/project/projects?min_access_level=30");
    expect(options.headers).toEqual({ "PRIVATE-TOKEN": "secret" });
  });

  it("reports GitLab rejecting the token", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 401, headers: new Headers() })));

    await expect(fetchMyProjects("expired")).rejects.toMatchObject({ status: 401 });
  });
});
