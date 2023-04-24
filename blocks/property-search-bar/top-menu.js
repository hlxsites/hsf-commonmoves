import {formatInput, getPlaceholder, addRangeOption, addOptions} from './common-function.js';

function addListeners() {

}

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
    const wrapper = document.createElement('div')
    wrapper.classList.add('filter-container', 'container-item', 'flex-row', 'center');
    wrapper.innerHTML = `
            <a role="button" aria-label="Filter">
                <svg role="presentation">
                    <use xlink:href="/icons/icons.svg#filter-white"></use>
                </svg>
            </a>`
    return wrapper;
}

export function buildTopFilterPlaceholder(filterName, callback = false) {
    const dropdownContainer = document.createElement('div');
    const identifier =  formatInput(filterName);
    const options = callback ? callback(filterName) : '';
    let label = ['beds', 'baths'].includes(filterName) ? `Any ${filterName}` : filterName

    let classes = [identifier, 'bl'];
    [...classes].forEach(className => dropdownContainer.classList.add(className));
    dropdownContainer.setAttribute('id', identifier);

    dropdownContainer.innerHTML =
        `<div class="header">
             <div class="title text-up"><span>${label}</span></div>
             </div>
       <div class="search-results-dropdown hide shadow">${options}</div>`;

    return dropdownContainer
}

export function build() {
    const defaultSuggestionMessage = 'Please enter at least 3 characters.';
    const wrapper = document.createElement('div');
    wrapper.classList.add('search-listing-block');
    const primaryFilters = document.createElement('div');
    const priceSelect = buildTopFilterPlaceholder('price', addRangeOption);
    const areaSelect = buildTopFilterPlaceholder('square feet', addRangeOption);
    const bedroomsSelect = buildTopFilterPlaceholder('beds', addOptions);
    const bathroomsSelect = buildTopFilterPlaceholder('baths', addOptions);

    primaryFilters.classList.add('primary-search', 'flex-row', 'container-item');
    primaryFilters.innerHTML = ` <div class="input-container">
                <input type="text" placeholder="${getPlaceholder('US')}" aria-label="${getPlaceholder('US')}" class="search-suggester">
                <div tabindex="0" class="search-suggester-results hide">
                    //@todo move to method???
                    <ul>
                        <li class="search-suggester-results">${defaultSuggestionMessage}</li>
                    </ul>
                </div>
            </div>`;
    wrapper.prepend(primaryFilters, buildButton('Search', true), priceSelect, bedroomsSelect, bathroomsSelect, areaSelect, buildFilterToggle(), buildButton('save search', true));
    [...wrapper.children].map(child => child.classList.add('container-item'));
    return wrapper;
}