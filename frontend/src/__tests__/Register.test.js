import React from "react";
import { createMemoryHistory as createHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  wait,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

const createRandomEmail = () => {
  const randomString = Math.random().toString(36).substr(2);
  return `${randomString}@example.com`;
};

// @todo use `import userEvent from "@testing-library/user-event";`
describe("register form", () => {
  beforeEach(() => {
    localStorage.removeItem("oauth");
  });
  it("displays passwords much match notice", async () => {
    const { getByLabelText, findByText, queryByText } = render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );
    const inputEmail = getByLabelText("Email Address *");
    inputEmail.value = "test@example.com";
    const inputPassword = getByLabelText("Password *");
    fireEvent.change(inputPassword, { target: { value: "foo" } });
    expect(inputPassword.value).toBe("foo");
    const inputConfirmPassword = getByLabelText("Confirm password *");
    fireEvent.change(inputConfirmPassword, { target: { value: "bar" } });
    expect(inputConfirmPassword.value).toBe("bar");

    await findByText("The passwords do not match");

    inputConfirmPassword.focus();
    fireEvent.change(inputConfirmPassword, { target: { value: "foo" } });
    expect(inputConfirmPassword.value).toBe("foo");
    inputConfirmPassword.blur();

    expect(queryByText("The passwords do not match")).not.toBeInTheDocument();
  });

  it("registers a new user", async () => {
    const history = createHistory({
      initialEntries: ["/register"],
    });
    const { debug, getByLabelText, getByText, queryByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    const testEmail = createRandomEmail();
    fireEvent.change(getByLabelText("Email Address *"), {
      target: { value: testEmail },
    });
    fireEvent.change(getByLabelText("Password *"), {
      target: { value: "foo" },
    });
    fireEvent.change(getByLabelText("Confirm password *"), {
      target: { value: "foo" },
    });

    let submitButton = getByText("Create your account").parentElement;
    expect(submitButton.disabled).toBe(false);
    fireEvent.submit(submitButton.closest("form"));
    submitButton = getByText("Create your account").parentElement;
    expect(submitButton.disabled).toBe(true);

    expect(queryByText("Passwords do not match")).not.toBeInTheDocument();

    try {
      await waitForElementToBeRemoved(() => getByText("Create your account"));
    } catch (err) {
      debug();
      throw err;
    }

    expect(history.location.pathname).toBe("/me");
    await wait(() => getByText(testEmail));
  });

  it("allows multiple registrations", async () => {
    const history = createHistory({
      initialEntries: ["/register"],
    });
    const { debug, getByLabelText, getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    const testEmail1 = createRandomEmail();
    fireEvent.change(getByLabelText("Email Address *"), {
      target: { value: testEmail1 },
    });
    fireEvent.change(getByLabelText("Password *"), {
      target: { value: "foo" },
    });
    fireEvent.change(getByLabelText("Confirm password *"), {
      target: { value: "foo" },
    });
    let submitButton = getByText("Create your account").parentElement;
    fireEvent.submit(submitButton.closest("form"));
    try {
      await waitForElementToBeRemoved(() => getByText("Create your account"));
    } catch (err) {
      debug();
      throw err;
    }
    await wait(() => getByText(testEmail1));

    const menuButton = getByLabelText("menu");
    history.push("/logout");
    history.push("/register");

    const testEmail2 = createRandomEmail();
    fireEvent.change(getByLabelText("Email Address *"), {
      target: { value: testEmail2 },
    });
    fireEvent.change(getByLabelText("Password *"), {
      target: { value: "foo" },
    });
    fireEvent.change(getByLabelText("Confirm password *"), {
      target: { value: "foo" },
    });
    submitButton = getByText("Create your account").parentElement;
    fireEvent.submit(submitButton.closest("form"));
    try {
      await waitForElementToBeRemoved(() => getByText("Create your account"));
    } catch (err) {
      debug();
      throw err;
    }
    await wait(() => getByText(testEmail2));
  });
});
