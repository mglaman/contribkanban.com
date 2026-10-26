import { describe, it, expect } from "vitest";
import { filterIds, issueProject, matchesText, readFilters, writeFilters } from "../filters";

describe("readFilters", () => {
  it("reads known values", () => {
    expect(readFilters("?type=bug&priority=major&project=token&milestone=1.0.0-rc1&q=views")).toEqual({
      type: "bug",
      priority: "major",
      project: "token",
      milestone: "1.0.0-rc1",
      text: "views",
    });
  });

  it("drops unknown values", () => {
    expect(readFilters("?type=1&priority=urgent&project=Not%20a%20project&milestone=%20")).toEqual({
      type: null,
      priority: null,
      project: null,
      milestone: null,
      text: "",
    });
  });
});

describe("writeFilters", () => {
  it("sets filters and keeps other parameters", () => {
    expect(
      writeFilters(
        { type: "task", priority: null, project: "token", milestone: "1.0.0 rc1", text: " cdn " },
        "?priority=minor&utm=x"
      )
    ).toBe("utm=x&type=task&project=token&milestone=1.0.0+rc1&q=cdn");
  });

  it("returns an empty string without filters", () => {
    expect(
      writeFilters({ type: null, priority: null, project: null, milestone: null, text: "" }, "?type=bug&milestone=1.0")
    ).toBe("");
  });
});

describe("filterIds", () => {
  it("maps values to drupal.org IDs", () => {
    expect(filterIds({ type: "plan", priority: "critical" })).toEqual({ category: "5", priority: "400" });
    expect(filterIds({ type: null, priority: null })).toEqual({ category: null, priority: null });
  });
});

describe("issueProject", () => {
  it.each([
    ["https://www.drupal.org/project/token/issues/3512345", "token"],
    ["https://git.drupalcode.org/project/canvas/-/work_items/400", "canvas"],
    ["https://www.drupal.org/node/3512345", null],
    [undefined, null],
  ])("reads %s", (url, expected) => {
    expect(issueProject({ url })).toBe(expected);
  });
});

describe("matchesText", () => {
  const issue = { nid: "3512345", title: "Error with CDN assets" };

  it.each([
    ["", true],
    ["cdn", true],
    ["  CDN ", true],
    ["#3512", true],
    ["351", true],
    ["2345", false],
    ["views", false],
  ])("matches %j: %s", (text, expected) => {
    expect(matchesText(issue, text)).toBe(expected);
  });
});
