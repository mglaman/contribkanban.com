import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  scopedLabelValue,
  toDrupalOrgIssue,
  filterIssues,
  fetchOpenWorkItems,
} from "../api/gitlab";

function makeWorkItem(iid, labels, assignees = []) {
  return {
    iid,
    title: `Work item ${iid}`,
    web_url: `https://git.drupalcode.org/project/tool/-/work_items/${iid}`,
    labels,
    assignees: assignees.map((username) => ({ username })),
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
        ["mglaman"]
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
  });
});

describe("filterIssues", () => {
  const issues = [
    makeWorkItem(1, ["state::needsReview", "priority::minor", "category::task"]),
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
