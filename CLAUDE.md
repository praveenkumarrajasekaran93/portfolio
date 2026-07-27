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

- `profile-data.js` — **the master data file (single source of truth).** Exposes `window.PROFILE_DATA` (identity, contact, about, skills, skillMatrix, experience, projects, certifications, education). Both the website and every downloadable resume read from here.
- `index.html` — page skeleton and section containers. Content sections (`about`, `experience`, `projects`, `certifications`, `education`, `contact`) are **empty containers filled at runtime by `script.js` from `PROFILE_DATA`** — do NOT hardcode content here. Includes inline JSON-LD, Open Graph/Twitter meta, inline SVG favicon.
- `styles.css` — dark theme, design tokens as CSS custom properties on `:root`. Includes the floating download button (`.download-fab`) and template-chooser modal (`.dl-modal`).
- `script.js` — vanilla JS: navbar/scroll-spy/mobile menu/animations/scroll-top/contact-form, **plus** `renderSite()` (renders sections from `PROFILE_DATA`) and the resume download engine (`buildResumeData()` + `generateResume()`).
- `resume-templates.js` — registry (`window.RESUME_TEMPLATES`) of downloadable `.docx` layouts shown in the download modal.
- `templates/*.docx` — Word merge templates (docxtemplater `{tags}`). Filled with the latest master data at download time. Regenerate the starters with `scratchpad/make_templates.py` (needs `python-docx`).
- `vendor/pizzip.min.js`, `vendor/docxtemplater.min.js` — the only third-party libs; used client-side to fill `.docx` templates in the browser. Vendored locally (no CDN, no build step).
- `TEMPLATE_FIELD_GUIDE.md` — the merge-field reference for authoring new `.docx` templates.

## Resume download feature

Floating download button → modal lists `RESUME_TEMPLATES` → picking one fetches that `.docx`, fills it with `buildResumeData()` (mapped from `PROFILE_DATA`) via pizzip+docxtemplater, and downloads an editable `.docx`. The merge-field names in the templates MUST match the keys `buildResumeData()` produces — see `TEMPLATE_FIELD_GUIDE.md`. Adding a template = drop a `.docx` in `templates/` + one entry in `resume-templates.js` (no upload UI by design).

## Source-of-truth content

Edit `profile-data.js` to update any profile fact — the site and all resumes update automatically. `PRAVEENKUMAR_PR.txt` / `.pdf` are the original résumé documents (gitignored, not deployed); keep `profile-data.js` consistent with them.

## Conventions

- Adding a nav section requires two coordinated edits: the `<section id="...">` and the matching `<a href="#...">` in `.nav-links`. `script.js` scroll-spy auto-discovers `section` elements, so no JS change is needed.
- Aider was previously used here (`.aider*` files, gitignored).
