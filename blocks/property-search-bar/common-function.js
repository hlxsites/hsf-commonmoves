/* eslint-disable no-param-reassign, no-plusplus, no-mixed-operators, no-unused-expressions, no-nested-ternary, eqeqeq, max-len */
export const TOP_LEVEL_FILTERS = {
  Price: { label: 'price', type: 'range' },
  MinBedroomsTotal: { label: 'beds', type: 'select' },
  MinBathroomsTotal: { label: 'baths', type: 'select' },
  LivingArea: { label: 'square feet', type: 'range' },
};
export const EXTRA_FILTERS = {
  PropertyType: { label: 'property type', type: 'property' },
  Features: { label: 'keyword search', type: 'keywords-search' },
  MatchAnyFeatures: { label: 'Match', type: 'child' },
  YearBuilt: { label: 'year built', type: 'range' },
  NewListing: { label: 'new listings', type: 'toggle' },
  RecentPriceChange: { label: 'recent price change', type: 'toggle' },
  OpenHouses: { label: 'open houses', type: 'open-houses' },
  Luxury: { label: 'luxury', type: 'toggle' },
  FeaturedCompany: { label: 'berkshire hathaway homeServices listings only', type: 'toggle' },
};

const SQUARE_FEET = [
  { value: '500', label: '500 Sq Ft' },
  { value: '750', label: '750 Sq Ft' },
  { value: '1000', label: '1,000 Sq Ft' },
  { value: '1250', label: '1,250  Sq Ft' },
  { value: '1500', label: '1,500 Sq Ft' },
  { value: '1750', label: '1,750 Sq Ft' },
  { value: '2000', label: '2,000 Sq Ft' },
  { value: '2250', label: '2,250 Sq Ft' },
  { value: '2500', label: '2,500 Sq Ft' },
  { value: '2750', label: '2,750 Sq Ft' },
  { value: '3000', label: '3,000 Sq Ft' },
  { value: '3500', label: '3,500 Sq Ft' },
  { value: '4000', label: '4,000 Sq Ft' },
  { value: '5000', label: '5,000 Sq Ft' },
  { value: '7500', label: '7,500 Sq Ft' },
];

const YEAR_BUILT = [
  { value: '1900', label: '1900' },
  { value: '1920', label: '1920' },
  { value: '1940', label: '1940' },
  { value: '1950', label: '1950' },
  { value: '1960', label: '1960' },
  { value: '1970', label: '1970' },
  { value: '1980', label: '1980' },
  { value: '1990', label: '1990' },
  { value: '1995', label: '1995' },
  { value: '2000', label: '2000' },
  { value: '2005', label: '2005' },
  { value: '2014', label: '2014' },
  { value: '2015', label: '2015' },
  { value: '2016', label: '2016' },
  { value: '2017', label: '2017' },
  { value: '2018', label: '2018' },
  { value: '2019', label: '2019' },
];

const SORT_BY = [
  { value: 'DISTANCE_ASCENDING', label: 'Distance' },
  { value: 'PRICE_DESCENDING', label: 'Price (Hi-Lo)' },
  { value: 'PRICE_ASCENDING', label: 'Price (Lo-Hi)' },
  { value: 'DATE_DESCENDING', label: 'DATE (NEW-OLD)' },
  { value: 'DATE_ASCENDING', label: 'DATE (OLD-NEW)' },
];
export function getConfig(filterName) {
  let output = '';
  switch (filterName) {
    case 'MinBedroomsTotal':
    case 'MinBathroomsTotal':
      output = 5;
      break;
    case 'LivingArea':
      output = SQUARE_FEET;
      break;
    case 'YearBuilt':
      output = YEAR_BUILT;
      break;
    case 'ApplicationType':
      output = ['For Sale', 'For Rent', 'Pending', 'Sold'];
      break;
    case 'Sort':
      output = SORT_BY;
      break;
    default:
      break;
  }
  return output;
}

/**
 *
 * @param {string} filterName
 * @param {string} defaultValue
 * @returns {string}
 */
function buildSelectOptions(filterName, defaultValue) {
  const conf = getConfig(filterName);
  let output = `<option value="">${defaultValue}</option>`;
  if (Array.isArray(conf)) {
    conf.forEach((el) => {
      output += `<option value="${el.value}">${el.label}</option>`;
    });
  } else {
    const labelSuf = `+ ${defaultValue.split(' ')[1]}`;
    for (let i = 1; i <= conf; i += 1) {
      const label = `${i} ${labelSuf}`;
      output += `<option value="${i}">${label}</option>`;
    }
  }
  return output;
}

/**
 * @param {string} filterName
 * @param {string} defaultValue
 * @returns {string}
 */
function buildListBoxOptions(filterName, defaultValue) {
  const config = getConfig(filterName);
  let output = `<li data-value="" class="tooltip-container highlighted">${defaultValue}</li>`;
  if (Array.isArray(config)) {
    config.forEach((conf) => {
      output += `<li data-value="${conf.value}" class="tooltip-container">${conf.label}</li>`;
    });
  } else {
    const labelSuf = `+ ${defaultValue.split(' ')[1]}`;
    for (let i = 1; i <= config; i += 1) {
      const label = `${i} ${labelSuf}`;
      output += `<li  data-value="${i}" class="tooltip-container">${label}</li>`;
    }
  }

  return output;
}

export function addOptions(filterName, defaultValue = '', mode = '', name = '') {
  const selectedHtml = mode === 'multi'
    ? `<div class="select-selected" role="button" aria-haspopup="listbox" name=${name}>${defaultValue}</div>
            `
    : '';

  return `<section>
        <div>
            <select class="hide" aria-label="${defaultValue}">${buildSelectOptions(filterName, defaultValue, mode)}</select>
            ${selectedHtml}
            <ul class="select-item" role="listbox">${buildListBoxOptions(filterName, defaultValue, mode)}</ul>
        </div>
    </section>`;
}

export function formatInput(string) {
  return string.replace(/[/\s]/g, '-').toLowerCase();
}

export function getPlaceholder(country) {
  return country === 'US' ? 'Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#' : 'Enter City';
}

export function addRangeOption(filterName) {
  const config = { ...TOP_LEVEL_FILTERS, ...EXTRA_FILTERS };
  const { label } = config[filterName];
  const filterLabel = label.charAt(0).toLocaleUpperCase() + label.slice(1).toLowerCase();
  const fromLabel = 'No Min';
  const toLabel = 'No Max';
  const maxLength = 14;
  let output = '';
  if (filterName === 'Price') {
    output = `<div class="multiple-inputs">
                <div id="Min${filterLabel}" class="input-dropdown">
                <input type="text" maxLength="${maxLength}" list="listMin${filterLabel}"
                    name="Min${filterLabel}" aria-describedby="Min${filterLabel}"
                    placeholder="${fromLabel}" aria-label="Minimum ${filterLabel}"
                    class="price-range-input min-price">
                <datalist id="listMinPrice" class="list${filterLabel}"></datalist>
            </div>
        <span class="range-label text-up">to</span>
        <div id="Max${filterLabel}" class="input-dropdown">
            <input type="text" maxLength="${maxLength}" list="listMax${filterLabel}" name="Max${filterLabel}" aria-describedby="Max${filterLabel}"
                  placeholder="${toLabel}" aria-label="Maximum ${filterLabel}"
                  class="price-range-input max-price">
            <datalist id="listMax${filterLabel}" class="list${filterLabel}"></datalist>
            </div>
        </div>`;
  }
  if (filterName === 'LivingArea' || filterName === 'YearBuilt') {
    const fromName = filterName === 'LivingArea' ? 'MinLivingArea' : '';
    const toName = filterName === 'LivingArea' ? 'MaxLivingArea' : '';
    output = `<div class="multiple-inputs">
                ${addOptions(filterName, fromLabel, 'multi', fromName)}
                <span class="range-label text-up">to</span>
                ${addOptions(filterName, toLabel, 'multi', toName)}
                </section>
            </div>
            `;
  }
  return output;
}

function abbrNum(d, h) {
  h = 10 ** h;
  const k = ['k', 'm', 'b', 't']; let
    m;
  for (m = k.length - 1; m >= 0; m--) {
    const n = 10 ** (3 * (m + 1));
    if (n <= d) {
      d = Math.round(d * h / n) / h;
      d === 1E3 && m < k.length - 1 && (d = 1, m++);
      d += k[m];
      break;
    }
  }
  return d;
}

export function formatPriceLabel(minPrice, maxPrice) {
  const d = minPrice.replace(/[^0-9]/g, '');
  const h = maxPrice.replace(/[^0-9]/g, '');
  return d !== '' && h !== ''
    ? `$${abbrNum(d, 2)} - $${abbrNum(h, 2)}`
    : d !== '' ? `$${abbrNum(d, 2)}`
      : d == '' && h !== '' ? `$0 - $${abbrNum(h, 2)}`
        : 'Price';
}

export function processSearchType(value, defaultInput = 'for sale') {
  const wrapper = document.createElement('div');
  wrapper.classList.add('filter-toggle', formatInput(value), 'flex-row', 'mb-1');
  wrapper.innerHTML = `
                <input hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="${value.toLowerCase() === defaultInput}">
                <div class="checkbox ${value.toLowerCase() === defaultInput ? 'checked' : ''}"></div>
                <label role="presentation" class="ml-1">${value}</label>
            </div>`;
  return wrapper;
}

export function buildKeywordEl(keyword, removeItemCallback) {
  const item = document.createElement('span');
  const keywordInput = document.querySelector('[name="Features"] input[type="text"]');
  const keywordContainer = document.querySelector('#container-tags');
  item.classList.add('tag');
  item.textContent = `${keyword} `;
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  item.appendChild(closeBtn);
  keywordContainer.append(item);
  closeBtn.addEventListener(
    'click',
    () => {
      removeItemCallback('Features', item.textContent.trim());
      item.remove();
    },
  );
  keywordInput.value = '';
}
