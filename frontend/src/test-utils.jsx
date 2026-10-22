import React from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";

export const TEST_TOKENS = {
  access_token: "test-access-token",
  refresh_token: "test-refresh-token",
};

export const TEST_USER = {
  data: {
    id: "user-uuid",
    type: "user--user",
    attributes: {
      mail: "tester@example.com",
      mail_hash: "abc123",
      drupalorg_username: "tester",
    },
  },
};

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/**
 * Replaces fetch with a router over request method and URL.
 *
 * Each route is { method, url, respond }. `url` is a RegExp tested against
 * the full URL. `respond` gets the URL, the Request, and the parsed JSON body
 * (for POST and PATCH), and returns a Response. Unmatched requests get a 404
 * so tests fail on calls they did not expect.
 *
 * @returns {import("vitest").Mock} The fetch mock, for asserting calls.
 */
export function mockFetch(routes) {
  const fetchMock = vi.fn(async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init);
    const url = decodeURIComponent(request.url);
    const method = request.method.toUpperCase();
    const route = routes.find(
      (candidate) =>
        (candidate.method ?? "GET") === method && candidate.url.test(url)
    );
    if (!route) {
      return jsonResponse({ errors: [{ status: "404", detail: url }] }, 404);
    }
    const text = ["POST", "PATCH"].includes(method)
      ? await request.clone().text()
      : "";
    let body = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (err) {
      // Form-encoded bodies, such as the OAuth token request, stay as text.
    }
    return route.respond(url, request, body);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** Requests the mock received, as decoded "METHOD url" strings. */
export function requestedUrls(fetchMock) {
  return fetchMock.mock.calls.map(([input, init]) => {
    const request = input instanceof Request ? input : new Request(input, init);
    return `${request.method} ${decodeURIComponent(request.url)}`;
  });
}

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">{location.pathname + location.search}</div>
  );
}

/** The current router path, as rendered by the location probe. */
export function currentPath() {
  return screen.getByTestId("location").textContent;
}

/**
 * Renders the whole app at a route, with the same theme as production.
 *
 * Pass `authenticated: true` to start with OAuth tokens in localStorage. The
 * test must then mock GET /jsonapi/me.
 */
export function renderApp(path = "/", { authenticated = false } = {}) {
  if (authenticated) {
    localStorage.setItem("oauth", JSON.stringify(TEST_TOKENS));
  }
  const user = userEvent.setup({ delay: null });
  const utils = render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider theme={theme}>
        <App />
        <LocationProbe />
      </ThemeProvider>
    </MemoryRouter>
  );
  return { user, ...utils };
}

/** Route for the current user lookup that AuthProvider makes when signed in. */
export const meRoute = {
  url: /\/jsonapi\/me$/,
  respond: () => jsonResponse(TEST_USER),
};
