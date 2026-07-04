import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@fontsource/press-start-2p"; // pixel font, headings / HUD only
import "@fontsource-variable/nunito"; // readable rounded font, body / reading
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
