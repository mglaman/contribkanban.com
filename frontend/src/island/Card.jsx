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
        {issue.field_issue_assigned ? (
          <span className="issue-card__assignee" role="img" aria-label="Assigned">
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="4" r="2.25" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M1.75 10.5c.6-2 2.3-3 4.25-3s3.65 1 4.25 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : null}
      </div>
    </article>
  );
}
export default Card;
