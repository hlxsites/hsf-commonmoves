import { abortSuggestions, getSuggestions } from '../../../scripts/apis/creg/creg.js';
import { getAttributes, setSearchParams } from '../search/suggestion.js';
import {
  populatePreSelectedFilters,
  setFilterValue,
} from '../filter-processor.js';
import {
  formatPriceLabel, closeTopLevelFilters, togglePropertyForm, hideFilter,
} from '../common-function.js';
import { getPropertiesCount } from '../../../scripts/search/results.js';

const event = new Event('onFilterChange');


function addChangeHandler(filter) {
  let value;
  filter.forEach((el) => {
    el.addEventListener('change', () => {
      if (el.checked) {
        filter.forEach((input) => {
          if (input.id !== el.id) input.checked = false;
        });
        value = el.value === 'Any' ? '' : el.value;
        setFilterValue(el.closest('.filter').getAttribute('name'), value);
      }
    });
  });
}

function addEventListeners() {
  const block = document.querySelector('.property-search-bar.block');
  const priceRangeInputs = block.querySelector('.container-item[name="Price"] .multiple-inputs');

  // add logic on price range change
  priceRangeInputs.addEventListener('keyup', (e) => {
    const minPrice = priceRangeInputs.querySelector('[name="MinPrice"]').value;
    const maxPrice = priceRangeInputs.querySelector('[name="MaxPrice"]').value;
    // display datalist
    const activeElement = e.target.closest('.price-range-input');
    const name = activeElement.getAttribute('name');
    const { value } = activeElement;
    activeElement.list.innerHTML = createPriceList(activeElement.value);

    // update label
    block.querySelector('[name="Price"] .title > span').innerText = formatPriceLabel(minPrice, maxPrice);
    setFilterValue(name, value);
    window.dispatchEvent(event);
  });

  // open additional filters
  block.querySelector('.filter-container').addEventListener('click', () => {
    togglePropertyForm();
    const overlay = document.querySelector('.property-search-bar.block .overlay');
    const toggledOnClose = overlay.classList.contains('hide');
    closeTopLevelFilters(false);
    if (toggledOnClose) {
      setFilterValue('MinPrice', document.querySelector('.filter [name="MinPrice"]').value);
      setFilterValue('MaxPrice', document.querySelector('.filter [name="MaxPrice"]').value);
    }
    populatePreSelectedFilters(toggledOnClose);
  });

  block.querySelectorAll('.select-selected').forEach((el) => {
    let isOpened;
    el.addEventListener('click', () => {
      if (el.closest('.multiple-inputs').getAttribute('name') === 'Sort') {
        isOpened = document.querySelector('[name="Sort"] .select-item').classList.contains('show');
        closeTopLevelFilters();
        if (isOpened) {
          document.querySelector('[name="Sort"] .select-item').classList.add('show');
        }
      }
      el.closest('section > div').querySelector('.select-item').classList.toggle('show');
    });
  });
  // suggestions
  const suggestionsTarget = block.querySelector('.suggester-input .suggester-results');
  block.querySelector('.search-listing-block  [name="keyword"]').addEventListener('input', (e) => {
    inputChanged(e, suggestionsTarget);
  });
  suggestionsTarget.addEventListener('click', (e) => {
    suggestionSelected(e, block);
  });
  window.addEventListener('onResultUpdated', () => {
    const count = getPropertiesCount();
    block.querySelector('.total-results > div').textContent = `Showing ${count} of ${count} Properties`;
  });
}

addEventListeners();
