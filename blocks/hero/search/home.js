import {
  build as buildCountrySelect,
} from '../../shared/search-countries/search-countries.js';
import { getMetadata, loadScript } from '../../../scripts/aem.js';
import { getSpinner } from '../../../scripts/util.js';
import Search from '../../../scripts/apis/creg/search/Search.js';
import { metadataSearch } from '../../../scripts/apis/creg/creg.js';

function observeForm() {
  if (document.querySelector('script[src~="/blocks/hero/search/home/suggestion.js"]')) {
    return;
  }
  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${window.hlx.codeBasePath}/blocks/hero/search/home/suggestion.js`;
  document.head.append(script);
}

async function submitForm(e) {
  e.preventDefault();
  e.stopPropagation();

  const spinner = getSpinner();
  const form = e.currentTarget.closest('form');
  form.prepend(spinner);

  const type = form.querySelector('input[name="type"]');

  let search = new Search();
  if (type && type.value) {
    try {
      const mod = await import(`${window.hlx.codeBasePath}/scripts/apis/creg/search/types/${type.value}Search.js`);
      if (mod.default) {
        // eslint-disable-next-line new-cap
        search = new mod.default();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`failed to load Search Type for ${type.value}`, error);
    }
  }
  search.populateFromSuggestion(new URLSearchParams(form.querySelector('input[name="query"]').value));
  search.input = form.querySelector('input[name="keyword"]').value;

  search.minPrice = form.querySelector('input[name="minPrice"]').value;
  search.maxPrice = form.querySelector('input[name="maxPrice"]').value;
  search.minBedrooms = form.querySelector('select[name="bedrooms"]').value;
  search.minBathrooms = form.querySelector('select[name="bathrooms"]').value;

  const franchisee = getMetadata('office-id');
  if (franchisee) {
    search.franchisee = franchisee;
  }
  metadataSearch(search).then((results) => {
    if (results) {
      let url = '';
      if (window.location.href.includes('localhost')) {
        url += `/search?${search.asURLSearchParameters()}`;
      } else if (results.vanityDomain) {
        if (getMetadata('vanity-domain') === results.vanityDomain) {
          url += `/search?${search.asURLSearchParameters()}`;
        } else {
          url += `${results.vanityDomain}/search?${search.asCregURLSearchParameters()}`;
        }
      } else {
        url = `https://www.bhhs.com${results.searchPath}/search?${search.asCregURLSearchParameters()}`;
      }
      window.location = url;
    }
    spinner.remove();
  });
}

/**
 * Creates a Select dropdown for filtering search.
 * @param {String} name
 * @param {String} placeholder
 * @param {number} number
 * @returns {HTMLDivElement}
 */
function buildSelect(name, placeholder, number) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('select-wrapper');
  wrapper.innerHTML = `
    <select name="${name}" aria-label="${placeholder}">
      <option value="">${placeholder}</option>
    </select>
    <div class="selected" role="button" aria-haspopup="listbox" aria-label="${placeholder}" tabindex="0">${placeholder}</div>
    <ul class="select-items" role="listbox">
      <li role="option">${placeholder}</li>
    </ul>
  `;

  const select = wrapper.querySelector('select');
  const ul = wrapper.querySelector('ul');
  for (let i = 1; i <= number; i += 1) {
    const option = document.createElement('option');
    const li = document.createElement('li');
    li.setAttribute('role', 'option');

    option.value = `${i}`;
    // eslint-disable-next-line no-multi-assign
    option.textContent = li.textContent = `${i}+`;
    select.append(option);
    ul.append(li);
  }
  return wrapper;
}

function getPlaceholder(country) {
  if (country && country !== 'US') {
    return 'Enter City';
  }
  return 'Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#';
}

async function buildForm() {
  const form = document.createElement('form');
  form.classList.add('homes');
  form.setAttribute('action', '/search');

  form.innerHTML = `
    <div class="mobile-header">
      <div class="logo">
        <img alt="Logo" src="/styles/images/logo-black.svg" />
      </div>
      <button class="close" aria-label="Close" type="button">
        <svg role="presentation" aria-hidden="true" tabindex="-1">
          <use xlink:href="/icons/icons.svg#close-x"></use>
        </svg>
      </button>
    </div>
    <div class="search-bar" role="search">
      <div class="search-suggester">
        <div class="search-country-select-parent"></div>
        <div class="suggester-input">
          <input type="text" placeholder="${getPlaceholder()}" aria-label="${getPlaceholder()}" name="keyword">
          <input type="hidden" name="query">
          <input type="hidden" name="type">
          <ul class="suggester-results">
            <li class="list-title">Please enter at least 3 characters.</li>
          </ul>
        </div>
      </div>
      <button class="filter" type="button" aria-label="More Filters" aria-haspopup="true">
        <span class="icon icon-filter">
          <img src="/icons/filter.svg" role="presentation" alt="Filter"/>
        </span>
      </button>
      <button class="search-submit" aria-label="Search Homes" type="submit">
        <span>Search</span>
      </button>
    </div>
    <div class="filters">
      <input type="text" placeholder="$ Minimum Price" name="minPrice" aria-label="minimum price">
      <input type="text" placeholder="$ Maximum Price" name="maxPrice" aria-label="maximum price">
      ${buildSelect('bedrooms', 'Bedrooms', 5).outerHTML}
      ${buildSelect('bathrooms', 'Bathrooms', 5).outerHTML}
       <button class="close" aria-label="Close" type="button">
         <svg role="presentation" aria-hidden="true">
          <use xlink:href="/icons/icons.svg#close-x"></use>
        </svg>
      </button>
    </div>
    <button class="submit" type="submit">Search</button>
  `;

  const input = form.querySelector('.suggester-input input');

  const changeCountry = (country) => {
    const placeholder = getPlaceholder(country);
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('aria-label', placeholder);
  };

  buildCountrySelect(changeCountry).then((select) => {
    if (select) {
      form.querySelector('.search-country-select-parent').append(select);
    }
  });

  window.setTimeout(() => {
    loadScript(`${window.hlx.codeBasePath}/blocks/hero/search/home/filters.js`, { type: 'module' });
  }, 3000);

  input.addEventListener('focus', observeForm);

  form.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.addEventListener('click', submitForm);
  });

  return form;
}

const homes = {
  buildForm,
};

export default homes;
