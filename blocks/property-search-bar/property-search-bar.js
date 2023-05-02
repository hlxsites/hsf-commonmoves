import { build as buildCountrySelect } from '../shared/search-countries/search-countries.js';
import { getPlaceholder, sanitizeString, formatPriceLabel, buildKeywordEl} from './common-function.js';
import { build as buildAdditionFilters, buildFilterButtons } from './additional-filters.js';
import { build as buildTopMenu } from './top-menu.js';
import {
  populatePreSelectedFilters,
  setFilterValue,
  removeFilterValue,
  getValueFromStorage
} from './filter-processor.js';

function closeSelect(element) {
  element.classList.remove('open');
  element.querySelector('.search-results-dropdown').classList.add('hide');
}

function openSelect(element) {
  element.classList.add('open');
  element.querySelector('.search-results-dropdown').classList.remove('hide');
}

function createPriceList(d) {
  let optionlist = '';
  const k = [10, 100, 1E3, 1E4, 1E5, 1E6];
  if (d) for (let m = 1; m <= 6; m++) optionlist += `<option> ${d * k[m - 1]} </option>`;
  return optionlist;
}

function toggleFilter(el) {
  const div = el.querySelector('.checkbox');
  const name = el.closest('.filter').getAttribute('name');
  div.classList.toggle('checked');
  const value = div.classList.contains('checked');
  el.querySelector('input').value = value;
  setFilterValue(name, !value);
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


        if (el.value === 'Any') {
          removeFilterValue(el.closest('.filter').getAttribute('name'));
        } else {
          setFilterValue(el.closest('.filter').getAttribute('name'), el.value);
        }
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
  const priceRangeInputs = block.querySelector('.container-item.price .multiple-inputs');
  const filterContainer = block.querySelector('.filter-container');
  const filterBlock = block.querySelector('.filter-block');
  const toggleFilters = block.querySelectorAll('.filter-toggle');
  const svgIcons = filterContainer.querySelectorAll(' svg');
  const selectAllPropertyFilters = block.querySelector('.property-type input[type="checkbox"]');
  const propertyButtons = block.querySelectorAll('.property-type button');
  const openHousesFilter = block.querySelector('[name="OpenHouses"]');
  const openHousesCheckbox = openHousesFilter.querySelector('input[type="checkbox"]');
  const keyWordSearchAny = block.querySelector('.keyword-search .filter-radiobutton input[name="matchTagsAny"]');
  const keyWordSearchAll = block.querySelector('.keyword-search .filter-radiobutton input[name="matchTagsAll"]');
  const bedsFilter = block.querySelectorAll('.beds input');
  const bathsFilter = block.querySelectorAll('.baths input');
  const addKeywordButton = block.querySelector('.keyword-search .button');
  const keywordInput = block.querySelector('.keyword-search input[type="text"]');

  function togglePropertyForm() {
    const hideClass = 'hide';
    filterBlock.classList.toggle(hideClass);
    overlay.classList.toggle(hideClass);
    propertyFilterButtons.classList.toggle(hideClass);
    svgIcons.forEach((el) => el.classList.toggle(hideClass));
    const toggledOnClose = svgIcons[0].classList.contains(hideClass);
    if (!toggledOnClose) {
      setFilterValue('MinPrice', block.querySelector(`.filter [name="MinPrice"]`).value);
      setFilterValue('MaxPrice', block.querySelector(`.filter [name="MaxPrice"]`).value);
    }
    populatePreSelectedFilters(!toggledOnClose)
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

  addKeywordButton.addEventListener('click', () => {
    const keyword = keywordInput.value;
    if (keyword) {
      buildKeywordEl(keyword, removeFilterValue)
      setFilterValue('Features', keyword.trim())
    }
  });

  block.querySelectorAll('#container-tags .close').forEach((el) => { el.addEventListener('click', (e) => { e.target.parentNode.remove(); }); });

  // bathes
  addChangeHandler(bathsFilter);
  // beds
  addChangeHandler(bedsFilter);
  // @todo add logic
  keyWordSearchAny.addEventListener('change', (e) => {
    if (keyWordSearchAny.checked) {
      keyWordSearchAll.checked = false;
      setFilterValue('MatchAnyFeatures', true);
    }
  });

  keyWordSearchAll.addEventListener('change', (e) => {
    if (keyWordSearchAll.checked) {
      keyWordSearchAny.checked = false;
      removeFilterValue('MatchAnyFeatures');
    }
  });
  openHousesCheckbox.addEventListener('change', () => {
    openHousesFilter.classList.toggle('selected');
    if (openHousesCheckbox.checked) {
      const value = document.querySelector('input[type="radio"]:checked ~span').innerText === 'This Weekend'
          ? 7
          : 365;
    setFilterValue('OpenHouses', value);
    } else {
      removeFilterValue('OpenHouses')
    }
  });

  // select all property filters on select all
  selectAllPropertyFilters.addEventListener('change', () => {
    const isChecked = selectAllPropertyFilters.checked;
    propertyButtons.forEach((el) => {
      el.classList.toggle('selected', isChecked);
    });
    if (isChecked) {
      setFilterValue('PropertyType', ['1', '2', '3', '5', '4', '6']);
    } else {
      removeFilterValue('PropertyType');
    }
  });
  // add logic for select property type on click
  propertyButtons.forEach((el) => {
    el.addEventListener('click', () => {
      el.classList.toggle('selected');
      const value = el.getAttribute('value');
      let params = getValueFromStorage('PropertyType');
      el.classList.contains('selected') ? params.push(value) : params = params.filter((i) => i !== value);
      setFilterValue('PropertyType', params);
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

  // add logic on price range change
  priceRangeInputs.addEventListener('keyup', (e) => {
    const minPrice = priceRangeInputs.querySelector('.price-range-input.min-price').value;
    const maxPrice = priceRangeInputs.querySelector('.price-range-input.max-price').value;
    // display datalist
    const activeElement = e.target.closest('.price-range-input');
    const name = activeElement.getAttribute('name');
    const { value } = activeElement;
    activeElement.list.innerHTML = createPriceList(activeElement.value);

    // update label
    block.querySelector('.price .title > span').innerText = formatPriceLabel(minPrice, maxPrice);
    setFilterValue(name, value);
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
        }
      });
      if (selectedFilter.parentElement.classList.contains('open')) {
        closeSelect(selectedFilter.parentElement);
      } else {
        openSelect(selectedFilter.parentElement);
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
      const value = element.getAttribute('data-value');
      const container = element.closest('.container-item');
      let name = container.getAttribute('name');
      container.querySelector('.highlighted').classList.remove('highlighted');
      element.classList.toggle('highlighted');
      const headerTitle = container.querySelector('.header .title');
      if (container.querySelector('.multiple-inputs')) {
        // logic
        element.closest('section > div').querySelector('.select-selected').innerHTML = selectedElValue;
        name = element.closest('section > div').querySelector('.select-selected').getAttribute('name');
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
      setFilterValue(name, value);
      headerTitle.innerHTML = `<span>${selectedElValue}</span>`;
    });
  });
  // year and square feet input logic on additional filters
  propertyFilterOptions.forEach((element) => {
    element.addEventListener('click', (e) => {
      const selectedElValue = element.innerText;
      const container = element.closest('section');
      const filter = element.closest('.filter');
      let name = filter.getAttribute('name');
      let value = element.getAttribute('data-value');
      container.querySelector('.highlighted').classList.remove('highlighted');
      element.classList.toggle('highlighted');
      const headerTitle = container.querySelector('.select-selected');

      headerTitle.innerHTML = `<span>${selectedElValue}</span>`;
      if (filter.querySelector('.multiple-inputs')) {
        if (name !== 'YearBuilt') {
          name = element.closest('section > div').querySelector('.select-selected').getAttribute('name');
        }
        if (name === 'YearBuilt') {
          const values = element.closest('.multiple-inputs').querySelectorAll('.select-selected');
          if (values[0].innerText === 'No Min' && values[1].innerText === 'No Max') {
            removeFilterValue('YearBuilt');
            return;
          }
          const minYear = values[0].innerText === 'No Min' ? 1899 : values[0].innerText;
          const maxYear = values[1].innerText === 'No Max' ? 2100 : values[1].innerText;
          value = `${minYear}-${maxYear}`;
        }
        element.closest('.select-item').classList.remove('show');
      }
      setFilterValue(name, value);
      element.closest('.select-item').classList.remove('show');
    });
  });
    populatePreSelectedFilters();

}

//todo add logic for open houses filter
//todo add logic to set value from the url/storage