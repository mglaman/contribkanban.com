import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import {
  renderApp,
  mockFetch,
  jsonResponse,
  currentPath,
  meRoute,
} from "../../test-utils";

const boardIndex = {
  url: /\/jsonapi\/index\/boards\?/,
  respond: () => jsonResponse({ data: [], links: {} }),
};

async function openDrawer(user) {
  await user.click(screen.getByRole("button", { name: "menu" }));
  return screen.findByRole("presentation");
}

describe("App bar", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("links the title home", async () => {
    mockFetch([boardIndex]);
    const { user } = renderApp("/create");
    await user.click(screen.getByRole("link", { name: "ContribKanban" }));
    expect(currentPath()).toBe("/");
  });

  it("shows board, guest, and project links in the drawer", async () => {
    mockFetch([boardIndex]);
    const { user } = renderApp("/");
    const drawer = await openDrawer(user);

    for (const [name, href] of [
      ["All", "/"],
      ["Drupal core", "/boards/core"],
      ["Projects", "/boards/project"],
      ["Sprints", "/boards/sprint"],
      ["Create", "/create"],
      ["Log in", "/login"],
      ["Register", "/register"],
      ["GitHub", "https://github.com/mglaman/contribkanban.com"],
    ]) {
      expect(within(drawer).getByRole("link", { name })).toHaveAttribute(
        "href",
        href
      );
    }
    expect(
      within(drawer).queryByRole("link", { name: "My account" })
    ).not.toBeInTheDocument();
    expect(
      within(drawer).queryByRole("link", { name: "Custom" })
    ).not.toBeInTheDocument();
  });

  it("closes the drawer after navigating", async () => {
    mockFetch([boardIndex]);
    const { user } = renderApp("/");
    const drawer = await openDrawer(user);
    await user.click(within(drawer).getByRole("link", { name: "Projects" }));
    expect(currentPath()).toBe("/boards/project");
    await vi.waitFor(() =>
      expect(screen.queryByRole("presentation")).not.toBeInTheDocument()
    );
  });

  it("shows account links when signed in", async () => {
    mockFetch([boardIndex, meRoute]);
    const { user } = renderApp("/", { authenticated: true });
    const drawer = await openDrawer(user);
    expect(
      within(drawer).getByRole("link", { name: "My account" })
    ).toHaveAttribute("href", "/me");
    expect(
      within(drawer).getByRole("link", { name: "Log out" })
    ).toHaveAttribute("href", "/logout");
    expect(
      within(drawer).queryByRole("link", { name: "Log in" })
    ).not.toBeInTheDocument();
  });
});

describe("Auth routes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends guests from /me to the login form", () => {
    mockFetch([]);
    renderApp("/me");
    expect(currentPath()).toBe("/login");
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("sends signed in users from /login to /me", async () => {
    mockFetch([
      meRoute,
      {
        url: /\/jsonapi\/node_board\/node_board\?/,
        respond: () => jsonResponse({ data: [] }),
      },
    ]);
    renderApp("/login", { authenticated: true });
    expect(currentPath()).toBe("/me");
    expect(await screen.findByText("tester@example.com")).toBeInTheDocument();
  });

  it("logs out and returns to the login form", async () => {
    mockFetch([meRoute]);
    renderApp("/logout", { authenticated: true });
    await vi.waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Sign In" })
      ).toBeInTheDocument()
    );
    expect(currentPath()).toBe("/login");
    expect(JSON.parse(localStorage.getItem("oauth"))).toBeNull();
  });
});
