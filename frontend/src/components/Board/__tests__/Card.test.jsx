import { describe, it, expect } from 'vitest';

import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Card from "../Card";

const mockedIssue = {
  url: `https://www.drupal.org/node/123456789`,
  title: `test issue`,
  nid: `123456789`,
  field_issue_category: `1`,
  field_issue_priority: `100`,
  field_issue_version: `1.x`,
};

describe("test the card component", () => {
  it("click the card opens the issue", async () => {
    const { container } = render(<Card data={mockedIssue} />);
    userEvent.click(container.firstChild);
    expect(mockOpen.mock.calls.length).toBe(1);
    expect(mockOpen.mock.calls[0][0]).toBe(
      `https://www.drupal.org/node/123456789`
    );
  });
  it("displays the issue title and issue number", async () => {
    const { findByText } = render(<Card data={mockedIssue} />);
    await findByText(mockedIssue.title);
  });
  it.each([
    ["400", "Critical"],
    ["300", "Major"],
    ["200", "Normal"],
    ["100", "Minor"],
  ])("displays the priority label: %s, %s", async (value, label) => {
    const testIssue = {
      ...mockedIssue,
      field_issue_priority: value,
    };
    const { findByText } = render(<Card data={testIssue} />);
    await findByText(label);
  });
});
