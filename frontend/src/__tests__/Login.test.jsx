import React from "react";
import { MemoryRouter } from "react-router";
import {
  render,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from '@mui/material/styles';
import App from "../App";
import { authWithPasswordGrant, fetchAsAuthenticated } from "../context/auth";

describe("login form", () => {
  it("logs in and shows me Me page", async () => {
    const { debug, getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <ThemeProvider theme={createTheme()}>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    );
    await userEvent.type(getByLabelText("Email Address *"), "logintest@example.com");
    await userEvent.type(getByLabelText("Password *"), "letmein");

    await userEvent.click(getByText("Sign In"));

    try {
      await waitForElementToBeRemoved(() => getByText("Sign In"));
    } catch (err) {
      // debug();
      throw err;
    }

    await waitFor(() => getByText("logintest@example.com"));
  });

  it("gets a token that can create and update an issue collection", async () => {
    const { success, result: tokens } = await authWithPasswordGrant(
      "logintest@example.com",
      "letmein"
    );
    expect(success).toBe(true);

    const res = await fetchAsAuthenticated(
      "/node_board/node_board",
      {
        method: "POST",
        body: JSON.stringify({
          data: {
            type: "node_board--node_board",
            attributes: { title: "Token scope check", collaboration: "private", nids: [] },
          },
        }),
      },
      tokens
    );
    expect(res.status).toBe(201);

    const { data } = await res.json();
    const updated = await fetchAsAuthenticated(
      `/node_board/node_board/${data.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          data: {
            type: "node_board--node_board",
            id: data.id,
            attributes: { title: "Token scope check, renamed" },
          },
        }),
      },
      tokens
    );
    expect(updated.status).toBe(200);
  });
});
