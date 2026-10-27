import { describe, it, expect, afterEach, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import IssueIdsEditor, { parseIssue } from "../IssueIdsEditor";

function jsonResponse(body) {
  return { ok: true, headers: new Headers(), json: async () => body };
}

const DRUPAL_ORG = [
  { nid: "3092318", title: "Fix the focus ring", field_issue_status: "13", url: "https://www.drupal.org/project/olivero/issues/3092318" },
  { nid: "2353867", title: "Already fixed", field_issue_status: "7", url: "https://www.drupal.org/project/token/issues/2353867" },
];

const WORK_ITEMS = [
  {
    iid: 3583123,
    title: "Review the MCP server",
    state: "opened",
    labels: ["state::needsReview"],
    assignees: [],
    web_url: "https://git.drupalcode.org/project/tool/-/work_items/3583123",
  },
];

function fetchIssues(url) {
  if (url.startsWith("https://www.drupal.org")) {
    const params = new URL(url).searchParams;
    const nids = [...params.keys()].filter((key) => key.startsWith("nid[")).map((key) => params.get(key));
    return Promise.resolve(jsonResponse({ list: DRUPAL_ORG.filter((issue) => nids.includes(issue.nid)) }));
  }
  return Promise.resolve(jsonResponse(WORK_ITEMS));
}

function renderEditor(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  document.body.append(textarea);
  render(<IssueIdsEditor textarea={textarea} movedProjects={[]} />);
  return textarea;
}

describe("parseIssue", () => {
  // The same cases as IssueIdsWidgetTest, since both read the field.
  it.each([
    ["3412345", "3412345"],
    ["#3412345", "3412345"],
    ["007", "7"],
    ["0", null],
    ["Issue 1", null],
    ["https://www.drupal.org/project/olivero/issues/3092318", "3092318"],
    ["https://www.drupal.org/project/olivero/issues/3092318#comment-1", "3092318"],
    ["https://www.drupal.org/node/2353867", "2353867"],
    ["https://drupal.org/i/2353867", "2353867"],
    ["https://git.drupalcode.org/project/canvas/-/work_items/3512345", "project/canvas#3512345"],
    ["https://git.drupalcode.org/project/tool/-/work_items/1#note_1", "project/tool#1"],
    ["https://git.drupalcode.org/project/canvas/-/issues/3512345", "project/canvas#3512345"],
    ["project/tool#3583123", "project/tool#3583123"],
    ["https://git.drupalcode.org/issue/tool-3583123/-/issues/1", null],
    ["https://www.drupal.org/project/notify_to_slack", null],
    ["https://example.com/node/123", null],
  ])("reads %s", (line, id) => {
    expect(parseIssue(line)).toBe(id);
  });
});

describe("IssueIdsEditor", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it("lists each line's issue with its project and status", async () => {
    const fetch = vi.fn(fetchIssues);
    vi.stubGlobal("fetch", fetch);
    renderEditor("3092318\nhttps://www.drupal.org/node/2353867\nproject/tool#3583123\nnot an issue\n999");

    expect(await screen.findByRole("link", { name: "Fix the focus ring" })).toHaveAttribute(
      "href",
      "https://www.drupal.org/project/olivero/issues/3092318"
    );
    const item = (name) => screen.getByRole("button", { name: `Remove ${name}` }).closest("li");
    expect(within(item("Fix the focus ring")).getByText("olivero")).toBeInTheDocument();
    expect(within(item("Fix the focus ring")).getByText("Needs work")).toBeInTheDocument();
    expect(item("Already fixed")).toHaveClass("issue-ids__item--done");
    expect(within(item("Review the MCP server")).getByText("Needs review")).toBeInTheDocument();
    expect(within(item("not an issue")).getByText("Not a drupal.org issue or GitLab work item")).toBeInTheDocument();
    expect(within(item("999")).getByText("drupal.org has no issue with this number")).toBeInTheDocument();
    expect(screen.getByText("5 issues")).toBeInTheDocument();
    // One drupal.org request for both node IDs, and one for the project's work items.
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("removes a line, and moves focus to the next one", async () => {
    vi.stubGlobal("fetch", vi.fn(fetchIssues));
    const textarea = renderEditor("3092318\n2353867\nproject/tool#3583123");

    fireEvent.click(await screen.findByRole("button", { name: "Remove Already fixed" }));
    expect(textarea.value).toBe("3092318\nproject/tool#3583123");
    expect(screen.getByRole("button", { name: "Remove Review the MCP server" })).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Removed Already fixed.");
  });

  it("removes every fixed or closed issue at once", async () => {
    vi.stubGlobal("fetch", vi.fn(fetchIssues));
    const textarea = renderEditor("3092318\nhttps://www.drupal.org/node/2353867");

    fireEvent.click(await screen.findByRole("button", { name: "Remove 1 fixed or closed" }));
    expect(textarea.value).toBe("3092318");
    expect(screen.queryByRole("button", { name: /fixed or closed/ })).not.toBeInTheDocument();
  });

  it("loads lines typed or pasted into the field", async () => {
    const fetch = vi.fn(fetchIssues);
    vi.stubGlobal("fetch", fetch);
    const textarea = renderEditor("3092318");
    await screen.findByRole("link", { name: "Fix the focus ring" });

    textarea.value = "3092318\nhttps://git.drupalcode.org/project/tool/-/work_items/3583123";
    fireEvent.input(textarea);
    expect(await screen.findByRole("link", { name: "Review the MCP server" })).toBeInTheDocument();
    // The issue already loaded doesn't load again.
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
