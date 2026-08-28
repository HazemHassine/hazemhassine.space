// ============================================================
// Comprehensive Project Data Repository
// Extracted and curated directly from the cloned project codebases,
// architectural specifications, and technical documentation.
// ============================================================

export const projectsDetail = [
  {
    id: "01",
    slug: "arbiter",
    aliases: ["arbiter-control-plane"],
    title: "ARBITER",
    subtitle: "Local-first dev environment control plane",
    headline: "Deterministic port coordination, live workstation topology, and approval-gated SRE control plane for local development.",
    category: "DEV TOOLS & CONTROL PLANE",
    status: "PRODUCTION / OPEN SOURCE",
    role: "System Architect & Sole Developer",
    timeline: "2024 - 2025",
    github: "https://github.com/HazemHassine/Arbiter",
    liveDemo: null,
    techStack: ["Python 3.12", "FastAPI", "Docker SDK", "LangGraph", "LangChain v1", "SQLite", "Pydantic v2", "Typer CLI", "MCP stdio", "Next.js"],
    badge: "SRE OPERATOR",
    stats: [
      { label: "OPERATING MODEL", value: "OBSERVE → DIAGNOSE → APPROVE → VERIFY" },
      { label: "RISK LEVELS", value: "5-TIER PERSISTED APPROVAL MATRIX" },
      { label: "INTERFACES", value: "REST API + CLI + SSE UI + MCP + A2A" },
      { label: "AGENT SAFETY", value: "ZERO GENERIC SHELL / COMPENSATING TRANSACTIONS" },
    ],
    summary: "Arbiter is a local-first Linux operations control plane engineered to understand, correlate, and safely operate complex developer workstations. It solves port collisions, container sprawl, and service dependencies across Docker Compose stacks, standalone containers, and native host processes through deterministic allocation, immutable approvals, and rollback-aware configuration editing.",
    overview: [
      "A developer workstation frequently runs multiple services competing for identical ports (PostgreSQL on 5432, Redis on 6379, frontend servers on 3000/5173, and API servers on 8000). When multiple projects are active simultaneously, identifying which process or container owns a port and safely re-allocating it is error-prone.",
      "Arbiter acts as an embedded SRE operator on your machine. It gathers low-level Linux socket evidence (`ss`) and Docker daemon metadata, renders a live connected resource topology, proposes deterministic replacement ports, requires human approval for state-changing operations, and automatically verifies system health after execution.",
      "Crucially, Arbiter operates under strict safety invariants: no arbitrary shell execution, no unbounded filesystem writes, immutable UUID-tracked approvals in SQLite, and compensating rollback transactions if Compose validation or container recreation fails."
    ],
    problemStatement: {
      problem: "Local development environments are fragile: running multiple microservices or agent-generated Docker Compose stacks results in silent port collisions, orphaned containers, and broken configurations. Developers waste hours tracking down PIDs or manually modifying YAML files with no rollback guarantee.",
      solution: "Arbiter provides a unified control plane that scans Linux `/proc` and socket listeners, maps Docker labels to Compose services, deterministically calculates free replacement ports, and safely rewrites Compose and `.env` files with atomic backups.",
      keyTakeaway: "By separating observation, proposal, approval, execution, and verification into distinct phases, Arbiter enables autonomous coding agents and human developers to manipulate dev environments with zero risk of workstation corruption."
    },
    architecture: {
      description: "Arbiter is structured as a modular single-process Python application where the REST API, Typer CLI, Browser Control Panel, stdio MCP Server, and A2A Agent Card all share the exact same core domain services and safety boundaries.",
      asciiDiagram: `
+-------------------------------------------------------------------------+
| INTERFACES: Browser UI (SSE) | Typer CLI | REST API | MCP Stdio | A2A   |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| AGENT ORCHESTRATION LAYER (LangChain v1 + LangGraph Runtime)           |
| - Bounded tool calling (AGENT_MAX_STEPS)                                |
| - Structured NDJSON operational streaming (Action trace, zero raw CoT)  |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| CORE DOMAIN SERVICES                                                    |
| ┌───────────────────┬───────────────────┬─────────────────────────────┐ |
| │ PortService       │ DockerService     │ ComposeService              │ |
| │ - ss socket scan  │ - SDK inspection  │ - AST YAML parsing          │ |
| │ - /proc correlation│ - Lifecycle ops  │ - Structured port rewrites  │ |
| │ - Allocator & HHI │ - Disk usage      │ - Atomic backup & rollback  │ |
| ├───────────────────┼───────────────────┼─────────────────────────────┤ |
| │ ProjectRegistry   │ SafetyService     │ ActionService               │ |
| │ - Root discovery  │ - 5 Risk Tiers    │ - Transaction dispatcher    │ |
| │ - .env redaction  │ - UUID approvals  │ - Mandatory verification    │ |
| └───────────────────┴───────────────────┴─────────────────────────────┘ |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| SYSTEM BOUNDARY: Linux Kernel (/proc, ss) | Docker Daemon | SQLite (WAL)|
+-------------------------------------------------------------------------+`,
      layers: [
        { name: "Linux Socket & Process Scanner", description: "Executes ss -H -lntu -p with fixed argument arrays and reads /proc/<pid>/comm and cmdline for non-intrusive host evidence.", tech: "Linux /proc, iproute2 ss" },
        { name: "Docker & Compose Correlation", description: "Correlates raw sockets with Docker container IDs, Compose project names, service tags, and controlling .env variables.", tech: "Docker SDK, PyYAML" },
        { name: "Safety & Persisted Approvals", description: "Categorizes actions into READ_ONLY, LOW_RISK, MEDIUM_RISK, HIGH_RISK, and DESTRUCTIVE with SQLite UUID reservations.", tech: "SQLAlchemy 2, SQLite" },
        { name: "LangGraph Bounded Agent", description: "Provides natural-language operational assistance with typed tool dispatch and streaming event traces.", tech: "LangChain v1, LangGraph, OpenAI/Open-source models" }
      ]
    },
    keyCapabilities: [
      {
        title: "Live Workstation Topology",
        description: "Renders real-time dependency graphs showing relationships between registered projects, Docker containers, network bridges, volume mounts, and host listening sockets."
      },
      {
        title: "Deterministic Port Reconciliation",
        description: "Scans occupied ports and calculates sequential replacement candidates from a configured range, avoiding collisions with pending approvals or running containers."
      },
      {
        title: "Rollback-Aware Configuration Editor",
        description: "Safely edits Compose YAML and .env files with pre-flight syntax validation, timestamped backups, and automatic compensating rollbacks upon failure."
      },
      {
        title: "5-Tier Safety & Approval Engine",
        description: "Requires explicit cryptographic approval for state-changing operations, guaranteeing that agents cannot execute destructive shell commands or delete active volumes."
      },
      {
        title: "Model Context Protocol (MCP) Adapter",
        description: "Exposes port querying, topology inspection, and the high-level arbiter_prepare_project tool over stdio for coding assistants like Claude Code and GitHub Copilot."
      },
      {
        title: "NDJSON Operational Trace Streaming",
        description: "Streams step-by-step diagnostic actions, tool invocations, and verification results over SSE to the browser UI without exposing private model chain-of-thought."
      }
    ],
    technicalDeepDive: [
      {
        title: "Compensating Transactions in Configuration Editing",
        content: "When reconciling port conflicts across Compose stacks, Arbiter parses the YAML AST, creates an isolated atomic backup, applies the updated port mapping, runs docker compose config validation, and attempts container recreation. If validation fails or the recreated container crashes, Arbiter executes a reverse compensating transaction, restoring the original YAML files and recreating services from the pristine baseline."
      },
      {
        title: "Separation of Execution and Verification",
        content: "In Arbiter, a successful process exit code does not equal operational success. Every state-changing action (such as starting a service or updating a port) triggers an independent verification phase that checks container health probes, re-probes listening sockets via ss, and inspects /proc ownership. The action is marked verification_failed if the runtime state does not match the desired declaration."
      }
    ],
    screenshots: [
      {
        src: "/projects/arbiter/preview.png",
        alt: "Arbiter Control Plane Overview",
        caption: "Arbiter real-time control panel displaying listening port owners, container health, and registered project status."
      }
    ],
    cliOrApiReference: {
      title: "CLI & API Commands",
      items: [
        { command: "arbiter ports --free 3000:4000 --count 5", description: "Find 5 deterministic sequential free ports in the 3000-4000 range." },
        { command: "arbiter inspect github-analysis", description: "Inspect project services, declared port bindings, and runtime conflicts." },
        { command: "arbiter ask 'What is using port 5432?'", description: "Query the SRE agent to trace process, container, and Compose ownership." },
        { command: "arbiter prepare github-analysis", description: "Generate a reconciliation plan, allocate replacement ports, and await approval." },
        { command: "arbiter mcp", description: "Launch the stdio MCP server for coding agents." }
      ]
    },
    gettingStarted: {
      prerequisites: ["Python 3.12+", "Docker & Docker Compose", "Linux / macOS"],
      steps: [
        { title: "1. Clone and Install Dependencies", code: "git clone https://github.com/HazemHassine/Arbiter.git\ncd Arbiter\ncp .env.example .env\nuv sync --extra dev --extra mcp" },
        { title: "2. Start the Control Plane", code: "uv run arbiter serve" },
        { title: "3. Open the Web Dashboard", code: "open http://127.0.0.1:8765" }
      ]
    }
  },
  {
    id: "02",
    slug: "repotrajectory",
    aliases: ["github-analysis", "repo-trajectory"],
    title: "REPOTRAJECTORY",
    subtitle: "OSS momentum & health analytics platform",
    headline: "Explainable research platform tracking open-source software momentum, contributor concentration, and health with GH Archive ingestion.",
    category: "OSS METRICS & BIG DATA",
    status: "PRODUCTION / OPEN SOURCE",
    role: "System Architect & Sole Developer",
    timeline: "2024 - 2025",
    github: "https://github.com/HazemHassine/github_analysis",
    liveDemo: null,
    techStack: ["Python 3.12", "FastAPI", "PostgreSQL", "Next.js", "Alembic", "GH Archive", "GitHub REST API", "Docker Compose", "Ruff", "MyPy"],
    badge: "BIG DATA PIPELINE",
    stats: [
      { label: "INGESTION MODEL", value: "DUAL-COHORT (DISCOVERY + HYDRATION)" },
      { label: "QUEUE STRATEGY", value: "POSTGRESQL FOR UPDATE SKIP LOCKED" },
      { label: "SCORING ALGORITHMS", value: "MOMENTUM (0-100) & HEALTH (0-100)" },
      { label: "METRIC TRANSPARENCY", value: "HERFINDAHL-HIRSCHMAN INDEX (HHI)" }
    ],
    summary: "RepoTrajectory is an explainable research platform that tracks the true momentum and governance health of open-source software. By combining high-level GitHub REST data with durable GH Archive hourly ingestion, RepoTrajectory separates automation noise from human contributions and computes transparent, reproducible metric snapshots.",
    overview: [
      "Traditional GitHub metrics like raw star counts and commit numbers are easily inflated by automated bots, infrequent mass commits, or vanity metrics. They fail to reveal whether a project is actively maintained, suffering from contributor burnout, or accelerating in genuine adoption.",
      "RepoTrajectory introduces a dual-cohort data pipeline: it scans thousands of candidate repositories using lightweight search metadata and compact GH Archive hourly counters, reserving deep API hydration for ranked projects to respect GitHub rate limits.",
      "Every calculated score (Momentum, Community Health, Contributor Concentration Risk) is strictly constrained to a 0–100 normalized range and persisted with its complete formula breakdown, sample sizes, and calculation timestamp, ensuring zero black-box scoring."
    ],
    problemStatement: {
      problem: "Engineering leaders and open-source consumers lack transparent, objective data on whether dependencies are vibrant or dying. Surface-level star counts conceal critical risks like single-maintainer bottlenecks, slow PR cycles, and bot-dominated activity.",
      solution: "RepoTrajectory ingests millions of events from GH Archive and GitHub REST, filters bot activity, and computes explainable mathematical scores including Herfindahl–Hirschman contributor concentration and tanh-normalized velocity.",
      keyTakeaway: "Transparent, reproducible metrics give developers confidence in evaluating open-source libraries before integrating them into mission-critical systems."
    },
    architecture: {
      description: "RepoTrajectory separates discovery from hydration using a PostgreSQL-backed job queue with worker leases (FOR UPDATE SKIP LOCKED). It maintains hourly GH Archive projections and daily deduplicated metric snapshots.",
      asciiDiagram: `
+-------------------------------------------------------------------------+
| DATA SOURCES: GitHub REST API (v3) + GH Archive Hourly JSON Streams     |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| DURABLE COLLECTOR ENGINE (Python 3.12 CLI / Worker)                     |
| - Priority Queue (FOR UPDATE SKIP LOCKED)                               |
| - Asymmetric Scheduling: Pinned > Search > Archive > Hydration          |
| - Rate Budget & Exponential Backoff Resilience                          |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| POSTGRESQL ANALYTICS DATABASE                                           |
| ┌───────────────────────────┬─────────────────────────────────────────┐ |
| │ Candidate Universe        │ Deep Hydration Cohort                   │ |
| │ - Mutable search rows     │ - Commits (human vs bot flagged)        │ |
| │ - Hourly archive counters │ - PR lifecycle & Issue close cycles     │ |
| ├───────────────────────────┴─────────────────────────────────────────┤ |
| │ Metric Snapshots (Daily deduplicated points with full formula ledger)│ |
| └─────────────────────────────────────────────────────────────────────┘ |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| EXPLAINABLE SCORING ENGINE & FASTAPI SERVICE                            |
| - Momentum Score: tanh velocity (Stars, Human Commits, PRs, Releases)   |
| - Community Health: Diminishing returns on active maintainers & cycles  |
| - Contributor Risk: Top-1/Top-3 share + Herfindahl-Hirschman Index      |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| FRONTEND DASHBOARD: Next.js + Tailwind CSS Brutalist Visualizer         |
+-------------------------------------------------------------------------+`,
      layers: [
        { name: "Asymmetric Collector Queue", description: "PostgreSQL job ledger with priority-based worker leasing, rate limit reserving, and idempotent daily snapshot deduplication.", tech: "PostgreSQL, SQLAlchemy, Python 3.12" },
        { name: "GH Archive & REST Ingestion", description: "Streams hourly compressed archive logs and enriches ranked repositories with deep commit, PR, and release metadata.", tech: "GH Archive, GitHub REST API, httpx" },
        { name: "Explainable Scoring Engine", description: "Deterministic mathematical transforms (hyperbolic tangent velocity, exponential release decay, HHI maintainer concentration).", tech: "NumPy / Python Mathematical Models" },
        { name: "FastAPI & Next.js Interface", description: "High-performance REST API with comprehensive OpenAPI documentation and Next.js frontend visualization.", tech: "FastAPI, Next.js, TailwindCSS" }
      ]
    },
    keyCapabilities: [
      {
        title: "Dual-Cohort Data Pipeline",
        description: "Tracks thousands of candidate repositories cheaply using search metadata and compact GH Archive counters before deeply hydrating ranked cohorts."
      },
      {
        title: "Bot-Filtered Human Velocity",
        description: "Heuristically identifies automated bot accounts (Dependabot, Renovate, CI runners) to report true human contributor activity and genuine development momentum."
      },
      {
        title: "Explainable Momentum Scoring",
        description: "Computes 30-day velocity across star growth (25%), contributor growth (20%), human commit acceleration (25%), PR acceleration (20%), and release cadence (10%)."
      },
      {
        title: "Community Health & Cycle Times",
        description: "Evaluates issue-close and PR-merge cycles for resolved events in the observation window, preventing open-cohort bias from distorting responsiveness metrics."
      },
      {
        title: "Maintainer Dependency & HHI Analysis",
        description: "Calculates the Herfindahl–Hirschman Index (Σ share²) along with top-1 and top-3 maintainer share to evaluate organizational risk and single-maintainer vulnerability."
      },
      {
        title: "Self-Healing Durable Ledger",
        description: "Uses conflict-safe PostgreSQL upserts and replaceable hourly projections so collector crashes or worker restarts recover instantly without state corruption."
      }
    ],
    technicalDeepDive: [
      {
        title: "Mathematical Formulation of Momentum",
        content: "Momentum uses a hyperbolic tangent function centered at 50 to score acceleration: zero change results in 50 points, deceleration maps below 50, and acceleration asymptotically approaches 100. Release cadence applies 100 × (1 − exp(−x / 2)), rewarding consistent shipping cadences with diminishing returns for excessive micro-releases."
      },
      {
        title: "Durable Worker Leasing with PostgreSQL",
        content: "Rather than introducing Redis or Celery, RepoTrajectory uses PostgreSQL row-level locks (SELECT ... FOR UPDATE SKIP LOCKED) to coordinate distributed collector workers. This architecture guarantees strict priority ordering (Pinned > Discovery > Archive > Hydration) with zero external messaging infrastructure."
      }
    ],
    screenshots: [
      {
        src: "/projects/repotrajectory/architecture.png",
        alt: "RepoTrajectory System Architecture",
        caption: "RepoTrajectory collector, database, and explainable scoring pipeline architecture diagram."
      }
    ],
    cliOrApiReference: {
      title: "Collector CLI Operations",
      items: [
        { command: "python -m app.cli schedule", description: "Enqueue all due collection and snapshot calculation jobs." },
        { command: "python -m app.cli collector", description: "Start the continuous scheduler and multi-worker collector daemon." },
        { command: "python -m app.cli collector-status", description: "Display real-time queue depth, archive progress, and GitHub rate-limit budget." },
        { command: "python -m app.cli enqueue fastapi/fastapi", description: "Manually pin and immediately hydrate a specific repository." },
        { command: "python -m app.cli classify-candidates", description: "Reapply transparent eligibility and intake heuristics across the candidate universe." }
      ]
    },
    gettingStarted: {
      prerequisites: ["Python 3.12+", "PostgreSQL 16+", "Node.js 20+", "Docker Compose"],
      steps: [
        { title: "1. Start Database & Setup Environment", code: "cp .env.example .env\ndocker compose up -d postgres" },
        { title: "2. Run Migrations & Backend API", code: "cd backend\npython -m venv .venv && source .venv/bin/activate\npip install -e '.[dev]'\nalembic upgrade head\nuvicorn app.main:app --reload --port 8001" },
        { title: "3. Start the Next.js Frontend", code: "cd ../frontend\nnpm install\nnpm run dev" }
      ]
    }
  },
  {
    id: "03",
    slug: "gitaudit",
    aliases: ["oss-maintainer", "github-maintainer", "git-audit"],
    title: "GITAUDIT",
    subtitle: "Evidence-first GitHub profile curator & reliability console",
    headline: "Reliability console and bounded LangGraph profile curator for developer GitHub repositories with commit-exact CI tracking.",
    category: "RELIABILITY & DEV GOVERNANCE",
    status: "PRODUCTION / OPEN SOURCE",
    role: "System Architect & Sole Developer",
    timeline: "2024 - 2025",
    github: "https://github.com/HazemHassine/github_maintainer",
    liveDemo: null,
    techStack: ["Python 3.12", "FastAPI", "Next.js", "PostgreSQL", "LangGraph", "LangChain", "OpenAI GPT-5", "Playwright", "Alembic", "Docker"],
    badge: "RELIABILITY CONSOLE",
    stats: [
      { label: "CI CORRELATION", value: "EXACT DEFAULT-BRANCH COMMIT SHA" },
      { label: "SAFETY BOUNDARY", value: "PROPOSAL-ONLY (ZERO AUTO-MUTATION)" },
      { label: "VISUAL GRAMMAR", value: "5-LAYER: PULSE, TRACE, EVIDENCE, ACTION, VERIFY" },
      { label: "AUTH MODES", value: "GITHUB APP INSTALLATION + FINE-GRAINED TOKEN" }
    ],
    summary: "GitAudit is an evidence-first GitHub operations console and AI profile curator for a developer's authorized repositories. It inventories repositories, tracks commit-exact CI health, separates evidence quality from evidence coverage, and uses a bounded LangGraph workflow to propose metadata, documentation, and reliability improvements.",
    overview: [
      "Engineering portfolios and personal GitHub profiles often accumulate dozens of stale, unmaintained, or poorly documented repositories. Existing tools either provide shallow vanity badges or attempt risky automated modifications that break existing code.",
      "GitAudit acts as a meticulous reliability console. It connects via a fine-grained GitHub App installation, inventories authorized repositories, and performs automated scans that evaluate CI and checks against the exact default-branch commit SHA being reported.",
      "In GitAudit, AI is strictly bounded: repository descriptions, topics, README text, and scan outputs are treated as untrusted inputs. A deterministic pre-check precedes a typed LangGraph curation assessment that proposes improvements (descriptions, topics, README updates, CI fixes). Proposals are persisted for human review and never auto-applied."
    ],
    problemStatement: {
      problem: "Developers lose track of the health and presentation of their open-source repositories. Missing CI pipelines are often falsely assumed to be 'passing', and outdated READMEs mislead potential users and hiring managers.",
      solution: "GitAudit enforces exact-SHA CI verification, distinguishes between missing evidence and passing checks, and deploys a bounded LangGraph agent to generate high-signal documentation and metadata proposals.",
      keyTakeaway: "Separating evidence from narrative ensures that repository health is grounded in verifiable facts while AI assists as an inspectable proposal generator."
    },
    architecture: {
      description: "GitAudit is architected as a modular FastAPI monolith with PostgreSQL persistence, Next.js command center UI, and a bounded LangGraph profile curation graph with strict proposal-only isolation.",
      asciiDiagram: `
+-------------------------------------------------------------------------+
| USER INTERACTION: Next.js Command Center (5-Layer Visual Grammar)       |
| - PULSE (Observed Health) | TRACE (Agent Activity) | EVIDENCE (Immutable)|
| - ACTION (Proposed Mutation) | VERIFY (Before/After Proof)              |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| FASTAPI BACKEND & SCAN COORDINATOR                                      |
| - Auto-Scan on Startup (Bounded Concurrency)                            |
| - Exact Default-Branch Commit SHA Verifier                              |
| - Health Signal Normalizer (PASS / FAIL / UNKNOWN / UNAVAILABLE)        |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| BOUNDED LANGGRAPH PROFILE CURATOR (Milestone 2 AI Boundary)            |
| ┌─────────────────────────────────────────────────────────────────────┐ |
| │ 1. Untrusted Input Sanitizer (READMEs, topics, scan output)         │ |
| │ 2. Deterministic Pre-Check (Metadata completeness & CI presence)    │ |
| │ 3. Strict Structured Output Model (Strengths, concerns, proposals)  │ |
| │ 4. Proposal Persistence (Stored in DB for human review; NO AUTO-PR) │ |
| └─────────────────────────────────────────────────────────────────────┘ |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| POSTGRESQL REPOSITORY SNAPSHOT STORE (Atomic Scan Snapshots & Ledgers)  |
+-------------------------------------------------------------------------+`,
      layers: [
        { name: "5-Layer Visual Command Center", description: "Dense operations UI rendering health pulses, active traces, immutable evidence, and reviewable action ledgers.", tech: "Next.js App Router, TailwindCSS, TypeScript" },
        { name: "Scan & Health Normalizer", description: "Evaluates exact-commit checks, separates signal quality from coverage, and handles GitHub API degradation gracefully.", tech: "Python 3.12, FastAPI, GitHub REST / GraphQL" },
        { name: "Bounded LangGraph Curator", description: "Extracts repository positioning, detects documentation gaps, and generates structured metadata proposals without write access.", tech: "LangGraph, LangChain, OpenAI GPT-5" },
        { name: "PostgreSQL System of Record", description: "Stores immutable scan snapshots, health signal ledgers, and curation assessment history with complete model provenance.", tech: "PostgreSQL 16, Alembic" }
      ]
    },
    keyCapabilities: [
      {
        title: "Commit-Exact CI Verification",
        description: "Evaluates CI checks against the exact default-branch commit SHA recorded during the scan, preventing stale CI runs from reporting false health."
      },
      {
        title: "Quality vs. Coverage Separation",
        description: "Separates observed score from evidence coverage: a repository with no CI is gated to ATTENTION even if all other metrics score 100%."
      },
      {
        title: "Bounded LangGraph Profile Curator",
        description: "Deploys a deterministic pre-check followed by a structured LLM assessment to propose repository descriptions, topic tags, and README enhancements."
      },
      {
        title: "Proposal-Only Safety Boundary",
        description: "Guarantees zero autonomous mutation: all AI-generated suggestions are stored in PostgreSQL for developer inspection with zero automatic GitHub writes."
      },
      {
        title: "Offline Inventory Resilience",
        description: "Maintains a full local PostgreSQL snapshot of authorized repositories, allowing continuous local inspection and health tracking during GitHub outages."
      },
      {
        title: "GitHub App & Fine-Grained Auth",
        description: "Supports short-lived GitHub App installation tokens with narrowly scoped read permissions, falling back to fine-grained PATs for local development."
      }
    ],
    technicalDeepDive: [
      {
        title: "Signal State Semantics: Unknown vs. Unavailable",
        content: "GitAudit enforces strict signal state semantics: UNKNOWN represents the complete absence of a configured signal (such as no configured deployment workflow), whereas UNAVAILABLE indicates that an external provider or GitHub endpoint failed to respond. Neither state is ever coerced into a passing score."
      },
      {
        title: "Milestone Safety Boundary & LangGraph Isolation",
        content: "Untrusted external repository contents (such as user-authored READMEs or issue comments) are strictly quarantined. The curation graph runs under a deterministic schema with bounded token budgets and prompt versioning. It persists every proposal with its model name, prompt hash, commit SHA, and exact evidence envelope."
      }
    ],
    screenshots: [],
    cliOrApiReference: {
      title: "Operations & Verification",
      items: [
        { command: "make dev", description: "Apply PostgreSQL migrations and launch the FastAPI API and Next.js web console concurrently." },
        { command: "make test", description: "Run backend pytest suite, Ruff linter, ESLint, and TypeScript validation." },
        { command: "make test-e2e", description: "Execute Playwright end-to-end browser verification across critical console paths." },
        { command: "curl http://localhost:8001/api/v1/sync", description: "Trigger an on-demand batch scan across all authorized repositories." }
      ]
    },
    gettingStarted: {
      prerequisites: ["Python 3.12+", "Node.js 20+", "PostgreSQL 16+", "Docker"],
      steps: [
        { title: "1. Configure Environment", code: "cp .env.example .env\n# Add your GITHUB_TOKEN or GITHUB_APP credentials and OPENAI_API_KEY" },
        { title: "2. Launch Database & Application", code: "docker compose up -d db\nmake install\nmake dev" },
        { title: "3. Open Command Center", code: "open http://localhost:3000\n# API Docs at http://localhost:8001/docs" }
      ]
    }
  },
  {
    id: "04",
    slug: "forma",
    aliases: ["cv-personalizer", "forma-workspace"],
    title: "FORMA",
    subtitle: "Job application workspace & agentic assistant",
    headline: "Local-first agentic workspace for résumé tailoring, source-backed company research, and human-reviewed cover letter synthesis.",
    category: "AGENTIC WORKSPACE",
    status: "PRODUCTION / OPEN SOURCE",
    role: "System Architect & Sole Developer",
    timeline: "2024 - 2025",
    github: "https://github.com/HazemHassine/Forma",
    liveDemo: null,
    techStack: ["Python", "FastAPI", "React", "TailwindCSS", "LangGraph", "SQLite", "Google Gemini", "OpenAI GPT-5", "Docker Compose"],
    badge: "HUMAN-IN-THE-LOOP AI",
    stats: [
      { label: "PRIVACY MODEL", value: "100% LOCAL-FIRST (DATA EXCLUDED FROM GIT)" },
      { label: "WORKFLOW ENGINE", value: "LANGGRAPH BOUNDED AGENTIC PIPELINE" },
      { label: "RESEARCH INTEGRITY", value: "SOURCE-BACKED CITATIONS & CONFIDENCE" },
      { label: "STORAGE BACKUP", value: "SQLITE ATOMIC .BACKUP SNAPSHOTS" }
    ],
    summary: "Forma is a local-first workspace designed to manage the entire job application lifecycle. It combines section-by-section résumé versioning, application status tracking, source-backed company research, and a multi-step LangGraph cover-letter synthesis pipeline with human-in-the-loop decision checkpoints.",
    overview: [
      "Job seekers are often forced to choose between generic automated AI cover letters that hallucinate company facts or tedious manual document tailoring across dozens of applications.",
      "Forma introduces an inspectable, human-guided agentic workflow: rather than generating an unverified draft in one shot, it breaks cover-letter synthesis into distinct phases: role requirement analysis, live sourced company research, targeted user clarification questions, drafting, interactive in-browser editing, and clean PDF export.",
      "Every company insight is retained with direct web source links, confidence scores, and identified organizational risks. Forma operates under a strict local-first privacy model: all private résumés, contact details, signatures, and SQLite databases remain in local-data/ on the user's host machine."
    ],
    problemStatement: {
      problem: "Applying for technical roles requires tailored résumés and authentic, company-specific cover letters. Cloud-based AI tools leak personal data and generate generic, hallucinated fluff with zero citation backing.",
      solution: "Forma executes bounded LangGraph workflows locally, pairing web-grounded company research with human decision gates to produce accurate, source-backed documents.",
      keyTakeaway: "Human-in-the-loop checkpoints ensure that AI assists with research and structuring without taking away personal authorial control."
    },
    architecture: {
      description: "Forma utilizes a FastAPI backend running LangGraph agent workflows alongside a responsive React frontend. Data is stored in a local SQLite database with zero cloud telemetry.",
      asciiDiagram: `
+-------------------------------------------------------------------------+
| REACT WORKSPACE FRONTEND: Resume Editor | App Pipeline | Research Hub   |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| FASTAPI BACKEND & ROUTERS (/resumes, /applications, /cover-letter, etc.)|
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| LANGGRAPH BOUNDED AGENTIC WORKFLOW                                      |
| ┌───────────────────────────┐     ┌───────────────────────────────────┐ |
| │ 1. Role & Gap Analysis    │ ──> │ 2. Sourced Company Research       │ |
| │ (Requirements, evidence)  │     │ (Live web search, citations, risk)│ |
| └───────────────────────────┘     └───────────────────────────────────┘ |
|               │                                     │                   |
|               ▼                                     ▼                   |
| ┌───────────────────────────┐     ┌───────────────────────────────────┐ |
| │ 3. Interactive Clarify    │ <── │ HUMAN REVIEW GATE                 │ |
| │ (Ask user only high-value)│     │ (Approve sources & edit context)  │ |
| └───────────────────────────┘     └───────────────────────────────────┘ |
|               │                                                         |
|               ▼                                                         |
| ┌───────────────────────────┐     ┌───────────────────────────────────┐ |
| │ 4. Structured Drafting    │ ──> │ 5. In-Browser Edit & PDF Export   │ |
| └───────────────────────────┘     └───────────────────────────────────┘ |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| LOCAL-FIRST STORAGE: SQLite (resume.db) + local-data/ (Excluded from Git)|
+-------------------------------------------------------------------------+`,
      layers: [
        { name: "Interactive React Workspace", description: "Section-by-section master résumé editor, version tree diffing, application kanban board, and live document previewer.", tech: "React, TailwindCSS, Vite" },
        { name: "Multi-Step LangGraph Pipeline", description: "Structured state graph managing requirement extraction, web-search grounding, clarification prompts, and drafting.", tech: "LangGraph, Google Gemini, OpenAI GPT-5" },
        { name: "Source-Backed Research Hub", description: "Crawls company news, engineering blogs, and public filings to extract verifiable organizational goals and technical stacks.", tech: "FastAPI, BeautifulSoup / Search Providers" },
        { name: "Local-First Persistence", description: "Zero-cloud SQLite database with atomic backup commands, keeping all documents, contact info, and API keys strictly local.", tech: "SQLite 3, Pydantic" }
      ]
    },
    keyCapabilities: [
      {
        title: "Multi-Step Agentic Cover Letter Flow",
        description: "Breaks synthesis into role analysis, company research, targeted user clarification questions, and structured drafting."
      },
      {
        title: "Source-Backed Company Researcher",
        description: "Generates structured company briefs with retained source URLs, confidence metrics, recent technical initiatives, and organizational risks."
      },
      {
        title: "Master Résumé & Branch Versioning",
        description: "Maintains a protected master résumé while creating tailored branch copies tied to specific job applications and submission timestamps."
      },
      {
        title: "Human-in-the-Loop Clarification",
        description: "Prompts the user to answer only high-signal clarifying questions that directly resolve ambiguities in the candidate's background."
      },
      {
        title: "100% Local-First Privacy Model",
        description: "Stores all resumes, applications, documents, and API keys in local-data/, ensuring private information never enters Git or Docker images."
      },
      {
        title: "Dual AI Provider Support",
        description: "Seamlessly switch between Google Gemini (e.g. Gemini 3.5 Flash) and OpenAI (GPT-5) with provider-native structured outputs and search tools."
      }
    ],
    technicalDeepDive: [
      {
        title: "LangGraph State Machine with Human Checkpoints",
        content: "Forma's cover letter generator avoids monolithic prompt traps by maintaining an immutable state graph in LangGraph. The graph pauses execution after role analysis and company research, allowing the user to review findings, inject personal anecdotes, or correct misinterpreted job requirements before generating the draft."
      },
      {
        title: "Atomic SQLite Backups & Data Isolation",
        content: "To guarantee zero data loss without running heavy database servers, Forma utilizes SQLite's online backup API (.backup). Users can create point-in-time snapshots while the application is actively running without locking database readers."
      }
    ],
    screenshots: [
      {
        src: "/projects/forma/00-forma-architecture.png",
        alt: "Forma Architecture Diagram",
        caption: "Forma architecture: a human-reviewed LangGraph workflow backed by local SQLite storage."
      },
      {
        src: "/projects/forma/01-agentic-analysis.png",
        alt: "Forma Inspectable Role Analysis",
        caption: "Inspect requirements, evidence, gaps, strategy, and uncertainties before research begins."
      },
      {
        src: "/projects/forma/02-research-and-clarify.png",
        alt: "Forma Research and Clarification",
        caption: "Approve sourced company context and answer targeted questions to refine the draft."
      },
      {
        src: "/projects/forma/03-company-researcher.png",
        alt: "Forma Company Researcher Report",
        caption: "Structured company research with retained sources, confidence scores, and role relevance."
      },
      {
        src: "/projects/forma/04-application-tracker.png",
        alt: "Forma Job Application Pipeline",
        caption: "Track application statuses and link the exact submitted résumé version to each company."
      },
      {
        src: "/projects/forma/05-resume-versions.png",
        alt: "Forma Resume Version Library",
        caption: "Protect the master résumé while branching tailored versions for different job descriptions."
      }
    ],
    cliOrApiReference: {
      title: "Local Commands",
      items: [
        { command: "docker compose up --build", description: "Start the complete backend API (port 8000) and React frontend (port 5173) in Docker." },
        { command: "sqlite3 local-data/resume.db \".backup 'local-data/backups/resume-backup.db'\"", description: "Create an atomic point-in-time backup of your local database." },
        { command: "python scripts/privacy_check.py --staged", description: "Verify that no private resumes or credentials are accidentally staged for Git." }
      ]
    },
    gettingStarted: {
      prerequisites: ["Docker & Docker Compose", "Python 3.11+", "Node.js 22+"],
      steps: [
        { title: "1. Clone & Configure Keys", code: "git clone https://github.com/HazemHassine/Forma.git\ncd Forma\ncp backend/.env.example backend/.env\n# Add GEMINI_API_KEY or OPENAI_API_KEY" },
        { title: "2. Launch via Docker", code: "docker compose up --build" },
        { title: "3. Open Application", code: "open http://localhost:5173\n# Backend Docs at http://localhost:8000/docs" }
      ]
    }
  },
  {
    id: "05",
    slug: "gemini-mcp",
    aliases: ["gemini-mcp-bridge", "gemni-mcp"],
    title: "GEMINI-MCP",
    subtitle: "Repository intelligence MCP server",
    headline: "Advanced Model Context Protocol server exposing repository AST exploration, LanceDB semantic vector search, and Gemini architectural mapping to coding agents.",
    category: "AGENT INTELLIGENCE & MCP",
    status: "PRODUCTION / OPEN SOURCE",
    role: "System Architect & Sole Developer",
    timeline: "2024 - 2025",
    github: "https://github.com/HazemHassine/Gemini-Mcp",
    liveDemo: null,
    techStack: ["Python", "MCP Protocol", "Google Gemini API", "LanceDB", "SQLite", "AST Analysis", "Web Graph UI"],
    badge: "MCP SERVER",
    stats: [
      { label: "PROTOCOL", value: "MODEL CONTEXT PROTOCOL (STDIO)" },
      { label: "VECTOR STORE", value: "LANCEDB EMBEDDINGS (LOCAL)" },
      { label: "MAPPER ENGINE", value: "FUNCTIONAL SIGNATURES & DEPENDENCY GRAPH" },
      { label: "AUDIT LOG", value: "SQLITE TASK & TOOL CALL MEMORY" }
    ],
    summary: "Gemini-MCP is an advanced Model Context Protocol (MCP) server that empowers AI coding assistants (GitHub Copilot, Claude Code, Cursor) with deep repository intelligence. It combines deterministic code navigation, Gemini-assisted architectural planning, LanceDB semantic code retrieval, and an interactive graph visualization dashboard.",
    overview: [
      "Large-scale software repositories present significant context-window challenges for coding agents. Agents often struggle to locate relevant files, misinterpret architectural dependencies, or generate ungrounded code patches that cause regressions.",
      "Gemini-MCP bridges Google Gemini models with the local filesystem through standardized MCP tools: agents can generate structured multi-step implementation plans (plan_task), review diffs for security and logic flaws (review_patch), and semantically discover related code using local LanceDB vector embeddings (semantic_search_code).",
      "Additionally, the server generates functional signatures and import dependency graphs (map_architecture), which can be inspected directly in a built-in web visualization UI at http://localhost:8000. All tool invocations and reasoning steps are recorded in a persistent SQLite audit log (history.db)."
    ],
    problemStatement: {
      problem: "Coding agents lack semantic understanding of large codebases, frequently guessing file locations or missing structural dependencies. Standard text search fails when terminology differs between user queries and source code.",
      solution: "Gemini-MCP equips agents with a standardized tool suite featuring local LanceDB vector search, AST dependency graphing, and Gemini-powered architectural reasoning.",
      keyTakeaway: "Combining deterministic code exploration with vector semantic search and architectural dependency maps enables coding agents to execute complex refactors accurately."
    },
    architecture: {
      description: "Gemini-MCP runs as a stdio MCP server coordinating LanceDB vector stores, SQLite call histories, Gemini API clients, and an embedded FastAPI visualization dashboard.",
      asciiDiagram: `
+-------------------------------------------------------------------------+
| CODING AGENTS (GitHub Copilot, Claude Code, Cursor, Windsurf)           |
+-------------------------------------------------------------------------+
                                     │ (MCP Protocol over stdio)
                                     ▼
+-------------------------------------------------------------------------+
| GEMINI-MCP BRIDGE SERVER (server.py)                                    |
| ┌───────────────────────────┬─────────────────────────────────────────┐ |
| │ Gemini Intelligence Tools │ Exploration & Search Tools              │ |
| │ - plan_task               │ - list_repo_files / read_repo_file      │ |
| │ - review_patch            │ - search_repo_code (grep)               │ |
| │ - ask_gemini              │ - semantic_search_code (LanceDB)        │ |
| ├───────────────────────────┴─────────────────────────────────────────┤ |
| │ Architecture Mapping Tools: map_architecture / get_graph_data       │ |
| └─────────────────────────────────────────────────────────────────────┘ |
+-------------------------------------------------------------------------+
                                     │
                 ┌───────────────────┼───────────────────┐
                 ▼                   ▼                   ▼
+-----------------------+ +---------------------+ +-----------------------+
| GOOGLE GEMINI API     | | LANCEDB VECTOR DB   | | SQLITE MEMORY         |
| - Text embeddings     | | - Local code vectors| | - history.db          |
| - Multimodal reasoning| | - Fast similarity   | | - Tool call audit log |
+-----------------------+ +---------------------+ +-----------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
| GRAPH VISUALIZATION UI (ui/main.py -> http://localhost:8000)            |
| - Interactive dependency graph & functional signature browser           |
+-------------------------------------------------------------------------+`,
      layers: [
        { name: "MCP Protocol Server", description: "Standardized stdio adapter exposing high-signal tools with strict path validation and traversal safeguards.", tech: "Python MCP SDK, Pydantic" },
        { name: "LanceDB Semantic Vector Engine", description: "Indexes repository files using Gemini embeddings for concept-based code discovery.", tech: "LanceDB, Google Gemini Embeddings" },
        { name: "Architectural Graph Engine", description: "Extracts functional signatures, parses AST import trees, and generates exportable graph topologies.", tech: "Python AST, NetworkX / Custom Graph Engine" },
        { name: "Audit Trail & Visualization UI", description: "Persists all requests and responses in SQLite and renders dependency topologies in a browser interface.", tech: "SQLite 3, HTML5 Canvas / D3.js" }
      ]
    },
    keyCapabilities: [
      {
        title: "Gemini-Powered Task Planning (plan_task)",
        description: "Analyzes project structure and technical requirements to generate a structured, step-by-step implementation plan before code modification."
      },
      {
        title: "Deep Patch & Diff Review (review_patch)",
        description: "Inspects code diffs to detect logic errors, security vulnerabilities, edge cases, and maintainability regressions."
      },
      {
        title: "LanceDB Vector Semantic Search",
        description: "Embeds codebase functions and modules into a high-performance local LanceDB vector store for conceptual code discovery."
      },
      {
        title: "Architectural Dependency Graphing",
        description: "Generates functional signatures and maps import dependencies between modules, exposing the topology as JSON data."
      },
      {
        title: "Interactive Web Graph UI",
        description: "Includes a standalone web dashboard at http://localhost:8000 to visually navigate and inspect the codebase graph."
      },
      {
        title: "Persistent Audit Memory",
        description: "Records every prompt, tool argument, and execution response in .mcp_data/history.db for task continuity and reproducibility."
      }
    ],
    technicalDeepDive: [
      {
        title: "Functional Signature Extraction",
        content: "The map_architecture tool parses Python ASTs and source trees, extracts class definitions, function signatures, and docstrings, and utilizes Gemini to summarize each module's core responsibility. It then maps internal imports to create an actionable, queryable architectural graph."
      },
      {
        title: "Security & Path Traversal Safeguards",
        content: "To ensure that coding agents cannot access sensitive host credentials or escape the repository sandbox, all file reading and grep tools pass through strict path canonicalization checks, blocking attempts to read outside the designated project root."
      }
    ],
    screenshots: [],
    cliOrApiReference: {
      title: "Tools & Commands",
      items: [
        { command: "python server.py", description: "Start the Gemini-MCP stdio server for client agent connections." },
        { command: "cd ui && python main.py", description: "Launch the interactive architectural graph dashboard at http://localhost:8000." },
        { command: "tool: plan_task", description: "Agent tool: Generate an execution blueprint for complex feature development." },
        { command: "tool: semantic_search_code", description: "Agent tool: Search code conceptually using LanceDB vector embeddings." }
      ]
    },
    gettingStarted: {
      prerequisites: ["Python 3.10+", "Google Gemini API Key"],
      steps: [
        { title: "1. Clone & Install", code: "git clone https://github.com/HazemHassine/Gemini-Mcp.git\ncd Gemini-Mcp\npython -m venv venv && source venv/bin/activate\npip install -r requirements.txt" },
        { title: "2. Configure Environment", code: "cp .env.example .env\n# Add your GEMINI_API_KEY in .env" },
        { title: "3. Launch Server or Visualization UI", code: "# Run MCP Server:\npython server.py\n\n# Or Run Graph UI:\ncd ui && python main.py" }
      ]
    }
  },
  {
    id: "06",
    slug: "rsvp-shift",
    aliases: ["rsvp-speed-reader", "rsvpshift"],
    title: "RSVP SHIFT",
    subtitle: "Chrome extension for speed reading",
    headline: "Privacy-focused Chrome speed-reading extension using Rapid Serial Visual Presentation (RSVP) with optimal focus-letter alignment.",
    category: "BROWSER EXTENSION / NLP",
    status: "PRODUCTION / OPEN SOURCE",
    role: "Sole Developer & Creator",
    timeline: "2024",
    github: "https://github.com/HazemHassine/RSVP-Shift",
    liveDemo: null,
    techStack: ["JavaScript", "Chrome Extensions API (Manifest V3)", "HTML5", "CSS3 Custom Properties", "Chrome Storage"],
    badge: "CHROME EXTENSION",
    stats: [
      { label: "EXTENSION SPEC", value: "MANIFEST V3 (OFFLINE)" },
      { label: "READING ENGINE", value: "RAPID SERIAL VISUAL PRESENTATION (RSVP)" },
      { label: "ALIGNMENT", value: "OPTIMAL RECOGNITION POINT (ORP FOCUS LETTER)" },
      { label: "PRIVACY", value: "100% LOCAL (ZERO NETWORK EGRESS)" }
    ],
    summary: "RSVP Shift is a lightweight, privacy-centric Chrome extension that transforms selected webpage text into a distraction-free, word-by-word speed-reading experience using Rapid Serial Visual Presentation (RSVP) and fixed focus-letter alignment.",
    overview: [
      "When reading lengthy online articles, documentation, or technical papers, the human eye wastes up to 80% of its time on physical saccadic movements (moving between words and tracking line breaks) rather than processing information.",
      "RSVP Shift eliminates eye strain and saccadic overhead by presenting words one by one at a fixed screen coordinate, highlighting the Optimal Recognition Point (ORP) — the exact letter where the brain naturally recognizes word meaning.",
      "Built strictly on Chrome Manifest V3, RSVP Shift requires zero external network permissions and processes 100% of highlighted text locally on your device. It features punctuation-adaptive pacing, keyboard-first navigation, and a scrubbable timeline."
    ],
    problemStatement: {
      problem: "Traditional reading requires continuous eye movement across lines of text, causing visual fatigue and limiting comprehension speed when consuming dense technical documentation or news.",
      solution: "RSVP Shift isolates words at a fixed focus point with custom punctuation delays and a distraction-free full-screen overlay.",
      keyTakeaway: "Eliminating physical eye movement through RSVP and optimal letter alignment allows readers to double reading speeds while maintaining comprehension."
    },
    architecture: {
      description: "RSVP Shift operates entirely client-side within the browser sandbox using Chrome's Manifest V3 extension architecture, communicating via asynchronous message passing between content scripts, background service workers, and popup settings.",
      asciiDiagram: `
+-------------------------------------------------------------------------+
| BROWSER WEBPAGE: User highlights text selection                         |
+-------------------------------------------------------------------------+
                                     │ (Keyboard Shortcut: Ctrl+Shift+Q)
                                     ▼
+-------------------------------------------------------------------------+
| CONTENT SCRIPT (content.js)                                             |
| ┌─────────────────────────────────────────────────────────────────────┐ |
| │ 1. Selection Extraction & Tokenizer (Words, punctuation, sentences) │ |
| │ 2. Dynamic Pacing Calculator (ORP alignment, comma/period delays)   │ |
| │ 3. Distraction-Free DOM Overlay (Fixed red focus letter container)  │ |
| │ 4. Keyboard Controller (Space, Arrow Scrubbing, WPM adjustments)    │ |
| └─────────────────────────────────────────────────────────────────────┘ |
+-------------------------------------------------------------------------+
                 ▲                                     ▲
                 │ (Chrome Storage Sync)               │ (Message Passing)
                 ▼                                     ▼
+------------------------------------+   +--------------------------------+
| SETTINGS POPUP (popup.html/js)     |   | BACKGROUND WORKER              |
| - WPM Speed (100 - 1000 WPM)       |   | (background.js)                |
| - Focus Letter Styling & Color     |   | - Extension lifecycle          |
| - Punctuation delay multipliers    |   | - Context menu dispatch        |
+------------------------------------+   +--------------------------------+`,
      layers: [
        { name: "Content Script & RSVP Engine", description: "Injects the distraction-free reader overlay, aligns focus letters at the Optimal Recognition Point, and handles precise timer loops.", tech: "Vanilla JavaScript (ES6+), CSS3" },
        { name: "Punctuation Pacing Module", description: "Calculates variable delays for periods, commas, colons, and long multi-syllable words to maintain natural reading cadence.", tech: "JavaScript Timing Engine" },
        { name: "Settings & Storage Adapter", description: "Syncs reader preferences (target WPM, font size, theme accents) using Chrome's synchronized storage.", tech: "Chrome Storage API" },
        { name: "Background Service Worker", description: "Handles keyboard shortcut dispatch (Ctrl+Shift+Q) and browser context-menu actions under Manifest V3.", tech: "Service Worker, Manifest V3" }
      ]
    },
    keyCapabilities: [
      {
        title: "Optimal Recognition Point (ORP) Alignment",
        description: "Fixes the highlighted red focus letter at an exact horizontal coordinate so the eye remains motionless while words advance."
      },
      {
        title: "Punctuation-Adaptive Timing",
        description: "Dynamically introduces extended pauses on periods, commas, semicolons, and long technical words to preserve natural comprehension."
      },
      {
        title: "Distraction-Free Focus Overlay",
        description: "Hides controls during active playback and automatically dims webpage backgrounds, reappearing seamlessly on mouse movement or keyboard toggle."
      },
      {
        title: "Scrubbable Sentence Timeline",
        description: "Provides a responsive progress scrubber to easily rewind or skip ahead to specific sentences without losing reading context."
      },
      {
        title: "Keyboard-First Controls",
        description: "Full keyboard control: Space (play/pause), ↑/↓ (adjust WPM speed), ←/→ (jump sentence), and ? (show shortcuts)."
      },
      {
        title: "100% Offline & Private",
        description: "Zero external analytics, zero tracking, zero remote network calls — operates entirely within the local Chrome sandbox."
      }
    ],
    technicalDeepDive: [
      {
        title: "Calculating the Optimal Recognition Point",
        content: "Scientific reading research shows that the human brain recognizes words most efficiently when the gaze lands slightly to the left of center (between 30% and 40% of word length). RSVP Shift calculates the exact ORP index for each word and shifts the container horizontally so the red focus letter remains locked at the exact same screen pixel."
      },
      {
        title: "Manifest V3 Compliance & Zero Egress",
        content: "RSVP Shift is architected strictly under Chrome Manifest V3 without unsafe-eval or external script loading. The extension requests minimal permissions (activeTab, storage), guaranteeing that user reading material never leaves the local machine."
      }
    ],
    screenshots: [
      {
        src: "/projects/rsvp-shift/01_focus_mode.png",
        alt: "RSVP Shift Focus Mode",
        caption: "Distraction-free RSVP reading mode with fixed red focus-letter alignment."
      },
      {
        src: "/projects/rsvp-shift/02_paused_controls.png",
        alt: "RSVP Shift Paused Controls",
        caption: "Clean paused state showing progress scrubber, sentence controls, and current reading speed."
      },
      {
        src: "/projects/rsvp-shift/03_keyboard_help.png",
        alt: "RSVP Shift Keyboard Help",
        caption: "Keyboard-first navigation guide for rapid speed adjustment and sentence scrubbing."
      },
      {
        src: "/projects/rsvp-shift/04_settings.png",
        alt: "RSVP Shift Settings Popup",
        caption: "Customizable reading preferences: WPM speeds, punctuation multipliers, and visual themes."
      }
    ],
    cliOrApiReference: {
      title: "Keyboard Shortcuts",
      items: [
        { command: "Ctrl + Shift + Q", description: "Activate RSVP Shift reader on highlighted text (Command + Shift + Q on macOS)." },
        { command: "Space", description: "Toggle playback between pause and resume." },
        { command: "↑ / ↓", description: "Increase or decrease reading speed (WPM)." },
        { command: "← / →", description: "Step backward or forward word by word." },
        { command: "Shift + ← / →", description: "Jump to previous or next sentence." },
        { command: "?", description: "Display on-screen keyboard shortcuts overlay." },
        { command: "Esc", description: "Close the RSVP Shift reader overlay." }
      ]
    },
    gettingStarted: {
      prerequisites: ["Google Chrome, Brave, or any Chromium-based browser"],
      steps: [
        { title: "1. Clone or Download Repository", code: "git clone https://github.com/HazemHassine/RSVP-Shift.git" },
        { title: "2. Load in Chrome", code: "1. Open chrome://extensions in Chrome\n2. Enable 'Developer mode' in the top right\n3. Click 'Load unpacked' and select the RSVP-Shift repository folder" },
        { title: "3. Start Reading", code: "Highlight any text on a webpage and press Ctrl+Shift+Q" }
      ]
    }
  }
];

export function getAllProjectSlugs() {
  return projectsDetail.map(p => p.slug);
}

export function getProjectDetail(slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();
  return projectsDetail.find(p => p.slug === normalized || p.aliases?.includes(normalized)) || null;
}

export function getAdjacentProjects(slug) {
  const currentIndex = projectsDetail.findIndex(p => p.slug === slug || p.aliases?.includes(slug));
  if (currentIndex === -1) return { prev: null, next: null };
  
  const prev = currentIndex > 0 ? projectsDetail[currentIndex - 1] : projectsDetail[projectsDetail.length - 1];
  const next = currentIndex < projectsDetail.length - 1 ? projectsDetail[currentIndex + 1] : projectsDetail[0];
  
  return { prev, next };
}
