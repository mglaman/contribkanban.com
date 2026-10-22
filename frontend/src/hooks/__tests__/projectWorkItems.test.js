import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useProjectWorkItems from "../projectWorkItems";

function projectBoard(gitlabWorkItems) {
  return {
    type: "board--drupalorg_project",
    attributes: { machine_name: "tool", gitlab_work_items: gitlabWorkItems },
  };
}

describe("useProjectWorkItems", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null for boards that are not project boards", () => {
    const { result } = renderHook(() =>
      useProjectWorkItems({
        type: "board--drupalorg_sprint",
        attributes: { machine_name: "rosetta", gitlab_work_items: true },
      })
    );
    expect(result.current).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([false, null])(
    "returns null when the board is not set to use GitLab (%s)",
    (value) => {
      const { result } = renderHook(() =>
        useProjectWorkItems(projectBoard(value))
      );
      expect(result.current).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("is loading before GitLab responds", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProjectWorkItems(projectBoard(true)));
    expect(result.current).toEqual({ state: "LOADING", issues: [] });
  });

  it("loads work items from the board's GitLab project", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ "X-Total-Pages": "1" }),
      json: async () => [
        {
          iid: 3583120,
          title: "A work item",
          web_url: "https://git.drupalcode.org/project/tool/-/work_items/3583120",
          labels: ["state::rtbc"],
          assignees: [],
        },
      ],
    });

    const { result } = renderHook(() => useProjectWorkItems(projectBoard(true)));

    await waitFor(() => expect(result.current.state).toBe("OK"));
    expect(result.current.issues).toHaveLength(1);
    expect(result.current.issues[0].field_issue_status).toBe("14");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/projects/project%2Ftool/issues");
  });

  it("reports an error when GitLab fails", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
    const { result } = renderHook(() => useProjectWorkItems(projectBoard(true)));
    await waitFor(() => expect(result.current.state).toBe("ERROR"));
  });
});
