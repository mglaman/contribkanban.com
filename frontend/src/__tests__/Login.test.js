import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  wait,
} from "@testing-library/react";
import App from "../App";

describe("login form", () => {
  it("logs in and shows me Me page", async () => {
    const { debug, getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    const inputEmail = getByLabelText("Email Address *");
    fireEvent.change(inputEmail, {
      target: { value: "logintest@example.com" },
    });
    const inputPassword = getByLabelText("Password *");
    fireEvent.change(inputPassword, { target: { value: "letmein" } });
    expect(inputPassword.value).toBe("letmein");

    let submitButton = getByText("Sign In").parentElement;
    fireEvent.submit(submitButton.closest("form"));

    try {
      await waitForElementToBeRemoved(() => getByText("Sign In"));
    } catch (err) {
      debug();
      throw err;
    }

    await wait(() => getByText("logintest@example.com"));
  });
});
