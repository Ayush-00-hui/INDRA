/**
 * Client-Side Hash Router.
 * Supports static file:// execution, deep-linking, and clean view teardown.
 */

import { renderHome } from "./views/home";
import { renderSim } from "./views/sim";
import { renderResults } from "./views/results";
import { renderAbout } from "./views/about";
import { renderIntelligence } from "./views/intelligence";

export class Router {
  private container: HTMLElement;
  private currentCleanup: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    window.addEventListener("hashchange", () => this.route());
  }

  public init() {
    this.route();
  }

  private route() {
    // Teardown previous view
    if (this.currentCleanup) {
      this.currentCleanup();
      this.currentCleanup = null;
    }
    if ((this.container as any).cleanup) {
      (this.container as any).cleanup();
      (this.container as any).cleanup = null;
    }

    const hash = window.location.hash.slice(1) || "/";

    if (hash.startsWith("/sim/")) {
      const scenarioId = hash.replace("/sim/", "").split("?")[0];
      renderSim(this.container, scenarioId);
    } else if (hash === "/intelligence") {
      renderIntelligence(this.container);
    } else if (hash === "/results") {
      renderResults(this.container);
    } else if (hash === "/about") {
      renderAbout(this.container);
    } else {
      renderHome(this.container);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }
}
