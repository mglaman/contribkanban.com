import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from 'vitest';
import App from "../App";

function mockReactRouterDom() {
  const original = vi.importActual("react-router-dom");
  return {
    ...original,
    MemoryRouter: ({ children }) => <div>{children}</div>,
    Route: ({ children }) => <div>{children}</div>,
    useLocation: vi.fn().mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "",
    }),
  };
}

vi.mock("react-router-dom", async () => mockReactRouterDom());

test("renders without crashing", () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(getByText("Welcome to Contrib Kanban!")).toBeInTheDocument();
});
