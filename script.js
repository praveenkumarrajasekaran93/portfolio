// Respect users who prefer reduced motion — cinematic effects are skipped for them
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navbar functionality
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Sticky navbar with scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();

    // Toggle scroll-to-top button
    toggleScrollTopButton();

    // Toggle floating download button
    toggleDownloadFab();
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('active');
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInNavbar = navbar.contains(e.target);
    const isMenuOpen = navLinksContainer.classList.contains('active');
    if (!isClickInNavbar && isMenuOpen) {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
});

// Close mobile menu with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const isMenuOpen = navLinksContainer.classList.contains('active');
        if (isMenuOpen) {
            mobileToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.focus();
        }
    }
});

// Smooth scroll and active link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll animations (fade-in / slide-up)
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
    animationObserver.observe(el);
});

// ============================================================
// Particle network background (canvas)
// ============================================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let running = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        const count = Math.min(90, Math.floor(window.innerWidth / 16));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.6
        }));
    }

    function draw() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.45)';
            ctx.fill();
        }

        // Connect nearby particles with faint lines
        const linkDist = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < linkDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.18 * (1 - dist / linkDist)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    // Pause the animation when the tab is hidden to save battery
    document.addEventListener('visibilitychange', () => {
        const wasRunning = running;
        running = !document.hidden;
        if (running && !wasRunning) draw();
    });

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    resize();
    createParticles();
    draw();
}

// ============================================================
// Typing effect — rotating roles in the hero
// ============================================================
function initTypedRole() {
    const el = document.getElementById('typedRole');
    if (!el) return;

    const roles = [
        'DevOps Cloud Engineer',
        'Senior System Administrator',
        'Cloud Security Specialist',
        'AI Integration Specialist'
    ];

    if (prefersReducedMotion) {
        el.textContent = roles[0];
        return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        const current = roles[roleIndex];

        if (!deleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(tick, 2200); // hold the full title before erasing
                return;
            }
            setTimeout(tick, 65);
        } else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(tick, 350);
                return;
            }
            setTimeout(tick, 32);
        }
    }

    el.textContent = '';
    tick();
}

// ============================================================
// Terminal window — typed command sequence
// ============================================================
function initTerminal() {
    const body = document.getElementById('terminalBody');
    if (!body) return;

    // Each line: prompt lines get typed character by character, output lines appear at once
    const lines = [
        { type: 'cmd', text: 'whoami' },
        { type: 'out', html: '<span class="t-out">devops-cloud-engineer | senior-sysadmin</span>' },
        { type: 'cmd', text: 'uptime --career' },
        { type: 'out', html: '<span class="t-out">9+ years in production, zero regrets</span>' },
        { type: 'cmd', text: 'ls ~/skills/' },
        { type: 'out', html: '<span class="t-dir">aws/  kubernetes/  docker/  terraform/  ci-cd/  security/</span>' },
        { type: 'cmd', text: './deploy --status' },
        { type: 'out', html: '<span class="t-ok">✔ All systems operational</span>' }
    ];

    const promptHTML = '<span class="t-prompt">praveen@devops</span><span class="t-out">:~$ </span>';

    if (prefersReducedMotion) {
        body.innerHTML = lines.map(l =>
            l.type === 'cmd' ? `${promptHTML}<span class="t-cmd">${l.text}</span>` : l.html
        ).join('\n');
        return;
    }

    let lineIndex = 0;

    function typeLine() {
        if (lineIndex >= lines.length) return;
        const line = lines[lineIndex];

        if (line.type === 'out') {
            body.innerHTML += line.html + '\n';
            lineIndex++;
            setTimeout(typeLine, 300);
            return;
        }

        body.innerHTML += promptHTML;
        const cmdSpan = document.createElement('span');
        cmdSpan.className = 't-cmd';
        body.appendChild(cmdSpan);

        let i = 0;
        function typeChar() {
            if (i < line.text.length) {
                cmdSpan.textContent += line.text[i];
                i++;
                setTimeout(typeChar, 45 + Math.random() * 40);
            } else {
                body.appendChild(document.createTextNode('\n'));
                lineIndex++;
                setTimeout(typeLine, 350);
            }
        }
        typeChar();
    }

    // Start typing when the terminal scrolls into view
    const startObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeLine, 600);
                startObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    startObserver.observe(body);
}

// ============================================================
// Animated stat counters
// ============================================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    if (prefersReducedMotion) {
        counters.forEach(c => { c.textContent = c.dataset.target; });
        return;
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1600;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                // Ease-out cubic for a satisfying deceleration
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

// ============================================================
// Skills — core competency meters
// ============================================================
// Sourced from the master file (profile-data.js) — the single source of truth.
const skills = (window.PROFILE_DATA && window.PROFILE_DATA.skills) || [];

function populateSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;
    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card${skill.highlight ? ' highlighted' : ''}">
            ${skill.highlight ? '<span class="skill-badge">Featured Skill</span>' : ''}
            <div class="skill-header">
                ${skill.icon ? `<span class="skill-icon" aria-hidden="true" style="font-size: 1.5rem; margin-right: 8px;">${skill.icon}</span>` : ''}
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="progress-bar" role="progressbar" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100" aria-label="${skill.name} proficiency">
                <div class="progress-fill" data-level="${skill.level}"></div>
            </div>
        </div>
    `).join('');
}

// ============================================================
// Skills — categorized tool matrix (terminal-style cards)
// ============================================================
// Sourced from the master file (profile-data.js) — the single source of truth.
const skillMatrix = (window.PROFILE_DATA && window.PROFILE_DATA.skillMatrix) || [];

function populateSkillMatrix() {
    const matrix = document.querySelector('.skill-matrix');
    if (!matrix) return;
    matrix.innerHTML = skillMatrix.map(cat => `
        <div class="matrix-card slide-up">
            <div class="matrix-header">
                <span class="matrix-icon" aria-hidden="true">${cat.icon}</span>
                <span>${cat.dir}</span>
            </div>
            <div class="matrix-body">
                ${cat.items.map(item => `<span class="tag">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');
    // Newly created cards need to join the reveal animation observer
    matrix.querySelectorAll('.slide-up').forEach(el => animationObserver.observe(el));
}

// Animate skill progress bars when they scroll into view.
// Must be initialized AFTER populateSkills() so the cards exist in the DOM.
function initSkillObserver() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                progressFill.style.width = progressFill.getAttribute('data-level') + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));
}

// ============================================================
// 3D tilt effect on project cards (pointer devices only)
// ============================================================
function initTilt() {
    if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`;
        });
        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================================
// Contact form -> open a pre-filled email (no backend required)
// ============================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cf-name').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const message = document.getElementById('cf-message').value.trim();

        if (!name || !email || !message) {
            status.textContent = 'Please fill in your name, email, and message.';
            status.className = 'form-status error';
            return;
        }

        const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        const toEmail = (window.PROFILE_DATA && window.PROFILE_DATA.contact.email) || 'praveenkumarrajasekaran93@gmail.com';
        window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;

        status.textContent = 'Thanks! Your email app should open with the message ready to send.';
        status.className = 'form-status success';
        form.reset();
    });
}

// Scroll-to-top button
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTopButton() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// Render website sections from the master profile data
// (profile-data.js). Editing the master updates the site here.
// ============================================================
function esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Newly-injected reveal elements must join the scroll-animation observer
function revealObserve(root) {
    if (!root) return;
    root.querySelectorAll('.fade-in, .slide-up').forEach((el) => animationObserver.observe(el));
}

function renderHero() {
    const P = window.PROFILE_DATA;
    if (!P) return;
    const desc = document.querySelector('.hero-description');
    if (desc && P.identity.heroDescription) desc.textContent = P.identity.heroDescription;
    const badge = document.querySelector('.availability-badge');
    if (badge && P.identity.availability) {
        badge.innerHTML = '<span class="status-dot" aria-hidden="true"></span>' + esc(P.identity.availability);
    }
}

function renderAbout() {
    const P = window.PROFILE_DATA;
    if (!P) return;
    const a = P.about || {};
    const textEl = document.querySelector('#about .about-text');
    if (textEl) {
        textEl.innerHTML =
            '<h3>' + esc(a.role) + '</h3>' +
            (a.paragraphs || []).map((par) => '<p>' + esc(par) + '</p>').join('') +
            '<div class="about-highlights">' +
                (a.highlights || []).map((h) => '<span class="highlight-chip">' + esc(h) + '</span>').join('') +
            '</div>';
    }
    const badgesEl = document.querySelector('#about .about-badges');
    if (badgesEl) {
        badgesEl.innerHTML = (a.awards || []).map((w) => '<span class="award-badge">' + esc(w) + '</span>').join('');
    }
}

function renderExperience() {
    const P = window.PROFILE_DATA;
    if (!P) return;
    const el = document.querySelector('#experience .timeline');
    if (!el) return;
    el.innerHTML = (P.experience || []).map((e) =>
        '<div class="timeline-item slide-up">' +
            '<div class="timeline-dot"></div>' +
            '<div class="timeline-content">' +
                '<span class="timeline-date">' + esc(e.dates) + '</span>' +
                '<h3>' + esc(e.role) + '</h3>' +
                '<h4 class="timeline-company">' + esc(e.company) + '</h4>' +
                '<ul class="timeline-list">' +
                    (e.bullets || []).map((b) => '<li>' + esc(b) + '</li>').join('') +
                '</ul>' +
            '</div>' +
        '</div>'
    ).join('');
    revealObserve(el);
}

function renderProjects() {
    const P = window.PROFILE_DATA;
    if (!P) return;
    const el = document.querySelector('#projects .projects-grid');
    if (!el) return;
    el.innerHTML = (P.projects || []).map((pr) =>
        '<div class="project-card slide-up">' +
            '<div class="project-image" aria-hidden="true">' + esc(pr.icon) + '</div>' +
            '<div class="project-content">' +
                '<h3>' + esc(pr.name) + '</h3>' +
                '<p>' + esc(pr.description) + '</p>' +
                '<div class="project-tags">' +
                    (pr.tags || []).map((t) => '<span class="tag">' + esc(t) + '</span>').join('') +
                '</div>' +
            '</div>' +
        '</div>'
    ).join('');
    revealObserve(el);
}

function renderCertifications() {
    const P = window.PROFILE_DATA;
    if (!P) return;
    const el = document.querySelector('#certifications .certifications-grid');
    if (!el) return;
    el.innerHTML = (P.certifications || []).map((ct) =>
        '<div class="cert-card slide-up">' +
            '<div class="cert-icon" aria-hidden="true">' + esc(ct.icon) + '</div>' +
            '<div>' +
                '<h3>' + esc(ct.name) + '</h3>' +
                '<p class="muted">' + esc(ct.detail) + '</p>' +
            '</div>' +
        '</div>'
    ).join('');
    revealObserve(el);
}

function renderEducation() {
    const P = window.PROFILE_DATA;
    if (!P) return;
    const el = document.querySelector('#education .timeline');
    if (!el) return;
    el.innerHTML = (P.education || []).map((ed) =>
        '<div class="timeline-item slide-up">' +
            '<div class="timeline-dot"></div>' +
            '<div class="timeline-content">' +
                '<span class="timeline-date">' + esc(ed.dates) + '</span>' +
                '<h3>' + esc(ed.degree) + '</h3>' +
                '<h4 class="timeline-company">' + esc(ed.field) + '</h4>' +
                '<p class="muted">' + esc(ed.institution) + '</p>' +
                (ed.notes || []).map((n) => '<p class="muted">' + esc(n) + '</p>').join('') +
            '</div>' +
        '</div>'
    ).join('');
    revealObserve(el);
}

function renderContact() {
    const P = window.PROFILE_DATA;
    if (!P) return;
    const c = P.contact || {};
    const info = document.querySelector('#contact .contact-info');
    if (info) {
        const h3 = info.querySelector('h3');
        if (h3 && P.contactIntro) h3.textContent = P.contactIntro.heading;
        const introP = info.querySelector('p');
        if (introP && P.contactIntro) introP.textContent = P.contactIntro.text;
    }
    const details = document.querySelector('#contact .contact-details');
    if (details) {
        details.innerHTML =
            contactItem('📱', 'Phone', '<a href="tel:' + esc(c.phoneLink) + '" class="contact-value">' + esc(c.phone) + '</a>') +
            contactItem('✉️', 'Email', '<a href="mailto:' + esc(c.email) + '" class="contact-value">' + esc(c.email) + '</a>') +
            contactItem('📍', 'Location', esc(c.location));
    }
    const linkedin = document.querySelector('.social-link[aria-label="LinkedIn profile"]');
    if (linkedin) linkedin.href = c.linkedin;
    const github = document.querySelector('.social-link[aria-label="GitHub profile"]');
    if (github) github.href = c.github;
    const emailLink = document.querySelector('.social-link[aria-label="Send email"]');
    if (emailLink) emailLink.href = 'mailto:' + c.email;
}

function contactItem(icon, label, valueHtml) {
    return '<div class="contact-item">' +
        '<div class="contact-icon" aria-hidden="true">' + icon + '</div>' +
        '<div>' +
            '<strong>' + esc(label) + '</strong>' +
            '<p class="muted">' + valueHtml + '</p>' +
        '</div>' +
    '</div>';
}

function renderSite() {
    renderHero();
    renderAbout();
    renderExperience();
    renderProjects();
    renderCertifications();
    renderEducation();
    renderContact();
}

// ============ Download profile modal ============
const downloadFab = document.getElementById('downloadFab');
const downloadModal = document.getElementById('downloadModal');
const dlTemplateList = document.getElementById('dlTemplateList');
let dlLastFocused = null;

// Show the floating download button once the user has scrolled a little
function toggleDownloadFab() {
    if (!downloadFab) return;
    downloadFab.classList.toggle('visible', window.scrollY > 300);
}

// Small download arrow used inside each card
function dlIconMarkup() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>';
}

// A friendly filename for the saved download, e.g. PraveenKumar_Amazon.docx
function dlFileName(template) {
    const base = 'PraveenKumar_' + String(template.label).replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
    const ext = (String(template.file).split('.').pop() || 'docx');
    return base + '.' + ext;
}

// ------------------------------------------------------------
// Map the master PROFILE_DATA into the flat shape the .docx
// merge fields expect. This is the SINGLE mapping used for every
// template, so all downloads always reflect the latest data.
// (Field names here must match the {tags} inside the templates —
//  see TEMPLATE_FIELD_GUIDE.md.)
// ------------------------------------------------------------
function buildResumeData() {
    const P = window.PROFILE_DATA;
    if (!P) return {};
    const c = P.contact || {};
    const matrix = P.skillMatrix || [];
    return {
        fullName: P.identity.fullName,
        title: P.identity.title,
        summary: P.identity.summary,
        email: c.email, phone: c.phone, location: c.location,
        linkedin: c.linkedin, github: c.github,
        experience: (P.experience || []).map((e) => ({
            role: e.role, company: e.company, dates: e.dates, bullets: (e.bullets || []).slice()
        })),
        skillGroups: matrix.map((g) => ({
            label: g.dir.replace('~/', '').replace(/-/g, ' '),
            items: (g.items || []).join(', ')
        })),
        skillsInline: matrix.reduce((a, g) => a.concat(g.items || []), []).join('  •  '),
        projects: (P.projects || []).map((pr) => ({
            name: pr.name, description: pr.description, techInline: (pr.tags || []).join(', ')
        })),
        certifications: (P.certifications || []).map((ct) => ({ name: ct.name, detail: ct.detail })),
        education: (P.education || []).map((ed) => ({
            degree: ed.degree, field: ed.field, institution: ed.institution,
            dates: ed.dates, notesInline: (ed.notes || []).join('; ')
        }))
    };
}

// Trigger a browser download for a generated Blob
function dlSaveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1500);
}

// Fill the chosen .docx template with the latest master data and download it
function generateResume(template, cardEl) {
    const PizZip = window.PizZip;
    const DocxtemplaterModule = window.docxtemplater;
    const Docxtemplater = DocxtemplaterModule && (DocxtemplaterModule.default || DocxtemplaterModule);

    if (!PizZip || !Docxtemplater) {
        dlSetStatus('Resume engine not loaded. Please refresh and try again.', 'error');
        return;
    }
    if (cardEl) cardEl.classList.add('is-loading');
    dlSetStatus('Building your ' + template.label + ' resume…', 'working');

    fetch(template.file)
        .then((res) => {
            if (!res.ok) throw new Error('template-missing');
            return res.arrayBuffer();
        })
        .then((buf) => {
            const zip = new PizZip(buf);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
            doc.render(buildResumeData());
            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });
            dlSaveBlob(out, dlFileName(template));
            dlSetStatus('Downloaded ✓  Your ' + template.label + ' resume is ready.', 'success');
            setTimeout(closeDownloadModal, 1200);
        })
        .catch((err) => {
            if (err && err.message === 'template-missing') {
                markUnavailable(template.id);
                dlSetStatus('That template file isn\'t uploaded yet.', 'error');
            } else {
                dlSetStatus('Sorry — could not build that resume. See console for details.', 'error');
                // eslint-disable-next-line no-console
                console.error('Resume generation failed:', err);
            }
        })
        .finally(() => { if (cardEl) cardEl.classList.remove('is-loading'); });
}

function dlSetStatus(msg, kind) {
    const el = document.getElementById('dlStatus');
    if (!el) return;
    el.textContent = msg;
    el.className = 'dl-status' + (kind ? ' dl-status-' + kind : '');
}

function renderTemplates() {
    if (!dlTemplateList) return;
    const list = Array.isArray(window.RESUME_TEMPLATES) ? window.RESUME_TEMPLATES : [];
    if (!list.length) {
        dlTemplateList.innerHTML = '<p class="dl-card-desc">No templates configured yet. Add entries to resume-templates.js.</p>';
        return;
    }
    dlTemplateList.innerHTML = list.map((t) => {
        const badge = t.isDefault ? '<span class="dl-badge">Default</span>' : '';
        const icon = t.icon ? t.icon : '📄';
        return (
            '<button type="button" class="dl-card" data-dl-id="' + t.id + '">' +
                '<span class="dl-card-icon" aria-hidden="true">' + icon + '</span>' +
                '<span class="dl-card-body">' +
                    '<span class="dl-card-title">' + t.label + ' ' + badge + '</span>' +
                    '<span class="dl-card-desc">' + (t.description || '') + '</span>' +
                '</span>' +
                '<span class="dl-card-cta" aria-hidden="true">' + dlIconMarkup() + '</span>' +
            '</button>'
        );
    }).join('');
    verifyTemplateAvailability(list);
}

// On served (http/https) sites, disable cards whose file is missing so
// visitors never hit a broken download. Skipped on file:// where HEAD
// requests aren't reliable.
function verifyTemplateAvailability(list) {
    if (location.protocol === 'file:') return;
    list.forEach((t) => {
        fetch(t.file, { method: 'HEAD' })
            .then((res) => { if (!res.ok) markUnavailable(t.id); })
            .catch(() => { /* network/permission hiccup — leave the card enabled */ });
    });
}

function markUnavailable(id) {
    if (!dlTemplateList) return;
    const card = dlTemplateList.querySelector('[data-dl-id="' + id + '"]');
    if (!card) return;
    card.classList.add('is-unavailable');
    card.setAttribute('disabled', 'disabled');
    card.setAttribute('aria-disabled', 'true');
    const desc = card.querySelector('.dl-card-desc');
    if (desc) desc.textContent = 'Coming soon — file not uploaded yet.';
}

function openDownloadModal() {
    if (!downloadModal) return;
    dlLastFocused = document.activeElement;
    downloadModal.classList.add('open');
    downloadModal.setAttribute('aria-hidden', 'false');
    if (downloadFab) downloadFab.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = downloadModal.querySelector('.dl-card:not(.is-unavailable), .dl-modal-close');
    if (first) first.focus();
}

function closeDownloadModal() {
    if (!downloadModal) return;
    downloadModal.classList.remove('open');
    downloadModal.setAttribute('aria-hidden', 'true');
    if (downloadFab) downloadFab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (dlLastFocused && typeof dlLastFocused.focus === 'function') dlLastFocused.focus();
}

function initDownloadModal() {
    if (!downloadFab || !downloadModal) return;
    renderTemplates();

    downloadFab.addEventListener('click', openDownloadModal);

    downloadModal.querySelectorAll('[data-dl-close]').forEach((el) => {
        el.addEventListener('click', closeDownloadModal);
    });

    // Generate + download the picked template with the latest master data
    if (dlTemplateList) {
        dlTemplateList.addEventListener('click', (e) => {
            const card = e.target.closest('.dl-card');
            if (!card || card.classList.contains('is-unavailable') || card.classList.contains('is-loading')) return;
            const id = card.getAttribute('data-dl-id');
            const template = (window.RESUME_TEMPLATES || []).find((t) => t.id === id);
            if (template) generateResume(template, card);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && downloadModal.classList.contains('open')) {
            closeDownloadModal();
        }
    });
}

// Keep footer year current
function setFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypedRole();
    initTerminal();
    initCounters();
    renderSite();
    populateSkills();
    populateSkillMatrix();
    initSkillObserver();
    initTilt();
    initContactForm();
    setFooterYear();
    updateActiveNavLink();
    toggleScrollTopButton();
    initDownloadModal();
    toggleDownloadFab();
});
