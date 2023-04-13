import { decorateIcons } from '../../scripts/lib-franklin.js';

const COUNTRIES = ['US', 'CA', 'MX', 'KY', 'AW', 'AE', 'BS', 'GB', 'GR', 'ES', 'IT', 'PT', 'IN'];

function buildCountrySelect() {
  const select = document.createElement('select');

  COUNTRIES.forEach((country) => {
    const option = document.createElement('option');
    option.value = country;
    option.innerHTML = `<img src="/icons/flags/${country}.png" alt="${country}" class="label-image" role="presentation" aria-hidden="true" tabIndex="-1" height="25" width="25">${country}`;
    select.append(option);
  });

  const selected = document.createElement('div');
  selected.classList.add('selected');
  selected.setAttribute('aria-haspopup', 'listbox');
  selected.setAttribute('aria-expanded', 'false');
  selected.setAttribute('aria-label', 'Select Country');
  selected.setAttribute('role', 'button');
  selected.setAttribute('tabIndex', '0');
  selected.innerHTML = select.querySelector('option').innerHTML;

  const wrapper = document.createElement('div');
  wrapper.classList.add('select-wrapper');
  wrapper.append(select, selected);
  return wrapper;
}

function buildForm() {
  const form = document.createElement('form');
  form.classList.add('homes');

  const html = `
    <div class="search-bar" role="search">
      <div class="search-suggester">
        ${buildCountrySelect().outerHTML}
        <div class="suggester-input">
          <input type="text" placeholder="Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#" aria-label="Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#">
          <ul class="suggester-results">
            <li>Please enter at least 3 characters.</li>
          </ul>
        </div>
      </div>
      <button class="search-filter" type="button" aria-label="More Filters" aria-haspopup="true">
        <span class="icon icon-filter"></span>
      </button>
      <button class="search-submit" aria-label="Search Homes" type="submit">
        <span>Search</span>
      </button>
    </div>
  `;

  form.innerHTML = html;

  const tmp = `
    <div class="search-bar-wrapper" role="search">
     
      <button class="btn--close" type="button" aria-label="Close Filters" aria-expanded="true">
        <svg role="presentation">
          <use xlink:href="/etc/clientlibs/bhhs-pagelibs/icons.svg#close-x"></use>
        </svg>
      </button>
      <button class="btn--filter" type="button" aria-label="More Filters" aria-haspopup="true">
        <svg role="presentation">
          <use xlink:href="/etc/clientlibs/bhhs-pagelibs/icons.svg#filter"></use>
        </svg>
      </button>
      <button class="btn--search" type="submit" aria-label="Homes Search">
        <span class="text-uppercase">search</span>
      </button>
    </div>
    <div class="filters homes">
      <input type="text" placeholder="$ minimum price" name="MinPrice" aria-label="minimum price">
        <input type="text" placeholder="$ maximum price" name="MaxPrice" aria-label="maximum price">
          <section class="cmp-dropdown">
            <div class="select-wrapper text-capitalize">
              <select name="MinBedroomsTotal" aria-label="bedrooms">
                <option value="">bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
                <option value="6">6+</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
                <option value="9">9+</option>
                <option value="10">10+</option>
                <option value="11">11+</option>
                <option value="12">12+</option>
              </select>
              <div class="select-selected" role="button" aria-haspopup="listbox" aria-label="Bedrooms">bedrooms
              </div>
              <ul class="select-items select-hide" role="listbox">
                <li role="option">bedrooms</li>
                <li role="option">1+</li>
                <li role="option">2+</li>
                <li role="option">3+</li>
                <li role="option">4+</li>
                <li role="option">5+</li>
                <li role="option">6+</li>
                <li role="option">7+</li>
                <li role="option">8+</li>
                <li role="option">9+</li>
                <li role="option">10+</li>
                <li role="option">11+</li>
                <li role="option">12+</li>
              </ul>
            </div>
          </section>
          <section class="cmp-dropdown">
            <div class="select-wrapper text-capitalize">
              <select name="MinBathroomsTotal" aria-label="bathrooms">
                <option value="">bathrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
                <option value="6">6+</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
              </select>
              <div class="select-selected" role="button" aria-haspopup="listbox" aria-label="Bathrooms">bathrooms
              </div>
              <ul class="select-items select-hide" role="listbox">
                <li role="option">bathrooms</li>
                <li role="option">1+</li>
                <li role="option">2+</li>
                <li role="option">3+</li>
                <li role="option">4+</li>
                <li role="option">5+</li>
                <li role="option">6+</li>
                <li role="option">7+</li>
                <li role="option">8+</li>
              </ul>
            </div>
          </section>
    </div>
    <button class="btn btn-primary btn--submit-mobile text-capitalize" type="submit">search</button>`;

  decorateIcons(form);
  return form;
}

const homes = {
  buildForm,
};

export default homes;
