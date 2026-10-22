import { describe, it, expect, afterEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import {
  renderApp,
  mockFetch,
  jsonResponse,
  currentPath,
  meRoute,
} from "../../test-utils";

function routes(onPatch) {
  return [
    meRoute,
    {
      url: /\/jsonapi\/node_board\/node_board\/nb-uuid$/,
      respond: () =>
        jsonResponse({
          data: {
            id: "nb-uuid",
            attributes: {
              title: "Release blockers",
              collaboration: "private",
              nids: ["3001"],
            },
            links: { self: { href: "x" } },
          },
        }),
    },
    {
      method: "PATCH",
      url: /\/jsonapi\/node_board\/node_board\/nb-uuid$/,
      respond: (url, request, body) => {
        onPatch(body);
        return jsonResponse({ data: { id: "nb-uuid" } });
      },
    },
    {
      url: /api-d7\/node\/3001\.json$/,
      respond: () =>
        jsonResponse({ type: "project_issue", title: "Existing issue" }),
    },
    {
      url: /api-d7\/node\/4\.json$/,
      respond: () => jsonResponse({ type: "page", title: "Not an issue" }),
    },
    {
      url: /api-d7\/node\.json/,
      respond: () => jsonResponse({ list: [] }),
    },
  ];
}

describe("Issue collection edit form", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the board and saves changes", async () => {
    let patched = null;
    mockFetch(routes((body) => (patched = body)));
    const { user } = renderApp("/node-board/nb-uuid/edit", {
      authenticated: true,
    });

    const title = await screen.findByDisplayValue("Release blockers");
    expect(screen.getByLabelText(/^Private:/)).toBeChecked();
    expect(await screen.findByText("Existing issue")).toBeInTheDocument();

    await user.clear(title);
    await user.type(title, "Renamed");
    await user.click(screen.getByLabelText(/^Public:/));
    await user.click(screen.getByRole("button", { name: "Add issue" }));
    const fields = screen.getAllByPlaceholderText("Issue ID");
    expect(fields).toHaveLength(2);
    await user.type(fields[1], "4");
    await user.tab();
    expect(await screen.findByText("Invalid issue ID")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save" }));

    await vi.waitFor(() => expect(currentPath()).toBe("/node-board/nb-uuid"));
    expect(patched.data).toEqual({
      type: "node_board--node_board",
      id: "nb-uuid",
      attributes: {
        title: "Renamed",
        collaboration: "public",
        nids: ["3001", "4"],
      },
    });
  });

  it("requires a board name", async () => {
    mockFetch(routes(() => {}));
    const { user } = renderApp("/node-board/nb-uuid/edit", {
      authenticated: true,
    });
    await user.clear(await screen.findByDisplayValue("Release blockers"));
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(
      await screen.findByText("Board name cannot be empty.")
    ).toBeInTheDocument();
  });

  it("returns to the account page on cancel", async () => {
    mockFetch([
      ...routes(() => {}),
      {
        url: /\/jsonapi\/node_board\/node_board\?/,
        respond: () => jsonResponse({ data: [] }),
      },
    ]);
    const { user } = renderApp("/node-board/nb-uuid/edit", {
      authenticated: true,
    });
    await screen.findByDisplayValue("Release blockers");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(currentPath()).toBe("/me");
  });
});
