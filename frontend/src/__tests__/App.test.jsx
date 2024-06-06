import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

function mockReactRouterDom() {
  const original = require.requireActual("react-router-dom");
  return {
    ...original,
    useLocation: jest.fn().mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "",
    }),
  };
}

jest.mock("react-router-dom", () => mockReactRouterDom());

test("renders without crashing", () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(getByText("Welcome to Contrib Kanban!")).toBeInTheDocument();
});
