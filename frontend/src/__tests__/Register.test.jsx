import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  render,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import App from "../App";

const createRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2);
  return `${randomString}@example.com`;
};

describe("register form", () => {
  beforeEach(() => {
    localStorage.removeItem("oauth");
  });
  it("displays passwords much match notice", async () => {
    const { getByLabelText, findByText, queryByText } = render(
      <MemoryRouter initialEntries={["/register"]}>
        <ThemeProvider theme={createTheme()}>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    );
    const inputEmail = getByLabelText("Email Address *");
    await userEvent.type(inputEmail, "test@example.com");
    const inputPassword = getByLabelText("Password *");
    await userEvent.type(inputPassword, "foo");
    expect(inputPassword).toHaveAttribute("value", "foo");
    const inputConfirmPassword = getByLabelText("Confirm password *");
    await userEvent.type(inputConfirmPassword, "bar");
    expect(inputConfirmPassword).toHaveAttribute("value", "bar");

    await findByText("The passwords do not match");

    await userEvent.type(inputConfirmPassword, "foo");
    expect(inputConfirmPassword).toHaveAttribute("value", "foo");

    expect(queryByText("The passwords do not match")).not.toBeInTheDocument();
  });

  it("registers a new user", async () => {
    const { debug, getByLabelText, getByText, queryByText } = render(
      <MemoryRouter initialEntries={["/register"]}>
        <ThemeProvider theme={createTheme()}>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    );

    const testEmail = createRandomEmail();
    userEvent.type(getByLabelText("Email Address *"), testEmail);
    userEvent.type(getByLabelText("Password *"), "foo");
    userEvent.type(getByLabelText("Confirm password *"), "foo");

    let submitButton = getByText("Create your account");
    expect(submitButton).not.toBeDisabled();
    userEvent.click(submitButton);
    submitButton = getByText("Create your account");
    expect(submitButton).toBeDisabled();

    expect(queryByText("Passwords do not match")).not.toBeInTheDocument();

    try {
      await waitForElementToBeRemoved(() => getByText("Create your account"));
    } catch (err) {
      debug();
      throw err;
    }

    await waitFor(() => getByText(testEmail));
  });

  // it("allows multiple registrations", async () => {
  //   const { debug, getByLabelText, getByText } = render(
  //     <MemoryRouter initialEntries={["/register"]}>
  //       <ThemeProvider theme={createTheme()}>
  //         <App />
  //       </ThemeProvider>
  //     </MemoryRouter>
  //   );
  //   const testEmail1 = createRandomEmail();
  //   userEvent.type(getByLabelText("Email Address *"), testEmail1);
  //   userEvent.type(getByLabelText("Password *"), "foo");
  //   userEvent.type(getByLabelText("Confirm password *"), "foo");
  //   let submitButton = getByText("Create your account");
  //   userEvent.click(submitButton);
  //   try {
  //     await waitForElementToBeRemoved(() => getByText("Create your account"));
  //   } catch (err) {
  //     debug();
  //     throw err;
  //   }
  //   await waitFor(() => getByText(testEmail1));

  //   history.push("/logout");
  //   history.push("/register");

  //   const testEmail2 = createRandomEmail();
  //   userEvent.type(getByLabelText("Email Address *"), testEmail2);
  //   userEvent.type(getByLabelText("Password *"), "bar");
  //   userEvent.type(getByLabelText("Confirm password *"), "bar");
  //   submitButton = getByText("Create your account");
  //   userEvent.click(submitButton);
  //   try {
  //     await waitForElementToBeRemoved(() => getByText("Create your account"));
  //   } catch (err) {
  //     debug();
  //     throw err;
  //   }
  //   await waitFor(() => getByText(testEmail2));
  // });
});
