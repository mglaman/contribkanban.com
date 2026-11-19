import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyProjects from "../MyProjects";

const STORAGE_KEY = "contribkanban:gitlab-token";

function jsonResponse(body, headers = {}) {
  return { ok: true, status: 200, headers: new Headers(headers), json: async () => body };
}

function column(name) {
  return screen.getByRole("region", { name: new RegExp(`^${name}`) });
}

const gitlabProject = (path, issuesEnabled) => ({
  path,
  path_with_namespace: `project/${path}`,
  issues_enabled: issuesEnabled,
});

// One project on GitLab, one on drupal.org.
function apiFetch(url) {
  if (url.includes("/groups/project/projects")) {
    return Promise.resolve(jsonResponse([gitlabProject("canvas", true), gitlabProject("entity", false)]));
  }
  if (url.includes("project%2Fcanvas/issues")) {
    return Promise.resolve(
      jsonResponse([
        {
          iid: 300,
          title: "GitLab 300",
          web_url: "https://git.drupalcode.org/project/canvas/-/work_items/300",
          labels: ["state::active"],
          assignees: [],
        },
      ])
    );
  }
  if (url.includes("field_project_machine_name=entity")) {
    return Promise.resolve(jsonResponse({ list: [{ nid: "626176" }] }));
  }
  const status = new URL(url).searchParams.get("field_issue_status[value][0]");
  return Promise.resolve(
    jsonResponse({
      list:
        status === "1"
          ? [
              {
                nid: "100",
                title: "Drupal.org 100",
                url: "https://www.drupal.org/project/entity/issues/100",
                field_project: { id: "626176" },
                field_issue_status: "1",
                field_issue_priority: "200",
                field_issue_assigned: null,
              },
            ]
          : [],
    })
  );
}

describe("MyProjects", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("asks for a token, keeps it in the browser, and loads the board", async () => {
    const fetch = vi.fn(apiFetch);
    vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    render(<MyProjects filtersSlot={null} actionsSlot={null} />);
    expect(fetch).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("GitLab token"), " secret ");
    await user.click(screen.getByRole("button", { name: "Show my projects" }));

    expect(await within(column("Active")).findByText("GitLab 300")).toBeInTheDocument();
    expect(await within(column("Active")).findByText("Drupal.org 100")).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("secret");
  });

  it("uses a saved token without asking", async () => {
    window.localStorage.setItem(STORAGE_KEY, "secret");
    vi.stubGlobal("fetch", vi.fn(apiFetch));

    render(<MyProjects filtersSlot={null} actionsSlot={null} />);

    expect(screen.queryByLabelText("GitLab token")).not.toBeInTheDocument();
    expect(await within(await screen.findByRole("region", { name: /^Active/ })).findByText("GitLab 300")).toBeInTheDocument();
  });

  it("only sends the token to GitLab", async () => {
    window.localStorage.setItem(STORAGE_KEY, "secret");
    const fetch = vi.fn(apiFetch);
    vi.stubGlobal("fetch", fetch);

    render(<MyProjects filtersSlot={null} actionsSlot={null} />);
    await within(await screen.findByRole("region", { name: /^Active/ })).findByText("Drupal.org 100");

    const withToken = fetch.mock.calls.filter(([, options]) => JSON.stringify(options ?? {}).includes("secret"));
    expect(withToken.length).toBeGreaterThan(0);
    for (const [url] of withToken) {
      expect(new URL(url).hostname).toBe("git.drupalcode.org");
    }
    for (const [url] of fetch.mock.calls) {
      expect(url).not.toContain("secret");
    }
  });

  it("forgets the token", async () => {
    window.localStorage.setItem(STORAGE_KEY, "secret");
    vi.stubGlobal("fetch", vi.fn(apiFetch));
    const user = userEvent.setup();
    render(<MyProjects filtersSlot={null} actionsSlot={null} />);

    await user.click(screen.getByRole("button", { name: "Forget my token" }));

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(screen.getByLabelText("GitLab token")).toBeInTheDocument();
  });

  it("offers every project in the Project filter, even with no issues loaded", async () => {
    window.localStorage.setItem(STORAGE_KEY, "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.includes("/groups/project/projects")) {
          return Promise.resolve(
            jsonResponse([gitlabProject("canvas", true), gitlabProject("quiet", true), gitlabProject("entity", false)])
          );
        }
        return url.includes("project%2Fquiet/issues") ? Promise.resolve(jsonResponse([])) : apiFetch(url);
      })
    );

    render(<MyProjects filtersSlot={null} actionsSlot={null} />);

    const filter = await screen.findByLabelText("Project");
    expect(within(filter).getAllByRole("option").map((option) => option.textContent)).toEqual([
      "All",
      "canvas",
      "entity",
      "quiet",
    ]);
  });

  it("shows postponed issues in their own column", async () => {
    window.localStorage.setItem(STORAGE_KEY, "secret");
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        url.includes("project%2Fcanvas/issues")
          ? Promise.resolve(
              jsonResponse([
                {
                  iid: 400,
                  title: "GitLab 400",
                  web_url: "https://git.drupalcode.org/project/canvas/-/work_items/400",
                  labels: ["state::postponed"],
                  assignees: [],
                },
              ])
            )
          : apiFetch(url)
      )
    );

    render(<MyProjects filtersSlot={null} actionsSlot={null} />);

    expect(await within(await screen.findByRole("region", { name: /^Postponed/ })).findByText("GitLab 400")).toBeInTheDocument();
  });

  it("drops a token GitLab rejects, and says so", async () => {
    window.localStorage.setItem(STORAGE_KEY, "expired");
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 401, headers: new Headers() })));

    render(<MyProjects filtersSlot={null} actionsSlot={null} />);

    expect(await screen.findByText(/GitLab didn't accept that token/)).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("accepts a new token after GitLab rejects one", async () => {
    window.localStorage.setItem(STORAGE_KEY, "expired");
    vi.stubGlobal(
      "fetch",
      vi.fn((url, options) =>
        options?.headers?.["PRIVATE-TOKEN"] === "expired"
          ? Promise.resolve({ ok: false, status: 401, headers: new Headers() })
          : apiFetch(url)
      )
    );
    const user = userEvent.setup();
    render(<MyProjects filtersSlot={null} actionsSlot={null} />);
    await screen.findByText(/GitLab didn't accept that token/);

    await user.type(screen.getByLabelText("GitLab token"), "fresh");
    await user.click(screen.getByRole("button", { name: "Show my projects" }));

    expect(await within(await screen.findByRole("region", { name: /^Active/ })).findByText("GitLab 300")).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("fresh");
    expect(screen.queryByText(/GitLab didn't accept that token/)).not.toBeInTheDocument();
  });

  it("keeps the token when GitLab fails for another reason", async () => {
    window.localStorage.setItem(STORAGE_KEY, "secret");
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 503, headers: new Headers() })));

    render(<MyProjects filtersSlot={null} actionsSlot={null} />);

    expect(await screen.findByText(/Couldn't load your projects/)).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("secret");
  });

  it("says so when the account maintains nothing", async () => {
    window.localStorage.setItem(STORAGE_KEY, "secret");
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse([]))));

    render(<MyProjects filtersSlot={null} actionsSlot={null} />);

    expect(await screen.findByText(/doesn't maintain any projects/)).toBeInTheDocument();
  });
});
