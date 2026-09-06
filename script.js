const menuButton = document.querySelector('.menu-btn');
const mainNav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
}));

const enquiryForm = document.querySelector('.enquiry-form');
const formMessage = document.querySelector('.form-message');
enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  enquiryForm.reset();
  if (formMessage) {
    formMessage.textContent = "Thank you for contacting Endurava Technologies. We'll get back to you soon.";
    formMessage.classList.add('visible');
  }
});
