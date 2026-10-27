import { createRoot } from "react-dom/client";
import Board from "./Board";
import Roulette from "./Roulette";

// The board shell component renders the configuration and empty columns, and
// the island replaces the columns once it loads issues.
for (const element of document.querySelectorAll("[data-board]")) {
  const config = JSON.parse(element.dataset.board);
  const shell = element.closest(".board-shell");
  const filtersSlot = shell?.querySelector("[data-board-filters]") ?? null;
  const rouletteLink = shell?.querySelector(".board-shell__roulette") ?? null;
  const embed = shell?.classList.contains("board-shell--embed") ?? false;
  createRoot(element).render(
    <Board config={config} filtersSlot={filtersSlot} rouletteLink={rouletteLink} embed={embed} />
  );
}

// The issue roulette component renders the tags in data-roulette, and the
// island renders the tag picker, the filters, and the strip.
for (const element of document.querySelectorAll("[data-roulette]")) {
  const config = JSON.parse(element.dataset.roulette);
  const filtersSlot = element.closest(".issue-roulette")?.querySelector("[data-roulette-filters]") ?? null;
  createRoot(element).render(<Roulette config={config} filtersSlot={filtersSlot} />);
}
