import { build as buildCountrySelect } from '../shared/search-countries/search-countries.js';
import { getPlaceholder, sanitizeString } from './common-function.js';
import { build as buildAdditionFilters, buildFilterButtons } from './additional-filters.js';
import { build as buildTopMenu } from './top-menu.js';

function closeSelect(element) {
  element.classList.remove('open');
  element.querySelector('.search-results-dropdown').classList.add('hide');
}

function openSelect(element) {
  element.classList.add('open');
  element.querySelector('.search-results-dropdown').classList.remove('hide');
}

function abbrNum(d, h) {
  h = 10 ** h;
  const k = ['k', 'm', 'b', 't']; let
    m;
  for (m = k.length - 1; m >= 0; m--) {
    const n = 10 ** (3 * (m + 1));
    if (n <= d) {
      d = Math.round(d * h / n) / h;
      d == 1E3 && m < k.length - 1 && (d = 1,
      m++);
      d += k[m];
      break;
    }
  }
  return d;
}

function createPriceList(d) {
  let optionlist = '';
  const k = [10, 100, 1E3, 1E4, 1E5, 1E6];
  if (d) for (let m = 1; m <= 6; m++) optionlist += `<option> ${d * k[m - 1]} </option>`;
  return optionlist;
}

function formatPriceLabel(minPrice, maxPrice) {
  const d = minPrice.replace(/[^0-9]/g, '');
  const h = maxPrice.replace(/[^0-9]/g, '');
  return d !== '' && h !== ''
    ? `$${abbrNum(d, 2)} - $${abbrNum(h, 2)}`
    : d !== '' ? `$${abbrNum(d, 2)}`
      : d == '' && h !== '' ? `$0 - $${abbrNum(h, 2)}`
        : 'Price';
}

function toggleFilter(el) {
  const div = el.querySelector('.checkbox');
  div.classList.toggle('checked');
  el.querySelector('input').value = div.classList.contains('checked');
}

function updateFilters() {
  const forRentEl = document.querySelector('.for-rent');
  const pendingEl = document.querySelector('.pending');
  const isForRentChecked = document.querySelector('.for-rent .checkbox').classList.contains('checked');
  const isPendingChecked = document.querySelector('.pending .checkbox').classList.contains('checked');

  forRentEl.classList.toggle('disabled', isPendingChecked);
  pendingEl.classList.toggle('disabled', isForRentChecked);
}

function addChangeHandler(filter) {
  filter.forEach((el) => {
    el.addEventListener('change', () => {
      if (el.checked) {
        filter.forEach((input) => {
          if (input.id !== el.id) input.checked = false;
        });
      }
    });
  });
}

export default async function decorate(block) {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay', 'hide');
  block.append(buildTopMenu(), buildAdditionFilters(), overlay, buildFilterButtons());
  const changeCountry = (country) => {
    const placeholder = getPlaceholder(country);
    const input = block.querySelector('.suggester-input input');
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('aria-label', placeholder);
  };

  const countrySelect = await buildCountrySelect(changeCountry);
  countrySelect.setAttribute('id', 'country-select');
  block.querySelector('.primary-search').prepend(countrySelect);
  const propertyFilterButtons = block.querySelector('.filter-buttons');
  const filterOptions = block.querySelectorAll('.container-item .select-item .tooltip-container');
  const propertyFilterOptions = block.querySelectorAll('.filter .select-item .tooltip-container');
  const topLevelFilters = block.querySelectorAll('.container-item .header');
  const multipleSelectInputs = block.querySelectorAll('.select-selected');
  const priceRangeInputs = block.querySelector('.price .multiple-inputs');
  const filterContainer = block.querySelector('.filter-container');
  const filterBlock = block.querySelector('.filter-block');
  const toggleFilters = block.querySelectorAll('.filter-toggle');
  const svgIcons = filterContainer.querySelectorAll(' svg');
  const selectAllPropertyFilters = block.querySelector('.property-type input[type="checkbox"]');
  const propertyButtons = block.querySelectorAll('.property-type button');
  const openHousesFilter = block.querySelector('.open-houses');
  const openHousesCheckbox = openHousesFilter.querySelector('input[type="checkbox"]');
  const keyWordSearchAny = block.querySelector('.keyword-search .filter-radiobutton input[name="matchTagsAny"]');
  const keyWordSearchAll = block.querySelector('.keyword-search .filter-radiobutton input[name="matchTagsAll"]');
  const bedsFilter = block.querySelectorAll('.beds input');
  const bathsFilter = block.querySelectorAll('.baths input');
  const addKeywordButton = block.querySelector('.keyword-search .button');
  const keywordInput = block.querySelector('.keyword-search input[type="text"]');
  const keywordContainer = block.querySelector('#container-tags');

  function togglePropertyForm() {
    filterBlock.classList.toggle('hide');
    overlay.classList.toggle('hide');
    propertyFilterButtons.classList.toggle('hide');
    svgIcons.forEach((el) => el.classList.toggle('hide'));
  }

  // close form on click cancel button
  block.querySelector('.filter-buttons a[title="cancel"]').addEventListener('click', togglePropertyForm);
  // reset form on click reset button
  block.querySelector('.filter-buttons a[title="reset"]').addEventListener('click', () => {
    // @todo set up initial values
    togglePropertyForm();
  });
  // apply filters on click apply button
  block.querySelector('.filter-buttons a[title="apply"]').addEventListener('click', () => {
    // @todo set up initial values
    togglePropertyForm();
  });
  // add logic for select on click
  filterContainer.addEventListener('click', togglePropertyForm);
  // @todo add logic on add keyword search
  addKeywordButton.addEventListener('click', () => {
    const keyword = keywordInput.value;
    if (keyword) {
      const item = document.createElement('span');
      item.classList.add('tag');
      item.textContent = `${keyword} `;
      const closeBtn = document.createElement('span');
      closeBtn.classList.add('close');
      item.appendChild(closeBtn);
      keywordContainer.append(item);
      closeBtn.addEventListener('click', () => item.remove());
      keywordInput.value = '';
    }
  });

  // @todo add logic to remove keyword
  block.querySelectorAll('#container-tags .close').forEach((el) => { el.addEventListener('click', (e) => { e.target.parentNode.remove(); }); });

  addChangeHandler(bathsFilter);

  addChangeHandler(bedsFilter);
  // @todo add logic
  keyWordSearchAny.addEventListener('change', (e) => {
    if (keyWordSearchAny.checked) {
      keyWordSearchAll.checked = false;
    }
  });
  keyWordSearchAll.addEventListener('change', (e) => {
    if (keyWordSearchAll.checked) {
      keyWordSearchAny.checked = false;
    }
  });
  openHousesCheckbox.addEventListener('change', () => {
    openHousesFilter.classList.toggle('selected');
  });

  // select all property filters on select all
  selectAllPropertyFilters.addEventListener('change', () => {
    const isChecked = selectAllPropertyFilters.checked;
    propertyButtons.forEach((el) => {
      el.classList.toggle('selected', isChecked);
    });
  });
  // add logic for select property type on click
  propertyButtons.forEach((el) => {
    el.addEventListener('click', () => {
      el.classList.toggle('selected');
    });
  });
  // logic to trigger events for additional property filters
  toggleFilters.forEach((el) => {
    el.addEventListener('click', () => {
      toggleFilter(el);
      if (el.classList.contains('for-rent') || el.classList.contains('pending')) {
        updateFilters();
      }
    });
  });

  // add logic on price range change
  priceRangeInputs.addEventListener('keyup', (e) => {
    const minPrice = priceRangeInputs.querySelector('.price-range-input.min-price').value;
    const maxPrice = priceRangeInputs.querySelector('.price-range-input.max-price').value;
    // display datalist
    const activeElement = e.target.closest('.price-range-input');
    activeElement.list.innerHTML = createPriceList(activeElement.value);
    // update label
    block.querySelector('.price .title > span').innerText = formatPriceLabel(minPrice, maxPrice);
  });
  // close filters on click outside
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      topLevelFilters.forEach((elem) => {
        if (elem.parentElement.classList.contains('open')) {
          closeSelect(elem.parentElement);
        }
      });
    }
  });

  topLevelFilters.forEach((selectedFilter) => {
    selectedFilter.addEventListener('click', () => {
      // close all other elements
      topLevelFilters.forEach((elem) => {
        if (elem.parentElement.hasAttribute('id')
                    && elem.parentElement.getAttribute('id') !== selectedFilter.parentElement.getAttribute('id')
                    && elem.parentElement.classList.contains('open')
        ) {
          closeSelect(elem.parentElement);
          // selectedFilter.parentElement.querySelector('.select-item').classList.add('hide')
        }
      });
      if (selectedFilter.parentElement.classList.contains('open')) {
        closeSelect(selectedFilter.parentElement);
        // selectedFilter.parentElement.querySelector('.select-item').classList.add('hide')
      } else {
        openSelect(selectedFilter.parentElement);
        // selectedFilter.parentElement.querySelector('.select-item').classList.remove('hide');
      }
    });
  });

  multipleSelectInputs.forEach((el) => {
    el.addEventListener('click', () => {
      el.closest('section > div').querySelector('.select-item').classList.add('show');
    });
  });

  // update input placeholder on click
  filterOptions.forEach((element) => {
    element.addEventListener('click', (e) => {
      let selectedElValue = element.innerText;
      const container = element.closest('.container-item');
      container.querySelector('.highlighted').classList.remove('highlighted');
      element.classList.toggle('highlighted');
      const headerTitle = container.querySelector('.header .title');
      if (container.querySelector('.multiple-inputs')) {
        // logic
        element.closest('section > div').querySelector('.select-selected').innerHTML = selectedElValue;
        const headerItems = container.querySelectorAll('.multiple-inputs .select-selected');
        const fromSelectedValue = headerItems[0].innerText;
        const toSelectedValue = headerItems[1].innerText;
        if (fromSelectedValue === 'No Min' && toSelectedValue === 'No Max') {
          selectedElValue = 'square feet';
        } else {
          selectedElValue = `${fromSelectedValue}-${toSelectedValue}`;
        }
        element.closest('.select-item').classList.remove('show');
      } else {
        closeSelect(container);
      }
      headerTitle.innerHTML = `<span>${selectedElValue}</span>`;
      // todo update logic for multiple select
    });
  });

  propertyFilterOptions.forEach((element) => {
    element.addEventListener('click', (e) => {
      const selectedElValue = element.innerText;
      const container = element.closest('section');
      container.querySelector('.highlighted').classList.remove('highlighted');
      element.classList.toggle('highlighted');
      const headerTitle = container.querySelector('.select-selected');
      // closeSelect(container);
      headerTitle.innerHTML = `<span>${selectedElValue}</span>`;
      if (element.closest('.filter').querySelector('.multiple-inputs')) {
        element.closest('.select-item').classList.remove('show');
      }
      // todo update logic for multiple select
    });
  });
}
///
// buildSearchBar
// buildFilters
// ul tooltip.

// @todo finish close all logic
// add logic for filter buttons
