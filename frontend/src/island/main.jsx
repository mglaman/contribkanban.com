import { createRoot } from "react-dom/client";
import Board from "./Board";

// The board shell component renders the configuration and empty columns, and
// the island replaces the columns once it loads issues.
for (const element of document.querySelectorAll("[data-board]")) {
  const config = JSON.parse(element.dataset.board);
  const filtersSlot = element.closest(".board-shell")?.querySelector("[data-board-filters]") ?? null;
  createRoot(element).render(<Board config={config} filtersSlot={filtersSlot} />);
}
