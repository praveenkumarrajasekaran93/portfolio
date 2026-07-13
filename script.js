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
const skills = [
    { name: 'CI/CD Pipeline Automation', level: 95, category: 'DevOps' },
    { name: 'Cloud Infrastructure (AWS)', level: 90, category: 'Cloud' },
    { name: 'Docker & Kubernetes', level: 88, category: 'DevOps' },
    { name: 'Terraform', level: 85, category: 'Infrastructure' },
    { name: 'Static & Dynamic Website Development', level: 92, category: 'Web Dev', highlight: true, icon: '💻' },
    { name: 'AI Tools & Cloud Development (Claude Code, GitHub Copilot)', level: 94, category: 'AI', highlight: true, icon: '🤖✨' },
    { name: 'Linux Administration', level: 92, category: 'System' },
    { name: 'Load Balancing (NGINX/HAProxy)', level: 87, category: 'Infrastructure' },
    { name: 'PostgreSQL', level: 82, category: 'Database' },
    { name: 'Penetration Testing', level: 80, category: 'Security' },
    { name: 'Jenkins', level: 88, category: 'DevOps' },
    { name: 'Security Audits', level: 85, category: 'Security' },
    { name: 'Monitoring (Nagios)', level: 84, category: 'System' },
    { name: 'Bash & PowerShell', level: 86, category: 'Scripting' }
];

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
const skillMatrix = [
    { dir: '~/devops-tools', icon: '🚀', items: ['Jenkins', 'GitLab', 'Docker', 'Kubernetes', 'Terraform', 'SonarQube', 'Kafka', 'Git', 'Bugzilla'] },
    { dir: '~/cloud-and-web', icon: '☁️', items: ['AWS', 'IIS', 'NGINX', 'Apache', '.NET', 'Microservices'] },
    { dir: '~/security', icon: '🛡️', items: ['SonicWall', 'pfSense', 'FortiGate', 'Sequrite', 'Burp Suite', 'Nmap', 'Nessus', 'ISO 27001'] },
    { dir: '~/monitoring', icon: '📡', items: ['Nagios Core', 'New Relic', 'Resource Monitoring'] },
    { dir: '~/virtualization', icon: '🖥️', items: ['Proxmox', 'ESXi', 'vCenter', 'Clustering'] },
    { dir: '~/servers-and-os', icon: '🐧', items: ['Windows Server', 'SUSE Linux', 'Ubuntu'] },
    { dir: '~/databases', icon: '🗄️', items: ['Oracle', 'PostgreSQL', 'MSSQL'] },
    { dir: '~/scripting', icon: '📜', items: ['Bash', 'PowerShell', 'Python'] },
    { dir: '~/mail-and-bi', icon: '📬', items: ['HMail', 'O365', 'Roundcube', 'Power BI', 'Tableau'] }
];

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
        window.location.href = `mailto:praveenkumarrajasekaran93@gmail.com?subject=${subject}&body=${body}`;

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
    populateSkills();
    populateSkillMatrix();
    initSkillObserver();
    initTilt();
    initContactForm();
    setFooterYear();
    updateActiveNavLink();
    toggleScrollTopButton();
});
