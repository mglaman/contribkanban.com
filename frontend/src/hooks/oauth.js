import { useState, useEffect } from "react";
import qs from "querystring";
import { useAuth } from "../context/auth";
// @todo move URL to context?
import { getApiBaseUrl } from "../api";
// @todo move into context?
const clientId = "d4f7c501-cff9-4a3f-bae7-aec1db19456c";

export const usePasswordGrant = (username, password) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  useEffect(() => {
    const obtainToken = async () => {
      setLoading(true);
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
        const token = await res.json();
        setError(!res.ok);
        setResult(token);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    obtainToken();
  }, [username, password]);

  return { error, loading, result };
};

export const useTokenDebug = () => {
  const { authTokens } = useAuth();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const tokenDebug = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/oauth/debug`, {
          headers: {
            Authorization: `${authTokens.token_type} ${authTokens.access_token}`,
          },
        });
        const json = await res.json();
        setResult(json);
      } catch (err) {
        setResult(null);
      }
    };
    tokenDebug();
  }, [authTokens]);

  return { result };
};
