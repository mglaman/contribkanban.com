import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

test("renders without crashing", () => {
  const { getByText } = render(<App />);
  expect(getByText("Welcome to Contrib Kanban!")).toBeInTheDocument();
});
