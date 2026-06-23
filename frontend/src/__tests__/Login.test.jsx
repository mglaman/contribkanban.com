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
    await userEvent.type(getByLabelText("Email Address *"), "logintest@example.com");
    await userEvent.type(getByLabelText("Password *"), "letmein");

    await userEvent.click(getByText("Sign In"));

    // Element removed immediately upon successful login mock resolution

    await waitFor(() => getByText("logintest@example.com"));
  });
});
