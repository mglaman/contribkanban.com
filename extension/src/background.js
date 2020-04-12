/* global chrome */
"use strict";

import { clearAuthData, setAuthData, setMeData, apiFetch } from "./shared";

chrome.runtime.onMessage.addListener((message, sender) => {
  const { event, payload } = message;
  if (event === "LOGGED_OUT") {
    clearAuthData();
    chrome.storage.local.remove("me");
  } else if (event === "LOGGED_IN") {
    setAuthData(payload);
    apiFetch(`https://api.contribkanban.com/jsonapi/me`, null, authData)
      .then((res) => res.json())
      .then((json) => setMeData(json));
  }
  console.log(message);
  console.log(sender);
});
