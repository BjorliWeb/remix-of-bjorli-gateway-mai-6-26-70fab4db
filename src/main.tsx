import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { markPrerenderedBoot } from "./lib/prerenderHandoff";
import { captureRecoveryTokenHash } from "./lib/auth/recoveryLink";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Must run before render: React replaces the prerendered skeleton.
markPrerenderedBoot();
// Must run before render: the first page_view reads location.href.
captureRecoveryTokenHash();
createRoot(document.getElementById("root")!).render(<App />);
