/* global chrome */
"use strict";

import {
  clientId,
  clearAuthData,
  setAuthData,
  setMeData,
  apiFetch,
} from "./shared";

function doLoggedOut() {
  console.log("Clearning connection data.");
  clearAuthData();
}
function doTokenRefreshed(data) {
  setAuthData(data);
}

// @note cannot dispatch another message inside of the listener lifecycle.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { event, payload } = message;
  console.log(message);
  console.log(sendResponse);

  switch (event) {
    case "LOGGED_OUT":
      doLoggedOut();
      break;
    case "LOGGED_IN":
      setAuthData(payload);
      apiFetch(`https://api.contribkanban.com/jsonapi/me`, null, payload)
        .then((res) => res.json())
        .then((json) => {
          setMeData(json);
          sendResponse(json);
        });
      return true;
    case "ENSURE_TOKEN":
      chrome.storage.local.get("authData", (items) => {
        console.log(items);
        authData = items.authData;
        if (!authData) {
          console.log("no access token to refresh");
          sendResponse();
          return;
        }
        let success;
        fetch(`https://api.contribkanban.com/oauth/token`, {
          method: "POST",
          body: `grant_type=refresh_token&client_id=${clientId}&refresh_token=${authData.refresh_token}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
          .then((res) => {
            success = res.ok;
            return res.json();
          })
          .then((json) => {
            if (success) {
              console.log("access token refreshed");
              doTokenRefreshed(json);
              sendResponse(json);
            } else {
              const { error, error_description } = json;
              console.log(`${error}: ${error_description}`);
              doLoggedOut();
              sendResponse(null);
            }
          });
      });
      return true;
    case "TOKEN_REFRESH":
      console.log("access token refreshed");
      doTokenRefreshed(payload);
      sendResponse(payload);
      break;
    default:
      sendResponse(null);
      break;
  }
});
