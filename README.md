# hazemhassine.space

A high-performance personal engineering space, developer portfolio, and interactive lab built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Three.js**, **Framer Motion**, and **Supabase**.

Designed with a dark **Neo-Brutalist & Cyberpunk** aesthetic, the site features a monochrome palette with a striking neon accent (`#ccf200`), technical typography (`IBM Plex Mono` & `Inter`), live telemetry, interactive 3D WebGL scenes, and an AI chat assistant.

---

## ⚡ Key Features

- **Instant Blog CMS (Supabase)**: Real-time PostgreSQL database with sub-50ms CRUD operations, Row-Level Security (RLS), and Supabase Storage bucket for instant image hosting without build or redeploy delays.
- **Admin Control Panel**: Protected by TOTP Two-Factor Authentication and JWT sessions. Features a live Markdown editor with instant post publishing, editing, deletion, and drag-and-drop image uploads.
- **Interactive 3D WebGL Scenes & Arcade**: Built using `three`, `@react-three/fiber`, and `@react-three/drei` with interactive 3D physics, wireframe grid games, and smooth canvas rendering.
- **HAZEM_AI Portfolio Assistant**: An embedded AI chatbot powered by Google Gemini (`google/gemini-2.5-flash-lite`) and the Vercel AI SDK, equipped with live context from the portfolio profile and published articles.
- **Neo-Brutalist Aesthetics & Motion**:
  - Glitch typography animations using pure CSS pseudo-elements and clip-path.
  - Page transitions powered by Framer Motion's `AnimatePresence` with custom frozen route contexts.
  - 3D perspective hover cards (TiltCard physics), magnetic buttons, and custom cursor interactions.
- **Performance & SEO**: Server components, automated dynamic `sitemap.xml` generation, OpenGraph metadata, and optimized static asset delivery.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Frontend**: [React 19](https://reactjs.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & 3D**: [Framer Motion](https://www.framer.com/motion/), [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Storage Buckets)
- **AI & LLM**: Google Gemini API, [Vercel AI SDK](https://sdk.vercel.ai/)
- **Auth & Security**: [Jose](https://github.com/panva/jose) (JWT), Node.js Native Crypto (RFC 6238 TOTP)
- **Markdown**: `react-markdown`, `gray-matter`, `@uiw/react-md-editor`

---

## 🚀 Featured Projects Detail

### 1. **ARBITER** — *Local-First Dev Environment Control Plane*
- **Category**: Dev Tools & SRE Operator
- **Tech Stack**: Python, FastAPI, Docker SDK, LangGraph, LangChain v1, SQLite, Pydantic v2, Typer CLI, Next.js
- **Overview**: An embedded control plane for understanding, correlating, and safely operating complex developer workstations. Solves port collisions, container sprawl, and service dependencies across Docker Compose stacks, standalone containers, and native host processes through deterministic port allocation, 5-tier approval matrices, and rollback-aware configuration editing.
- **GitHub**: [github.com/HazemHassine/Arbiter](https://github.com/HazemHassine/Arbiter)

### 2. **REPOTRAJECTORY** — *OSS Momentum & Health Analytics Platform*
- **Category**: Big Data & Open Source Intelligence
- **Tech Stack**: Python, FastAPI, PostgreSQL, Next.js, GH Archive, Chart.js
- **Overview**: An explainable research platform for tracking the velocity, contributor momentum, and health of open-source software repositories. Ingests raw GitHub events from GH Archive, maintains durable collection pipelines, and computes transparent, reproducible vitality scores.
- **GitHub**: [github.com/HazemHassine/github_analysis](https://github.com/HazemHassine/github_analysis)

### 3. **GITAUDIT** — *Evidence-First GitHub Profile Curator*
- **Category**: AI & Bounded Operations Console
- **Tech Stack**: Python, FastAPI, PostgreSQL, LangGraph, Playwright
- **Overview**: An operations console for evaluating authorized GitHub repositories. Analyzes CI/CD runs against exact default-branch commits, tracks historical scans, and executes bounded LangGraph agents to curate evidence-backed portfolio profiles.
- **GitHub**: [github.com/HazemHassine/github_maintainer](https://github.com/HazemHassine/github_maintainer)

### 4. **FORMA** — *Job Application Workspace & Agentic Assistant*
- **Category**: AI Agents & Productivity
- **Tech Stack**: Python, FastAPI, React, SQLite, LangGraph
- **Overview**: A local-first workspace for managing the job application lifecycle. Connects résumé versioning, application tracking, source-backed company research, and tailored cover-letter generation with bounded LangGraph workflows.
- **GitHub**: [github.com/HazemHassine/Forma](https://github.com/HazemHassine/Forma)

### 5. **GEMINI-MCP** — *Repository Intelligence MCP Server*
- **Category**: Model Context Protocol & Developer Tools
- **Tech Stack**: Python, MCP, Gemini API, LanceDB, SQLite
- **Overview**: Exposes deep repository intelligence as standard Model Context Protocol (MCP) tools for coding agents. Combines deterministic code navigation with Gemini-assisted planning, AST mapping, and LanceDB semantic retrieval.
- **GitHub**: [github.com/HazemHassine/Gemini-Mcp](https://github.com/HazemHassine/Gemini-Mcp)

### 6. **RSVP SHIFT** — *Privacy-Focused Speed Reading Extension*
- **Category**: Frontend & Browser Extensions
- **Tech Stack**: JavaScript, Chrome Extension Manifest V3, CSS3
- **Overview**: A lightweight Chrome extension for rapid, distraction-free reading. Uses focus-letter alignment, punctuation-aware timing, and local-only text processing for maximum privacy.
- **GitHub**: [github.com/HazemHassine/RSVP-Shift](https://github.com/HazemHassine/RSVP-Shift)

### 7. **HAZEMHASSINE.SPACE** — *Personal Space & Interactive Lab*
- **Category**: Frontend & WebGL Lab
- **Tech Stack**: Next.js 16, React 19, Tailwind CSS v4, Three.js, Supabase, Framer Motion
- **Overview**: The current portfolio codebase featuring custom WebGL shaders, live Supabase blog CMS, 2FA admin panel, and an AI chat assistant.
- **GitHub**: [github.com/HazemHassine/hazemhassine.space](https://github.com/HazemHassine/hazemhassine.space)

---

## ⚙️ Getting Started

### 1. Clone the repository and install dependencies:
```bash
git clone https://github.com/HazemHassine/hazemhassine.space.git
cd hazemhassine.space
npm install
```

### 2. Environment Configuration:
Create a `.env.local` file in the root directory:

```env
# Authentication & Security
JWT_SECRET=your_jwt_secret_here
ADMIN_TOTP_SECRET=your_totp_secret_here

# Supabase (Database & Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Assistant
AI_GATEWAY_API_KEY=your_ai_api_key_here
```

### 3. Initialize the Supabase CMS

Open **Supabase → SQL Editor → New query**, paste the complete contents of
[`supabase/cms.sql`](./supabase/cms.sql), and run it. Then sign in at `/admin`
and choose **Publish everything** once to seed the CMS with the repository's
current portfolio content.

The CMS keeps drafts private, exposes only published content through RLS,
records revision history, stores public media, and retains contact-form messages.

### 4. Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build & Lint:
```bash
npm run lint
npm run build
```

---

## 📄 License

© Mohamed Hazem Hassine. All rights reserved.
