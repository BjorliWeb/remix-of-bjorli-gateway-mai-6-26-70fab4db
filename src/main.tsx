import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { markPrerenderedBoot } from "./lib/prerenderHandoff";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Must run before render: React replaces the prerendered skeleton.
markPrerenderedBoot();
createRoot(document.getElementById("root")!).render(<App />);
