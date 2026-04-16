import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import {
  AuthProvider,
  useAuth,
  authWithPasswordGrant,
  fetchAsAuthenticated,
  refreshToken,
  storeOauthTokens,
} from "../context/auth";
import { getApiBaseUrl } from "../api";

const BASE_URL = getApiBaseUrl();

function makeFetchResponse(body = {}, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
    clone() {
      return this;
    },
  };
}

// Helper to render a consumer of AuthContext
function AuthConsumer() {
  const { authTokens, currentUser, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{currentUser ? currentUser.mail : "guest"}</span>
      <span data-testid="token">{authTokens ? "has-token" : "no-token"}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("storeOauthTokens", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("stores token data in localStorage under the oauth key", () => {
    const tokens = { access_token: "abc", refresh_token: "xyz" };
    storeOauthTokens(tokens);
    expect(JSON.parse(localStorage.getItem("oauth"))).toEqual(tokens);
  });

  it("stores null to clear tokens", () => {
    localStorage.setItem("oauth", JSON.stringify({ access_token: "old" }));
    storeOauthTokens(null);
    expect(localStorage.getItem("oauth")).toBe("null");
  });
});

describe("authWithPasswordGrant", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns success and token data on valid credentials", async () => {
    const tokenData = { access_token: "abc", refresh_token: "xyz" };
    fetchMock.mockResolvedValue(makeFetchResponse(tokenData, true));

    const result = await authWithPasswordGrant("user@example.com", "secret");

    expect(result.success).toBe(true);
    expect(result.result).toEqual(tokenData);
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/oauth/token`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("returns failure on bad credentials (non-ok response)", async () => {
    fetchMock.mockResolvedValue(
      makeFetchResponse({ error: "invalid_grant" }, false, 401)
    );

    const result = await authWithPasswordGrant("user@example.com", "wrong");

    expect(result.success).toBe(false);
  });

  it("returns failure when fetch throws a network error", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    const result = await authWithPasswordGrant("user@example.com", "secret");

    expect(result.success).toBe(false);
  });
});

describe("refreshToken", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns new token data on successful refresh", async () => {
    const newTokens = { access_token: "new-access", refresh_token: "new-refresh" };
    fetchMock.mockResolvedValue(makeFetchResponse(newTokens, true));

    const result = await refreshToken({ refresh_token: "old-refresh" });

    expect(result).toEqual(newTokens);
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/oauth/token`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("returns null when refresh fails", async () => {
    fetchMock.mockResolvedValue(
      makeFetchResponse({ error: "invalid_token" }, false, 401)
    );

    const result = await refreshToken({ refresh_token: "expired" });

    expect(result).toBeNull();
  });
});

describe("fetchAsAuthenticated", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches without Authorization header when no tokens provided", async () => {
    fetchMock.mockResolvedValue(makeFetchResponse());

    await fetchAsAuthenticated("/node--board", null, null);

    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Authorization")).toBeNull();
  });

  it("sets Authorization Bearer header when tokens are provided", async () => {
    fetchMock.mockResolvedValue(makeFetchResponse());
    const tokens = { access_token: "my-token", refresh_token: "my-refresh" };

    await fetchAsAuthenticated("/node--board", null, tokens);

    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Authorization")).toBe("Bearer my-token");
  });

  it("prepends base URL and /jsonapi for relative paths", async () => {
    fetchMock.mockResolvedValue(makeFetchResponse());
    const tokens = { access_token: "my-token", refresh_token: "my-refresh" };

    await fetchAsAuthenticated("/node--board", null, tokens);

    const [request] = fetchMock.mock.calls[0];
    expect(request.url).toBe(`${BASE_URL}/jsonapi/node--board`);
  });

  it("refreshes token and retries on 401 response", async () => {
    const freshTokens = { access_token: "fresh-token", refresh_token: "fresh-refresh" };
    fetchMock
      .mockResolvedValueOnce({ ...makeFetchResponse(), ok: false, status: 401 }) // initial request
      .mockResolvedValueOnce(makeFetchResponse(freshTokens, true)) // refreshToken call
      .mockResolvedValueOnce(makeFetchResponse({ data: "ok" }, true)); // retry

    const tokens = { access_token: "stale-token", refresh_token: "stale-refresh" };
    const result = await fetchAsAuthenticated("/node--board", null, tokens);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.ok).toBe(true);
    // The retry should use the refreshed access token
    const [retryRequest] = fetchMock.mock.calls[2];
    expect(retryRequest.headers.get("Authorization")).toBe("Bearer fresh-token");
  });

  it("returns the 401 response when token refresh fails", async () => {
    fetchMock
      .mockResolvedValueOnce({ ...makeFetchResponse(), ok: false, status: 401 }) // initial
      .mockResolvedValueOnce(makeFetchResponse({ error: "invalid" }, false, 401)); // refresh fails

    const tokens = { access_token: "stale", refresh_token: "expired" };
    const result = await fetchAsAuthenticated("/node--board", null, tokens);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
  });
});

describe("AuthProvider", () => {
  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("renders children", () => {
    render(
      <AuthProvider>
        <span>child content</span>
      </AuthProvider>
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("provides null currentUser and no tokens for unauthenticated state", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("user").textContent).toBe("guest");
    expect(screen.getByTestId("token").textContent).toBe("no-token");
  });

  it("reads existing tokens from localStorage on mount", async () => {
    const tokens = { access_token: "stored-token", refresh_token: "stored-refresh" };
    localStorage.setItem("oauth", JSON.stringify(tokens));

    const fetchMock = vi.fn().mockResolvedValue(
      makeFetchResponse({ mail: "user@example.com" }, true)
    );
    vi.stubGlobal("fetch", fetchMock);

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("token").textContent).toBe("has-token");
    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("user@example.com")
    );
  });

  it("clears tokens and user on logout", async () => {
    const tokens = { access_token: "stored-token", refresh_token: "stored-refresh" };
    localStorage.setItem("oauth", JSON.stringify(tokens));

    const fetchMock = vi.fn().mockResolvedValue(
      makeFetchResponse({ mail: "user@example.com" }, true)
    );
    vi.stubGlobal("fetch", fetchMock);

    const { getByText } = render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("user@example.com")
    );

    getByText("Logout").click();

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("guest");
      expect(screen.getByTestId("token").textContent).toBe("no-token");
    });
  });
});
