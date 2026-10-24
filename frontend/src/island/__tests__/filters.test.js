import { describe, it, expect } from "vitest";
import { filterIds, matchesText, readFilters, writeFilters } from "../filters";

describe("readFilters", () => {
  it("reads known values", () => {
    expect(readFilters("?type=bug&priority=major&q=views")).toEqual({
      type: "bug",
      priority: "major",
      text: "views",
    });
  });

  it("drops unknown values", () => {
    expect(readFilters("?type=1&priority=urgent")).toEqual({ type: null, priority: null, text: "" });
  });
});

describe("writeFilters", () => {
  it("sets filters and keeps other parameters", () => {
    expect(writeFilters({ type: "task", priority: null, text: " cdn " }, "?priority=minor&utm=x")).toBe(
      "utm=x&type=task&q=cdn"
    );
  });

  it("returns an empty string without filters", () => {
    expect(writeFilters({ type: null, priority: null, text: "" }, "?type=bug")).toBe("");
  });
});

describe("filterIds", () => {
  it("maps values to drupal.org IDs", () => {
    expect(filterIds({ type: "plan", priority: "critical" })).toEqual({ category: "5", priority: "400" });
    expect(filterIds({ type: null, priority: null })).toEqual({ category: null, priority: null });
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
