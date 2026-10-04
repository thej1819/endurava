const menuButton = document.querySelector('.menu-btn');
const mainNav = document.querySelector('.main-nav');
const navItems = mainNav?.querySelectorAll('.nav-item') || [];
const desktopNavigation = window.matchMedia('(min-width: 761px)');

function setSubmenu(item, isOpen) {
  const toggle = item.querySelector('.submenu-toggle');
  item.classList.toggle('submenu-open', isOpen);
  toggle?.setAttribute('aria-expanded', String(isOpen));
  toggle?.setAttribute('aria-label', `${isOpen ? 'Hide' : 'Show'} ${item.querySelector('.nav-link')?.textContent} menu`);
}

function closeSubmenus(except) {
  navItems.forEach(item => {
    if (item !== except) setSubmenu(item, false);
  });
}

menuButton?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navItems.forEach(item => {
  const toggle = item.querySelector('.submenu-toggle');
  toggle?.addEventListener('click', () => {
    const willOpen = !item.classList.contains('submenu-open');
    closeSubmenus(item);
    setSubmenu(item, willOpen);
  });
  item.addEventListener('mouseenter', () => {
    if (desktopNavigation.matches) {
      closeSubmenus(item);
      setSubmenu(item, true);
    }
  });
  item.addEventListener('mouseleave', () => {
    if (desktopNavigation.matches) setSubmenu(item, false);
  });
  item.addEventListener('focusin', () => {
    closeSubmenus(item);
    setSubmenu(item, true);
  });
  item.addEventListener('focusout', event => {
    if (!item.contains(event.relatedTarget)) setSubmenu(item, false);
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeSubmenus();
});
document.addEventListener('click', event => {
  if (!event.target.closest('.main-nav')) closeSubmenus();
});
desktopNavigation.addEventListener('change', () => closeSubmenus());

mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
}));
