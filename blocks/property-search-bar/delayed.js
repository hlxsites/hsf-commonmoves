import { BREAKPOINTS } from '../../scripts/scripts.js';
import { closeOnBodyClick, filterItemClicked } from '../shared/search/util.js';
import { SQUARE_FEET } from './property-search-bar.js';
import ListingType from '../../scripts/apis/creg/search/types/ListingType.js';
import Search, { SEARCH_URL, STORAGE_KEY } from '../../scripts/apis/creg/search/Search.js';

function toggleAdvancedFilters(e) {
  const open = e.currentTarget.classList.toggle('open');
  const wrapper = e.currentTarget.closest('.search-form-wrapper');
  const filters = wrapper.querySelector('.advanced-filters');
  filters.classList.toggle('open');
  filters.scrollTo({ top: 0, behavior: 'smooth' });
  wrapper.querySelector('.search-overlay').classList.toggle('visible');

  if (open) {
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = '';
  }
}

const updateExpanded = (wrapper) => {
  const wasOpen = wrapper.classList.contains('open');
  const thisForm = wrapper.closest('form');
  thisForm.querySelectorAll('[class*="-wrapper"][class*="open"]').forEach((item) => {
    if (item !== wrapper && item.contains(wrapper)) {
      return;
    }
    item.classList.remove('open');
    item.querySelector('[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
  });
  if (!wasOpen) {
    wrapper.classList.add('open');
    wrapper.querySelector('[aria-expanded="false"]')?.setAttribute('aria-expanded', 'true');
    closeOnBodyClick(wrapper);
  }
};

async function observeSearchInput(e) {
  e.preventDefault();
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

function updatePriceLabel(wrapper) {
  const min = wrapper.querySelector('input[name="min-price"]').value;
  const max = wrapper.querySelector('input[name="max-price"]').value;

  let content;
  const low = min.replace(/[^0-9]/g, '');
  const high = max.replace(/[^0-9]/g, '');
  if (low !== '' && high !== '') {
    content = `$${abbrNum(low, 2)} -<br/>$${abbrNum(high, 2)}`;
  } else if (low !== '') {
    content = `$${abbrNum(low, 2)}`;
  } else if (high !== '') {
    content = `$0 -<br/>$${abbrNum(high, 2)}`;
  } else {
    content = 'Price';
  }
  wrapper.querySelector('.selected span').innerHTML = content;
}

function observePriceInput(e) {
  e.preventDefault();
  const { target } = e;
  const { value } = target;
  const datalist = target.closest('.input-dropdown').querySelector('datalist');
  datalist.innerHTML = createPriceList(value);
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
  updateExpanded(e.currentTarget.closest('.select-wrapper'));
}

function updateSqftLabel(wrapper) {
  const min = wrapper.querySelector('#list-min-sqft li.selected');
  const max = wrapper.querySelector('#list-max-sqft li.selected');

  let label = wrapper.querySelector('div.selected').getAttribute('aria-label');

  if (min.getAttribute('data-value') || max.getAttribute('data-value')) {
    label = `${min.textContent} -<br/>${max.textContent}`;
  }
  wrapper.querySelector('span').innerHTML = label;
}

function addKeyword(e) {
  e.preventDefault();
  e.stopPropagation();
  const wrapper = e.currentTarget.closest('.keywords');
  const input = wrapper.querySelector('.keywords-input input[type="text"]');
  const { value } = input;
  if (!value) {
    return;
  }
  const keyword = document.createElement('div');
  keyword.classList.add('keyword');
  keyword.innerHTML = `
    <span>${value}</span>
    <span class="close">X</span>
  `;
  keyword.querySelector('.close').addEventListener('click', (localE) => {
    localE.stopPropagation();
    localE.preventDefault();
    localE.currentTarget.closest('.keyword').remove();
  });

  wrapper.querySelector('.keywords-list').append(keyword);
  input.value = '';
}

async function updateParameters() {
  const form = document.querySelector('.property-search-bar.block form');
  // Build Search Obj and store it.
  let type = form.querySelector('input[name="type"]').value;
  if (type) {
    type = type.replaceAll(/\s/g, '');
    if (type === 'ZipCode') {
      type = 'PostalCode';
    } else if (type === 'MLS #') {
      type = 'MLSListingKey';
    }
  }
  const search = await Search.load(type);
  let input = form.querySelector('.suggester-input input[type="text"]');
  if (input.value) search.input = input.value;
  input = form.querySelector('.result-filters input[name="min-price"]');
  if (input.value) search.minPrice = input.value;
  input = form.querySelector('.result-filters input[name="max-price"]');
  if (input.value) search.maxPrice = input.value;
  input = form.querySelector('.result-filters .bedrooms select');
  if (input.value) search.minBedrooms = input.value;
  input = form.querySelector('.result-filters .bathrooms select');
  if (input.value) search.minBathrooms = input.value;
  input = form.querySelector('.result-filters #min-sqft select');
  if (input.value) search.minSqft = input.value;
  input = form.querySelector('.result-filters #max-sqft select');
  if (input.value) search.maxSqft = input.value;
  search.listingTypes = [];
  input = form.querySelector('.listing-types input[name="FOR_SALE"]');
  if (input.checked) search.addListingType(ListingType.FOR_SALE);
  input = form.querySelector('.listing-types input[name="FOR_RENT"]');
  if (input.checked) search.addListingType(ListingType.FOR_RENT);
  input = form.querySelector('.listing-types input[name="PENDING"]');
  if (input.checked) search.addListingType(ListingType.PENDING);
  input = form.querySelector('.listing-types input[name="RECENTLY_SOLD"]');
  if (input.checked) search.addListingType(ListingType.RECENTLY_SOLD);
  search.propertyTypes = [];
  form.querySelectorAll('.property-types button.selected').forEach((btn) => search.addPropertyType(btn.name));
  search.keyword = [];
  form.querySelectorAll('.keywords .keywords-list .keyword span:first-of-type').forEach((kw) => search.keywords.push(kw.textContent));
  input = form.querySelector('.year-range #min-year select');
  if (input.value) search.minYear = input.value;
  input = form.querySelector('.year-range #max-year select');
  if (input.value) search.maxYear = input.value;
  search.isNew = form.querySelector('.is-new input').checked;
  search.priceChange = form.querySelector('.price-update input').checked;
  input = form.querySelector('.open-houses input');
  if (input.checked) search.openHouses = form.querySelector('.open-houses input[name="open-houses-timeframe"]:checked').value;
  input = form.querySelector('.lux input');
  if (input.checked) search.luxury = true;
  input = form.querySelector('.bhhs-only input');
  if (input.checked) search.bhhsOnly = true;

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(search));
  form.querySelector('a.filter.open')?.dispatchEvent(new MouseEvent('click'));
  if (window.location.pathname === SEARCH_URL) {
    window.location.hash = search.asURLSearchParameters().toString();
  } else {
    window.location = `${SEARCH_URL}#${search.asURLSearchParameters().toString()}`;
  }
}

function syncToBar() {
  const bar = document.querySelector('.property-search-bar.block form .result-filters');
  const attrib = document.querySelector('.property-search-bar.block form .advanced-filters .attributes');
  bar.querySelector('input[name="min-price"]').value = attrib.querySelector('input[name="adv-min-price"]').value;
  bar.querySelector('input[name="max-price"]').value = attrib.querySelector('input[name="adv-max-price"]').value;
  updatePriceLabel(bar.querySelector('.range-wrapper.price'));

  const bedrooms = attrib.querySelector('.bedrooms li input:checked').value;
  bar.querySelector(`.select-wrapper.bedrooms li[data-value="${bedrooms}"]`).dispatchEvent(new MouseEvent('click'));
  const bathrooms = attrib.querySelector('.bathrooms li input:checked').value;
  bar.querySelector(`.select-wrapper.bathrooms li[data-value="${bathrooms}"]`).dispatchEvent(new MouseEvent('click'));

  const minSqft = attrib.querySelector('#adv-min-sqft select').value;
  bar.querySelector(`.range-wrapper.sqft #min-sqft ul li[data-value="${minSqft}"]`).dispatchEvent(new MouseEvent('click'));
  const maxSqft = attrib.querySelector('#adv-max-sqft select').value;
  bar.querySelector(`.range-wrapper.sqft #max-sqft ul li[data-value="${maxSqft}"]`).dispatchEvent(new MouseEvent('click'));
}

function syncToAdvanced() {
  const bar = document.querySelector('.property-search-bar.block form .result-filters');
  const attrib = document.querySelector('.property-search-bar.block form .advanced-filters .attributes');
  attrib.querySelector('input[name="adv-min-price"]').value = bar.querySelector('input[name="min-price"]').value;
  attrib.querySelector('input[name="adv-max-price"]').value = bar.querySelector('input[name="max-price"]').value;

  const bedrooms = bar.querySelector('.bedrooms select').value;
  attrib.querySelector(`.bedrooms li[data-value="${bedrooms}"] input`).checked = true;
  const bathrooms = bar.querySelector('.bathrooms select').value;
  attrib.querySelector(`.bathrooms li[data-value="${bathrooms}"] input`).checked = true;

  const minSqft = bar.querySelector('#min-sqft select').value;
  attrib.querySelector(`.sqft #adv-min-sqft ul li[data-value="${minSqft}"]`).dispatchEvent(new MouseEvent('click'));
  const maxSqft = bar.querySelector('#max-sqft select').value;
  attrib.querySelector(`.sqft #adv-max-sqft ul li[data-value="${maxSqft}"]`).dispatchEvent(new MouseEvent('click'));
}

function resetForm(e) {
  e.stopPropagation();
  e.preventDefault();
  const form = e.currentTarget.closest('form');
  form.querySelectorAll('.advanced-filters .listing-types input[checked="checked"]').forEach((input) => input.closest('.filter-toggle').dispatchEvent(new MouseEvent('click')));
  form.querySelector('.advanced-filters input[name="FOR_SALE"]').closest('.filter-toggle').dispatchEvent(new MouseEvent('click'));
  form.querySelectorAll('.advanced-filters .range-wrapper.price input[type="text"]').forEach((input) => { input.value = ''; });
  form.querySelectorAll('.advanced-filters .bedrooms li[data-value=""] input').forEach((li) => li.dispatchEvent(new MouseEvent('click')));
  form.querySelectorAll('.advanced-filters .bathrooms li[data-value=""] input').forEach((li) => li.dispatchEvent(new MouseEvent('click')));
  form.querySelectorAll('.advanced-filters .sqft li[data-value=""]').forEach((li) => li.dispatchEvent(new MouseEvent('click')));
  form.querySelectorAll('.advanced-filters .property-types button').forEach((button) => button.classList.add('selected'));
  form.querySelectorAll('.advanced-filters .property-types button[name="COMMERCIAL"]').forEach((button) => button.classList.remove('selected'));
  form.querySelector('.advanced-filters .property-types .all input[type="checkbox"]').checked = false;
  form.querySelectorAll('.advanced-filters .misc .year-range li[data-value=""]').forEach((li) => li.dispatchEvent(new MouseEvent('click')));
  form.querySelectorAll('.advanced-filters .misc .filter-toggle input[checked="checked"]').forEach((input) => input.closest('.filter-toggle').dispatchEvent(new MouseEvent('click')));
}

function buildAdvancedFilters() {
  const wrapper = document.querySelector('.property-search-bar.block .advanced-filters');
  wrapper.innerHTML = `
    <div class="listing-types">
      <label class="section-label">Search Types</label>
      <div class="filter-toggle">
        <input name="FOR_SALE" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" checked="checked" value="${ListingType.FOR_SALE.type}">
        <div class="checkbox checked"></div>
        <label role="presentation">${ListingType.FOR_SALE.label}</label>
      </div>
      <div class="filter-toggle">
        <input name="FOR_RENT" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="${ListingType.FOR_RENT.type}">
        <div class="checkbox"></div>
        <label role="presentation">${ListingType.FOR_RENT.label}</label>
      </div>
      <div class="filter-toggle">
        <input name="PENDING" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="${ListingType.PENDING.type}">
        <div class="checkbox"></div>
        <label role="presentation">${ListingType.PENDING.label}</label>
      </div>
      <div class="filter-toggle">
        <input name="RECENTLY_SOLD" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="${ListingType.RECENTLY_SOLD.type}">
        <div class="checkbox"></div>
        <label role="presentation">${ListingType.RECENTLY_SOLD.label}</label>
      </div>
    </div>
    <div class="attributes">
      <div class="range-wrapper price">
        <label class="section-label" role="presentation">Price</label>
        <div class="range-items">
          <div id="adv-min-price" class="input-dropdown">
            <input type="text" name="adv-min-price" maxlength="14" aria-describedby="adv-min-price" aria-label="Minimum price" placeholder="No Min" list="adv-list-min-price">
            <datalist id="adv-list-min-price"></datalist> 
          </div> 
          <span>to</span>
          <div id="adv-max-price" class="input-dropdown">
            <input type="text" name="adv-max-price" maxlength="14" aria-describedby="adv-max-price" aria-label="Maximum price" placeholder="No Max" list="adv-list-max-price">
            <datalist id="adv-list-max-price"></datalist> 
          </div> 
        </div>
      </div>
      <div class="bedrooms">
        <label class="section-label" role="presentation">Bedrooms</label>
        <ul>
          <li data-value=""><input name="bedrooms" aria-describedby="bedrooms-any" type="radio" id="bedrooms-any" value="" tabindex="0" checked><label for="bedrooms-any">Any</label></li>
          <li data-value="1"><input name="bedrooms" aria-describedby="bedrooms-1" type="radio" id="bedrooms-1" value="1" tabindex="0"><label for="bedrooms-1">1+</label></li>
          <li data-value="2"><input name="bedrooms" aria-describedby="bedrooms-2" type="radio" id="bedrooms-2" value="2" tabindex="0"><label for="bedrooms-2">2+</label></li>
          <li data-value="3"><input name="bedrooms" aria-describedby="bedrooms-3" type="radio" id="bedrooms-3" value="3" tabindex="0"><label for="bedrooms-3">3+</label></li>
          <li data-value="4"><input name="bedrooms" aria-describedby="bedrooms-4" type="radio" id="bedrooms-4" value="4" tabindex="0"><label for="bedrooms-4">4+</label></li>
          <li data-value="5"><input name="bedrooms" aria-describedby="bedrooms-5" type="radio" id="bedrooms-5" value="5" tabindex="0"><label for="bedrooms-5">5+</label></li>
        </ul>
      </div>
      <div class="bathrooms">
        <label class="section-label" role="presentation">Bathroom</label>
        <ul>
          <li data-value=""><input name="bathrooms" aria-describedby="bathrooms-any" type="radio" id="bathrooms-any" value="" tabindex="0" checked><label for="bathrooms-any">Any</label></li>
          <li data-value="1"><input name="bathrooms" aria-describedby="bathrooms-1" type="radio" id="bathrooms-1" value="1" tabindex="0"><label for="bathrooms-1">1+</label></li>
          <li data-value="2"><input name="bathrooms" aria-describedby="bathrooms-2" type="radio" id="bathrooms-2" value="2" tabindex="0"><label for="bathrooms-2">2+</label></li>
          <li data-value="3"><input name="bathrooms" aria-describedby="bathrooms-3" type="radio" id="bathrooms-3" value="3" tabindex="0"><label for="bathrooms-3">3+</label></li>
          <li data-value="4"><input name="bathrooms" aria-describedby="bathrooms-4" type="radio" id="bathrooms-4" value="4" tabindex="0"><label for="bathrooms-4">4+</label></li>
          <li data-value="5"><input name="bathrooms" aria-describedby="bathrooms-5" type="radio" id="bathrooms-5" value="5" tabindex="0"><label for="bathrooms-5">5+</label></li>
        </ul>
      </div>
      <div class="sqft">
        <label class="section-label" role="presentation">Square Feet</label>
        <div class="range-items">
          <div id="adv-min-sqft" class="select-wrapper">
            <select name="adv-min-sqft" aria-label="No Min">
              <option value="">No Min</option>
            </select>
            <div class="selected" role="combobox" aria-haspopup="listbox" aria-label="No Min" aria-expanded="false" aria-controls="adv-list-min-sqft" tabindex="0"><span>No Min</span></div>
            <ul id="adv-list-min-sqft" class="select-items" role="listbox">
              <li data-value="" role="option" class="selected">No Min</li>
            </ul>
          </div>
          <span>to</span>
          <div id="adv-max-sqft" class="select-wrapper">
            <select name="adv-max-sqft" aria-label="No Max">
              <option value="">No Max</option>
            </select>
            <div class="selected" role="combobox" aria-haspopup="listbox" aria-label="No Max" aria-expanded="false" aria-controls="adv-list-max-sqft" tabindex="0"><span>No Max</span></div>
            <ul id="adv-list-max-sqft" class="select-items" role="listbox">
              <li data-value="" role="option" class="selected">No Max</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="property-types">
      <label class="section-label" role="presentation">Property Type</label>
      <div class="options">
        <button name="CONDO_TOWNHOUSE" type="button" class="selected" tabindex="0">
          <svg role="presentation" aria-hidden="true" tabindex="-1"><use xlink:href="${window.hlx.codeBasePath}/icons/icons.svg#condo-townhouse"></use></svg>
          <span>Condo / Townhouse</span>
        </button>
        <button name="SINGLE_FAMILY" type="button" class="selected" tabindex="0">
          <svg role="presentation" aria-hidden="true" tabindex="-1"><use xlink:href="${window.hlx.codeBasePath}/icons/icons.svg#single-family"></use></svg>
          <span>Single Family</span>
        </button>
        <button name="COMMERCIAL" type="button" class="" tabindex="0">
          <svg role="presentation" aria-hidden="true" tabindex="-1"><use xlink:href="${window.hlx.codeBasePath}/icons/icons.svg#commercial"></use></svg>
          <span>Commercial</span>
        </button>
        <button name="MULTI_FAMILY" type="button" class="selected" tabindex="0">
          <svg role="presentation" aria-hidden="true" tabindex="-1"><use xlink:href="${window.hlx.codeBasePath}/icons/icons.svg#multi-family"></use></svg>
          <span>Multi Family</span>
        </button>
        <button name="LAND" type="button" class="selected" tabindex="0">
          <svg role="presentation" aria-hidden="true" tabindex="-1"><use xlink:href="${window.hlx.codeBasePath}/icons/icons.svg#lot-land"></use></svg>
          <span>Lot / Land</span>
        </button>
        <button name="FARM" type="button" class="selected" tabindex="0">
          <svg role="presentation" aria-hidden="true" tabindex="-1"><use xlink:href="${window.hlx.codeBasePath}/icons/icons.svg#farm-ranch"></use></svg>
          <span>Farm / Ranch</span>
        </button>
      </div>
      <div class="all">
        <label for="select-all-property-types">
          <input type="checkbox" value="" id="select-all-property-types" tabindex="0">
          <div class="checkbox">
            <svg class="empty" role="presentation" aria-hidden="true" tabindex="-1"><use xlink:href="${window.hlx.codeBasePath}/icons/icons.svg#checkmark"></use></svg>
          </div>
          <span class="label">Select All</span>
        </label>
      </div>
    </div>
    <div class="keywords">
      <label class="section-label" role="presentation">Keyword Search</label>
      <div class="keywords-input">
        <input name="keywords" type="text" placeholder="Pool, Offices, Fireplace..." aria-label="Pool, Offices, Fireplace...">
        <button><span>Add</span></button>
      </div>
      <div class="keywords-list">
      
      </div>
      <div class="keywords-match">
        <label role="presentation">Match</label>
        <label role="presenation">
          <input type="radio" name="matchType" value="any">
          <div class="radio-button"></div>
          <span>Any</span>
        </label>
        <label role="presenation">
          <input type="radio" name="matchType" value="all" checked="checked">
          <div class="radio-button"></div>
          <span>All</span>
        </label>
      </div>
    </div>
    <div class="misc">
      <div class="year-range">
        <label class="section-label" role="presentation">Year Built</label>
        <div class="range-items">
          <div id="min-year" class="select-wrapper">
            <select name="min-year" aria-label="No Min">
              <option value="">No Min</option>
            </select>
            <div class="selected" role="combobox" aria-haspopup="listbox" aria-label="No Min" aria-expanded="false" aria-controls="list-min-year" tabindex="0"><span>No Min</span></div>
            <ul id="list-min-year" class="select-items" role="listbox">
              <li data-value="" role="option" class="selected">No Min</li>
            </ul>
          </div>
          <span>to</span>
          <div id="max-year" class="select-wrapper">
            <select name="max-year" aria-label="No Max">
              <option value="">No Max</option>
            </select>
            <div class="selected" role="combobox" aria-haspopup="listbox" aria-label="No Max" aria-expanded="false" aria-controls="list-max-year" tabindex="0"><span>No Max</span></div>
            <ul id="list-max-year" class="select-items" role="listbox">
              <li data-value="" role="option" class="selected">No Max</li>
            </ul>
          </div>
        </div>
      </div>
      <hr>
      <div class="is-new">
        <div class="filter-toggle">
          <label role="presentation">New Listings</label>
          <input name="is-new" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="true">
          <div class="checkbox"></div>
        </div>
      </div>
      <hr>
      <div class="price-update">
        <div class="filter-toggle">
          <label role="presentation">Recent Price Changes</label>
          <input name="price-change" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="true">
          <div class="checkbox"></div>
        </div>
      </div>
      <hr>
      <div class="open-houses">
        <div class="filter-toggle">
          <label role="presentation">Open Houses Only</label>
          <input name="open-houses" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="true">
          <div class="checkbox"></div>
        </div>
        <div class="open-houses-timeframe">
          <label role="presenation">
            <input type="radio" name="open-houses-timeframe" value="ONLY_WEEKEND" checked="checked">
            <div class="radio-button"></div>
            <span>This Weekend</span>
          </label>
          <label role="presenation">
            <input type="radio" name="open-houses-timeframe" value="ANYTIME">
            <div class="radio-button"></div>
            <span>Anytime</span>
          </label>
        </div>
      </div>
      <hr>
      <div class="lux">
        <div class="filter-toggle">
          <label role="presentation">Luxury</label>
          <input name="lux" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="true">
          <div class="checkbox"></div>
        </div>
      </div>
      <hr>
      <div class="bhhs-only">
        <div class="filter-toggle">
          <label role="presentation">Berkshire Hathaway Home Services Listings Only</label>
          <input name="bhhs-only" hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="true">
          <div class="checkbox"></div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <p class="button-container">
        <a id="search-apply" href="#" title="Apply">Apply</a>
      </p>
      <p class="button-container secondary">
        <a id="search-cancel" href="#" title="Cancel">Cancel</a>
      </p>
      <p class="button-container secondary">
        <a id="search-reset" href="#" title="Reset">Reset</a>
      </p>
    </div>
  `;

  wrapper.querySelectorAll('#adv-min-sqft, #adv-max-sqft').forEach((item) => {
    SQUARE_FEET.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b.value;
      opt.textContent = b.label;
      item.querySelector('select').append(opt);
      const li = document.createElement('li');
      li.setAttribute('data-value', b.value);
      li.setAttribute('role', 'option');
      li.textContent = b.label;
      item.querySelector('ul').append(li);
    });
  });

  wrapper.querySelectorAll('#min-year, #max-year').forEach((item) => {
    let year = new Date().getFullYear();
    const select = item.querySelector('select');
    const ul = item.querySelector('ul');

    const addOption = (value) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      select.append(opt);
      const li = document.createElement('li');
      li.setAttribute('data-value', value);
      li.setAttribute('role', 'option');
      li.textContent = value;
      ul.append(li);
    };

    // Last 6 years individually
    for (let i = 0; i < 6; i += 1) {
      addOption(year);
      year -= 1;
    }

    // 6 blocks of 5 year increments
    year -= year % 5;
    for (let i = 1; i < 6; i += 1) {
      addOption(year);
      year -= 5;
    }

    // 6 blocks of 10 year increments
    year -= year % 10;
    for (let i = 1; i < 6; i += 1) {
      addOption(year);
      year -= 10;
    }

    // remaining at 20 year increments
    while (year >= 1900) {
      addOption(year);
      year -= 20;
    }
  });
}

function observeForm(form) {
  const searchInput = form.querySelector('.suggester-input input');
  searchInput.addEventListener('focus', observeSearchInput);

  form.querySelector('a.search-submit').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!BREAKPOINTS.medium.matches) {
      syncToBar();
    }
    updateParameters();
  });

  form.querySelectorAll('.result-filters > .select-wrapper div.selected, .advanced-filters .misc .select-wrapper div.selected').forEach((button) => {
    button.addEventListener('click', filterSelectClicked);
  });

  form.querySelectorAll('.select-wrapper .select-items li').forEach((li) => {
    li.addEventListener('click', filterItemClicked);
  });

  form.querySelectorAll('.range-wrapper > div.selected').forEach((button) => {
    button.addEventListener('click', rangeSelectClicked);
  });

  form.querySelectorAll('.range-wrapper .range-items div[id="min-price"], .range-wrapper .range-items div[id="max-price"]').forEach((price) => {
    price.addEventListener('keyup', (e) => {
      observePriceInput(e);
      updatePriceLabel(price.closest('.range-wrapper'));
    });
  });

  form.querySelectorAll('.filter-toggle').forEach((t) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      const { currentTarget } = e;
      const checked = currentTarget.querySelector('div.checkbox').classList.toggle('checked');
      if (checked) {
        currentTarget.querySelector('input').setAttribute('checked', 'checked');
      } else {
        currentTarget.querySelector('input').removeAttribute('checked');
      }
    });
  });

  form.querySelectorAll('.range-wrapper .range-items div[id="adv-min-price"], .range-wrapper .range-items div[id="adv-max-price"]').forEach((price) => {
    price.addEventListener('keyup', observePriceInput);
  });

  form.querySelector('.listing-types').addEventListener('click', (e) => {
    e.preventDefault();
    const input = e.target.closest('.filter-toggle')?.querySelector('input');
    if (input && input.value === ListingType.FOR_RENT.type) {
      e.currentTarget.querySelector(`input[value="${ListingType.PENDING.type}"]`).closest('.filter-toggle').classList.toggle('disabled');
    } else if (input && input.value === ListingType.PENDING.type) {
      e.currentTarget.querySelector(`input[value="${ListingType.FOR_RENT.type}"]`).closest('.filter-toggle').classList.toggle('disabled');
    }
  });

  form.querySelectorAll('.range-items div[id$="-sqft"] > .selected').forEach((sqft) => {
    sqft.addEventListener('click', sqftSelectClicked);
  });

  form.querySelectorAll('.range-wrapper .range-items div[id$="-sqft"] .select-items li').forEach((li) => {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      updateSqftLabel(e.currentTarget.closest('.range-wrapper'));
    });
  });

  const allTypes = form.querySelector('.property-types .all');
  form.querySelectorAll('.property-types .options button').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const exists = e.currentTarget.classList.toggle('selected');
      if (!exists) {
        allTypes.querySelector('input[type="checkbox"]').checked = false;
      }
    });
  });

  form.querySelector('.property-types .all label').addEventListener('click', (e) => {
    if (e.currentTarget.querySelector('input').checked) {
      e.currentTarget.closest('.property-types').querySelectorAll('.options button').forEach((b) => b.classList.add('selected'));
    } else {
      e.currentTarget.closest('.property-types').querySelectorAll('.options button').forEach((b) => b.classList.remove('selected'));
    }
  });

  form.querySelector('.advanced-filters .keywords button').addEventListener('click', addKeyword);

  form.querySelectorAll('.year-range .select-wrapper div.selected').forEach((button) => {
    button.addEventListener('click', filterSelectClicked);
  });

  form.querySelector('.advanced-filters .open-houses .filter-toggle').addEventListener('click', (e) => {
    const input = e.currentTarget.querySelector('input');
    const timeframe = e.currentTarget.closest('.open-houses').querySelector('.open-houses-timeframe');
    if (input.checked) {
      timeframe.classList.add('visible');
    } else {
      timeframe.classList.remove('visible');
    }
  });

  const filterBtn = form.querySelector('a.filter');
  filterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toggleAdvancedFilters(e);
  });

  form.querySelector('a#search-apply').addEventListener('click',(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!BREAKPOINTS.medium.matches) {
      syncToBar();
    }
    updateParameters();
  });

  form.querySelector('a#search-cancel').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    filterBtn.dispatchEvent(new MouseEvent('click'));
  });

  form.querySelector('a#search-reset').addEventListener('click', resetForm);

  BREAKPOINTS.medium.addEventListener('change', (e) => {
    if (e.matches) {
      syncToBar();
    } else {
      syncToAdvanced();
    }
  });
}

buildAdvancedFilters();
observeForm(document.querySelector('.property-search-bar.block form'));
