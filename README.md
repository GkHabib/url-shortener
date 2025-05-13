> **Summary:** This repository is a Turborepo monorepo comprising a Next.js frontend and an Express-based API for shortening URLs. It uses a JSON-file datastore for the MVP, with Biome for linting, Bun for fast scripts, and Lefthook for Git hooks. This README covers project overview, setup, development, testing, deployment, and contributing guidelines—ensuring new contributors can get started quickly while maintainers have a clear reference ([FreeCodeCamp][1]).

---

## 📖 Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The **URL Shortener** is a minimal, fast, and extensible service that converts long URLs into compact short links. It consists of a Next.js web app for user interaction and an Express API for URL generation and redirection. Data persistence uses a simple JSON file store, making it easy to run without external databases ([GitHub][2]).

## Tech Stack

* **Turborepo** for monorepo management and pipelining ([GitHub][3])
* **Next.js** (React) for the frontend UI
* **Express** for the API server
* **Biome** for linting and formatting ([DEV Community][4])
* **Bun** as the package manager and runtime for fast scripts
* **Lefthook** for Git hooks (pre-commit and pre-push)
* **Tailwind CSS** for styling
* **Jest** for backend testing

## Getting Started

### Prerequisites

* **Node.js** ≥ 18 (recommended via nvm) ([Hatica][5])
* **Bun** ≥ 1.2.13 (as specified in `packageManager`)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/url-shortener.git
cd url-shortener

# Install dependencies
bun install
```

> This installs Turborepo, Next.js, Express, and all required dev tools in one go ([FreeCodeCamp][1]).

## Available Scripts

From the monorepo root, run:

| Script              | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `bun run dev`       | Runs frontend and API in parallel (Next.js & Express).    |
| `bun run build`     | Builds both workspaces (frontend `.next` and API `dist`). |
| `bun run test`      | Executes Jest tests for the API.                          |
| `bun run check`     | Runs Biome linter across the monorepo.                    |
| `bun run check:fix` | Auto-formats code via Biome.                              |
| `bun run cleanup`   | Removes all `node_modules` folders for a fresh restore.   |

## Project Structure

```
/
├─ apps/
│  └─ web/          # Next.js frontend
│     	├─ src/
│ 		    ├─ app/     # React pages using app directory
│					├─ containers/     # Page containers 
│					├─ components/  
│					└─ style/    # Tailwind globals
├─ packages/
│  └─ api/          # Express server & JSON datastore
│     ├─ src/
│     │  ├─ server.ts
│     │  ├─ index.ts
│     │  └─ datastore.ts
│     └─ data/      # urls.json (prod) & urls.test.json (tests)
├─ turbo.json       # Turborepo pipeline config
├─ package.json     # Root scripts & workspaces
└─ renovate.json    # Dependency update config
```

This structure follows feature-based grouping, promoting scalability and clarity ([Reddit][6]).

## Development Workflow

1. **Start both servers:**

   ```bash
   bun run dev
   ```
2. **Frontend:** Open `http://localhost:3002` to use the URL shortener UI.
3. **API:** The Express server listens on port `5001` by default; POST to `/api/shorten` and GET `/:id` for redirects.
4. **Git Hooks:** Pre-commit runs Biome linting and tests; pre-push builds both packages automatically.

## Testing

* **Backend unit tests** live in `packages/api/src/server.test.ts`.
* Run with:

  ```bash
  cd packages/api
  bun run test
  ```
* Tests spin up the Express app via Supertest and use an isolated `urls.test.json` datastore ([Reddit][7]).

## Deployment

* **API:** Deploy to platforms supporting Node.js (e.g. Vercel Serverless Functions, Heroku, Bun Cloud) by pointing `DATA_PATH` and `BASE_URL` env vars to production values ([Medium][8]).
* **Web:** Deploy the Next.js app to Vercel or Netlify; configure rewrites so `/api` routes target your live backend URL.

## Contributing

1. Fork the repo and create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```
2. Commit your changes with descriptive messages.
3. Push to your fork and open a Pull Request.
4. Ensure all checks pass (lint, tests, build) before requesting review.

For detailed guidelines on PRs, see the [CONTRIBUTING.md](./CONTRIBUTING.md) (if added) ([GitHub][3]).

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

[1]: https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/?utm_source=chatgpt.com "How to Write a Good README File for Your GitHub Project"
[2]: https://github.com/othneildrew/Best-README-Template?utm_source=chatgpt.com "An awesome README template to jumpstart your projects! - GitHub"
[3]: https://github.com/elsewhencode/project-guidelines?utm_source=chatgpt.com "elsewhencode/project-guidelines: A set of best practices for ... - GitHub"
[4]: https://dev.to/merlos/how-to-write-a-good-readme-bog?utm_source=chatgpt.com "How to write a good README - DEV Community"
[5]: https://www.hatica.io/blog/best-practices-for-github-readme/?utm_source=chatgpt.com "Best Practices For An Eye Catching GitHub Readme - Hatica"
[6]: https://www.reddit.com/r/reactjs/comments/1dwi8p8/i_made_my_own_react_best_practices_readme_on/?utm_source=chatgpt.com "I made my own React best practices README on github. : r/reactjs"
[7]: https://www.reddit.com/r/AskProgramming/comments/1c2d2h6/how_to_design_a_readme_file_to_help_newcomers_to/?utm_source=chatgpt.com "How to design a README file to help newcomers to contribute ..."
[8]: https://medium.com/elsewhen/we-boosted-our-javascript-projects-maintainability-by-following-these-guidelines-62536e6e0d04?utm_source=chatgpt.com "A set of best practices for JavaScript projects - Medium"
