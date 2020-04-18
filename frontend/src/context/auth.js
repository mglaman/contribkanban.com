import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
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

const oauthStorageKey = "oauth";

export const storeOauthTokens = (tokenData) => {
  localStorage.setItem(oauthStorageKey, JSON.stringify(tokenData));
};

export const useOAuthTokens = () => {
  const [authTokens, setTokensToState] = useState(() =>
    JSON.parse(localStorage.getItem(oauthStorageKey))
  );
  const setAuthTokens = (newTokens) => {
    storeOauthTokens(newTokens);
  };

  const storageEventHandler = useCallback(
    (event) => {
      console.log(`storage handler executed`);
      console.log(event);
      const updatedValue = JSON.parse(event.newValue);
      console.log(updatedValue);
      if (event.key === oauthStorageKey && updatedValue !== authTokens) {
        setTokensToState(updatedValue);
      }
    },
    [authTokens]
  );
  useEffect(() => {
    window.addEventListener("storage", storageEventHandler);
    return () => window.removeEventListener("storage", storageEventHandler);
  }, [storageEventHandler]);

  return [authTokens, setAuthTokens];
};

export const authWithPasswordGrant = async (username, password) => {
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
    console.log(err);
    success = false;
  }
  return { success, result };
};

export const fetchAsAuthenticated = async (resource, opts, authTokens) => {
  if (resource.substr(0, 1) === "/") {
    resource = `${getApiBaseUrl()}/jsonapi${resource}`;
  }
  let res;
  const request = new Request(resource, opts);
  request.headers.set("Accept", "application/vnd.api+json");
  if (opts && (opts.method === "POST" || opts.method === "PATCH")) {
    request.headers.set("Content-Type", "application/vnd.api+json");
  }

  if (authTokens && authTokens.access_token) {
    res = await fetchWithToken(request.clone(), authTokens.access_token);
    if (!res.ok && res.status === 401) {
      const refreshedTokens = await refreshToken(authTokens);
      storeOauthTokens(refreshedTokens);
      if (!refreshedTokens) {
        return res;
      }
      res = await fetchWithToken(request, refreshedTokens.access_token);
    }
  } else {
    res = await fetch(request);
  }
  return res;
};
const fetchWithToken = async (req, token) => {
  req.headers.set("Authorization", `Bearer ${token}`);
  return await fetch(req);
};
export const refreshToken = async (authTokens) => {
  const refreshRes = await fetch(`${getApiBaseUrl()}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: authTokens.refresh_token,
    }),
  });
  const result = await refreshRes.json();
  if (!refreshRes.ok) {
    return null;
  }
  return result;
};
