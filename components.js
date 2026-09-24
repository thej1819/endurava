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
    ['home', 'Home'],
    ['about', 'About'],
    ['services', 'Services'],
    ['stories', 'Testimonials'],
    ['contact', 'Contact']
  ];
  return `<header class="site-header"><div class="header-inner">
    <a class="brand" href="${pageRoutes.home}" aria-label="Endurava Technologies home"><span class="brand-mark">E</span><span>ENDURAVA <small>TECHNOLOGIES</small></span></a>
    <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    <nav class="main-nav" aria-label="Main navigation">${navItems.map(([key, label]) => `<a class="${key === activePage ? 'active' : ''}" href="${pageRoutes[key]}">${label}</a>`).join('')}</nav>
    <a class="header-cta" href="${pageRoutes.contact}">Get Started <span>↗</span></a>
  </div></header>`;
}

function renderFooter() {
  return `<footer class="site-footer"><div class="page-wrap footer-grid"><div><a class="brand footer-brand" href="${pageRoutes.home}"><span class="brand-mark">E</span><span>ENDURAVA <small>TECHNOLOGIES</small></span></a><p>Empowering talent. Connecting opportunities. Building what comes next.</p></div><div><h3>Quick Links</h3><a href="${pageRoutes.home}">Home</a><a href="${pageRoutes.about}">About</a><a href="${pageRoutes.services}">Services</a><a href="${pageRoutes.stories}">Testimonials</a></div><div><h3>Explore</h3><a href="${pageRoutes.contact}">Contact</a><a href="${pageRoutes.services}">Recruitment</a><a href="${pageRoutes.services}">Training</a></div><div><h3>Contact</h3><a href="mailto:admin@enduravatech.com">admin@enduravatech.com</a><span>7780580473</span><span>Hyderabad, Telangana, India</span><div class="socials"><span>LinkedIn</span><span>Instagram</span><span>Facebook</span></div></div></div><div class="page-wrap footer-bottom"><span>© 2026 Endurava Technologies. All Rights Reserved.</span><span>Talent / Training / Opportunity</span></div></footer>`;
}

document.querySelector('[data-site-header]')?.replaceWith(document.createRange().createContextualFragment(renderHeader()));
document.querySelector('[data-site-footer]')?.replaceWith(document.createRange().createContextualFragment(renderFooter()));
