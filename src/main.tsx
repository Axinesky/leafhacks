import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initPrefs } from "@/shared/prefs/usePrefs";
import "@fontsource/press-start-2p"; // pixel font, headings / HUD only
import "@fontsource-variable/nunito"; // readable rounded font, body / reading
import "./styles/global.css";

// Apply saved preferences to <html> before the first paint, so there is no flash.
initPrefs();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
