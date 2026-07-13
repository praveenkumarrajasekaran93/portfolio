# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal portfolio website for Praveen Kumar Rajasekaran (DevOps Cloud Engineer). Pure static front-end — plain HTML, CSS, and vanilla JavaScript, no build step, framework, or package manager. Deployed via GitHub Pages (URLs reference `praveenkumarrajasekaran93.github.io`).

## Running / developing

There is no build or test tooling. Open `index.html` directly in a browser, or serve the folder for correct relative-path behavior:

```
python -m http.server 8000   # then visit http://localhost:8000
```

## Structure

- `index.html` — all content and page sections. Sections are anchored by `id` (`home`, `about`, `skills`, `experience`, `projects`, `certifications`, `education`, `contact`) and drive both nav links and scroll-spy. Includes inline JSON-LD (`schema.org/Person`), Open Graph/Twitter meta, and an inline SVG favicon (no external image assets).
- `styles.css` — dark theme, design tokens defined as CSS custom properties on `:root`.
- `script.js` — vanilla JS: sticky navbar, scroll-spy active-link highlighting, mobile menu toggle, `IntersectionObserver` fade-in animations, scroll-to-top button, and client-side contact-form validation (the form has no backend — it validates only).

## Source-of-truth content

`PRAVEENKUMAR_PR.txt` / `.pdf` are the original résumé documents the site content is derived from. They are gitignored and not deployed — only `index.html`, `styles.css`, and `script.js` are tracked. When updating profile facts (experience, skills, certs), keep them consistent with these source documents.

## Conventions

- Adding a nav section requires two coordinated edits: the `<section id="...">` and the matching `<a href="#...">` in `.nav-links`. `script.js` scroll-spy auto-discovers `section` elements, so no JS change is needed.
- Aider was previously used here (`.aider*` files, gitignored).
