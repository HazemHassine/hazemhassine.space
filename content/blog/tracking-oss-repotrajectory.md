---
title: "Tracking open source momentum with Repotrajectory"
date: "NOVEMBER 02, 2026"
summary: "A look at Repotrajectory, a platform designed to track the health of open source projects."
---

Open source projects are living things. They gain momentum, they stall, they get forks, and sometimes they just quietly fade away. Keeping a pulse on how healthy a project is can be tricky if you are just looking at star counts on GitHub.

With Repotrajectory, I wanted to go a bit deeper. It is an analytics platform that tracks signals of open-source momentum. By combining GitHub REST data with GH Archive event data, it offers a more detailed view of what is happening under the hood.

We score projects transparently. The formulas and supporting metrics are exposed so each score can be inspected. Underneath, it uses Python, FastAPI, and PostgreSQL for data ingestion and processing, with Next.js serving the frontend. The project remains under active development as a tool for exploring open-source momentum and monitoring dependencies.
