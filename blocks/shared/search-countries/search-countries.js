import {
  loadCSS,
} from '../../../scripts/lib-franklin.js';

const imgHTML = (country) => `<img src="/icons/flags/${country}.png" alt="${country}" class="label-image" role="presentation" aria-hidden="true" tabIndex="-1" height="25" width="25"/>${country}`;

function addListeners(wrapper) {
  wrapper.querySelector('.selected').addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    wrapper.classList.toggle('open');
  });

  wrapper.querySelectorAll('.select-items .item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selected = e.currentTarget.getAttribute('data-value');
      wrapper.querySelector('.selected').innerHTML = imgHTML(selected);

      wrapper.querySelector('.select-items .item.selected')?.classList.remove('selected');
      e.currentTarget.classList.add('selected');

      wrapper.querySelector('select option[selected="selected"]')?.removeAttribute('selected');
      wrapper.querySelector(`select option[value="${selected}"]`).setAttribute('selected', 'selected');
      wrapper.classList.toggle('open');
    });
  });
}

/**
 * Create the Country Select drop down to use in various locations.
 *
 * @returns {Promise.<HTMLElement>} the HTML string of the select element.
 */
export default async function buildCountrySelect() {
  const resp = await fetch('/search/country-list.plain.html');
  if (!resp.ok) {
    return undefined;
  }

  loadCSS(`${window.hlx.codeBasePath}/blocks/shared/search-countries/search-countries.css`);
  const tmp = document.createElement('div');
  tmp.innerHTML = await resp.text();

  const list = tmp.querySelectorAll('div > ul > li');
  const select = document.createElement('select');
  const ul = document.createElement('ul');
  ul.classList.add('select-items');
  ul.setAttribute('role', 'listbox');

  list.forEach((li) => {
    if (!li.hasChildNodes() || li.childNodes[0].nodeType !== Node.TEXT_NODE) {
      return;
    }
    const country = li.childNodes[0].nodeValue.trim();
    const option = document.createElement('option');
    select.append(option);
    option.value = country;
    option.innerHTML = `${country}`;

    const item = document.createElement('li');
    item.setAttribute('role', 'option');
    item.setAttribute('data-value', country);
    item.classList.add('item');
    item.innerHTML = `
      <a role="button" tabindex="-1"><img src="/icons/flags/${country}.png" alt="${country}" class="label-image" role="presentation" aria-hidden="true" tabIndex="-1"/>${country}</a>
    `;
    ul.append(item);

    const submenu = li.querySelector(':scope ul');
    if (submenu) {
      item.classList.add('has-children');
      item.append(submenu);
    }
  });

  const first = select.querySelector('option');
  first.setAttribute('selected', 'selected');

  const selected = document.createElement('div');
  selected.classList.add('selected');
  selected.setAttribute('aria-haspopup', 'listbox');
  selected.setAttribute('aria-expanded', 'false');
  selected.setAttribute('aria-label', 'Select Country');
  selected.setAttribute('role', 'button');
  selected.setAttribute('tabIndex', '0');
  selected.innerHTML = imgHTML(first.value);

  ul.querySelector(`.item[data-value="${first.value}"]`).classList.add('selected');

  const wrapper = document.createElement('div');
  wrapper.classList.add('search-country-select-wrapper');
  wrapper.append(select, selected, ul);
  addListeners(wrapper);
  return wrapper;
}
