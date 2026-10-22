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

const nodeBoard = (id, title) => ({
  url: new RegExp(`/jsonapi/node_board/node_board/${id}$`),
  respond: () =>
    jsonResponse({
      data: {
        id,
        attributes: { title, collaboration: "private", nids: [] },
        links: { self: { href: "x" } },
      },
    }),
});

function routes() {
  return [
    meRoute,
    {
      url: /\/jsonapi\/node_board\/node_board\?filter\[uid\.id\]=user-uuid$/,
      respond: () =>
        jsonResponse({
          data: [{ id: "nb-1", attributes: { title: "My collection" } }],
        }),
    },
    nodeBoard("nb-1", "My collection"),
  ];
}

describe("Me page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the account and its issue collections", async () => {
    const fetchMock = mockFetch(routes());
    renderApp("/me", { authenticated: true });

    expect(await screen.findByText("tester@example.com")).toBeInTheDocument();
    expect(screen.getByText("tester")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Avatar" })).toHaveAttribute(
      "src",
      expect.stringContaining("gravatar.com/avatar/abc123")
    );
    expect(await screen.findByText("My collection")).toBeInTheDocument();

    const meRequest = fetchMock.mock.calls
      .map(([request]) => request)
      .find((request) => request.url.endsWith("/jsonapi/me"));
    expect(meRequest.headers.get("Authorization")).toBe(
      "Bearer test-access-token"
    );
    expect(requestedUrls(fetchMock)).toContainEqual(
      expect.stringContaining("filter[uid.id]=user-uuid")
    );
  });

  it("opens a collection board", async () => {
    mockFetch(routes());
    const { user } = renderApp("/me", { authenticated: true });
    await user.click(await screen.findByText("My collection"));
    expect(currentPath()).toBe("/node-board/nb-1");
  });

  it("opens a collection's edit form from its edit button", async () => {
    mockFetch(routes());
    const { user } = renderApp("/me", { authenticated: true });
    const item = (await screen.findByText("My collection")).closest("li");
    await user.click(within(item).getByRole("button", { name: "edit" }));
    expect(currentPath()).toBe("/node-board/nb-1/edit");
  });

  it("opens the new issue collection dialog", async () => {
    mockFetch(routes());
    const { user } = renderApp("/me", { authenticated: true });
    await user.click(
      await screen.findByRole("button", { name: "New issue collection" })
    );
    expect(
      await screen.findByRole("dialog", { name: "Create issue collection" })
    ).toBeInTheDocument();
  });
});
