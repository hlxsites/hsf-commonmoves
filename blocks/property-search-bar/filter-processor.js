import { setParam, getParam, removeParam } from '../../scripts/search.js';
import {buildKeywordEl, formatPriceLabel} from './common-function.js';
const sharedFilters = {
  'Price': ['MinPrice', 'MaxPrice'],
  'MinBedroomsTotal' : 'MinBedroomsTotal',
  'MinBathroomsTotal' : 'MinBathroomsTotal',
  'SquareFeet': ['MinLivingArea', 'MaxLivingArea'],
};
const additionalFilters  = {
  'PropertyType': 'PropertyType',
  'Features': 'Features',
  'MatchAnyFeatures': 'MatchAnyFeatures',
  'YearBuilt': 'YearBuilt',
  'NewListing': 'NewListing',
  'RecentPriceChange': 'RecentPriceChange',
  'Luxury': 'Luxury',
  'BHHS': 'FeaturedCompany',
  'OpenHouses': 'OpenHouses'
};


/**
 *
 * @param {string} name
 * @param {Boolean} topMenu
 * @returns {void}
 */
export function populatePreSelectedFilters(topMenu = true) {
  let value = '';
  if (topMenu) {
    Object.keys(sharedFilters).forEach((name) => {
      let selector = topMenu ? `[name="${name}"] .title span` : `[name="${name}"] .select-item`;
      value = getValueFromStorage(name);
      document.querySelector(selector).innerText = formatValue(name, value);
    });
  } else {
    const storageKeyToName = {...sharedFilters, ...additionalFilters};
    Object.keys(storageKeyToName).forEach((name) => {
      value = getValueFromStorage(name);
      switch (name) {
        case 'Price':
          document.querySelector('.filter [name="MinPrice"]').value = value.min;
          document.querySelector('.filter [name="MaxPrice"]').value = value.max;
          break;
        case 'MinBedroomsTotal':
        case 'MinBathroomsTotal':
          value = value ? value : 'Any';
          document.querySelectorAll(`[name="${name}"] input`).forEach(
              input => input.checked = (input.value === value)
          )
          break;
        case 'SquareFeet':
          document.querySelector('.filter [name="MinLivingArea"]').innerText = value.min.length > 0 ? `${value.min} Sq Ft` : 'No Min';
          document.querySelector('.filter [name="MaxLivingArea"]').innerText = value.max.length > 0 ? `${value.max} Sq Ft` : 'No Max';
          document.querySelectorAll('.filter [name="MinLivingArea"] ~ul li').forEach(li => {
            li.classList.toggle('highlighted', li.getAttribute('data-value') === value.min);
          });
          document.querySelectorAll('.filter [name="MaxLivingArea"] ~ul li').forEach(li => {
            li.classList.toggle('highlighted', li.getAttribute('data-value') === value.max);
          });

          break;
        case 'PropertyType':
          document.querySelectorAll('.filter[name="PropertyType"] button').forEach(button => {
            button.classList.toggle('selected', value.includes(button.value));
          });
          break;
        case 'Features':
          const keyWordSearchAny = document.querySelector('.keyword-search .filter-radiobutton input[name="matchTagsAny"]');
          const keyWordSearchAll = document.querySelector('.keyword-search .filter-radiobutton input[name="matchTagsAll"]');
          if (document.querySelector('#container-tags').childElementCount === 0) {
            value.forEach((key) => {
              buildKeywordEl(key, removeFilterValue);
            });
          }
          break;
        case 'YearBuilt':
          const [min, max] = [value.min !== '' ? value.min : 'No Min', value.max !== '' ? value.max : 'No Max'];
          document.querySelectorAll('[name="YearBuilt"] .select-selected').forEach((el, i) => {
            el.innerText = i === 0 ? min : max;
          });
          break;
        case 'OpenHouses':
          const openHousesFilter = document.querySelector('[name="OpenHouses"]');
          openHousesFilter.classList.toggle('selected', !!value);
          openHousesFilter.querySelector('input[type="checkbox"]').checked = !!value;
            const el = value === 7 ? openHousesFilter.querySelector('[name="openHousesOnlyWeekend"]')
                : openHousesFilter.querySelector('[name="openHousesOnlyAnytime"]');
            el.checked = true;
          break;
        case 'MatchAnyFeatures':
          document.querySelector(`[name="matchTagsAll"]`).checked =  !value;
          document.querySelector(`[name="matchTagsAny"]`).checked =  value;
          break;
        default:
          document.querySelector(`.filter[name="${name}"] .checkbox`).classList.toggle('checked', value);
          document.querySelector(`.filter[name="${name}"] input`).value = value;
      }
    })
  }
}

/** @todo add logic
 *
 * @param filterName
 * @param value
 * @returns {string|string|*}
 */
function formatValue(filterName, value) {
  let formattedValue = '';
  switch (filterName) {
    case 'Price':
      formattedValue = formatPriceLabel(value.min, value.max);
      break;
    case 'MinBedroomsTotal':
      formattedValue = value ? `${value}+ Beds` : 'Any Beds';
      break;
    case 'MinBathroomsTotal':
      formattedValue = value ? `${value}+ Baths`: 'Any Baths';
      break;
    case 'SquareFeet':
      formattedValue = `${value.min}Sq Ft-${value.max} Sq Ft`
      if (value.min === '' && value.max === '') {
        formattedValue = `square feet`;
      }
      break;
    default:
      formattedValue = value;
  }
  return formattedValue
}

/**
 * Get filter value
 * @param {string} filterName
 * @returns {string}
 *
 */
export function getValueFromStorage(filterName) {
  let value = '';
  switch (filterName) {
    case 'Price':
      const minPrice = getParam('MinPrice') ?? '';
      const maxPrice = getParam('MaxPrice') ?? '';
      value = {min:minPrice, max:maxPrice};
      break;
    case 'SquareFeet':
      const minLivingArea = getParam('MinLivingArea') ?? '';
      const maxLivingArea = getParam('MaxLivingArea') ?? '';
      value = {min:minLivingArea, max:maxLivingArea};
      break;
    case 'PropertyType':
    value = getParam('PropertyType') ? getParam('PropertyType') : [];
    break;

    case 'Features':
      value = getParam('Features') ? getParam('Features').split(',') : [];
    break;
    case 'YearBuilt':
      const [min, max] = (getParam('YearBuilt') || '-').split('-').map(val => {
        if (val === '1899') return 'No Min';
        if (val === '2100') return 'No Max';
        return val;
      });
      value = {min: min, max: max};
      break;
    case 'BHHS':
        value = getParam('FeaturedCompany') === 'BHHS';
        break;
    default:
    value = getParam(filterName) ?? false;
  }
  return value;
}

export function removeFilterValue(name, value ='') {
  switch (name) {
    case 'Features':
      let params = getParam('Features') ?? '';
      let paramsToArray = params.split(',');
      paramsToArray = paramsToArray.filter((i) => i !== value);
      params = paramsToArray.join(',');
      setParam('Features', params);
      break;
    default:
        removeParam(name);
  }
}
/**
 *
 * @param {string} name
 * @param {string|obj} value
 */
export function setFilterValue(name, value) {
  switch (name) {
    case 'BHHS':
      value ? setParam('FeaturedCompany', name) : removeParam('FeaturedCompany');
      break;
    case 'Luxury':
    case 'RecentPriceChange':
      value ? setParam(name, true) : removeParam(name);
      break;
    case 'Features':
      let params = getParam('Features') ?? '';
      params = params.length > 0 ? params.concat(',', value):  value;
      setParam('Features', params);
        break;
    case 'MinPrice':
    case 'MaxPrice':
    case 'MinBedroomsTotal':
    case 'MinBathroomsTotal':
          value.length > 0 ? setParam(name, value) : removeParam(name);
          break;
    default:
        setParam(name, value);
  }
}
