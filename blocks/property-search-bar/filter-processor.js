import { setParam, getParam, removeParam } from '../../scripts/search.js';

function getTopMenuValues(filterName) {
  const selector = `div[name="${filterName}"] .title span`;
  const value = document.querySelector(selector).innerText;

  return value;
}
/**
 * Build filter HTML
 *
 * @param {string} name
 * @param {object} params
 * @returns {void}
 */
export function buildFilterHTML(name, params) {
  // @todo move logic
}

/**
 * Get filter value
 * @param {string} filterName
 * @returns {string}
 *
 */
export function getFilterValue(filterName) {
  const value = '';
  switch (filterName) {
    case 'price':
  }
}

/**
 *
 * @param {string} name
 * @param {string|obj} value
 */
export function setFilterValue(name, value) {
  switch (name) {
    case 'BBHS':
      value ? setParam('FeaturedCompany', name) : removeParam('FeaturedCompany');
      break;
    case 'Luxury':
    case 'RecentPriceChange':
      value ? setParam(name, 'true') : removeParam(name);
      break;
    case 'NewListing':
      value ? setParam(name, 'true') : setParam('false');
      break;
  }
}
