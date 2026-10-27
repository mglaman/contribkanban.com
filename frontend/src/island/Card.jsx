import { useState } from "react";
import { issueProject } from "./filters";

const CATEGORIES = {
  1: "Bug",
  2: "Task",
  3: "Feature",
  4: "Support",
  5: "Plan",
};

// Cards only show priorities that need attention.
const PRIORITIES = {
  400: "Critical",
  300: "Major",
};

/**
 * Who an issue is assigned to: their avatar from GitLab, or else an icon.
 *
 * @param {object} props
 * @param {{username: string, avatarUrl: string|null}|null} props.assignee The
 *   GitLab assignee. Drupal.org issues have none.
 */
function Assignee({ assignee }) {
  // An avatar that fails to load falls back to the icon.
  const [broken, setBroken] = useState(false);
  const label = assignee ? `Assigned to ${assignee.username}` : "Assigned";
  if (assignee?.avatarUrl && !broken) {
    return (
      <img
        className="issue-card__assignee issue-card__assignee--avatar"
        src={assignee.avatarUrl}
        alt={label}
        width="24"
        height="24"
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span className="issue-card__assignee" role="img" aria-label={label}>
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="4" r="2.25" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1.75 10.5c.6-2 2.3-3 4.25-3s3.65 1 4.25 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * An issue on the board.
 *
 * @param {object} props
 * @param {object} props.issue An issue from drupal.org, or a work item from toDrupalOrgIssue().
 * @param {boolean} [props.showProject] Whether to name the issue's project.
 */
function Card({ issue, showProject = false }) {
  const category = CATEGORIES[issue.field_issue_category];
  const priority = PRIORITIES[issue.field_issue_priority];
  const project = showProject ? issueProject(issue) : null;
  return (
    <article className="issue-card">
      {project ? <span className="issue-card__project">{project}</span> : null}
      <a className="issue-card__title" href={issue.url} target="_blank" rel="noreferrer">
        {issue.title}
      </a>
      <div className="issue-card__meta">
        {category ? (
          <span className={`issue-card__category issue-card__category--${category.toLowerCase()}`}>
            {category}
          </span>
        ) : null}
        {priority ? (
          <span className={`issue-card__priority issue-card__priority--${priority.toLowerCase()}`}>
            {priority}
          </span>
        ) : null}
        <span className="issue-card__number">#{issue.nid}</span>
        {issue.field_issue_assigned ? <Assignee assignee={issue.assignee ?? null} /> : null}
      </div>
    </article>
  );
}
export default Card;
