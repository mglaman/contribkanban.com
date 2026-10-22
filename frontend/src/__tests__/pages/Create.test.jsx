import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import {
  renderApp,
  mockFetch,
  jsonResponse,
  currentPath,
  meRoute,
} from "../../test-utils";

const emptyBoard = {
  url: /\/jsonapi\/index\/boards\?filter\[machine_name\]=/,
  respond: () => jsonResponse({ data: [] }),
};

function cardButton(heading) {
  const card = screen
    .getByRole("heading", { name: heading })
    .closest(".MuiCard-root");
  return within(card).getByRole("button");
}

describe("Create page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("validates and creates a project board", async () => {
    let addedMachineName = null;
    mockFetch([
      {
        url: /api-d7\/node\.json\?field_project_machine_name=nope$/,
        respond: () => jsonResponse({ list: [] }),
      },
      {
        url: /api-d7\/node\.json\?field_project_machine_name=pathauto$/,
        respond: () => jsonResponse({ list: [{ nid: "17345" }] }),
      },
      {
        method: "POST",
        url: /\/api\/boards\/add\/pathauto$/,
        respond: () => {
          addedMachineName = "pathauto";
          return jsonResponse({ machine_name: "pathauto" }, 201);
        },
      },
      emptyBoard,
    ]);
    const { user } = renderApp("/create");
    expect(document.title).toBe("Create a new board - ContribKanban");

    await user.click(cardButton("Project board"));
    const dialog = await screen.findByRole("dialog", {
      name: "Create project board",
    });

    await user.click(within(dialog).getByRole("button", { name: "Add board" }));
    expect(
      within(dialog).getByText("Machine name cannot be empty.")
    ).toBeInTheDocument();

    const input = within(dialog).getByLabelText("Project machine name");
    await user.type(input, "nope");
    await user.click(within(dialog).getByRole("button", { name: "Add board" }));
    expect(
      await within(dialog).findByText('Cannot find a project for "nope"')
    ).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "pathauto{Enter}");
    await vi.waitFor(() => expect(currentPath()).toBe("/board/pathauto"));
    expect(addedMachineName).toBe("pathauto");
  });

  it("creates a sprint board from a tag", async () => {
    let postedBody = null;
    mockFetch([
      {
        url: /api-d7\/taxonomy_term\.json\?name=Novice$/,
        respond: () => jsonResponse({ list: [{ tid: "123" }] }),
      },
      {
        method: "POST",
        url: /\/api\/boards\/add\/tag\/Novice$/,
        respond: (url, request, body) => {
          postedBody = body;
          return jsonResponse({ machine_name: "novice" }, 201);
        },
      },
      emptyBoard,
    ]);
    const { user } = renderApp("/create");

    await user.click(cardButton("Sprint board"));
    const dialog = await screen.findByRole("dialog", {
      name: "Create sprint board",
    });
    await user.type(within(dialog).getByLabelText("Tag name"), "Novice");
    await user.click(within(dialog).getByRole("button", { name: "Add board" }));

    await vi.waitFor(() => expect(currentPath()).toBe("/board/novice"));
    expect(postedBody).toEqual({ tid: "123" });
  });

  it("requires a login for issue collection boards", () => {
    mockFetch([]);
    renderApp("/create");
    const button = cardButton("Issue collection board");
    expect(button).toHaveTextContent("Log in to create");
    expect(button).toBeDisabled();
  });

  it("creates an issue collection board when signed in", async () => {
    let postedBody = null;
    mockFetch([
      meRoute,
      {
        method: "POST",
        url: /\/jsonapi\/node_board\/node_board$/,
        respond: (url, request, body) => {
          postedBody = body;
          return jsonResponse({ data: { id: "nb-uuid" } }, 201);
        },
      },
      {
        url: /\/jsonapi\/node_board\/node_board\/nb-uuid$/,
        respond: () =>
          jsonResponse({
            data: {
              id: "nb-uuid",
              attributes: { title: "Mine", collaboration: "shared", nids: [] },
            },
          }),
      },
    ]);
    const { user } = renderApp("/create", { authenticated: true });

    await user.click(cardButton("Issue collection board"));
    const dialog = await screen.findByRole("dialog", {
      name: "Create issue collection",
    });
    await user.type(within(dialog).getByLabelText("Board name"), "Mine");
    await user.click(within(dialog).getByLabelText(/^Shared:/));
    await user.click(within(dialog).getByRole("button", { name: "Add board" }));

    await vi.waitFor(() =>
      expect(currentPath()).toBe("/node-board/nb-uuid/edit")
    );
    expect(postedBody.data.attributes).toEqual({
      title: "Mine",
      collaboration: "shared",
      nids: [],
    });
  });
});
