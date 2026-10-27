import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { inProject, useListIssues, useProjectNid, useProjects, useWorkItems } from "./Board";
import Card from "./Card";
import Filters, { byName } from "./Filters";
import { filterIds, issueProject, matchesText, readFilters, writeFilters } from "./filters";
import { fetchLabeledWorkItems, fetchOpenWorkItems, filterIssues } from "./gitlab";

// Issues someone can pick up: Active, Needs work, and Needs review.
const STATUSES = ["1", "13", "8"];

const STATUS_LABELS = {
  "1": { label: "Active", tone: "active" },
  "13": { label: "Needs work", tone: "needs-work" },
  "8": { label: "Needs review", tone: "needs-review" },
};

// Cards on the strip, sampled from the pool.
const STRIP_SIZE = 24;

const ROLL_MS = 3600;
// Time for the browser to paint the jump back before the roll starts.
const JUMP_MS = 40;
// The intro in issue-roulette.twig says three.
const REROLLS = 3;
const CONFETTI = 22;

const IDLE = { phase: "idle", strip: null, index: null, animate: false, used: 0, rolls: 0 };

// A stable empty list, so a skipped load doesn't recompute the pool.
const NO_ISSUES = [];

// Someone already works on an assigned issue.
const unassigned = (issue) => !issue.field_issue_assigned;

/**
 * Combines the states of the loads behind a pool.
 *
 * @param {string[]} states
 * @returns {"loading"|"ok"|"error"}
 */
const poolState = (states) => (states.includes("error") ? "error" : states.includes("loading") ? "loading" : "ok");

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/**
 * Picks up to `size` issues at random.
 *
 * @param {object[]} issues
 * @param {number} size
 * @returns {object[]}
 */
function sample(issues, size) {
  const shuffled = [...issues];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, size);
}

/**
 * Full laps a roll travels. Short strips take more, so each roll passes at
 * least STRIP_SIZE cards.
 *
 * @param {number} count Issues on the strip.
 * @returns {number}
 */
const laps = (count) => Math.max(3, Math.ceil(STRIP_SIZE / count));

/**
 * Picks the tag in the URL, or Novice, or the first tag.
 *
 * @param {{label: string}[]} tags
 * @param {string} search
 * @returns {string|null}
 */
function initialTag(tags, search) {
  const wanted = new URLSearchParams(search).get("tag")?.toLowerCase();
  const tag =
    tags.find(({ label }) => label.toLowerCase() === wanted) ??
    tags.find(({ label }) => label === "Novice") ??
    tags[0];
  return tag?.label ?? null;
}

/**
 * Loads the issues to roll for: the first page of drupal.org issues with the
 * tag, by priority, and every GitLab work item with its label. Like a tag
 * board, the Project filter queries drupal.org by the project's node ID.
 * Issues someone is assigned to stay off the strip.
 *
 * @param {{label: string, tid: string|null}} tag
 * @param {Set<string>} movedProjects Node IDs of projects on GitLab.
 * @param {{category: string|null, priority: string|null, project: string|null, text: string}} filters
 * @returns {{state: string, issues: object[]}}
 */
function useTagPool(tag, movedProjects, { category, priority, project, text }) {
  const list = useMemo(
    () => ({ statuses: STATUSES, projects: [], tags: [tag.tid], versions: [], component: null }),
    [tag.tid]
  );
  const projectNid = useProjectNid(project);
  // A GitLab label has no drupal.org tag, and a project drupal.org doesn't
  // know has no drupal.org issues to load.
  const enabled = tag.tid !== null && (!project || projectNid.nid !== null);
  const loaded = useListIssues(list, category, priority, projectNid.nid, enabled);
  const drupalorg = enabled
    ? loaded
    : { state: tag.tid === null ? "ok" : projectNid.state, issues: NO_ISSUES };
  const workItems = useWorkItems(fetchLabeledWorkItems, tag.label);
  return useMemo(() => {
    const gitlab = filterIssues(workItems.issues, { statuses: STATUSES, category, priority, version: [] }).filter(
      inProject(project)
    );
    const gitlabNids = new Set(gitlab.map((issue) => issue.nid));
    const fromDrupalOrg = drupalorg.issues.filter(
      (issue) => !gitlabNids.has(issue.nid) && !movedProjects.has(issue.field_project?.id)
    );
    return {
      state: poolState([drupalorg.state, workItems.state]),
      issues: gitlab
        .concat(fromDrupalOrg)
        .filter((issue) => unassigned(issue) && matchesText(issue, text)),
    };
  }, [drupalorg.state, drupalorg.issues, workItems, movedProjects, category, priority, project, text]);
}

/**
 * Loads the issues to roll for in one project: every GitLab work item for a
 * project on GitLab, or else the first page of drupal.org issues by priority.
 * Issues someone is assigned to stay off the strip.
 *
 * @param {{nid: string|null, gitlabProject: string|null}} project
 * @param {{category: string|null, priority: string|null, milestone: string|null, text: string}} filters
 * @returns {{pool: {state: string, issues: object[]}, milestones: string[]}}
 */
function useProjectPool(project, { category, priority, milestone, text }) {
  const list = useMemo(
    () => ({ statuses: STATUSES, projects: project.nid ? [project.nid] : [], tags: [], versions: [], component: null }),
    [project.nid]
  );
  // A project on GitLab keeps its drupal.org issues frozen, so it loads only one.
  const drupalorg = useListIssues(list, category, priority, null, !project.gitlabProject && project.nid !== null);
  const workItems = useWorkItems(fetchOpenWorkItems, project.gitlabProject);
  const milestones = useMemo(
    () => [...new Set(workItems.issues.map((issue) => issue.milestone).filter(Boolean))].sort(byName),
    [workItems.issues]
  );
  const pool = useMemo(() => {
    const open = (issue) => unassigned(issue) && matchesText(issue, text);
    if (!project.gitlabProject) {
      return { state: drupalorg.state, issues: drupalorg.issues.filter(open) };
    }
    const filter = { statuses: STATUSES, category, priority, version: [], milestone };
    return { state: workItems.state, issues: filterIssues(workItems.issues, filter).filter(open) };
  }, [project.gitlabProject, drupalorg, workItems, category, priority, milestone, text]);
  return { pool, milestones };
}

/**
 * The dice on the buttons that roll.
 */
function Dice() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" />
      <circle cx="11" cy="11" r="1.4" fill="currentColor" />
      <circle cx="14.5" cy="14.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Confetti that bursts from the marker, laid out differently on each roll.
 *
 * @param {object} props
 * @param {number} props.roll The roll number.
 */
function Confetti({ roll }) {
  return (
    <div className="roulette__confetti" aria-hidden="true">
      {Array.from({ length: CONFETTI }, (_, c) => {
        const angle = (c / CONFETTI) * Math.PI * 2 + (roll % 5) * 0.3;
        const distance = 120 + ((c * 37 + roll * 13) % 140);
        return (
          <span
            key={c}
            className="roulette__confetto"
            style={{
              width: c % 3 ? 8 : 6,
              height: c % 2 ? 12 : 8,
              borderRadius: c % 4 ? 2 : "50%",
              animationDuration: `${0.8 + (c % 5) * 0.08}s`,
              "--dx": `${Math.round(Math.cos(angle) * distance * 1.8)}px`,
              "--dy": `${Math.round(Math.sin(angle) * distance * 0.6)}px`,
              "--r": `${((c * 97) % 540) - 270}deg`,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * The strip of issues with one tag, and the buttons that roll it.
 *
 * @param {object} props
 * @param {{state: string, issues: object[]}} props.pool The issues to roll for.
 * @param {string} props.empty The message when there are none.
 */
function RouletteStrip({ pool, empty }) {
  const [roll, setRoll] = useState(IDLE);
  const timers = useRef([]);
  const issueLink = useRef(null);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const strip = roll.strip ?? pool.issues.slice(0, STRIP_SIZE);
  const count = strip.length;
  // Starts on the second lap, so cards fill the strip on both sides.
  const index = roll.index ?? count;
  const landed = roll.phase === "landed";
  const pick = landed ? strip[index % count] : null;
  const rerollsLeft = REROLLS - roll.used;

  // The issue link replaces the Roll button, so it takes the button's focus.
  useEffect(() => {
    if (landed && document.activeElement === document.body) {
      issueLink.current?.focus();
    }
  }, [landed]);
  const canRoll = pool.state === "ok" && count > 0;
  const canReroll = landed && rerollsLeft > 0 && count > 1;

  function start() {
    const reroll = landed;
    if (reroll ? !canReroll : roll.phase === "rolling" || !canRoll) {
      return;
    }
    const next = reroll ? strip : sample(pool.issues, STRIP_SIZE);
    const from = next.length + (reroll ? index % next.length : 0);
    let target = from + next.length * laps(next.length) + Math.floor(Math.random() * next.length);
    // A re-roll lands on another issue.
    if (reroll && target % next.length === from % next.length) {
      target += 1 + Math.floor(Math.random() * (next.length - 1));
    }
    const rolled = { strip: next, used: reroll ? roll.used + 1 : 0, rolls: roll.rolls + 1 };
    if (prefersReducedMotion()) {
      setRoll({ ...rolled, phase: "landed", index: target, animate: false });
      return;
    }
    // Jumps back to the second lap, then animates forward from there.
    setRoll({ ...rolled, phase: "rolling", index: from, animate: false });
    timers.current.push(
      setTimeout(() => {
        setRoll((current) => ({ ...current, index: target, animate: true }));
        timers.current.push(setTimeout(() => setRoll((current) => ({ ...current, phase: "landed" })), ROLL_MS));
      }, JUMP_MS)
    );
  }

  let message = null;
  if (pool.state === "loading" && count === 0) {
    message = "Loading issues…";
  } else if (pool.state === "error") {
    message = "Couldn't load issues.";
  } else if (count === 0) {
    message = empty;
  }

  // Laps: one left of the start, the start lap, laps(count) rolled, one for
  // the landing offset, and one to fill the strip right of the marker.
  const slots = [];
  for (let lap = 0; count > 0 && lap < laps(count) + 4; lap++) {
    strip.forEach((issue, i) => {
      const status = STATUS_LABELS[issue.field_issue_status];
      const hit = landed && lap * count + i === index;
      slots.push(
        <div key={`${lap}:${issue.url}`} className={`roulette__slot${hit ? " roulette__slot--hit" : ""}`}>
          {status ? (
            <span className={`roulette__status roulette__status--${status.tone}`}>{status.label}</span>
          ) : null}
          <Card issue={issue} showProject />
        </div>
      );
    });
  }

  const trackClasses = ["roulette__track"];
  if (roll.animate) {
    trackClasses.push("roulette__track--animate");
  }
  if (roll.phase === "rolling" && roll.animate) {
    trackClasses.push("roulette__track--rolling");
  }

  return (
    <div className={`roulette${landed ? " roulette--landed" : ""}`}>
      <div className="roulette__window">
        {message ? (
          <p className="roulette__message">{message}</p>
        ) : (
          <div
            className={trackClasses.join(" ")}
            inert
            style={{ "--roulette-index": index, "--roulette-roll": `${ROLL_MS}ms` }}
          >
            {slots}
          </div>
        )}
        {landed ? <Confetti key={roll.rolls} roll={roll.rolls} /> : null}
        <div className="roulette__line" aria-hidden="true" />
        <svg className="roulette__marker roulette__marker--top" viewBox="0 0 28 18" width="28" height="18" aria-hidden="true">
          <path d="M1 1h26L14 17z" />
        </svg>
        <svg className="roulette__marker roulette__marker--bottom" viewBox="0 0 28 18" width="28" height="18" aria-hidden="true">
          <path d="M1 17h26L14 1z" />
        </svg>
      </div>

      <div className="roulette__actions">
        <div className="roulette__buttons">
          {landed ? (
            <a ref={issueLink} className="roulette__roll" href={pick.url} target="_blank" rel="noreferrer">
              Go to the issue
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3h7v7M13 3L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <button
              type="button"
              className="roulette__roll"
              onClick={start}
              disabled={roll.phase === "idle" && !canRoll}
              aria-disabled={roll.phase === "rolling"}
            >
              <Dice />
              {roll.phase === "rolling" ? "Rolling…" : "Roll"}
            </button>
          )}
          {/* Stays while a re-roll rolls, so it keeps focus. */}
          {landed || roll.used > 0 ? (
            <button type="button" className="roulette__reroll" onClick={start} aria-disabled={!canReroll}>
              <Dice />
              Re-roll
              <span className="roulette__pips" role="img" aria-label={`${rerollsLeft} of ${REROLLS} re-rolls left`}>
                {Array.from({ length: REROLLS }, (_, i) => (
                  <span key={i} className={`roulette__pip${i < rerollsLeft ? " roulette__pip--left" : ""}`} />
                ))}
              </span>
            </button>
          ) : null}
        </div>
        {!landed && count > 0 ? (
          <p className="roulette__hint">{count === 1 ? "1 issue on the strip." : `${count} issues on the strip.`}</p>
        ) : null}
        <p className="visually-hidden" role="status">
          {landed ? `Landed on ${pick.title}, in ${issueProject(pick)}.` : ""}
        </p>
      </div>
    </div>
  );
}

/**
 * Replaces the query string, so a roulette can be shared.
 *
 * @param {string} query The query string without its leading `?`.
 */
function replaceQuery(query) {
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
  );
}

/**
 * Keeps the roulette's filters in the URL, like a board's.
 *
 * A board's "Roll for an issue" link carries its filters, so the roulette
 * rolls within them.
 *
 * @param {object} options
 * @param {boolean} options.forProject Whether `project` names the project
 *   board to roll for, rather than filtering a tag's issues.
 * @param {boolean} options.gitlab Whether milestones apply.
 * @param {string|null} [options.tag] The picked tag. It always goes in the URL,
 *   since `project` without a tag names a project board.
 * @returns {[object, Function]} The filters and their setter.
 */
function useUrlFilters({ forProject, gitlab, tag = null }) {
  const [filters, setFilters] = useState(() => {
    const read = readFilters(window.location.search);
    return { ...read, project: forProject ? null : read.project, milestone: gitlab ? read.milestone : null };
  });
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const project = forProject ? params.get("project") : filters.project;
    if (tag) {
      params.set("tag", tag);
    }
    replaceQuery(writeFilters({ ...filters, project }, params.toString()));
  }, [forProject, tag, filters]);
  return [filters, setFilters];
}

/**
 * Whether any filter narrows the roulette.
 *
 * @param {object} filters
 * @returns {boolean}
 */
const isFiltered = (filters) =>
  Boolean(filters.type || filters.priority || filters.project || filters.milestone || filters.text.trim());

/**
 * The strip for one tag.
 *
 * @param {object} props
 * @param {{label: string, tid: string|null}} props.tag
 * @param {Set<string>} props.movedProjects
 * @param {object} props.filters
 * @param {(issues: object[]) => void} props.onIssues Receives the loaded issues, for the Project filter.
 */
function TagStrip({ tag, movedProjects, filters, onIssues }) {
  const pool = useTagPool(tag, movedProjects, { ...filterIds(filters), project: filters.project, text: filters.text });
  useEffect(() => onIssues(pool.issues), [pool.issues, onIssues]);
  return (
    <RouletteStrip
      pool={pool}
      empty={isFiltered(filters) ? "No open issues with this tag match the filters." : "No open issues with this tag right now."}
    />
  );
}

/**
 * Rolls for an issue in one project, within a milestone on GitLab.
 *
 * @param {object} props
 * @param {{label: string, nid: string|null, gitlabProject: string|null}} props.project
 * @param {Element|null} props.filtersSlot Where the component wants the filters.
 */
function ProjectRoulette({ project, filtersSlot }) {
  const [filters, setFilters] = useUrlFilters({ forProject: true, gitlab: Boolean(project.gitlabProject) });
  const { pool, milestones } = useProjectPool(project, {
    ...filterIds(filters),
    milestone: filters.milestone,
    text: filters.text,
  });

  const toolbar = (
    <Filters filters={filters} onChange={setFilters} milestones={project.gitlabProject ? milestones : null} />
  );
  return (
    <>
      {filtersSlot ? createPortal(toolbar, filtersSlot) : toolbar}
      {/* Keyed by the filters, so new filters reset the roll and the re-rolls. */}
      <RouletteStrip
        key={JSON.stringify(filters)}
        pool={pool}
        empty={isFiltered(filters) ? "No open issues match the filters." : `No open ${project.label} issues right now.`}
      />
    </>
  );
}

/**
 * The issue roulette island.
 *
 * @param {object} props
 * @param {object} props.config The roulette configuration from the component.
 * @param {Element|null} props.filtersSlot Where the component wants the picker and filters.
 */
function Roulette({ config, filtersSlot }) {
  return config.project ? (
    <ProjectRoulette project={config.project} filtersSlot={filtersSlot} />
  ) : (
    <TagRoulette config={config} filtersSlot={filtersSlot} />
  );
}

/**
 * Rolls for an issue with one of the tag boards' tags.
 *
 * @param {object} props
 * @param {object} props.config The roulette configuration from the component.
 * @param {Element|null} props.filtersSlot Where the component wants the tag picker and filters.
 */
function TagRoulette({ config, filtersSlot }) {
  const [label, setLabel] = useState(() => initialTag(config.tags, window.location.search));
  const [filters, setFilters] = useUrlFilters({ forProject: false, gitlab: false, tag: label });
  const projects = useProjects();
  const moved = useMemo(() => new Set(config.movedProjects.map(String)), [config.movedProjects]);
  const tag = config.tags.find((candidate) => candidate.label === label) ?? null;

  const toolbar = config.tags.length ? (
    <div className="board-filters">
      <label className="board-filters__field">
        Tag
        <select className="board-filters__select" value={label} onChange={(event) => setLabel(event.target.value)}>
          {config.tags.map(({ label: option }) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <Filters filters={filters} onChange={setFilters} projects={projects.names} />
    </div>
  ) : null;

  return (
    <>
      {filtersSlot ? createPortal(toolbar, filtersSlot) : toolbar}
      {tag ? (
        // Keyed by tag and filters, so either resets the roll and the re-rolls.
        <TagStrip
          key={`${tag.label}:${JSON.stringify(filters)}`}
          tag={tag}
          movedProjects={moved}
          filters={filters}
          onIssues={projects.add}
        />
      ) : (
        <p className="roulette__message">There are no tag boards to roll from yet.</p>
      )}
    </>
  );
}
export default Roulette;
