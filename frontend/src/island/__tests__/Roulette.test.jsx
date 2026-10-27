import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Roulette from "../Roulette";

const CONFIG = {
  tags: [
    { label: "Accessibility", tid: "111" },
    { label: "Novice", tid: "222" },
    { label: "Rosetta", tid: "333" },
  ],
  movedProjects: [2350161],
};

const ISSUES = [
  { nid: "101", title: "Fix the focus ring", field_issue_status: "1", field_project: { id: "17345", machine_name: "pathauto" } },
  { nid: "102", title: "Write a kernel test", field_issue_status: "13", field_project: { id: "17345", machine_name: "pathauto" } },
  { nid: "103", title: "Frozen after the move", field_issue_status: "8", field_project: { id: "2350161", machine_name: "tool" } },
  { nid: "104", title: "Taken on drupal.org", field_issue_status: "1", field_project: { id: "17345", machine_name: "pathauto" }, field_issue_assigned: { id: "1" } },
].map((issue) => ({ ...issue, field_issue_priority: "200", url: `https://www.drupal.org/node/${issue.nid}` }));

const WORK_ITEMS = [
  { iid: 3583123, title: "Review the MCP server", labels: ["state::needsReview"] },
  { iid: 3583124, title: "Already reviewed", labels: ["state::rtbc"] },
  { iid: 3583125, title: "Taken on GitLab", labels: ["state::needsWork"], assignees: [{ username: "f0ns" }] },
].map((item) => ({
  assignees: [],
  ...item,
  state: "opened",
  milestone: null,
  web_url: `https://git.drupalcode.org/project/mcp/-/work_items/${item.iid}`,
}));

function jsonResponse(body) {
  return { ok: true, headers: new Headers(), json: async () => body };
}

function fetchIssues(url) {
  return Promise.resolve(jsonResponse(url.startsWith("https://www.drupal.org") ? { list: ISSUES } : WORK_ITEMS));
}

function hitTitle() {
  return document.querySelector(".roulette__slot--hit .issue-card__title").textContent;
}

describe("Roulette", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/roulette");
    // Rolls land at once, without animating.
    vi.stubGlobal("matchMedia", (query) => ({ matches: query === "(prefers-reduced-motion: reduce)" }));
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads open issues with the tag from drupal.org and GitLab", async () => {
    const fetch = vi.fn(fetchIssues);
    vi.stubGlobal("fetch", fetch);
    render(<Roulette config={CONFIG} filtersSlot={null} />);

    expect(await screen.findByText("3 issues on the strip.")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tag" })).toHaveValue("Novice");
    // The tag goes in the URL, so a Project filter can't be read as a project board.
    expect(window.location.search).toBe("?tag=Novice");
    const query = new URL(fetch.mock.calls.find(([url]) => url.startsWith("https://www.drupal.org"))[0]).searchParams;
    expect(query.get("taxonomy_vocabulary_9[tid][0]")).toBe("222");
    expect(query.get("field_issue_status[value][0]")).toBe("1");
    expect(query.get("field_issue_status[value][1]")).toBe("13");
    expect(query.get("field_issue_status[value][2]")).toBe("8");
    expect(fetch.mock.calls.some(([url]) => url.includes("labels=Novice"))).toBe(true);
    // Neither the RTBC work item nor the moved project's frozen issue.
    expect(screen.queryByText("Already reviewed")).not.toBeInTheDocument();
    expect(screen.queryByText("Frozen after the move")).not.toBeInTheDocument();
    // Nor issues someone is assigned to.
    expect(screen.queryByText("Taken on drupal.org")).not.toBeInTheDocument();
    expect(screen.queryByText("Taken on GitLab")).not.toBeInTheDocument();
  });

  it("picks the tag in the URL and writes a picked tag back", async () => {
    vi.stubGlobal("fetch", vi.fn(fetchIssues));
    window.history.replaceState(null, "", "/roulette?tag=rosetta");
    render(<Roulette config={CONFIG} filtersSlot={null} />);

    const picker = screen.getByRole("combobox", { name: "Tag" });
    expect(picker).toHaveValue("Rosetta");
    await userEvent.selectOptions(picker, "Accessibility");
    expect(window.location.search).toBe("?tag=Accessibility");
  });

  it("lands on an issue and re-rolls three times", async () => {
    vi.stubGlobal("fetch", vi.fn(fetchIssues));
    render(<Roulette config={CONFIG} filtersSlot={null} />);
    await screen.findByText("3 issues on the strip.");

    await userEvent.click(screen.getByRole("button", { name: "Roll" }));
    expect(screen.getByRole("link", { name: "Go to the issue" })).toHaveFocus();
    const first = hitTitle();
    expect(screen.getByRole("status")).toHaveTextContent(`Landed on ${first}`);
    expect(screen.getByRole("link", { name: "Go to the issue" })).toHaveAttribute(
      "href",
      document.querySelector(".roulette__slot--hit .issue-card__title").getAttribute("href")
    );
    expect(screen.getByRole("img", { name: "3 of 3 re-rolls left" })).toBeInTheDocument();

    const reroll = screen.getByRole("button", { name: /Re-roll/ });
    await userEvent.click(reroll);
    expect(hitTitle()).not.toBe(first);
    await userEvent.click(reroll);
    await userEvent.click(reroll);
    expect(reroll).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("img", { name: "0 of 3 re-rolls left" })).toBeInTheDocument();
    await userEvent.click(reroll);
    expect(screen.getByRole("img", { name: "0 of 3 re-rolls left" })).toBeInTheDocument();
  });

  it("rolls the strip, then lands on the issue under the marker", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.stubGlobal("fetch", vi.fn(fetchIssues));
    render(<Roulette config={CONFIG} filtersSlot={null} />);
    await screen.findByText("3 issues on the strip.");
    vi.useFakeTimers();

    const roll = screen.getByRole("button", { name: "Roll" });
    fireEvent.click(roll);
    expect(screen.getByRole("button", { name: "Rolling…" })).toHaveAttribute("aria-disabled", "true");
    act(() => vi.advanceTimersByTime(40));
    const track = document.querySelector(".roulette__track");
    expect(track).toHaveClass("roulette__track--rolling");
    act(() => vi.runAllTimers());

    const index = Number(track.style.getPropertyValue("--roulette-index"));
    const slots = track.querySelectorAll(".roulette__slot");
    // The strip's 3 issues fill a full lap right of the marker.
    expect(slots.length - 1 - index).toBeGreaterThanOrEqual(3);
    expect(slots[index]).toHaveClass("roulette__slot--hit");
    expect(screen.getByRole("status")).toHaveTextContent(`Landed on ${hitTitle()}`);
  });

  it("says so when no issue has the tag", async () => {
    vi.stubGlobal("fetch", vi.fn((url) => Promise.resolve(jsonResponse(url.startsWith("https://www.drupal.org") ? { list: [] } : []))));
    render(<Roulette config={CONFIG} filtersSlot={null} />);

    expect(await screen.findByText("No open issues with this tag right now.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Roll" })).toBeDisabled();
  });

  it("rolls within the filters a tag board carried over", async () => {
    const fetch = vi.fn(fetchIssues);
    vi.stubGlobal("fetch", fetch);
    window.history.replaceState(null, "", "/roulette?tag=Novice&type=task&q=kernel");
    render(<Roulette config={CONFIG} filtersSlot={null} />);

    expect(await screen.findByText("1 issue on the strip.")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Type" })).toHaveValue("task");
    expect(screen.getByRole("searchbox")).toHaveValue("kernel");
    const query = new URL(fetch.mock.calls.find(([url]) => url.startsWith("https://www.drupal.org"))[0]).searchParams;
    expect(query.get("field_issue_category")).toBe("2");

    await userEvent.clear(screen.getByRole("searchbox"));
    expect(window.location.search).toBe("?tag=Novice&type=task");
  });

  describe("for a project", () => {
    const TOOL = { tags: CONFIG.tags, movedProjects: [], project: { label: "Tool API", nid: "3538471", gitlabProject: "project/tool" } };

    const TOOL_ITEMS = [
      { iid: 1, title: "Ship the release candidate", labels: ["state::active"], milestone: { title: "1.0.0-rc1" } },
      { iid: 2, title: "Review the rc1 docs", labels: ["state::needsReview"], milestone: { title: "1.0.0-rc1" } },
      { iid: 3, title: "Plan 1.1", labels: ["state::needsWork"], milestone: { title: "1.1.0" } },
      { iid: 4, title: "No milestone yet", labels: ["state::active"], milestone: null },
    ].map((item) => ({
      ...item,
      state: "opened",
      assignees: [],
      web_url: `https://git.drupalcode.org/project/tool/-/work_items/${item.iid}`,
    }));

    it("rolls within the milestone in the URL for a project on GitLab", async () => {
      const fetch = vi.fn(() => Promise.resolve(jsonResponse(TOOL_ITEMS)));
      vi.stubGlobal("fetch", fetch);
      window.history.replaceState(null, "", "/roulette?project=tool&milestone=1.0.0-rc1");
      render(<Roulette config={TOOL} filtersSlot={null} />);

      expect(await screen.findByText("2 issues on the strip.")).toBeInTheDocument();
      expect(screen.queryByText("Plan 1.1")).not.toBeInTheDocument();
      expect(screen.queryByRole("combobox", { name: "Tag" })).not.toBeInTheDocument();
      // Its drupal.org issues are frozen, so only GitLab loads.
      expect(fetch.mock.calls.every(([url]) => url.includes("/projects/project%2Ftool/issues"))).toBe(true);

      const picker = screen.getByRole("combobox", { name: "Milestone" });
      expect(picker).toHaveValue("1.0.0-rc1");
      await userEvent.selectOptions(picker, "");
      expect(await screen.findByText("4 issues on the strip.")).toBeInTheDocument();
      expect(window.location.search).toBe("?project=tool");
    });

    it("rolls within the filters a project board carried over", async () => {
      vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(TOOL_ITEMS))));
      window.history.replaceState(null, "", "/roulette?project=tool&milestone=1.0.0-rc1&q=docs");
      render(<Roulette config={TOOL} filtersSlot={null} />);

      expect(await screen.findByText("1 issue on the strip.")).toBeInTheDocument();
      // The project names the board, so there's no Project filter to clear it.
      expect(screen.queryByRole("combobox", { name: "Project" })).not.toBeInTheDocument();
      await userEvent.selectOptions(screen.getByRole("combobox", { name: "Type" }), "bug");
      expect(await screen.findByText("No open issues match the filters.")).toBeInTheDocument();
      expect(window.location.search).toBe("?project=tool&milestone=1.0.0-rc1&q=docs&type=bug");
    });

    it("rolls for a drupal.org project's issues", async () => {
      const fetch = vi.fn(fetchIssues);
      vi.stubGlobal("fetch", fetch);
      render(<Roulette config={{ ...TOOL, project: { label: "Pathauto", nid: "17345", gitlabProject: null } }} filtersSlot={null} />);

      expect(await screen.findByText("3 issues on the strip.")).toBeInTheDocument();
      const [url] = fetch.mock.calls.map(([called]) => new URL(called));
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(url.searchParams.get("field_project[target_id][0]")).toBe("17345");
      expect(url.searchParams.get("taxonomy_vocabulary_9[tid][0]")).toBeNull();
      expect(screen.queryByRole("combobox", { name: "Milestone" })).not.toBeInTheDocument();
    });
  });
});
