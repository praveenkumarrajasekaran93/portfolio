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
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
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

// Skill progress bar animation
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressFill = entry.target.querySelector('.progress-fill');
            const level = progressFill.getAttribute('data-level');
            progressFill.style.width = level + '%';
        }
    });
}, { threshold: 0.5 });

skillCards.forEach(card => {
    skillObserver.observe(card);
});

// Scroll animations
const animateElements = document.querySelectorAll('.fade-in, .slide-up');

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

animateElements.forEach(el => {
    animationObserver.observe(el);
});

// Skill data from profile
const skills = [
    { name: 'CI/CD Pipeline Automation', level: 95, category: 'DevOps' },
    { name: 'Cloud Infrastructure (AWS)', level: 90, category: 'Cloud' },
    { name: 'Docker & Kubernetes', level: 88, category: 'DevOps' },
    { name: 'Terraform', level: 85, category: 'Infrastructure' },
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
        <div class="skill-card">
            <div class="skill-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" data-level="${skill.level}"></div>
            </div>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateSkills();
});