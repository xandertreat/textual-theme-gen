# Contributing to Textual Theme Generator

Thank you for your interest in contributing! Your help is greatly appreciated. This guide will help you get started and ensure a smooth contribution process.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branching & Commit Messages](#branching--commit-messages)
- [Testing & Quality](#testing--quality)
- [Pull Requests](#pull-requests)
- [Code Style](#code-style)
- [Feature Requests & Issues](#feature-requests--issues)
- [Acknowledgements](#acknowledgements)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Please be respectful and considerate in all interactions.

## How to Contribute

1. **Fork** the repository and clone it locally.
2. **Create a new branch** for your feature or fix: `git checkout -b feat/your-feature` or `fix/your-bug`.
3. **Make your changes** with clear, concise commits.
4. **Test** your changes locally.
5. **Push** your branch and open a Pull Request (PR) against `main`.
6. **Describe** your changes and reference any related issues.

## Development Setup

- Install dependencies: `bun install` (or `npm install`/`pnpm install`/`yarn install`)
- Start development server: `bun run dev`
- Run tests: `bun test`
- Lint and format: `bun check` and `bun format`

## Branching & Commit Messages

- Use descriptive branch names: `feat/feature-name`, `fix/bug-description`, `docs/update-readme`, etc.
- Write clear, concise commit messages. Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) if possible.

## Testing & Quality

- Add or update tests for new features and bug fixes.
- Ensure all tests pass before submitting a PR.
- Run linting and formatting tools to maintain code quality.

## Pull Requests

- Open PRs against the `main` branch.
- Provide a clear description of your changes and why they are needed.
- Reference related issues (e.g., `Closes #123`).
- Be responsive to feedback and requested changes.
- PRs should be small and focused; avoid mixing unrelated changes.

## Code Style

- Use [Biome](https://biomejs.dev/) for linting and formatting.
- Follow the existing component and file structure.
- Prefer functional, composable components.
- Use TypeScript and SolidJS best practices.

## Feature Requests & Issues

- Use [GitHub Issues](https://github.com/xandertreat/textual-theme-gen/issues) to report bugs or request features.
- Please search for existing issues before opening a new one.
- Provide as much detail as possible, including steps to reproduce bugs.

## Acknowledgements

Thanks for helping make Textual Theme Generator better! See [README.md](README.md#acknowledgements) for a list of major dependencies and contributors.
