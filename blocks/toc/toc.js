const isDesktop = window.matchMedia('(min-width: 600px)');

/**
 * Build the ToC from nav list.
 * @param block
 * @returns {Promise<void>}
 */
export default async function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-expanded', isDesktop.matches);

  const opener = document.createElement('a');
  opener.href = '#';
  opener.textContent = 'Jump To';

  nav.append(opener);
  nav.append(block.querySelector('ul'));
  block.replaceChildren(nav);

  isDesktop.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', isDesktop.matches);
  });

  opener.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (nav.getAttribute('aria-expanded') === 'true') {
      nav.setAttribute('aria-expanded', 'false');
    } else {
      nav.setAttribute('aria-expanded', 'true');
    }
  });
}
