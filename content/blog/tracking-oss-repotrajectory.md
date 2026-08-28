---
title: "Tracking open source momentum with Repotrajectory"
date: "NOVEMBER 02, 2026"
summary: "A look at Repotrajectory, a platform designed to track the health of open source projects."
---

Open source projects are living things. They gain momentum, they stall, they get forks, and sometimes they just quietly fade away. Keeping a pulse on how healthy a project is can be tricky if you are just looking at star counts on GitHub.

With Repotrajectory, I wanted to go a bit deeper. It is an analytics platform that tracks the actual momentum of open source software. By combining GitHub REST data with massive datasets from GH Archive, we get a much clearer picture of what is happening under the hood.

We score projects transparently. No hidden algorithms. You can see exactly why a project scored the way it did based on traceable metrics. Underneath, it uses a solid stack of Python, FastAPI, and PostgreSQL to handle all the data ingestion and processing, with Next.js serving up the frontend. It is a great way to discover hidden gems or keep an eye on dependencies your team relies on.
