import { createContext, useContext } from "react";
import qs from "qs";
import { getApiBaseUrl } from "../api";

const clientId = "d4f7c501-cff9-4a3f-bae7-aec1db19456c";

/**
 * @typedef {Object} AuthContextValue
 * @property {OAuth} auth
 */

export const AuthContext = createContext();

/**
 * @return {AuthContextValue}
 */
export function useAuth() {
  return useContext(AuthContext);
}

export class OAuth {
  access_token = null;
  refresh_token = null;
  setAuthTokensCallback;
  expireTokensCallback;
  constructor(tokenData, setAuthTokensCallback, expireTokensCallback) {
    if (tokenData) {
      this.access_token = tokenData.access_token || null;
      this.refresh_token = tokenData.refresh_token || null;
    }
    this.setAuthTokensCallback = setAuthTokensCallback;
    this.expireTokensCallback = expireTokensCallback;
  }

  setAuthTokens = (tokens) => {
    this.setAuthTokensCallback(tokens);
  };
  expireTokens = () => {
    this.expireTokensCallback();
  };

  /**
   *
   * @param {RequestInfo} resource
   * @param {RequestInit} opts
   *
   * @returns {Promise<Response>}
   */
  fetchAsAuthenticated = async (resource, opts) => {
    if (resource.substr(0, 1) === "/") {
      resource = `${getApiBaseUrl()}/jsonapi${resource}`;
    }
    let res;
    const request = new Request(resource, opts);
    request.headers.set("Accept", "application/vnd.api+json");
    if (opts && (opts.method === "POST" || opts.method === "PATCH")) {
      request.headers.set("Content-Type", "application/vnd.api+json");
    }

    if (this.access_token) {
      res = await this.fetchWithToken(request.clone(), this.access_token);
      if (!res.ok && res.status === 401) {
        const refreshedTokens = await this.refreshToken();
        this.setAuthTokens(refreshedTokens);
        res = await this.fetchWithToken(request, refreshedTokens.access_token);
      }
    } else {
      res = await fetch(request);
    }
    return res;
  };
  fetchWithToken = async (req, token) => {
    req.headers.set("Authorization", `Bearer ${token}`);
    return await fetch(req);
  };
  refreshToken = async () => {
    const refreshRes = await fetch(`${getApiBaseUrl()}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: this.refresh_token,
      }),
    });
    const result = await refreshRes.json();
    if (!refreshRes.ok) {
      this.expireTokens();
      return null;
    }
    return result;
  };

  usePasswordGrant = async (username, password) => {
    let success = false;
    let result;
    try {
      const res = await fetch(`${getApiBaseUrl()}/oauth/token`, {
        method: "POST",
        body: qs.stringify({
          grant_type: "password",
          client_id: clientId,
          username,
          password,
        }),
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      });
      result = await res.json();
      success = res.ok;
    } catch (err) {
      success = false;
    }
    return { success, result };
  };
}
