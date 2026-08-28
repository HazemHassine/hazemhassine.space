# hazemhassine.space

A personal portfolio and blog website built with Next.js (App Router), React, Tailwind CSS, and Framer Motion.

This project serves as a showcase of my personal and professional projects, built with a dark Neo-Brutalist and cyberpunk design aesthetic. It features a monochrome palette with a striking neon primary accent color (`#ccf200`), grid backgrounds, and stark typography.

## Key Features

- **Interactive 3D WebGL Components**: Built using `three`, `@react-three/fiber`, and `@react-three/drei` for dynamic, immersive interactions.
- **Smooth Route Transitions**: Implemented via Framer Motion's `AnimatePresence` with a custom `<PageTransition>` wrapper and a frozen route context to preserve state during exit animations.
- **Markdown-Powered Blog**: Write and publish articles seamlessly.
- **Built-in Admin Editor**: Uses `react-markdown` and `@uiw/react-md-editor` for intuitive content management.
- **Visual Experience Timeline**: A clean, structured timeline showcasing work experience.
- **Glitch Typography Effects**: Subtle, randomized monochrome static glitch animations implemented using pure CSS pseudo-elements, clip-path, and data-text attributes.

## Tech Stack & Tags

tags: `next.js`, `react`, `tailwindcss`, `portfolio`, `blog`, `three.js`, `framer-motion`

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

## Design and Aesthetics
- **Theme Config**: Custom theme colors and variables are handled via `@theme inline` directly within `app/globals.css`.
- **Typography**: Uses `Inter` for display and `IBM Plex Mono` for a stark, technical feel.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Build and Lint

To build the project:

```bash
npm run build
```

To run the linter:

```bash
npm run lint
```

## Learn More

To learn more about the tools used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) - learn how to build 3D apps in React.
- [Tailwind CSS v4](https://tailwindcss.com/docs) - learn about the new version of Tailwind CSS.
- [Framer Motion](https://www.framer.com/motion/) - learn about animation in React.
