// ============================================================
//  RESUME TEMPLATES  —  registry of downloadable .docx layouts
// ------------------------------------------------------------
//  A "template" here is a Microsoft Word (.docx) file that uses
//  merge fields (e.g. {fullName}, {#experience}...{/experience}).
//  When a visitor picks one, your LATEST details from
//  profile-data.js are poured into it and an editable .docx is
//  downloaded — in that template's exact layout.
//
//  TO ADD YOUR OWN TEMPLATE:
//    1. In Word/Google Docs, design the resume however you like.
//    2. Put merge fields where data should go (see the field
//       reference in TEMPLATE_FIELD_GUIDE.md).
//    3. Save it as .docx into the /templates folder.
//    4. Add one entry to the array below.
//  No upload button, no site rebuild — it just appears in the
//  download menu.
//
//  Fields per entry:
//    id           unique short key
//    label        name shown on the card (e.g. "Amazon")
//    description  one short line
//    file         path to the .docx, relative to index.html
//    icon         optional emoji shown on the card
//    isDefault    set true on EXACTLY ONE entry (gets a badge)
// ============================================================

const RESUME_TEMPLATES = [
    {
        id: 'standard-ats',
        label: 'Standard (ATS-friendly)',
        description: 'Clean single-column layout that applicant tracking systems parse reliably.',
        file: 'templates/standard-ats.docx',
        icon: '📄',
        isDefault: true
    },
    {
        id: 'modern-two-column',
        label: 'Modern Two-Column',
        description: 'Sidebar for skills & contact, main column for experience. Sharp and contemporary.',
        file: 'templates/modern-two-column.docx',
        icon: '🧭',
        isDefault: false
    },
    {
        id: 'compact-one-page',
        label: 'Compact One-Page',
        description: 'Condensed single page — ideal for quick applications and recruiters who skim.',
        file: 'templates/compact-one-page.docx',
        icon: '📑',
        isDefault: false
    }
    // ➕ Add your Amazon / Flipkart / custom .docx templates here.
    // { id: 'amazon', label: 'Amazon', description: 'Tailored to Amazon.',
    //   file: 'templates/amazon.docx', icon: '📦', isDefault: false },
];

window.RESUME_TEMPLATES = RESUME_TEMPLATES;
