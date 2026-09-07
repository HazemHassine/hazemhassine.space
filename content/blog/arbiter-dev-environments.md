---
title: "Building Arbiter: A local-first dev control plane"
date: "OCTOBER 15, 2026"
summary: "Why I built a control plane for managing development environments locally."
---

Managing development environments can be a real headache. You have containers spinning up, processes taking up ports, and configuration files scattered everywhere. It gets messy fast. That is exactly why I started working on Arbiter.

Arbiter is a local-first control plane that brings everything into a single view. Instead of jumping between terminal tabs to figure out what is running where, you can see all your projects, containers, and ports in a live topology map. It connects the dots for you.

One of the most helpful features I built into it is rollback-aware editing. Proposed state changes pass through human approval and post-action verification, while backup and rollback mechanisms are designed to reduce risk when configurations change. It is built with Python, FastAPI, and Docker, with an optional LangGraph-powered agent interface for routine tasks. Arbiter remains under active development: these controls reduce risk rather than guarantee security, and further hardening, validation, observability, and application-specific safety checks are still planned.
