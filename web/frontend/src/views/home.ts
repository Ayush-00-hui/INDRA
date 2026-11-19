/**
 * Home / Landing Page View.
 * Showcases the 3-step Learn -> Imagine -> Act pedagogical framework
 * and surfaces the three interactive simulation choices.
 */

export function renderHome(container: HTMLElement) {
  container.innerHTML = `
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <div class="nav-brand">
        <div class="nav-logo-icon" style="background: linear-gradient(135deg, #f97316, #0284c7); color: #fff; font-weight: 800;">I</div>
        <span>PROJECT INDRA</span>
        <span class="badge badge-live" style="margin-left: 8px;">Indian Urban Robotics</span>
      </div>
      <nav class="nav-links">
        <a href="#/" class="active">Simulations</a>
        <a href="#/intelligence">Intelligence Dashboard</a>
        <a href="#/results">Accreditation Results</a>
        <a href="#/about">Architecture & Tech</a>
      </nav>
    </header>

    <main class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="glass-pill hero-badge">
          <span style="color: var(--accent-cyan); font-weight: 700;">● Model-Based Predictive Autonomy</span>
          <span style="color: var(--text-dim);">|</span>
          <span>Indian Neural Dynamics, Reasoning & Autonomy</span>
        </div>
        <h1 class="hero-title">PROJECT INDRA: Learn, Imagine, Act</h1>
        <p class="hero-subtitle">
          Instead of reacting blindly, INDRA's autonomous ground robot learns an internal neural world model,
          mentally rolls out hundreds of candidate futures in parallel, and navigates high-entropy Indian urban environments safely.
        </p>

        <!-- 3-Step Explainer Strip -->
        <div class="explainer-strip">
          <div class="glass-panel step-card">
            <div class="step-number">Step 01</div>
            <h3 class="step-title">LEARN</h3>
            <p class="step-desc">
              Collect transitions (state, action) &rarr; (next state, reward) to train an epistemic uncertainty-aware neural dynamics model.
            </p>
          </div>
          <div class="glass-panel step-card">
            <div class="step-number">Step 02</div>
            <h3 class="step-title">IMAGINE</h3>
            <p class="step-desc">
              Roll out hundreds of candidate action trajectories 14 steps into the future in 4.2 ms on CUDA without touching physical hardware.
            </p>
          </div>
          <div class="glass-panel step-card">
            <div class="step-number">Step 03</div>
            <h3 class="step-title">ACT</h3>
            <p class="step-desc">
              Execute the first action of the highest-value simulated trajectory, proactively escaping cul-de-sacs and crowded traffic jams.
            </p>
          </div>
        </div>
      </section>

      <!-- Simulation Choices Grid -->
      <section>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h2 style="font-size: 1.4rem; font-weight: 700;">Interactive Simulation Environments</h2>
          <span style="font-size: 0.85rem; color: #38bdf8; font-family: var(--font-mono); font-weight: 600;">Flagship: Project INDRA &middot; Internal Baseline: Warehouse Robotics</span>
        </div>

        <div class="cards-grid">
          <!-- Card 0: Project INDRA (Flagship) -->
          <div class="glass-panel sim-card" style="border: 1px solid rgba(56, 189, 248, 0.4); box-shadow: 0 0 25px rgba(56, 189, 248, 0.1);">
            <div class="sim-card-thumb">
              <img src="./results/web_screenshots/sim_robotics_upgraded.png" alt="Project INDRA Indian Urban Robotics" onerror="this.src='./results/screenshots/hero_menu.png'" />
              <div class="sim-card-badge">
                <span class="badge badge-live" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8;">● PROJECT INDRA &middot; LIVE</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title" style="color: #38bdf8;">PROJECT INDRA: Indian Urban Robotics</h3>
              <div class="sim-card-tagline">"Anticipating unstructured traffic, cattle & monsoon hazards"</div>
              <p class="sim-card-desc">
                India-adapted autonomous UGV simulation. Navigates complex Delhi urban corridors with auto-rickshaws, filtering two-wheelers, sacred cattle, vendor carts, and monsoon waterlogging across 10 benchmark scenarios.
              </p>
              <a href="#/sim/indra" class="btn-launch" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff;">
                <span>Launch Project INDRA Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>

          <!-- Card 1: Robotics Baseline -->
          <div class="glass-panel sim-card">
            <div class="sim-card-thumb">
              <img src="./results/screenshots/hero_split_screen.png" alt="Warehouse Robotics Baseline" onerror="this.src='./results/screenshots/hero_menu.png'" />
              <div class="sim-card-badge">
                <span class="badge badge-replay">● Internal Baseline</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title">Warehouse Robotics Baseline</h3>
              <div class="sim-card-tagline">"Internal baseline for comparative evaluation"</div>
              <p class="sim-card-desc">
                Clean indoor benchmark for testing candidate trajectory rollouts in static U-traps and moving pedestrian scenarios.
              </p>
              <a href="#/sim/robotics" class="btn-launch">
                <span>Launch Baseline Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}
