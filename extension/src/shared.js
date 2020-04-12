export const clientId = "d4f7c501-cff9-4a3f-bae7-aec1db19456c";

export function apiFetch(input, init, authData) {
  const request = new Request(input, init);
  request.headers.set("Accept", "application/vnd.api+json");
  request.headers.set("Authorization", `Bearer ${authData.access_token}`);
  if (init && (init.method === "POST" || init.method === "PATCH")) {
    request.headers.set("Content-Type", "application/vnd.api+json");
  }
  return fetch(request);
}

export function dispatchEvent(event, payload) {
  chrome.runtime.sendMessage(
    {
      event,
      payload,
    },
    (resp) => {
      console.log(`debug response from: ${event}`);
      console.log(resp);
    }
  );
}

export function storeData(data, callback) {
  chrome.storage.local.set(data, callback);
}
export function getAuthData(callback) {
  chrome.storage.local.get("authData", callback);
}
export function setAuthData(authData, callback) {
  chrome.storage.local.set({ authData }, callback);
}

export function getMeData(callback) {
  chrome.storage.local.get("me", callback);
}
export function setMeData(me, callback) {
  chrome.storage.local.set({ me }, callback);
}

export function clearAuthData(callback) {
  chrome.storage.local.clear(callback);
}
