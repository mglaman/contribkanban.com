import { describe, it, expect } from "vitest";
import { filterIds, issueProject, matchesText, readFilters, writeFilters } from "../filters";

describe("readFilters", () => {
  it("reads known values", () => {
    expect(readFilters("?type=bug&priority=major&project=token&q=views")).toEqual({
      type: "bug",
      priority: "major",
      project: "token",
      text: "views",
    });
  });

  it("drops unknown values", () => {
    expect(readFilters("?type=1&priority=urgent&project=Not%20a%20project")).toEqual({
      type: null,
      priority: null,
      project: null,
      text: "",
    });
  });
});

describe("writeFilters", () => {
  it("sets filters and keeps other parameters", () => {
    expect(
      writeFilters({ type: "task", priority: null, project: "token", text: " cdn " }, "?priority=minor&utm=x")
    ).toBe("utm=x&type=task&project=token&q=cdn");
  });

  it("returns an empty string without filters", () => {
    expect(writeFilters({ type: null, priority: null, project: null, text: "" }, "?type=bug&project=token")).toBe("");
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
