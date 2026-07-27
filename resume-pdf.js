// ============================================================
//  RESUME PDF LAYOUTS  —  client-side PDF generation (pdfmake)
// ------------------------------------------------------------
//  Each visitor picks a template in the download modal; we build
//  a .pdf on the fly from the LATEST master data (profile-data.js,
//  mapped by buildResumeData() in script.js) and download it.
//
//  No server, no build step — pdfmake + its embedded fonts run
//  entirely in the browser (see vendor/pdfmake.min.js + vfs_fonts.js).
//
//  TO ADD A NEW LAYOUT:
//    1. Write a builder function `(d) => docDefinition` below.
//    2. Register it in RESUME_PDF_BUILDERS keyed by the template id.
//    3. Add a matching entry in resume-templates.js (same id).
//  The `d` passed in is the flat object from buildResumeData().
// ============================================================
(function () {
    'use strict';

    // ---- Shared palette (kept readable on white paper) ---------
    const ACCENT = '#7c3aed';   // headings / rules  (site --accent-1)
    const INK = '#1a2332';      // body text
    const MUTED = '#5b6472';    // dates, meta
    const RULE = '#d8dce4';     // hairlines

    // ---- Small building blocks ---------------------------------

    // A thin horizontal rule spanning the usable width.
    function hr(width) {
        return {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: width, y2: 0, lineWidth: 0.75, lineColor: RULE }],
            margin: [0, 4, 0, 6]
        };
    }

    // Section heading (accent, uppercase, letter-spaced-ish).
    function heading(text) {
        return { text: String(text).toUpperCase(), style: 'h2' };
    }

    // Contact line pieces — only include what exists.
    function contactBits(d) {
        return [d.location, d.phone, d.email].filter(Boolean);
    }

    // Clean a URL for display (drop scheme + trailing slash).
    function shortUrl(u) {
        return String(u || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
    }

    // Experience block (shared): role/company on the left, dates right.
    function experienceBlocks(d, opts) {
        opts = opts || {};
        const gap = opts.compact ? 4 : 8;
        return (d.experience || []).map((e) => ({
            stack: [
                {
                    columns: [
                        { text: [{ text: e.role || '', bold: true, color: INK }, e.company ? { text: '  —  ' + e.company, color: MUTED } : ''], width: '*' },
                        { text: e.dates || '', color: MUTED, alignment: 'right', fontSize: opts.compact ? 8 : 9, width: 'auto' }
                    ]
                },
                (e.bullets && e.bullets.length) ? {
                    ul: e.bullets.map((b) => ({ text: b, margin: [0, 1, 0, 0] })),
                    markerColor: ACCENT,
                    margin: [2, 2, 0, 0]
                } : {}
            ],
            margin: [0, 0, 0, gap]
        }));
    }

    // Grouped skills as "Label: a, b, c" lines.
    function skillGroupLines(d) {
        return (d.skillGroups || []).map((g) => ({
            text: [{ text: (g.label || '') + ':  ', bold: true, color: INK }, { text: g.items || '', color: MUTED }],
            margin: [0, 0, 0, 3]
        }));
    }

    function projectBlocks(d, opts) {
        opts = opts || {};
        return (d.projects || []).map((p) => ({
            stack: [
                { text: p.name || '', bold: true, color: INK },
                p.description ? { text: p.description, color: MUTED, margin: [0, 1, 0, 0] } : {},
                p.techInline ? { text: p.techInline, italics: true, color: ACCENT, fontSize: opts.compact ? 8 : 8.5, margin: [0, 1, 0, 0] } : {}
            ],
            margin: [0, 0, 0, opts.compact ? 4 : 6]
        }));
    }

    function certLines(d) {
        return (d.certifications || []).map((c) => ({
            text: [{ text: c.name || '', bold: true, color: INK }, c.detail ? { text: '  —  ' + c.detail, color: MUTED } : ''],
            margin: [0, 0, 0, 3]
        }));
    }

    function educationBlocks(d) {
        return (d.education || []).map((ed) => ({
            stack: [
                {
                    columns: [
                        { text: [{ text: [ed.degree, ed.field].filter(Boolean).join(', '), bold: true, color: INK }], width: '*' },
                        { text: ed.dates || '', color: MUTED, alignment: 'right', fontSize: 9, width: 'auto' }
                    ]
                },
                ed.institution ? { text: ed.institution, color: MUTED } : {},
                ed.notesInline ? { text: ed.notesInline, italics: true, color: MUTED, fontSize: 8.5, margin: [0, 1, 0, 0] } : {}
            ],
            margin: [0, 0, 0, 5]
        }));
    }

    // Shared header (name + title).
    function nameHeader(d, opts) {
        opts = opts || {};
        return [
            { text: d.fullName || '', style: 'name', color: opts.color || INK },
            d.title ? { text: d.title, style: 'title', color: ACCENT } : {}
        ];
    }

    // ==========================================================
    //  TEMPLATE 1 — Standard, ATS-friendly (single column)
    // ==========================================================
    function standardAts(d) {
        const W = 515; // A4 width (595) minus 40+40 margins
        const contact = contactBits(d);
        const links = [d.linkedin, d.github].filter(Boolean);
        const content = [];

        content.push({ text: d.fullName || '', style: 'name' });
        if (d.title) content.push({ text: d.title, style: 'title', color: ACCENT });
        if (contact.length) content.push({ text: contact.join('   •   '), color: MUTED, fontSize: 9, margin: [0, 3, 0, 0] });
        if (links.length) {
            content.push({
                text: links.map((u) => ({ text: shortUrl(u), link: u, color: ACCENT })).reduce((a, b, i) => (i ? a.concat([{ text: '   •   ', color: MUTED }, b]) : a.concat([b])), []),
                fontSize: 9, margin: [0, 2, 0, 0]
            });
        }
        content.push(hr(W));

        if (d.summary) {
            content.push(heading('Professional Summary'));
            content.push({ text: d.summary, margin: [0, 0, 0, 8] });
        }
        if ((d.experience || []).length) {
            content.push(heading('Experience'));
            content.push.apply(content, experienceBlocks(d));
        }
        if ((d.skillGroups || []).length) {
            content.push(heading('Skills'));
            content.push.apply(content, skillGroupLines(d));
            content.push({ text: '', margin: [0, 0, 0, 4] });
        }
        if ((d.projects || []).length) {
            content.push(heading('Projects'));
            content.push.apply(content, projectBlocks(d));
        }
        if ((d.certifications || []).length) {
            content.push(heading('Certifications'));
            content.push.apply(content, certLines(d));
            content.push({ text: '', margin: [0, 0, 0, 4] });
        }
        if ((d.education || []).length) {
            content.push(heading('Education'));
            content.push.apply(content, educationBlocks(d));
        }

        return {
            pageSize: 'A4',
            pageMargins: [40, 40, 40, 40],
            defaultStyle: { font: 'Roboto', fontSize: 10, color: INK, lineHeight: 1.15 },
            styles: baseStyles(),
            content: content
        };
    }

    // ==========================================================
    //  TEMPLATE 2 — Modern two-column (sidebar + main)
    // ==========================================================
    function modernTwoColumn(d) {
        const contact = contactBits(d);
        const links = [d.linkedin, d.github].filter(Boolean);

        const sidebar = [];
        sidebar.push({ text: 'CONTACT', style: 'h2side' });
        contact.forEach((c) => sidebar.push({ text: c, color: '#e6e9f0', fontSize: 9, margin: [0, 0, 0, 2] }));
        links.forEach((u) => sidebar.push({ text: shortUrl(u), link: u, color: '#8fd7ff', fontSize: 9, margin: [0, 0, 0, 2] }));

        if ((d.skillGroups || []).length) {
            sidebar.push({ text: 'SKILLS', style: 'h2side', margin: [0, 12, 0, 4] });
            (d.skillGroups || []).forEach((g) => {
                sidebar.push({ text: g.label || '', bold: true, color: '#ffffff', fontSize: 9, margin: [0, 3, 0, 1] });
                sidebar.push({ text: g.items || '', color: '#c7cede', fontSize: 8.5, margin: [0, 0, 0, 2] });
            });
        }
        if ((d.certifications || []).length) {
            sidebar.push({ text: 'CERTIFICATIONS', style: 'h2side', margin: [0, 12, 0, 4] });
            (d.certifications || []).forEach((c) => {
                sidebar.push({ text: c.name || '', bold: true, color: '#ffffff', fontSize: 9, margin: [0, 2, 0, 0] });
                if (c.detail) sidebar.push({ text: c.detail, color: '#c7cede', fontSize: 8.5, margin: [0, 0, 0, 2] });
            });
        }
        if ((d.education || []).length) {
            sidebar.push({ text: 'EDUCATION', style: 'h2side', margin: [0, 12, 0, 4] });
            (d.education || []).forEach((ed) => {
                sidebar.push({ text: [ed.degree, ed.field].filter(Boolean).join(', '), bold: true, color: '#ffffff', fontSize: 9, margin: [0, 2, 0, 0] });
                if (ed.institution) sidebar.push({ text: ed.institution, color: '#c7cede', fontSize: 8.5 });
                if (ed.dates) sidebar.push({ text: ed.dates, color: '#9aa4bd', fontSize: 8, margin: [0, 0, 0, 2] });
            });
        }

        const mainW = 340;
        const main = [];
        main.push({ text: d.fullName || '', style: 'name' });
        if (d.title) main.push({ text: d.title, style: 'title', color: ACCENT, margin: [0, 0, 0, 2] });
        main.push(hr(mainW));
        if (d.summary) {
            main.push(heading('Summary'));
            main.push({ text: d.summary, margin: [0, 0, 0, 8] });
        }
        if ((d.experience || []).length) {
            main.push(heading('Experience'));
            main.push.apply(main, experienceBlocks(d));
        }
        if ((d.projects || []).length) {
            main.push(heading('Projects'));
            main.push.apply(main, projectBlocks(d));
        }

        // Table gives the sidebar a full-height coloured band.
        return {
            pageSize: 'A4',
            pageMargins: [0, 0, 0, 0],
            defaultStyle: { font: 'Roboto', fontSize: 10, color: INK, lineHeight: 1.15 },
            styles: baseStyles(),
            content: [{
                table: {
                    widths: [175, '*'],
                    body: [[
                        { stack: sidebar, fillColor: '#141a2e', margin: [18, 26, 16, 26] },
                        { stack: main, margin: [22, 26, 26, 26] }
                    ]]
                },
                layout: {
                    defaultBorder: false,
                    paddingLeft: function () { return 0; }, paddingRight: function () { return 0; },
                    paddingTop: function () { return 0; }, paddingBottom: function () { return 0; }
                }
            }]
        };
    }

    // ==========================================================
    //  TEMPLATE 3 — Compact one-page (dense, small type)
    // ==========================================================
    function compactOnePage(d) {
        const W = 523; // A4 minus 36+36 margins
        const contact = contactBits(d);
        const links = [d.linkedin, d.github].filter(Boolean);
        const content = [];

        content.push({
            columns: [
                { stack: [{ text: d.fullName || '', style: 'nameSm' }, d.title ? { text: d.title, color: ACCENT, fontSize: 10 } : {}], width: '*' },
                { text: contact.concat(links.map(shortUrl)).join('\n'), color: MUTED, fontSize: 8, alignment: 'right', width: 'auto' }
            ]
        });
        content.push(hr(W));

        if (d.summary) content.push({ text: d.summary, fontSize: 9, margin: [0, 0, 0, 6] });
        if ((d.experience || []).length) {
            content.push(heading('Experience'));
            content.push.apply(content, experienceBlocks(d, { compact: true }));
        }
        if (d.skillsInline) {
            content.push(heading('Skills'));
            content.push({ text: d.skillsInline, color: MUTED, fontSize: 8.5, margin: [0, 0, 0, 6] });
        }
        if ((d.projects || []).length) {
            content.push(heading('Projects'));
            content.push.apply(content, projectBlocks(d, { compact: true }));
        }
        const twoCol = [];
        if ((d.certifications || []).length) twoCol.push({ width: '*', stack: [heading('Certifications')].concat(certLines(d)) });
        if ((d.education || []).length) twoCol.push({ width: '*', stack: [heading('Education')].concat(educationBlocks(d)) });
        if (twoCol.length) content.push({ columns: twoCol, columnGap: 18 });

        return {
            pageSize: 'A4',
            pageMargins: [36, 34, 36, 30],
            defaultStyle: { font: 'Roboto', fontSize: 9, color: INK, lineHeight: 1.1 },
            styles: baseStyles(true),
            content: content
        };
    }

    // Shared named styles (compact shrinks headings a touch).
    function baseStyles(compact) {
        return {
            name: { fontSize: 22, bold: true, color: INK },
            nameSm: { fontSize: 17, bold: true, color: INK },
            title: { fontSize: 12 },
            h2: { fontSize: compact ? 10 : 11, bold: true, color: ACCENT, margin: [0, compact ? 6 : 10, 0, compact ? 2 : 4] },
            h2side: { fontSize: 10, bold: true, color: '#8fd7ff', margin: [0, 0, 0, 4] }
        };
    }

    // ---- Registry (keyed by template id in resume-templates.js) ----
    const RESUME_PDF_BUILDERS = {
        'standard-ats': standardAts,
        'modern-two-column': modernTwoColumn,
        'compact-one-page': compactOnePage
    };

    // Public: pick a builder (falls back to the standard layout).
    window.buildResumePdfDoc = function (templateId, data) {
        const builder = RESUME_PDF_BUILDERS[templateId] || standardAts;
        return builder(data || {});
    };
    window.RESUME_PDF_BUILDERS = RESUME_PDF_BUILDERS;
})();
