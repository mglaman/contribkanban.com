import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  render,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider,  } from "@mui/styles";
import { createTheme } from '@mui/material/styles';
import App from "../App";

describe("login form", () => {
  it("logs in and shows me Me page", async () => {
    const { debug, getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <ThemeProvider theme={createTheme()}>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    );
    userEvent.type(getByLabelText("Email Address *"), "logintest@example.com");
    userEvent.type(getByLabelText("Password *"), "letmein");

    userEvent.click(getByText("Sign In"));

    try {
      await waitForElementToBeRemoved(() => getByText("Sign In"));
    } catch (err) {
      // debug();
      throw err;
    }

    await waitFor(() => getByText("logintest@example.com"));
  });
});
