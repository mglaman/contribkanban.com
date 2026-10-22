import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import App from "../App";

test("renders without crashing", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/"]}>
      <ThemeProvider theme={createTheme()}>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  );
  expect(getByText("Welcome to Contrib Kanban!")).toBeInTheDocument();
});
