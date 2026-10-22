import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import {
  renderApp,
  mockFetch,
  jsonResponse,
  requestedUrls,
  currentPath,
} from "../../test-utils";

function boardsPage(titles, links = {}) {
  return {
    data: titles.map((title) => ({
      type: "board--drupalorg_project",
      id: `uuid-${title}`,
      attributes: { title, machine_name: title.toLowerCase() },
    })),
    links,
  };
}

const NEXT_HREF = "http://api.test/jsonapi/index/boards?page[offset]=10";

describe("Home page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lists boards linked by machine name", async () => {
    mockFetch([
      {
        url: /\/jsonapi\/index\/boards\?sort=title&page\[limit\]=10$/,
        respond: () => jsonResponse(boardsPage(["Address", "Pathauto"])),
      },
    ]);
    renderApp("/");

    expect(
      screen.getByText("Welcome to Contrib Kanban!")
    ).toBeInTheDocument();
    const link = await screen.findByRole("link", { name: "Pathauto" });
    expect(link).toHaveAttribute("href", "/board/pathauto");
    expect(screen.getByRole("link", { name: "Address" })).toBeInTheDocument();
    expect(document.title).toBe("All boards - ContribKanban");
  });

  it("filters by board type from the route", async () => {
    const fetchMock = mockFetch([
      {
        url: /\/jsonapi\/index\/boards\?/,
        respond: () => jsonResponse(boardsPage(["Gin Admin Theme"])),
      },
    ]);
    renderApp("/boards/project");

    await screen.findByRole("link", { name: "Gin Admin Theme" });
    expect(requestedUrls(fetchMock)).toContainEqual(
      expect.stringContaining("filter[board_type]=drupalorg_project")
    );
  });

  it("searches boards by title", async () => {
    const fetchMock = mockFetch([
      {
        url: /filter\[fulltext\]=path/,
        respond: () => jsonResponse(boardsPage(["Pathauto"])),
      },
      {
        url: /\/jsonapi\/index\/boards\?/,
        respond: () => jsonResponse(boardsPage(["Address", "Pathauto"])),
      },
    ]);
    const { user } = renderApp("/");
    await screen.findByRole("link", { name: "Address" });

    await user.type(screen.getByLabelText("Search"), "path");

    await waitFor(() =>
      expect(
        screen.queryByRole("link", { name: "Address" })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("link", { name: "Pathauto" })).toBeInTheDocument();
    expect(requestedUrls(fetchMock)).toContainEqual(
      expect.stringContaining("filter[fulltext]=path")
    );
  });

  it("pages through results with the JSON:API links", async () => {
    mockFetch([
      {
        url: /page\[offset\]=10/,
        respond: () => jsonResponse(boardsPage(["Webform"])),
      },
      {
        url: /\/jsonapi\/index\/boards\?/,
        respond: () =>
          jsonResponse(
            boardsPage(["Address"], { next: { href: NEXT_HREF } })
          ),
      },
    ]);
    const { user } = renderApp("/");
    await screen.findByRole("link", { name: "Address" });

    const [topPager] = screen.getAllByRole("group");
    expect(
      within(topPager).getByRole("button", { name: "Previous" })
    ).toBeDisabled();
    await user.click(within(topPager).getByRole("button", { name: "Next" }));

    expect(
      await screen.findByRole("link", { name: "Webform" })
    ).toBeInTheDocument();
  });

  it("shows an error when the board index fails", async () => {
    mockFetch([
      {
        url: /\/jsonapi\/index\/boards\?/,
        respond: () => jsonResponse({}, 500),
      },
    ]);
    renderApp("/");
    expect(await screen.findByText("Error!")).toBeInTheDocument();
  });

  it("navigates to a board when a listing is clicked", async () => {
    mockFetch([
      {
        url: /\/jsonapi\/index\/boards\?sort=title/,
        respond: () => jsonResponse(boardsPage(["Pathauto"])),
      },
      {
        url: /filter\[machine_name\]=pathauto/,
        respond: () => jsonResponse({ data: [] }),
      },
    ]);
    const { user } = renderApp("/");
    await user.click(await screen.findByRole("link", { name: "Pathauto" }));
    expect(currentPath()).toBe("/board/pathauto");
  });
});
