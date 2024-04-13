import {
  render,
  wait,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

describe("login form", () => {
  it("logs in and shows me Me page", async () => {
    const { debug, getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    userEvent.type(getByLabelText("Email Address *"), "logintest@example.com");
    userEvent.type(getByLabelText("Password *"), "letmein");

    let submitButton = getByText("Sign In").parentElement;
    userEvent.click(submitButton);

    try {
      await waitForElementToBeRemoved(() => getByText("Sign In"), { timeout: 5000 });
    } catch (err) {
      debug();
      throw err;
    }

    await wait(() => getByText("logintest@example.com"));
  });
});
