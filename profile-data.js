// ============================================================
//  MASTER PROFILE DATA  —  SINGLE SOURCE OF TRUTH
// ------------------------------------------------------------
//  Edit THIS file to update your details. Everything else reads
//  from here:
//    • the live website (About, Skills, Experience, Projects,
//      Certifications, Education, Contact all render from this)
//    • every downloadable resume (your latest data is rendered
//      into the PDF layout you pick)
//
//  You never edit index.html for content again — just this file.
//  After editing, refresh the page; downloads use it automatically.
// ============================================================

const PROFILE_DATA = {

    // ---- Identity -------------------------------------------------
    identity: {
        fullName: 'Praveen Kumar Rajasekaran',
        title: 'DevOps Cloud Engineer',
        yearsExperience: 9,
        availability: 'Open to opportunities',
        // Short professional summary — used at the top of resumes.
        summary: 'DevOps Cloud Engineer with 9 years of experience building resilient, ' +
            'scalable multi-cloud infrastructure — 6 years as a Senior System Administrator and ' +
            '3+ years in DevOps. Specialised in CI/CD automation, containerisation, cloud security, ' +
            'and cost optimisation, with a track record of leading teams and acting as security SPOC.',
        // Longer hero blurb shown on the website home section.
        heroDescription: '9 years of engineering resilient infrastructure — 6 years as a Senior System Administrator, ' +
            '3+ years deep in DevOps. I design scalable multi-cloud environments, automate CI/CD pipelines, ' +
            'and harden application security. Passionate about building websites and leveraging AI tools ' +
            'like Claude Code for code generation and optimization.'
    },

    // ---- Contact --------------------------------------------------
    contact: {
        phone: '+91 8056804695',
        phoneLink: '+918056804695',
        email: 'praveenkumarrajasekaran93@gmail.com',
        location: 'Bangalore, Karnataka, India',
        linkedin: 'https://www.linkedin.com/in/praveen-kumar-itconsultant',
        github: 'https://github.com/praveenkumarrajasekaran93'
    },

    // ---- About ----------------------------------------------------
    about: {
        role: 'DevOps Cloud Engineer & Senior System Administrator',
        paragraphs: [
            "I'm a dedicated technology professional with extensive experience in designing and deploying scalable multi-cloud " +
            "environments. My expertise spans cloud infrastructure management, CI/CD pipeline automation, and ensuring application " +
            "security through white-box, black-box, and grey-box testing methodologies.",
            "Throughout my career, I've led cross-functional teams and served as the Single Point of Contact (SPOC) " +
            "for security incidents. I'm passionate about implementing cloud architectures focused on high availability, auto-scaling, " +
            "and resource management — always with an eye on cost optimization.",
            "My journey includes managing large-scale infrastructure, database optimization and migration, and delivering " +
            "cost-effective, secure, and highly available solutions. I'm committed to continuous improvement and mentoring " +
            "teams to foster collaborative growth."
        ],
        highlights: [
            '☁️ Multi-Cloud Architecture',
            '🔐 Security SPOC',
            '📋 ISO 27001',
            '🤝 Team Leadership',
            '🤖 AI-Assisted Development'
        ],
        awards: [
            '🏆 ACE Performance of the Year 2025',
            '💡 Brainiac Idean 2021'
        ]
    },

    // ---- Core competency meters (website Skills > Core) -----------
    skills: [
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
    ],

    // ---- Categorized tool matrix (website Skills > Full Stack) ----
    skillMatrix: [
        { dir: '~/devops-tools', icon: '🚀', items: ['Jenkins', 'GitLab', 'Docker', 'Kubernetes', 'Terraform', 'SonarQube', 'Kafka', 'Git', 'Bugzilla'] },
        { dir: '~/cloud-and-web', icon: '☁️', items: ['AWS', 'IIS', 'NGINX', 'Apache', '.NET', 'Microservices'] },
        { dir: '~/security', icon: '🛡️', items: ['SonicWall', 'pfSense', 'FortiGate', 'Sequrite', 'Burp Suite', 'Nmap', 'Nessus', 'ISO 27001'] },
        { dir: '~/monitoring', icon: '📡', items: ['Nagios Core', 'New Relic', 'Resource Monitoring'] },
        { dir: '~/virtualization', icon: '🖥️', items: ['Proxmox', 'ESXi', 'vCenter', 'Clustering'] },
        { dir: '~/servers-and-os', icon: '🐧', items: ['Windows Server', 'SUSE Linux', 'Ubuntu'] },
        { dir: '~/databases', icon: '🗄️', items: ['Oracle', 'PostgreSQL', 'MSSQL'] },
        { dir: '~/scripting', icon: '📜', items: ['Bash', 'PowerShell', 'Python'] },
        { dir: '~/mail-and-bi', icon: '📬', items: ['HMail', 'O365', 'Roundcube', 'Power BI', 'Tableau'] }
    ],

    // ---- Work experience -----------------------------------------
    experience: [
        {
            role: 'DevOps Cloud Engineer',
            company: 'Idea Infinity IT Solution Pvt. Ltd.',
            dates: 'February 2021 - Present',
            bullets: [
                'Designing and deploying scalable cloud architectures for multi-cloud environments',
                'Automating deployment pipelines & optimizing CI/CD processes using Jenkins, GitLab, & Terraform',
                'Managing containerized environments with Docker & Kubernetes for auto-scaling',
                'Leading AWS cloud infrastructure with focus on security and cost optimization',
                'Implementing load balancing solutions using NGINX & HAProxy',
                'Conducting penetration testing and vulnerability assessments',
                'Leading IT teams and mentoring professionals'
            ]
        },
        {
            role: 'Senior System Administrator',
            company: 'Idea Infinity IT Solution Pvt. Ltd.',
            dates: 'August 2016 - January 2021',
            bullets: [
                'Administered Linux & Windows servers ensuring system availability',
                'Implemented firewall solutions using SonicWall & FortiGate',
                'Optimized virtualized environments (Proxmox, ESXi, vCenter)',
                'Conducted security audits and penetration testing',
                'Managed Nagios Core for proactive monitoring',
                'Provided tier 2 & 3 technical support'
            ]
        },
        {
            role: 'Junior Network Engineer',
            company: 'Tata Teleservice, Bangalore',
            dates: 'November 2015 - July 2016',
            bullets: [
                'Configured and troubleshooted DSL modems and routers',
                'Managed DSLAM servers for broadband services',
                'Provided customer support and network troubleshooting',
                'Conducted network maintenance and software upgrades'
            ]
        }
    ],

    // ---- Notable projects ----------------------------------------
    projects: [
        { name: 'Multi-Cloud Infrastructure Migration', icon: '☁️', description: 'Migrated 200+ instances from physical servers to Proxmox virtualized environment with clustering and SAN storage for improved scalability.', tags: ['Proxmox', 'Virtualization', 'Clustering'] },
        { name: 'Email Migration & Exchange Server', icon: '📧', description: 'Successfully migrated 300+ employee email mailboxes to on-premises HMail Exchange server, ensuring seamless communication.', tags: ['HMail', 'Email Infrastructure'] },
        { name: 'Endpoint Security Implementation', icon: '🔒', description: 'Led endpoint security implementation across organization using Sequrite, providing advanced antivirus and security features.', tags: ['Sequrite', 'Security'] },
        { name: 'PostgreSQL Active Directory Integration', icon: '🔐', description: 'Implemented access control in PostgreSQL integrated with Active Directory for enhanced security and high availability.', tags: ['PostgreSQL', 'Active Directory', 'Security'] },
        { name: 'AI-Based OCR Mobile Module', icon: '🤖', description: 'Led developer team to implement AI-based OCR module in a mobile application, utilizing new technologies recognized by IdeaInfinity.', tags: ['AI/ML', 'OCR'] },
        { name: 'Nagios Enterprise Monitoring', icon: '📊', description: 'Implemented Nagios Core for enterprise-level monitoring across 200+ instances, enhancing system reliability and efficiency.', tags: ['Nagios', 'Monitoring'] }
    ],

    // ---- Certifications ------------------------------------------
    certifications: [
        { name: 'CCNA', detail: 'Cisco Certified Network Associate', icon: '📜' },
        { name: 'DevOps Training', detail: 'Tools and Automation Practices', icon: '⚙️' },
        { name: 'Cybersecurity', detail: 'Fundamentals and Advanced Techniques', icon: '🛡️' },
        { name: 'Penetration Testing', detail: 'Vulnerability Assessment and Exploitation', icon: '🎯' }
    ],

    // ---- Education -----------------------------------------------
    education: [
        {
            degree: 'Bachelor of Engineering (B.E.)',
            field: 'Electronics & Communication',
            institution: 'Sri Ramakrishna Engineering College, Coimbatore',
            dates: '2015',
            notes: ['Graduated with distinction, GPA: 7.5']
        }
    ],

    // ---- Contact-section intro (website) -------------------------
    contactIntro: {
        heading: "Let's Connect",
        text: "I'm always open to discussing new opportunities, collaborations, or simply connecting with fellow professionals " +
            "in the DevOps and cloud engineering space."
    }
};

window.PROFILE_DATA = PROFILE_DATA;
