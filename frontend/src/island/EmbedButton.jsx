import { useEffect, useRef, useState } from "react";
import { writeFilters } from "./filters";

/**
 * Builds the iframe that embeds a board with its filters.
 *
 * @param {string} path The board's embed path, like `/board/tool/embed`.
 * @param {string} title The board's title, for the iframe's title.
 * @param {object} filters The board's filters.
 * @returns {string}
 */
export function embedCode(path, title, filters) {
  const query = writeFilters(filters, "");
  const src = new URL(`${path}${query ? `?${query}` : ""}`, window.location.origin).href;
  const escaped = title.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `<iframe title="${escaped}" src="${src}" width="100%" height="600"></iframe>`;
}

/**
 * The Embed button, which copies an iframe for the board.
 *
 * Browsers can refuse to copy, so the code shows in a field to copy by hand
 * when they do.
 *
 * @param {object} props
 * @param {string} props.code The iframe to copy.
 */
function EmbedButton({ code }) {
  const [state, setState] = useState("idle");
  const field = useRef(null);

  useEffect(() => {
    if (state === "copied") {
      const timer = setTimeout(() => setState("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (state === "manual") {
      field.current?.focus();
      field.current?.select();
    }
  }, [state]);

  function copy() {
    if (!navigator.clipboard) {
      setState("manual");
      return;
    }
    navigator.clipboard.writeText(code).then(
      () => setState("copied"),
      () => setState("manual")
    );
  }

  return (
    <>
      <button type="button" className="board-shell__embed" onClick={copy}>
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path
            d="M8 6 3 11l5 5M14 6l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {state === "copied" ? "Copied" : "Embed"}
      </button>
      <span className="visually-hidden" role="status">
        {state === "copied" ? "Copied the embed code." : ""}
      </span>
      {state === "manual" ? (
        <textarea
          ref={field}
          className="board-shell__embed-code"
          aria-label="Embed code"
          readOnly
          rows={4}
          value={code}
        />
      ) : null}
    </>
  );
}

export default EmbedButton;
