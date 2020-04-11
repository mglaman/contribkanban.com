const clientId = "d4f7c501-cff9-4a3f-bae7-aec1db19456c";
let authData = null;
chrome.storage.local.get("authData", (items) => {
  authData = items.authData;
});

window.addEventListener(
  "message",
  function (event) {
    // We only accept messages from ourselves
    if (event.source != window) return;
    if (event?.data?.type !== "ADD_ISSUE") return;
    this.console.log("Content script received: " + event.data.issueNid);

    // first refresh our token.
    this.fetch(`https://api.contribkanban.com/oauth/token`, {
      method: "POST",
      body: `grant_type=refresh_token&client_id=${clientId}&refresh_token=${authData.refresh_token}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("couldn't refresh token");
        } else {
          return res.json();
        }
      })
      .then((json) => {
        authData = json;
        chrome.storage.local.set({ authData: json }, () => {
          this.console.log(`updated authdata`);
        });
        this.fetch(`https://api.contribkanban.com/jsonapi/me`, {
          headers: {
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${authData.access_token}`,
          },
        })
          .then((res) => res.json())
          .then((json) => {
            const userId = json.data.id;
            this.fetch(
              `https://api.contribkanban.com/jsonapi/node_board/node_board?filter[uid.id]=${userId}`,
              {
                headers: {
                  Accept: "application/vnd.api+json",
                  Authorization: `Bearer ${authData.access_token}`,
                },
              }
            )
              .then((res) => res.json())
              .then((json) => {
                const boards = json.data;
                this.console.log(boards);
              });
          });
      })
      .catch((err) => {
        this.console.log(err);
        chrome.storage.local.remove("authData", () => {
          this.alert(
            "There was an error authenticating, re-connect with ContribKanban"
          );
        });
      });
  },
  false
);

(() => {
  if (!document.body.classList.contains("node-type-project-issue")) {
    return;
  }
  // Fetch the current issue nid from the canonical link.
  // This catches anyone going to `/node/{nid}`.
  const issueNid = document
    .querySelector('link[rel="canonical"]')
    .href.split("/")
    .splice(-1, 1)[0];
  const issueMetadataBlock = document.getElementById(
    "block-project-issue-issue-metadata"
  );

  const buttonWrapper = document.createElement("div");
  buttonWrapper.style = "margin-top: 1em";
  const button = document.createElement("button");
  button.setAttribute("value", "Add to issue collection");
  button.setAttribute("data-nid", issueNid);
  button.appendChild(document.createTextNode("Add to issue collection"));
  button.addEventListener(
    "click",
    () => {
      window.postMessage({ type: "ADD_ISSUE", issueNid }, "*");
    },
    false
  );
  button.style = "width: 100%; margin: 0";
  buttonWrapper.appendChild(button);
  issueMetadataBlock.parentNode.appendChild(buttonWrapper);
})();
