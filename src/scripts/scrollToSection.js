/**
 * Scrolls smoothly to the specified section on the page.
 * @param {string} selector - The CSS selector of the section to scroll to.
 */
export function scrollToSection(selector) {
  const section = document.querySelector(selector);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}