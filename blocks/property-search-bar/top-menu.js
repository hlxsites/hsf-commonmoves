import {formatInput, getPlaceholder} from './common-function.js';

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

function buildTopFilterPlaceholder(title, classes, callback = false) {
    const dropdownContainer = document.createElement('div');
    const identifier =  formatInput(title);
    const options = callback ? callback(title) : '';
    classes.push(identifier);
    [...classes].forEach(className => dropdownContainer.classList.add(className));
    dropdownContainer.setAttribute('id', identifier);

    dropdownContainer.innerHTML =
        `<div class="header">
             <div class="title text-up"><span>${title}</span></div>
             </div>
       <div class="search-results-dropdown hide shadow">${options}</div>`;

    return dropdownContainer
}

function addRangeOption(filterName, fromLabel = 'No Min', toLabel = 'No Max', maxLength = 14) {
    const filterLabel = filterName.charAt(0).toLocaleUpperCase() + filterName.slice(1).toLowerCase();
    if (filterName === 'price') {

        return `<div class="multiple-inputs">
                <div id="Min${filterLabel}" class="input-dropdown">
                <input type="text" maxLength="${maxLength}" list="listMin${filterLabel}"
                    id="bbh-Min${filterLabel}" aria-describedby="Min${filterLabel}"
                    placeholder="${fromLabel}" aria-label="Minimum ${filterLabel}"
                    class="price-range-input min-price">
                <datalist id="listMinPrice" class="list${filterLabel}"></datalist>
            </div>
        <span class="range-label text-up">to</span>
        <div id="Max${filterLabel}" class="input-dropdown">
            <input type="text" maxLength="${maxLength}" list="listMax${filterLabel}" id="bbh-Max${filterLabel}" aria-describedby="Max${filterLabel}"
                  placeholder="${toLabel}" aria-label="Maximum ${filterLabel}"
                  class="price-range-input max-price">
            <datalist id="listMax${filterLabel}" class="list${filterLabel}"></datalist>
            </div>
        </div>`
    } else if (filterName === 'square feet') {
        return addRangeOptionArea();
    } else if (filterName === 'year built') {
        return addRangeYearBuild();
    }
}

export function build() {
    const defaultSuggestionMessage = 'Please enter at least 3 characters.';
    const wrapper = document.createElement('div');
    wrapper.classList.add('search-listing-block');
    const primaryFilters = document.createElement('div');
    const priceFilter = buildTopFilterPlaceholder('price', ['container-item', 'left-border'], addRangeOption);

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

    wrapper.append(primaryFilters, buildButton('Search', true));
    return wrapper;
}