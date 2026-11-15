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
        <div class="nav-logo-icon">W</div>
        <span>World Model 3D</span>
        <span class="badge badge-live" style="margin-left: 8px;">NBA 2026</span>
      </div>
      <nav class="nav-links">
        <a href="#/" class="active">Simulations</a>
        <a href="#/results">Accreditation Results</a>
        <a href="#/about">Architecture & Tech</a>
      </nav>
    </header>

    <main class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="glass-pill hero-badge">
          <span style="color: var(--accent-cyan); font-weight: 700;">● Model-Based Predictive Control</span>
          <span style="color: var(--text-dim);">|</span>
          <span>National Board of Accreditation Showcase</span>
        </div>
        <h1 class="hero-title">World Model: Learn, Imagine, Act</h1>
        <p class="hero-subtitle">
          Instead of reacting blindly, autonomous systems learn an internal physics model,
          mentally roll out candidate futures in parallel, and choose optimal actions before physical execution.
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
              Roll out hundreds of candidate action trajectories 14 steps into the future in 8.7 ms without touching physical hardware.
            </p>
          </div>
          <div class="glass-panel step-card">
            <div class="step-number">Step 03</div>
            <h3 class="step-title">ACT</h3>
            <p class="step-desc">
              Execute the first action of the highest-value simulated trajectory, completely bypassing local collision traps.
            </p>
          </div>
        </div>
      </section>

      <!-- 3 Simulation Choices Grid -->
      <section>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h2 style="font-size: 1.4rem; font-weight: 700;">Interactive Simulation Environments</h2>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">3 Domains Available</span>
        </div>

        <div class="cards-grid">
          <!-- Card 1: Robotics -->
          <div class="glass-panel sim-card">
            <div class="sim-card-thumb">
              <img src="./results/screenshots/hero_split_screen.png" alt="Warehouse Robotics" onerror="this.src='./results/screenshots/hero_menu.png'" />
              <div class="sim-card-badge">
                <span class="badge badge-live">● LIVE Ready</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title">Autonomous Warehouse Robotics</h3>
              <div class="sim-card-tagline">"Imagining detour paths before moving"</div>
              <p class="sim-card-desc">
                Predictive obstacle evasion & dynamic pedestrian anticipation. World Model MPC achieves 94% win rate in static U-traps and 97% against moving pedestrians.
              </p>
              <a href="#/sim/robotics" class="btn-launch">
                <span>Launch Robotics Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>

          <!-- Card 2: Driving -->
          <div class="glass-panel sim-card">
            <div class="sim-card-thumb">
              <img src="./results/screenshots/hero_menu.png" alt="Highway Driving" />
              <div class="sim-card-badge">
                <span class="badge badge-replay">● Prototype / Replay</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title">Autonomous Highway Driving</h3>
              <div class="sim-card-tagline">"Predicting lead vehicle braking dynamics"</div>
              <p class="sim-card-desc">
                Continuous lane-centering and traffic speed adaptation. Implements the frozen BaseEnv adapter with modular hooks for teammate expansion.
              </p>
              <a href="#/sim/driving" class="btn-launch">
                <span>Launch Driving Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>

          <!-- Card 3: Factory -->
          <div class="glass-panel sim-card">
            <div class="sim-card-thumb">
              <img src="./results/visuals3d/model_sheet_v2.png" alt="Factory Digital Twin" onerror="this.src='./results/screenshots/hero_menu.png'" />
              <div class="sim-card-badge">
                <span class="badge badge-green">● Digital Twin</span>
              </div>
            </div>
            <div class="sim-card-body">
              <h3 class="sim-card-title">Factory-Line Digital Twin</h3>
              <div class="sim-card-tagline">"Predictive maintenance before line stoppage"</div>
              <p class="sim-card-desc">
                A 3-station manufacturing pipeline with stochastic machine wear. The World Model forecasts queue buildup and executes maintenance before failure.
              </p>
              <a href="#/sim/factory" class="btn-launch">
                <span>Launch Factory Sim</span>
                <span style="font-size: 1.1rem;">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}
