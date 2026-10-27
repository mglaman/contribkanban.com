/**
 * @file
 * Collapses the main menu behind a toggle button on small screens.
 */

document.querySelectorAll('.page-header').forEach((header) => {
  const toggle = header.querySelector('.page-header__toggle');
  const menu = header.querySelector('.page-header__menu');
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => toggle.setAttribute('aria-expanded', String(open));

  toggle.hidden = false;
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  // The backdrop is the header's ::after, so clicks on it target the header.
  document.addEventListener('click', (event) => {
    if (isOpen() && !menu.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
});
