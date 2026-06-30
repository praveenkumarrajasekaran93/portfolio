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

// Skill data from profile
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

// Populate skills section
function populateSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
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

// Contact form -> open a pre-filled email (no backend required)
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
    populateSkills();
    initSkillObserver();
    initContactForm();
    setFooterYear();
    updateActiveNavLink();
    toggleScrollTopButton();
});
