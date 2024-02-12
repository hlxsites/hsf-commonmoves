import { filterItemClicked } from '../shared/search/util.js';

const updateExpanded = (wrapper) => {
  const wasOpen = wrapper.classList.contains('open');
  const thisForm = wrapper.closest('form');
  thisForm.querySelectorAll('.open').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
  });
  if (!wasOpen) {
    wrapper.classList.add('open');
    wrapper.querySelector('[aria-expanded="false"]')?.setAttribute('aria-expanded', 'true');
  }
};

async function observeSearchInput(e) {
  e.preventDefault();
  e.stopPropagation();
  const form = e.target.closest('form');
  try {
    const mod = await import(`${window.hlx.codeBasePath}/blocks/shared/search/suggestion.js`);
    mod.default(form);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('failed to load suggestion library', error);
  }
  e.target.removeEventListener('focus', observeSearchInput);
}

const createPriceList = (d) => {
  let options = '';
  const k = [10, 100, 1E3, 1E4, 1E5, 1E6];
  // eslint-disable-next-line no-plusplus
  if (d) for (let m = 1; m <= 6; m++) options += `<option> ${d * k[m - 1]} </option>`;
  return options;
};

function abbrNum(value, exp) {
  let abbr = value;
  const factor = 10 ** exp;
  const k = ['k', 'm', 'b', 't'];
  let m;
  for (m = k.length - 1; m >= 0; m -= 1) {
    const n = 10 ** (3 * (m + 1));
    if (n <= abbr) {
      abbr = Math.round((value * factor) / n) / factor;
      if (abbr === 1E3 && m < k.length - 1) {
        abbr = 1;
        m += 1;
      }
      abbr += k[m];
      break;
    }
  }
  return abbr;
}

function formatPriceLabel(minPrice, maxPrice) {
  const low = minPrice.replace(/[^0-9]/g, '');
  const high = maxPrice.replace(/[^0-9]/g, '');
  if (low !== '' && high !== '') return `$${abbrNum(low, 2)} -<br/>$${abbrNum(high, 2)}`;
  if (low !== '') return `$${abbrNum(low, 2)}`;
  if (high !== '') return `$0 -<br/>$${abbrNum(high, 2)}`;
  return 'Price';
}

function observePriceInput(e) {
  e.preventDefault();
  e.stopPropagation();
  const { value } = e.target;
  const wrapper = e.target.closest('.range-wrapper');
  const min = wrapper.querySelector('input[name="min-price"]').value;
  const max = wrapper.querySelector('input[name="max-price"]').value;
  const datalist = e.target.closest('.input-dropdown').querySelector('datalist');
  datalist.innerHTML = createPriceList(value);
  e.target.closest('.range-wrapper').querySelector('.selected span').innerHTML = formatPriceLabel(min, max);
}

function filterSelectClicked(e) {
  e.preventDefault();
  e.stopPropagation();
  updateExpanded(e.currentTarget.closest('.select-wrapper'));
}

function rangeSelectClicked(e) {
  e.preventDefault();
  e.stopPropagation();
  updateExpanded(e.currentTarget.closest('.range-wrapper'));
}

function sqftSelectClicked(e) {
  e.preventDefault();
  e.stopPropagation();
  const { currentTarget } = e;
  currentTarget.setAttribute('aria-expanded', true);
  currentTarget.closest('.select-wrapper').classList.add('open');
}

function sqftOptionClicked(e) {
  const wrapper = e.currentTarget.closest('.range-wrapper');
  const min = wrapper.querySelector('#list-min-sqft li.selected');
  const max = wrapper.querySelector('#list-max-sqft li.selected');

  let label = wrapper.querySelector('div.selected').getAttribute('aria-label');

  if (min.getAttribute('data-value') || max.getAttribute('data-value')) {
    label = `${min.textContent} -<br/>${max.textContent}`;
  }
  wrapper.querySelector('span').innerHTML = label;
}

async function observeForm(form) {
  const searchInput = form.querySelector('.suggester-input input');
  searchInput.addEventListener('focus', observeSearchInput);

  form.querySelectorAll('.result-filters > .select-wrapper div.selected').forEach((button) => {
    button.addEventListener('click', filterSelectClicked);
  });

  form.querySelectorAll('.select-wrapper .select-items li, .range-select-wrapper .select-items li').forEach((li) => {
    li.addEventListener('click', filterItemClicked);
  });
  form.querySelectorAll('.range-wrapper > div.selected').forEach((button) => {
    button.addEventListener('click', rangeSelectClicked);
  });
  form.querySelectorAll('.range-wrapper .range-items div[id$="-price"]').forEach((price) => {
    price.addEventListener('keyup', observePriceInput);
  });

  form.querySelectorAll('.range-wrapper .range-items div[id$="-sqft"] > .selected').forEach((sqft) => {
    sqft.addEventListener('click', sqftSelectClicked);
  });

  form.querySelectorAll('.range-wrapper .range-items div[id$="-sqft"] .select-items li').forEach((li) => {
    li.addEventListener('click', sqftOptionClicked);
  });
}

observeForm(document.querySelector('.property-search-bar.block form'));
