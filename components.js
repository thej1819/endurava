const pageRoutes = {
  home: '/',
  about: '/about',
  services: '/services',
  stories: '/testimonials',
  contact: '/contact'
};

function currentPage() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  if (path.endsWith('about.html') || path.endsWith('/about')) return 'about';
  if (path.endsWith('services.html') || path.endsWith('/services')) return 'services';
  if (path.endsWith('testimonials.html') || path.endsWith('/testimonials')) return 'stories';
  if (path.endsWith('contact.html') || path.endsWith('/contact')) return 'contact';
  return 'home';
}

function renderHeader() {
  const activePage = currentPage();
  const navItems = [
    { key: 'home', label: 'Home', title: 'Explore Endurava', intro: 'Discover how technology talent and opportunity come together.', groups: [{ heading: 'On this page', links: [['Who We Are', '/#who-we-are', 'Technology talent that powers growth.'], ['Our Services', '/#services', 'Practical support for every next step.'], ['Your Path', '/#your-path', 'Solutions for teams and technology careers.'], ['Technology Expertise', '/#technology-expertise', 'The modern technology ecosystems we support.'], ['Why Endurava', '/#why-endurava', 'A technology-first, human-centered approach.'], ['Testimonials', '/#testimonials', 'Progress stories from talent and teams.'], ['Get Started', '/#get-started', 'Build what comes next with us.']]}] },
    { key: 'about', label: 'About', title: 'About Endurava', intro: 'A technology talent partner built around people and progress.', groups: [{ heading: 'Discover', links: [['Who We Are', '/about#our-story', 'Why Endurava connects talent with opportunity.'], ['Our Approach', '/about#our-approach', 'Deep specialization and thoughtful matching.'], ['Why Endurava', '/about#why-endurava', 'Technology expertise with lasting relationships.'], ['Our Values', '/about#our-values', 'The principles behind our work.']]}], footer: ['Learn More About Us', '/about'] },
    { key: 'services', label: 'Services', title: 'Services', intro: 'Specialized technology talent, skills, and career support.', groups: [{ heading: 'Talent Solutions', links: [['Technology Recruitment', '/services#technology-recruitment', 'Find specialized technology professionals.'], ['Staffing Solutions', '/services#staffing-solutions', 'Flexible teams for evolving needs.'], ['Contract & Permanent Hiring', '/services#contract-permanent-hiring', 'Flexible approaches for every hiring strategy.']] }, { heading: 'AI & Data', links: [['AI & Emerging Tech Talent', '/services#ai-emerging-tech', 'Build teams for tomorrow’s technology.'], ['Data Warehousing & BI', '/services#data-warehousing-bi', 'Decision-ready data expertise.']] }, { heading: 'Career Development', links: [['Technology Training', '/services#technology-training', 'Practical skills for the future of tech.'], ['Career & Placement Support', '/services#career-placement-support', 'Guidance from learning to opportunity.']] }], footer: ['View All Services', '/services'] },
    { key: 'stories', label: 'Testimonials', title: 'Success Stories', intro: 'Real outcomes from career transitions and growing technology teams.', groups: [{ heading: 'Stories', links: [['Candidate Stories', '/testimonials#candidate-stories', 'Career transformations powered by skills and support.'], ['Client Stories', '/testimonials#client-stories', 'How organizations grew the right teams.'], ['Testimonials', '/testimonials', 'Progress worth sharing from people and partners.']]}], footer: ['View Testimonials', '/testimonials'] },
    { key: 'contact', label: 'Contact', title: 'Get in Touch', intro: 'Tell us what you are looking to build next.', contact: true, groups: [{ heading: 'Start a conversation', links: [['For Businesses', '/contact?type=hiring', 'Looking for technology talent?'], ['For Candidates', '/contact?type=career', 'Looking for your next opportunity?'], ['Email Us', 'mailto:admin@enduravatech.com', 'admin@enduravatech.com'], ['Contact Us', '/contact', 'Reach our team directly.']]}], footer: ['Contact Us', '/contact'] }
  ];
  const renderMenu = (item) => `<div class="mega-menu mega-menu--${item.key}${item.contact ? ' mega-menu--contact' : ''}" aria-label="${item.label} menu"><div class="mega-menu-head"><p>${item.title}</p><span>${item.intro}</span></div><div class="mega-menu-groups">${item.groups.map(group => `<section class="mega-menu-group"><h2>${group.heading}</h2>${group.links.map(([label, href, description]) => `<a href="${href}" class="mega-menu-link"><strong>${label} <b aria-hidden="true">→</b></strong><small>${description}</small></a>`).join('')}</section>`).join('')}</div>${item.footer ? `<a class="mega-menu-footer" href="${item.footer[1]}">${item.footer[0]} <span aria-hidden="true">→</span></a>` : ''}</div>`;
  return `<header class="site-header"><div class="header-inner">
    <a class="brand" href="${pageRoutes.home}" aria-label="Endurava Technologies home"><span class="brand-mark">E</span><span>ENDURAVA <small>TECHNOLOGIES</small></span></a>
    <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    <nav class="main-nav" aria-label="Main navigation">${navItems.map(item => `<div class="nav-item"><div class="nav-parent"><a class="nav-link ${item.key === activePage ? 'active' : ''}" href="${pageRoutes[item.key]}">${item.label}</a><button class="submenu-toggle" type="button" aria-label="Show ${item.label} menu" aria-haspopup="true" aria-expanded="false"><span aria-hidden="true">⌄</span></button></div>${renderMenu(item)}</div>`).join('')}</nav>
    <a class="header-cta" href="${pageRoutes.contact}">Get Started <span>↗</span></a>
  </div></header>`;
}

function renderFooter() {
  return `<footer class="site-footer"><div class="page-wrap footer-grid"><div><a class="brand footer-brand" href="${pageRoutes.home}"><span class="brand-mark">E</span><span>ENDURAVA <small>TECHNOLOGIES</small></span></a><p>Empowering talent. Connecting opportunities. Building what comes next.</p></div><div><h3>Quick Links</h3><a href="${pageRoutes.home}">Home</a><a href="${pageRoutes.about}">About</a><a href="${pageRoutes.services}">Services</a><a href="${pageRoutes.stories}">Testimonials</a></div><div><h3>Explore</h3><a href="${pageRoutes.contact}">Contact</a><a href="${pageRoutes.services}">Recruitment</a><a href="${pageRoutes.services}">Training</a></div><div><h3>Contact</h3><a href="mailto:admin@enduravatech.com">admin@enduravatech.com</a><span>7780580473</span><span>Hyderabad, Telangana, India</span><div class="socials"><span>LinkedIn</span><span>Instagram</span><span>Facebook</span></div></div></div><div class="page-wrap footer-bottom"><span>© 2026 Endurava Technologies. All Rights Reserved.</span><span>Talent / Training / Opportunity</span></div></footer>`;
}

document.querySelector('[data-site-header]')?.replaceWith(document.createRange().createContextualFragment(renderHeader()));
document.querySelector('[data-site-footer]')?.replaceWith(document.createRange().createContextualFragment(renderFooter()));
