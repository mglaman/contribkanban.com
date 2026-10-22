import { describe, it, expect, afterEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import {
  renderApp,
  mockFetch,
  jsonResponse,
  currentPath,
  meRoute,
  TEST_TOKENS,
} from "../../test-utils";

const nodeBoards = {
  url: /\/jsonapi\/node_board\/node_board\?/,
  respond: () => jsonResponse({ data: [] }),
};

describe("Login and registration forms", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the OAuth error for bad credentials", async () => {
    mockFetch([
      {
        method: "POST",
        url: /\/oauth\/token$/,
        respond: () =>
          jsonResponse(
            { error: "invalid_grant", message: "The user credentials were incorrect." },
            400
          ),
      },
    ]);
    const { user } = renderApp("/login");
    expect(document.title).toBe("Login - ContribKanban");
    await user.type(screen.getByLabelText(/^Email Address/), "a@example.com");
    await user.type(screen.getByLabelText(/^Password/), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(
      await screen.findByText("The user credentials were incorrect.")
    ).toBeInTheDocument();
    expect(currentPath()).toBe("/login");
  });

  it("stores tokens and goes to /me after signing in", async () => {
    let grant = null;
    mockFetch([
      {
        method: "POST",
        url: /\/oauth\/token$/,
        respond: (url, request, body) => {
          grant = new URLSearchParams(body);
          return jsonResponse(TEST_TOKENS);
        },
      },
      meRoute,
      nodeBoards,
    ]);
    const { user } = renderApp("/login");
    await user.type(screen.getByLabelText(/^Email Address/), "tester@example.com");
    await user.type(screen.getByLabelText(/^Password/), "secret");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("tester@example.com", { selector: "h6" })).toBeInTheDocument();
    expect(currentPath()).toBe("/me");
    expect(JSON.parse(localStorage.getItem("oauth"))).toEqual(TEST_TOKENS);
    expect(grant.get("grant_type")).toBe("password");
    expect(grant.get("username")).toBe("tester@example.com");
  });

  it("blocks registration when the passwords differ", async () => {
    const fetchMock = mockFetch([]);
    const { user } = renderApp("/register");
    await user.type(screen.getByLabelText(/^Email Address/), "new@example.com");
    await user.type(screen.getByLabelText(/^Password/), "one");
    await user.type(screen.getByLabelText(/^Confirm password/), "two");
    expect(screen.getByText("The passwords do not match")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Create your account" }));
    expect(
      screen.getByText("Passwords do not match", { selector: "p" })
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("registers, signs in, and goes to /me", async () => {
    let registered = null;
    mockFetch([
      {
        method: "POST",
        url: /\/jsonapi\/user\/register$/,
        respond: (url, request, body) => {
          registered = body.data.attributes;
          return jsonResponse({ data: { id: "user-uuid" } }, 201);
        },
      },
      {
        method: "POST",
        url: /\/oauth\/token$/,
        respond: () => jsonResponse(TEST_TOKENS),
      },
      meRoute,
      nodeBoards,
    ]);
    const { user } = renderApp("/register");
    await user.type(screen.getByLabelText(/^Email Address/), "new@example.com");
    await user.type(screen.getByLabelText(/^Password/), "secret");
    await user.type(screen.getByLabelText(/^Confirm password/), "secret");
    await user.type(screen.getByLabelText("Drupal.org username"), "newbie");
    await user.click(screen.getByRole("button", { name: "Create your account" }));

    await vi.waitFor(() => expect(currentPath()).toBe("/me"));
    expect(registered).toEqual({
      mail: "new@example.com",
      name: "new@example.com",
      pass: "secret",
      drupalorg_username: "newbie",
    });
  });
});
