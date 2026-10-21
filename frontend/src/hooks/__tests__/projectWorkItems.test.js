import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useProjectWorkItems from "../projectWorkItems";

const projectBoard = {
  type: "board--drupalorg_project",
  attributes: { project_nid: ["3538471"] },
};

function makeFetchResponse(body, ok = true) {
  return { ok, status: ok ? 200 : 404, json: async () => body };
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
      useProjectWorkItems({ type: "board--drupalorg_sprint", attributes: {} })
    );
    expect(result.current).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is resolving before the project is checked", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProjectWorkItems(projectBoard));
    expect(result.current).toEqual({ state: "RESOLVING", issues: [] });
  });

  it("returns null when the project still uses the Drupal.org issue queue", async () => {
    fetchMock.mockResolvedValue(
      makeFetchResponse({ field_project_has_issue_queue: true })
    );
    const { result } = renderHook(() => useProjectWorkItems(projectBoard));
    await waitFor(() => expect(result.current).toBeNull());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns null when the project lookup fails", async () => {
    fetchMock.mockResolvedValue(makeFetchResponse({}, false));
    const { result } = renderHook(() => useProjectWorkItems(projectBoard));
    await waitFor(() => expect(result.current).toBeNull());
  });

  it("loads work items from GitLab when the project has migrated", async () => {
    fetchMock
      .mockResolvedValueOnce(
        makeFetchResponse({
          field_project_has_issue_queue: false,
          field_project_machine_name: "tool",
        })
      )
      .mockResolvedValueOnce({
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

    const { result } = renderHook(() => useProjectWorkItems(projectBoard));

    await waitFor(() => expect(result.current.state).toBe("OK"));
    expect(result.current.issues).toHaveLength(1);
    expect(result.current.issues[0].field_issue_status).toBe("14");
    expect(fetchMock.mock.calls[1][0]).toContain("/projects/project%2Ftool/issues");
  });

  it("reports an error when GitLab fails", async () => {
    fetchMock
      .mockResolvedValueOnce(
        makeFetchResponse({
          field_project_has_issue_queue: false,
          field_project_machine_name: "tool",
        })
      )
      .mockResolvedValueOnce(makeFetchResponse({}, false));
    const { result } = renderHook(() => useProjectWorkItems(projectBoard));
    await waitFor(() => expect(result.current.state).toBe("ERROR"));
  });
});
