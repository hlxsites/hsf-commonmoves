import {
  getPlaceholder, addRangeOption, addOptions, TOP_LEVEL_FILTERS,
} from './common-function.js';

function buildButton(label, primary = false) {
  const button = document.createElement('div');
  button.classList.add('button-container');
  button.innerHTML = `
    <a target="_blank" tabindex="" class="btn center ${primary ? 'btn-primary' : 'btn-secondary'}" role="button">
            <span>${label}</span>
    </a>`;
  return button;
}

function buildFilterToggle() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('filter-container', 'flex-row', 'center');
  wrapper.innerHTML = `
            <a role="button" aria-label="Filter">
                <svg role="presentation">
                    <use xlink:href="/icons/icons.svg#filter-white"></use>
                </svg>
                <svg role="presentation" class="hide">
                <use xlink:href="/icons/icons.svg#close-x-white"></use></svg>
            </a>`;
  return wrapper;
}

function buildTopFilterPlaceholder(filterName) {
  const dropdownContainer = document.createElement('div');
  const { type } = TOP_LEVEL_FILTERS[filterName];
  let { label } = TOP_LEVEL_FILTERS[filterName];
  let options = addRangeOption(label);
  if (type === 'select') {
    options = addOptions(label, `Any ${TOP_LEVEL_FILTERS[filterName].label}`);
    label = `Any ${TOP_LEVEL_FILTERS[filterName].label}`;
  }
  dropdownContainer.classList.add('bl', 'container-item');
  dropdownContainer.setAttribute('name', filterName);
  dropdownContainer.innerHTML = `<div class="header">
             <div class="title text-up"><span>${label}</span></div>
             </div>
       <div class="search-results-dropdown hide shadow">${options}</div>`;

  return dropdownContainer;
}

export default function build() {
  const defaultSuggestionMessage = 'Please enter at least 3 characters.';
  const wrapper = document.createElement('div');
  const container = document.createElement('div');
  container.classList.add('search-listing-container', 'flex-row');
  wrapper.classList.add('search-listing-block');

  const primaryFilters = document.createElement('div');
  primaryFilters.classList.add('primary-search', 'flex-row');
  primaryFilters.innerHTML = ` <div class="input-container">
                <input type="text" placeholder="${getPlaceholder('US')}" aria-label="${getPlaceholder('US')}" class="search-suggester">
                <div tabindex="0" class="search-suggester-results hide">
                    <ul>
                        <li class="search-suggester-results">${defaultSuggestionMessage}</li>
                    </ul>
                </div>
            </div>`;
  wrapper.prepend(primaryFilters, buildButton('Search', true));
  Object.keys(TOP_LEVEL_FILTERS).forEach((filter) => {
    const filterElement = buildTopFilterPlaceholder(filter);
    wrapper.append(filterElement);
  });
  wrapper.append(buildFilterToggle(), buildButton('save search', true));
  container.append(wrapper);
  return container;
}
