import { createContext, useContext } from "react";
import qs from "qs";
import { getApiBaseUrl } from "../api";

export const AuthContext = createContext();

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

  fetchAsAuthenticated = async (url, opts) => {
    const request = new Request(url, opts);
    let res = await this.fetchWithToken(request.clone(), this.access_token);
    if (!res.ok && res.status === 401) {
      const refreshedTokens = await this.refreshToken();
      debugger;
      this.setAuthTokens(refreshedTokens);
      res = await this.fetchWithToken(request, refreshedTokens.access_token);
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
        client_id: "d4f7c501-cff9-4a3f-bae7-aec1db19456c",
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
}