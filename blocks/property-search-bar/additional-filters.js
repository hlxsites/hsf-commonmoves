import {addRangeOption, formatInput} from './common-function.js';

const filters = [
    {name: 'search types', callback: buildFilterSearchTypesElement},
    {name: 'price', callback: addRangeOption},
    {name: 'beds', callback: buildSectionFilter},
    {name: 'baths', callback: buildSectionFilter},
    {name: 'square feet', callback: addRangeOption},
    {name: 'property type', callback: buildPropertyFilterHtml},
    {name: 'keyword search', callback: buildKeywordSearch},
    {name: 'year built', callback: addRangeOption},
    {name: 'new listings', callback: buildFilterToggle},
    {name: 'recent price changes', callback: buildFilterToggle},
    {name: 'open houses', callback: buildFilterOpenHouses},
    {name: 'luxury', callback: buildFilterToggle},
    {name: 'berkshire hathaway homeServices listings only', callback: buildFilterToggle}
]

function buildFilterSearchTypesElement() {
    const  defaultInput = 'for sale';
    const columns = [['for sale', 'for rent'], ['pending', 'sold']];
    let output = '<div class="column-2 flex-row">';
    columns.forEach(column => {
        output += `<div class="column">`;
        column.forEach(type => {
            output += `
            <div class="${formatInput(type)} filter-toggle flex-row mb-1">
                <input hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="${type.toLowerCase() === defaultInput}">
                <div class="checkbox ${type.toLowerCase() === defaultInput ? 'checked' : ''}"></div>
                <label class="text-up ml-1" role="presentation">${type}</label>
            </div>`
        });
        output+= `</div>`
    });
    output += `</div>`;
    return output
}

export function buildFilterButtons() {
    const buttons = ['apply', 'cancel', 'reset'];
    const primary = ['apply'];
    const wrapper = document.createElement('div');
    wrapper.classList.add('filter-buttons', 'button-container', 'flex-row', 'vertical-center');
    let output = '';
    buttons.forEach(button => {
        output += `<a rel="noopener" href="" target="_blank" tabindex="" class="btn ${primary.includes(button) ? 'btn-primary' : 'btn-secondary'} center" role="button">
            <span class="text-up ${primary.includes(button) && 'c-w'}">${button}</span>
        </a>`
    });
    wrapper.innerHTML = output;
    return wrapper;
}

function buildPropertyColumn(labels = []) {
    let output = '';
    labels.forEach(buttonName => {
        output += `<button type="button" class="flex-row">
                <svg role="presentation">
                    <use xlink:href="/icons/icons.svg#${formatInput(buttonName)}"></use>
                </svg>
                <span class="ml-1">${buttonName}</span>
            </button>`
    });
    return output;
}

function buildCheckBox(ariaLabel, label = '') {

    return `<div class=" filter-checkbox mt-1">
        <label role="presentation" class="flex-row mb-1">
            <input type="checkbox" aria-label="${ariaLabel}">
            <div class="checkbox">
                <svg role="presentation">
                    <use xlink:href="/icons/icons.svg#checkmark"></use>
                </svg>
            </div>
            <span class="label">${label}</span>
        </label>
    </div>`
}

export function buildPropertyFilterHtml() {
    const firstColumnValues = ['Condo/Townhouse', 'Commercial', 'Lot/Land'];
    const secondColumnValues = ['Single Family', 'Multi Family', 'Farm/Ranch'];
    return `
    <div class="column-2 flex-row">
    <div class="column">${buildPropertyColumn(firstColumnValues)}</div>
    <div class="column">${buildPropertyColumn(secondColumnValues)}</div>
    </div>
    ${buildCheckBox('Property Type', 'Select All')}
`;
}

function buildFilterOpenHouses() {
    return `
    <div class="flex-row vertical-center">
    ${buildCheckBox('Open Houses Only')}
        <div class="ml-1 mr-1">
            <label role="presentation" class="flex-row center">
                <input type="radio" name="openHousesOnly" value="true">
            <div class="radio-btn"></div>
            <span class="">This Weekend</span>
            </label>
        </div>
        <div>
            <label role="presentation" class="flex-row vertical-center">
            <input type="radio" name="openHousesOnly" value="false">
            <div class="radio-btn"></div>
            <span class="">Anytime</span>
            </label>
        </div>
    </div>
`;
}
function buildKeywordSearch() {
    return `
    <div class="flex-row vertical-center container-input">
            <input type="text" placeholder="Pool, Offices, Fireplace..." aria-label="Pool, Offices, Fireplace...">
            <button type="submit" class="button secondary">
                <span class="text-up">add</span>
            </button>
    </div>
    <div id="container-tags"></div>
        <br>
<!--        <span class="cmp-container-tags__tag"> cord-->
<!--            <span class="close"></span>-->
<!--        </span>-->
<!--        <span class="cmp-container-tags__tag"> cors-->
<!--            <span class="close"></span>-->
<!--        </span>-->
        <div class="flex-row vertical-center">
            <label class="text-up vertical-center" role="presentation">match</label>
            <div class="filter-radiobutton">
                <label role="presentation" class="flex-row vertical-center ml-1 mr-1">
                    <input type="radio" name="matchTagsAny" value="false">
                    <div class="radio-btn"></div>
                    <span class="fs-1">Any</span>
                </label>
            </div>
            <div class="filter-radiobutton">
                <label role="presentation" class="flex-row vertical-center">
                    <input type="radio" name="matchTagsAll" value="true">
                    <div class="radio-btn"></div>
                    <span class="fs-1">All</span>
                </label>
            </div>
        </div>
</div>`
}

 function buildFilterToggle() {
    return `
    <div>
        <section class="filter-toggle">
            <div>
                <input hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="true">
                <div class="checkbox"></div>
            </div>
        </section>
    </div>`
}

function buildPlaceholder(filterName, callback ){
    const placeholder = document.createElement('div');
    const classNames = ['filter', formatInput(filterName)];
    [...classNames].forEach(className => placeholder.classList.add(className));

    placeholder.innerHTML = ` <label class="section-label text-up">${filterName}</label>
    ${callback(filterName)}
    `;
    return placeholder.outerHTML;
}

function buildSectionFilter(filterName) {
    //todo refactor
    const number = 5;
    const defaultValue = 'Any';
    const name = filterName.toLowerCase();
    let output = `
    <ul class="flex-row tile">
    <li>
            <input aria-describedby="${name}${defaultValue}" type="radio" id="${name}${defaultValue}" value=${defaultValue}>
            <label for="${name}${defaultValue}">${defaultValue}</label>
    </li>`;

    for (let i = 1; i <= number; i += 1) {
        output += `<li>
            <input aria-describedby="${name}${i}" type="radio" id="${name}${i}" value=${i}>
            <label for="${name}${i}">${i + "+"}</label>
        </li>`
    }

    output += `</ul>`;
    return output;
}

export function build() {
    const wrapper = document.createElement('div');
    let output = '';
    filters.forEach(filter =>
        output+= buildPlaceholder(filter.name, filter.callback));
    wrapper.classList.add('filter-block');
    wrapper.innerHTML = ` 
    ${output}`;
    return wrapper;
}
// export function buildFilterButtons() {
//
// }


// ${buildPlaceholder('search types', ['flex-column', 'hide-desktop'], buildFilterSearchTypesElement)}
// ${buildPlaceholder('price', addRangeOption, ['hide-desktop', 'mb-1', 'flex-column'])}
// ${buildPlaceholder('beds', buildSectionFilter, ['hide-desktop', 'beds'], buildSectionFilter)}
// ${buildPlaceholder('baths', buildSectionFilter, ['hide-desktop', 'beds'])}
//${buildPlaceholder('square feet', addRangeOption)}
//${buildPlaceholder('property type', buildPropertyFilterHtml, ['flex-column', 'property-type'])}
//${buildPlaceholder('keyword search', buildKeywordSearch, ['keyword-search'], buildKeywordSearch)}
//${buildPlaceholder('year built',  addRangeOption)}
//${buildPlaceholder('new listings', buildFilterToggle, ['space-between'])}
//${buildPlaceholder('recent price changes', buildFilterToggle['space-between'])}
// ${buildPlaceholder('open houses only', buildFilterOpenHouses)}
// ${buildPlaceholder('luxury', buildFilterToggle, ['space-between'])}
// ${buildPlaceholder('berkshire hathaway homeServices listings only', buildFilterToggle['space-between'])}