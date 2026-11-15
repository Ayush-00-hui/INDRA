/**
 * World Model Web Application Main Entrypoint.
 */

import "./style.css";
import { Router } from "./router";
import { sound } from "./audio/webaudio";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  // Unlock audio context on first click or keypress
  const unlockAudio = () => {
    sound.unlock();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio);
  window.addEventListener("keydown", unlockAudio);

  // Initialize client router
  const router = new Router(appContainer);
  router.init();
});
