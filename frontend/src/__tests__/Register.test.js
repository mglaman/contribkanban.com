import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import App from "../App";
import Register from "../pages/Register"

test("register form passwords do not match", () => {
  const { container, getById } = render(
    <MemoryRouter initialEntries={["/register"]}>
      <App />
    </MemoryRouter>
  );
});
