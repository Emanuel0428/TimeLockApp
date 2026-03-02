import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./style.css";
import { TimerEngine } from "./core/time/TimerEngine";
import { MotionDetector } from "./core/capabilities/MotionDetector";
import { DailyReport } from "./core/metrics/DailyReport";
import { AppLifecycle } from "./core/metrics/AppLifecycle";

// Initialize background services
TimerEngine.initialize();
MotionDetector.start();
DailyReport.initialize();
AppLifecycle.initialize();
AppLifecycle.registerPickup(); // Count this page load as a pickup

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
