import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useListIssues, useWorkItems } from "./Board";
import Card from "./Card";
import { issueProject } from "./filters";
import { fetchLabeledWorkItems, filterIssues } from "./gitlab";

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
 * tag, by priority, and every GitLab work item with its label. Issues someone
 * is assigned to stay off the strip.
 *
 * @param {{label: string, tid: string}} tag
 * @param {Set<string>} movedProjects Node IDs of projects on GitLab.
 * @returns {{state: string, issues: object[]}}
 */
function usePool(tag, movedProjects) {
  const list = useMemo(
    () => ({ statuses: STATUSES, projects: [], tags: [tag.tid], versions: [], component: null }),
    [tag.tid]
  );
  const drupalorg = useListIssues(list, null, null);
  const workItems = useWorkItems(fetchLabeledWorkItems, tag.label);
  return useMemo(() => {
    const gitlab = filterIssues(workItems.issues, { statuses: STATUSES, category: null, priority: null, version: [] });
    const gitlabNids = new Set(gitlab.map((issue) => issue.nid));
    const fromDrupalOrg = drupalorg.issues.filter(
      (issue) => !gitlabNids.has(issue.nid) && !movedProjects.has(issue.field_project?.id)
    );
    const states = [drupalorg.state, workItems.state];
    const state = states.includes("error") ? "error" : states.includes("loading") ? "loading" : "ok";
    const issues = gitlab.concat(fromDrupalOrg).filter((issue) => !issue.field_issue_assigned);
    return { state, issues };
  }, [drupalorg, workItems, movedProjects]);
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
 * @param {{label: string, tid: string}} props.tag
 * @param {Set<string>} props.movedProjects
 */
function RouletteStrip({ tag, movedProjects }) {
  const pool = usePool(tag, movedProjects);
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
    message = "No open issues with this tag right now.";
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
 * The issue roulette island.
 *
 * @param {object} props
 * @param {object} props.config The roulette configuration from the component.
 * @param {Element|null} props.filtersSlot Where the component wants the tag picker.
 */
function Roulette({ config, filtersSlot }) {
  const [label, setLabel] = useState(() => initialTag(config.tags, window.location.search));
  const moved = useMemo(() => new Set(config.movedProjects.map(String)), [config.movedProjects]);
  const tag = config.tags.find((candidate) => candidate.label === label) ?? null;

  // A picked tag goes in the URL, so a roulette can be shared.
  function pickTag(value) {
    setLabel(value);
    const params = new URLSearchParams(window.location.search);
    params.set("tag", value);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params}${window.location.hash}`);
  }

  const picker = config.tags.length ? (
    <div className="board-filters">
      <label className="board-filters__field">
        Tag
        <select className="board-filters__select" value={label} onChange={(event) => pickTag(event.target.value)}>
          {config.tags.map(({ label: option }) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  ) : null;

  return (
    <>
      {filtersSlot ? createPortal(picker, filtersSlot) : picker}
      {tag ? (
        // Keyed by tag, so a new tag resets the roll and the re-rolls.
        <RouletteStrip key={tag.label} tag={tag} movedProjects={moved} />
      ) : (
        <p className="roulette__message">There are no tag boards to roll from yet.</p>
      )}
    </>
  );
}
export default Roulette;
