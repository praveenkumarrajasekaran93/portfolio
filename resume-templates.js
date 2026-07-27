// ============================================================
//  RESUME TEMPLATES  —  registry of downloadable PDF layouts
// ------------------------------------------------------------
//  A "template" here is a PDF layout generated in the browser
//  from your LATEST details in profile-data.js. When a visitor
//  picks one, an editable-free .pdf is built on the fly (via
//  pdfmake) and downloaded — in that template's exact layout.
//
//  Each entry's `id` maps to a layout builder in resume-pdf.js
//  (RESUME_PDF_BUILDERS). There is no .docx / file to upload.
//
//  TO ADD YOUR OWN TEMPLATE:
//    1. Write a builder `(data) => docDefinition` in resume-pdf.js
//       and register it in RESUME_PDF_BUILDERS under a new id.
//    2. Add one entry below with the SAME id.
//  No upload button, no site rebuild — it just appears in the
//  download menu. (A card whose id has no builder is auto-disabled.)
//
//  Fields per entry:
//    id           unique short key — MUST match a RESUME_PDF_BUILDERS key
//    label        name shown on the card (e.g. "Amazon")
//    description  one short line
//    icon         optional emoji shown on the card
//    isDefault    set true on EXACTLY ONE entry (gets a badge)
// ============================================================

const RESUME_TEMPLATES = [
    {
        id: 'standard-ats',
        label: 'Standard (ATS-friendly)',
        description: 'Clean single-column layout that applicant tracking systems parse reliably.',
        icon: '📄',
        isDefault: true
    },
    {
        id: 'modern-two-column',
        label: 'Modern Two-Column',
        description: 'Sidebar for skills & contact, main column for experience. Sharp and contemporary.',
        icon: '🧭',
        isDefault: false
    },
    {
        id: 'compact-one-page',
        label: 'Compact One-Page',
        description: 'Condensed single page — ideal for quick applications and recruiters who skim.',
        icon: '📑',
        isDefault: false
    }
    // ➕ Add a custom layout: create the builder in resume-pdf.js, then add
    // { id: 'amazon', label: 'Amazon', description: 'Tailored to Amazon.', icon: '📦', isDefault: false },
];

window.RESUME_TEMPLATES = RESUME_TEMPLATES;
