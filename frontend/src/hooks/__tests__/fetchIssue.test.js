import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useFetchIssue from "../fetchIssue";

function makeFetchResponse(body = {}, ok = true) {
  return {
    ok,
    status: ok ? 200 : 404,
    json: async () => body,
  };
}

describe("useFetchIssue", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null issue and no error for empty nid", () => {
    const { result } = renderHook(() => useFetchIssue(""));
    expect(result.current.issue).toBeNull();
    expect(result.current.error).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns null issue and no error when nid is undefined", () => {
    const { result } = renderHook(() => useFetchIssue(undefined));
    expect(result.current.issue).toBeNull();
    expect(result.current.error).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches and sets issue for a valid project_issue nid", async () => {
    const issueData = { type: "project_issue", nid: "12345", title: "Fix the bug" };
    fetchMock.mockResolvedValue(makeFetchResponse(issueData));

    const { result } = renderHook(() => useFetchIssue("12345"));

    await waitFor(() => expect(result.current.issue).toEqual(issueData));
    expect(result.current.error).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://www.drupal.org/api-d7/node/12345.json" })
    );
  });

  it("sets error when the fetched node is not a project_issue", async () => {
    const nodeData = { type: "page", nid: "99999", title: "Some page" };
    fetchMock.mockResolvedValue(makeFetchResponse(nodeData));

    const { result } = renderHook(() => useFetchIssue("99999"));

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.issue).toBeNull();
  });

  it("sets error on a non-ok response", async () => {
    fetchMock.mockResolvedValue(makeFetchResponse({}, false));

    const { result } = renderHook(() => useFetchIssue("12345"));

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.issue).toBeNull();
  });

  it("resets state when nid changes to empty string", async () => {
    const issueData = { type: "project_issue", nid: "12345" };
    fetchMock.mockResolvedValue(makeFetchResponse(issueData));

    const { result, rerender } = renderHook(({ nid }) => useFetchIssue(nid), {
      initialProps: { nid: "12345" },
    });

    await waitFor(() => expect(result.current.issue).toEqual(issueData));

    rerender({ nid: "" });

    await waitFor(() => {
      expect(result.current.issue).toBeNull();
      expect(result.current.error).toBe(false);
    });
  });
});
