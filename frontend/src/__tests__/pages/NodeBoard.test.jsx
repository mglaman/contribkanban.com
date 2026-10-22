import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import {
  renderApp,
  mockFetch,
  jsonResponse,
  requestedUrls,
  currentPath,
  meRoute,
} from "../../test-utils";

const ISSUES = [
  { nid: "1", title: "Active issue", field_issue_status: "1" },
  { nid: "2", title: "Postponed issue", field_issue_status: "16" },
  { nid: "3", title: "Closed fixed issue", field_issue_status: "7" },
].map((issue) => ({
  ...issue,
  url: `https://www.drupal.org/node/${issue.nid}`,
  field_issue_priority: "200",
}));

function boardRoute({ canEdit = false } = {}) {
  return {
    url: /\/jsonapi\/node_board\/node_board\/nb-uuid$/,
    respond: () =>
      jsonResponse({
        data: {
          id: "nb-uuid",
          attributes: {
            title: "Release blockers",
            collaboration: "shared",
            nids: ["1", "2", "3"],
          },
          links: {
            self: {
              href: "x",
              meta: { linkParams: { rel: canEdit ? ["self", "update"] : ["self"] } },
            },
          },
        },
      }),
  };
}

const issuesRoute = {
  url: /api-d7\/node\.json\?nid\[0\]=1&nid\[1\]=2&nid\[2\]=3$/,
  respond: () => jsonResponse({ list: ISSUES }),
};

function column(title) {
  return screen
    .getByText(new RegExp(`^${title} \\(\\d+\\)$`))
    .closest(".MuiPaper-root");
}

describe("Issue collection board", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sorts the collection's issues into status columns", async () => {
    const fetchMock = mockFetch([boardRoute(), issuesRoute]);
    renderApp("/node-board/nb-uuid");

    expect(
      await screen.findByRole("heading", { name: "Release blockers" })
    ).toBeInTheDocument();
    expect(await screen.findByText("Active (1)")).toBeInTheDocument();
    expect(screen.getByText("Postponed (1)")).toBeInTheDocument();
    expect(screen.getByText("Fixed (1)")).toBeInTheDocument();
    expect(screen.getByText("Needs review (0)")).toBeInTheDocument();
    expect(
      within(column("Fixed")).getByText("Closed fixed issue")
    ).toBeInTheDocument();
    expect(requestedUrls(fetchMock)).toContainEqual(
      expect.stringContaining("api-d7/node.json?nid[0]=1&nid[1]=2&nid[2]=3")
    );
    expect(
      screen.queryByRole("link", { name: "edit" })
    ).not.toBeInTheDocument();
  });

  it("adds an edit action to the app bar for editors", async () => {
    mockFetch([meRoute, boardRoute({ canEdit: true }), issuesRoute]);
    const { user } = renderApp("/node-board/nb-uuid", { authenticated: true });

    const edit = await screen.findByRole("link", { name: "edit" });
    expect(edit).toHaveAttribute("href", "/node-board/nb-uuid/edit");
    await user.click(edit);
    expect(currentPath()).toBe("/node-board/nb-uuid/edit");
  });

  it("explains when the board does not exist", async () => {
    mockFetch([]);
    renderApp("/node-board/missing");
    expect(
      await screen.findByText("Sorry, this board does not seem to exist.")
    ).toBeInTheDocument();
  });
});
