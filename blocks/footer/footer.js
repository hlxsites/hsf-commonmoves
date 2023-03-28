import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();
    // decorate footer DOM
    const footer = document.createElement('div');
    footer.className = 'footer-container';
    const footerFlex = document.createElement('div');
    footerFlex.className = 'footer-container-flex';
    footerFlex.innerHTML = html;
    footer.append(footerFlex);
    decorateIcons(footer);
    block.append(footer);
    const parentDiv = block.querySelector('ul').closest('div');
    const ulChildren = [...parentDiv.querySelectorAll('ul')];
    const wrapper = document.createElement('div');
    wrapper.className = 'link-menu-row';
    ulChildren.forEach((elem) => {
      const div = document.createElement('div');
      div.className = 'link-menu-col';
      div.append(elem);
      wrapper.append(div);
    });
    parentDiv.prepend(wrapper);
  }
}
