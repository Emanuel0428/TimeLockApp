import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./style.css";
import { TimerEngine } from "./core/time/TimerEngine";
import { MotionDetector } from "./core/capabilities/MotionDetector";

// Initialize background timer engine
TimerEngine.initialize();
// Initialize background motion detector
MotionDetector.start();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
