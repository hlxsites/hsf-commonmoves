 const COUNTRIES = {
    'US': [],
     'CA': [
         {'url': 'https://www.bhhs.com/quebec-ca802', 'label': 'Québec'},
         {'url': 'https://www.bhhs.com/toronto-realty-ca801', 'label': 'Toronto Realty / West Realty'}
     ],
     'MX': [
         {'url': 'https://www.bhhs.com/applegate-realtors-mx804', 'label': 'Puerto Vallarta - Applegate Realtors'},
         {'url': 'https://www.bhhs.com/los-cabos-properties-mx803', 'label': 'Baja Real Estate'},
         {'url': 'https://www.bhhs.com/cancunproperties-mx802', 'label': 'Cancun'},
         {'url': 'https://www.bhhscolonialhomes.com/', 'label': 'San Miguel de Allende'}
     ],
     'KY': [{'url': 'https://www.berkshirehathawayhomeservicescaymanislands.com', 'label': 'Cayman Islands'}],
     'AW': [{'url': 'https://www.bhhs.com/aruba-realty-aw801', 'label': 'Aruba Realty'}],
     'AE': [{'url': 'https://www.bhhs.com', 'label': 'Gulf Properties'}],
     'BS': [{'url': 'https://www.bhhs.com"', 'label': 'Bahamas Real Estate'}],
     'GB': [{'url': 'https://www.bhhs.com', 'label': 'London Kay &amp; Co'}],
     'GR': [{'url': 'https://www.bhhs.com', 'label': 'Athens Properties'}],
     'ES': [{'url': 'https://www.bhhs.com/spain-es801', 'label': 'Spain'}],
     'IT': [{'url': 'https://www.bhhs.com', 'label': 'Maggi Properties'}],
     'PT': [
         {'url': 'https://www.bhhs.com', 'label': 'Atlantic Portugal'},
         {'url': 'https://www.bhhs.com', 'label': 'Portugal Property'}
     ],
     'IN': [{'url': 'https://www.bhhs.com', 'label': 'Orenda India'}],
};

 const BEDROOMS = [
     {"value": "1", "label": "1+ Beds"},
     {"value": "2", "label": "2+ Beds"},
     {"value": "3", "label": "3+ Beds"},
     {"value": "4", "label": "4+ Beds"},
     {"value": "5", "label": "5+ Beds"}
 ];

 const BATHROOMS = [
     {"value": "1", "label": "1+ Baths"},
     {"value": "2", "label": "2+ Baths"},
     {"value": "3", "label": "3+ Baths"},
     {"value": "4", "label": "4+ Baths"},
     {"value": "5", "label": "5+ Baths"}
 ];
const SQUARE_FEET = [
    {"value": "500", "label": "500 sq ft"},
    {"value": "750", "label": "750 sq ft"},
    {"value": "1000", "label": "1,000 sq ft"},
    {"value": "1250", "label": "1,250  sq ft"},
    {"value": "1500", "label": "1,500 sq ft"},
    {"value": "1750", "label": "1,750 sq ft"},
    {"value": "2000", "label": "2,000 sq ft"},
    {"value": "2250", "label": "2,250 sq ft"},
    {"value": "2500", "label": "2,500 sq ft"},
    {"value": "2750", "label": "2,750 sq ft"},
    {"value": "3000", "label": "3,000 sq ft"},
    {"value": "3500", "label": "3,500 sq ft"},
    {"value": "4000", "label": "4,000 sq ft"},
    {"value": "5000", "label": "5,000 sq ft"},
    {"value": "7500", "label": "7,500 sq ft"},
    ];

const YEAR_BUILT = [
    {"value": "1900", "label": "1900"},
    {"value": "1920", "label": "1920"},
    {"value": "1940", "label": "1940"},
    {"value": "1950", "label": "1950"},
    {"value": "1960", "label": "1960"},
    {"value": "1970", "label": "1970"},
    {"value": "1980", "label": "1980"},
    {"value": "1990", "label": "1990"},
    {"value": "1995", "label": "1995"},
    {"value": "2000", "label": "2000"},
    {"value": "2005", "label": "2005"},
    {"value": "2014", "label": "2014"},
    {"value": "2015", "label": "2015"},
    {"value": "2016", "label": "2016"},
    {"value": "2017", "label": "2017"},
    {"value": "2018", "label": "2018"},
    {"value": "2019", "label": "2019"},
]
function buildCountriesList(config) {
    let optionsList = '';
    Object.keys(config).forEach(country => {
       optionsList+= `<option value=${country}><img src="/icons/property-search/${country}.png" alt="${country}"
                                role="presentation" aria-hidden="true" tabIndex="-1">
                                ${country}</option>`
    });
    return optionsList;
}

 function buildFilterButtons(buttons, primary) {
     let output = `<div class="filter-buttons button-container flex-row vertical-center">`;
     buttons.forEach(button => {
         output += `<a rel="noopener" href="" target="_blank" tabindex="" class="btn ${primary.includes(button) ? 'btn-primary' : 'btn-secondary'} center" role="button">
            <span class="text-up">${button}</span>
        </a>`
     });
     output += `</div>`;
     return output;
 }

function buildFilterSearchTypesElement() {
    const  defaultInput = 'for sale';
    const columns = [['for sale', 'for rent'], ['pending', 'sold']];
    let output = '';
    output += `<div class="flex-column filter toggle hide-desktop">
    <label class="section-label text-up mb-1">Search Type</label><div class="column-2 flex-row">`
    columns.forEach(column => {
        output += `<div class="column">`;
        column.forEach(type => {
            output += `
            <div class="${formatInput(type)} flex-row mb-1">
                <input hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="${type.toLowerCase() === defaultInput}">
                <div class="checkbox ${type.toLowerCase() === defaultInput ? 'checked' : ''}"></div>
                <label class="text-up ml-1" role="presentation">${type}</label>
            </div>`
        });
        output+= `</div>`
    });
    output += `</div></div>`
    return output
}

function formatInput(string) {
    return string.replace(/ /g, '-').toLowerCase();
}
 function buildTooltipByCountry(config) {
     let optionsList = '';
     Object.keys(config).forEach(country => {
         optionsList += `<li data-value="${country}" class="tooltip-container">
        <a role="button"> 
        <img src="/icons/property-search/${country}.png" target="_blank" class="label-image" role="presentation" aria-hidden="true" tabindex="-1">${country}</a>
                                                        <ul class="custom-tooltip hide">`;
         if (config[country].length > 0) {
             config[country].forEach(config => {
                 optionsList += `<li><a href="${config.url}" target="_self" tabIndex="-1">${config.label}</a></li>`
             })
         }
         optionsList += `</ul></li>`
     });
     return optionsList;
}

 function buildDropdownElement(title, mode = '', defaultValue = '') {
     const dropdownContainer = document.createElement('div');
     const identifier =  title.toLocaleLowerCase().replace(/ /g, '-');
     let selectedOptionHtml = `<div class="title text-up">${title}</div>`;
     if (mode === 'country') {
         selectedOptionHtml =`
            <div role="button" aria-label="Select Country" class="title selected-country">
                <img src="/icons/property-search/${defaultValue}.png" alt="${defaultValue}Country Flag" class="label-image">
                <span>${defaultValue}</span>
            </div>`;
     }
     dropdownContainer.classList.add('container', identifier);
     dropdownContainer.setAttribute('id', identifier);
     dropdownContainer.innerHTML =
         `<div class="header">
             ${selectedOptionHtml}
             <svg role="presentation" class="arrow">
                <use xlink:href="/icons/icons.svg#arrow-down-white"></use>
             </svg>
             </div>
       <div class="search-results-dropdown hide shadow"/>`;

     return dropdownContainer
 }

 function addRangeOptionArea() {
     return `<div class="multiple-inputs">
                ${addOptions(SQUARE_FEET, 'No Min', 'multi')}
                <span class="range-label text-up">to</span>
                ${addOptions(SQUARE_FEET, 'No Max', 'multi')}
                </section>
            </div>
            `
 }

 function buildAreaFilter() {
    return `<div class="area-filter filter">
     <label class="section-label text-up" role="presentation">square feet</label>
     ${addRangeOptionArea()}
     </div>;`
 }
function addRangeYearBuild()  {
    return `<div class="multiple-inputs">
                ${addOptions(YEAR_BUILT, 'No Min', 'multi')}
                <span class="range-label text-up">to</span>
                ${addOptions(YEAR_BUILT, 'No Max', 'multi')}
                </section>
            </div>
            `
}

 function buildPriceFilter() {
     return `<div class="flex-column filter mb-1 hide-desktop">
    <label class="section-label text-up">price</label>
    ${addRangeOption('price')}
</div>`
 }

 function addRangeOption(filterName, fromLabel = 'No Min', toLabel = 'No Max', maxLength = 14) {
    const filterLabel = filterName.charAt(0).toLocaleUpperCase() + filterName.slice(1).toLowerCase();
    return `<div class="multiple-inputs">
                <div id="Min${filterLabel}" class="input-dropdown">
                <input type="text" maxLength="${maxLength}" list="listMin${filterLabel}"
                    id="bbh-Min${filterLabel}" aria-describedby="Min${filterLabel}"
                    placeholder="${fromLabel}" aria-label="Minimum ${filterLabel}"
                    class="price-range-input min-price">
                <datalist id="listMinPrice" class="list${filterLabel}"></datalist>
            </div>
        <span class="range-label text-up">to</span>
        <div id="Max{filterLabel}" class="input-dropdown">
            <input type="text" maxLength="${maxLength}" list="listMax${filterLabel}" id="bbh-Max${filterLabel}" aria-describedby="Max${filterLabel}"
                  placeholder="${toLabel}" aria-label="Maximum ${filterLabel}"
                  class="price-range-input max-price">
            <datalist id="listMax${filterLabel}" class="list${filterLabel}"></datalist>
            </div>
        </div>`
 }

 function buildPropertyColumn(buttonNames = []) {
    let output = '';
    buttonNames.forEach(buttonName => {
        output += `<button type="button" class="flex-row">
                <svg role="presentation">
                    <use xlink:href="/icons/icons.svg#${buttonName.replace(/[\/\s]/g, "-").toLowerCase()}"></use>
                </svg>
                <span class="ml-1">${buttonName}</span>
            </button>`
    });
    return output;
 }

 function buildPropertyFilterHtml() {
    const firstColumnValues  = ['Condo/Townhouse', 'Commercial', 'Lot/Land'];
    const secondColumnValues = ['Single Family', 'Multi Family', 'Farm/Ranch'];
    let  output= `<div class="flex-column property-type filter">`;
    //select all button might be separate method
    output += `
    <label class="section-label text-up" role="presentation">property type</label>
    <div class="column-2 flex-row">
    <div class="column">${buildPropertyColumn(firstColumnValues)}</div>
    <div class="column">${buildPropertyColumn(secondColumnValues)}</div>
    </div>
    <div class=" filter-checkbox mt-1">
        <label role="presentation" class="flex-row mb-1">
            <input type="checkbox" aria-label="Property Type">
            <div class="checkbox">
                <svg role="presentation">
                    <use xlink:href="/icons/icons.svg#checkmark"></use>
                </svg>
            </div>
            <span class="label">Select All</span>
        </label>
    </div>
    </div>
    `;
    return output;
 }

 function buildYearBuildFilter() {
    return `<div class="year-built filter">
        <label class="section-label text-up" role="presentation">year built</label>
        <div class="error hide">
        <svg class="icon-msg" role="presentation">
            <use xlink:href="/icons/icons.svg#error"></use>
        </svg>
        <span>Min year must be before or the same as Max year</span>
    </div>
    ${addRangeYearBuild()}
    </div>`
 }

 function buildKeywordSearch() {
     return `<div class="keyword-search filter mb-1 mt-1">
    <label class="section-label text-up" role="presentation">keyword search</label>
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
 function addOptions(config, defaultValue, mode = '') {
    let selectedHtml = '';
    if (mode === 'multi') {
        selectedHtml = `
            <div class="select-selected" role="button" aria-haspopup="listbox">${defaultValue}</div>
            `;
    }
    return `<section>
        <div>
            <select class="hide" aria-label="${defaultValue}">${buildSelectOptions(config, defaultValue, mode)}</select>
            ${selectedHtml}
            <ul class="select-item select-hide" role="listbox">${buildListBoxOptions(config, defaultValue, mode)}</ul>
        </div>
    </section>`
 }

 /**
  *
  * @param {array} config
  * @param {string} defaultValue
  * @param {string} mode
  * @returns {string}
  */
 function buildSelectOptions(config, defaultValue, mode) {
     let output = '';
     if (mode === 'country') {
         output = buildCountriesList(config);
     } else {
         output = `<option value="">${defaultValue}</option>`
         config.forEach(el => {
             output += `<option value="${el.value}">${el.label}</option>`
         });
     }
     return output
 }

 /**
  *
  * @param {array} config
  * @param {string} defaultValue
  * @param {string} mode
  * @returns {string}
  */
 function buildListBoxOptions(config, defaultValue, mode) {
     let output = '';
     if (mode === 'country') {
         output += buildTooltipByCountry(config);
     } else {
         output += `<li data-value="" class="tooltip-container">${defaultValue}</li>`
         config.forEach(config => {

             output += `<li data-value="${config.value}" class="tooltip-container">${config.label}</li>`
         });
     }
     return output
 }

 function buildFilterOpenHouses() {
     return `<div class="filter">
    <label class="section-label text-up" role="presentation">Open Houses Only</label>
    <div class="flex-row vertical-center">
        <div class="filter-checkbox mt-1">
            <label role="presentation" class="flex-row mb-1">
                <input type="checkbox" aria-label="Open Houses Only" value="">
            <div class="checkbox">
                <svg  role="presentation">
                    <use xlink:href="/icons/icons.svg#checkmark"></use>
                </svg>
            </div>
            <span class="label"></span>
            </label>
        </div>
        <div>
            <label role="presentation" class="flex-row center">
                <input type="radio" name="openHousesOnly" value="true">
            <div class="radio-btn"></div>
            <span class="">This Weekend</span>
            </label>
        </div>
        <div>
            <label role="presentation" class="flex-row vertical-center"><input type="radio" name="openHousesOnly" value="false">
            <div class="radio-btn"></div>
            <span class="">Anytime</span>
            </label>
        </div>
    </div>
</div>`;
 }

 function buildSectionFilter(config, defaultValue, name) {
     let output = `<div class="${name.toLowerCase()} filter tile hide-desktop">
    <label class="section-label text-up" role="presentation">${name}</label><ul class="flex-row">`;
     //add element on top of array
     config.unshift({value: '', label: defaultValue});

     config.forEach(el => {
         output += `<li>
            <input aria-describedby="${name.toLowerCase()}${el.value}" type="radio" id="${name.toLowerCase()}${el.value}" value=${el.value}>
            <label for="${name.toLowerCase()}${el.value}">${el.label === 'Any'? 'Any': el.value + "+"}</label>
        </li>`
     });
     output += `</ul></div>`;
     return output;

 }
 function getPlaceholder(country) {
     return country === 'US' ? 'Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#' : 'Enter City'
 }

 function closeSelect(element) {

     element.classList.remove('opened');
     element.querySelector('.search-results-dropdown').classList.add('hide');
 }

 function openSelect(element) {
     element.classList.add('opened');
     element.querySelector('.search-results-dropdown').classList.remove('hide');
 }

 function abbrNum(d, h) {
     h = Math.pow(10, h);
     let k = ["k", "m", "b", "t"], m;
     for (m = k.length - 1; 0 <= m; m--) {
         var n = Math.pow(10, 3 * (m + 1));
         if (n <= d) {
             d = Math.round(d * h / n) / h;
             1E3 == d && m < k.length - 1 && (d = 1,
                 m++);
             d += k[m];
             break
         }
     }
     return d
 }

 function createPriceList(d) {
     let optionlist = '';
     let k = [10, 100, 1E3, 1E4, 1E5, 1E6];
     if (d)
         for (let m = 1; 6 >= m; m++)
             optionlist += `<option> ${d * k[m - 1]} </option>`;
     return optionlist
 }

 function formatPriceLabel(minPrice, maxPrice) {
     let d = minPrice.replace(/[^0-9]/g, "");
     let h = maxPrice.replace(/[^0-9]/g, "");
     return "" !== d && "" !== h ?
         "$" + abbrNum(d, 2) + " - $" + abbrNum(h, 2) :
         "" !== d ? "$" + abbrNum(d, 2) :
             "" == d && "" !== h ? "$0 - $" + abbrNum(h, 2) :
                 "Price"
 }

 function buildFilterToggle(label) {
     return `<div class="filter toggle flex-row space-between">
    <label class="section-label text-up" role="presentation">${label}</label>
    <div>
        <section class="filter-toggle">
            <div>
                <input hidden="hidden" type="checkbox" aria-label="Hidden checkbox" value="true">
                <div class="checkbox"></div>
            </div>
        </section>
    </div>
</div>`
 }

export default function decorate(block) {
    const countrySelect = buildDropdownElement('Select Country', 'country', 'US');
    countrySelect.querySelector('.search-results-dropdown').innerHTML = addOptions(COUNTRIES, 'US', 'country');
    const defaultSuggestionMessage = 'Please enter at least 3 characters.';
    const priceSelect = buildDropdownElement('price');
    priceSelect.querySelector('.search-results-dropdown').innerHTML = addRangeOption('price');
    priceSelect.classList.add('container-item', 'left-border');
    const bedroomsSelect = buildDropdownElement('any beds');
    bedroomsSelect.classList.add('container-item', 'left-border');
    bedroomsSelect.querySelector('.search-results-dropdown').innerHTML = addOptions(BEDROOMS, 'Any Beds');
    const bathroomsSelect = buildDropdownElement('any baths');
    bathroomsSelect.classList.add('container-item', 'left-border');
    bathroomsSelect.querySelector('.search-results-dropdown').innerHTML = addOptions(BATHROOMS, 'Any Baths');
    const areaSelect = buildDropdownElement('square feet');
    areaSelect.classList.add('container-item', 'left-border');
    areaSelect.querySelector('.search-results-dropdown').innerHTML = addRangeOptionArea();
    areaSelect.querySelectorAll('.select-item').forEach((el) => {
        el.classList.add('hide');
    });
    block.innerHTML = `<div class="search-listing-block">
    <div class="primary-search container-item">
        ${countrySelect.outerHTML}
        <div class="input-container">
                <input type="text" placeholder="${getPlaceholder('US')}" aria-label="${getPlaceholder('US')}" class="search-suggester">
                <div tabindex="0" class="search-suggester-results" style="display: none;">
                    //@todo move to method???
                    <ul>
                        <li class="search-suggester-results">${defaultSuggestionMessage}</li>
                    </ul>
                </div>
            </div>
        </div>
    <div class="button-container container-item">
        <a target="_blank" tabindex="" class="btn btn-search" role="button">
            <span>search</span>
        </a>
    </div>
    ${priceSelect.outerHTML}
    ${bedroomsSelect.outerHTML}
    ${bathroomsSelect.outerHTML}
    ${areaSelect.outerHTML}
    <div class ="filter-container container-item">
            <a role="button" aria-label="Filter">
                <svg role="presentation">
                    <use xlink:href="/icons/icons.svg#filter-white"></use>
                </svg>
                <svg role="presentation" class="hide">
                <use xlink:href="/icons/icons.svg#close-x-white"></use></svg>
            </a>
        </div>
        
        <div class="button-container container-item save-search">
        <a target="_blank" tabindex="" class="btn btn-search" role="button">
            <span>save search</span>
        </a>
    </div>
</div>
<div class="filter-block hide"> 
${buildFilterSearchTypesElement()}
${buildPriceFilter()}
${buildSectionFilter(BEDROOMS, 'Any', 'bedrooms')}
${buildSectionFilter(BATHROOMS, 'Any', 'bathrooms')}
${buildAreaFilter()}
${buildPropertyFilterHtml()}
 ${buildKeywordSearch()}
${buildYearBuildFilter()}
${buildFilterToggle('New listings')}
${buildFilterToggle('Recent Price Changes')}
${buildFilterOpenHouses()}
${buildFilterToggle('luxury')}
${buildFilterToggle('Berkshire Hathaway HomeServices Listings only')}
${buildFilterButtons(['apply', 'cancel', 'reset'], ['apply'])}
</div>
 `

    //add logic for select on click
    const countriesListItems = block.querySelectorAll('.container.select-country .select-item .tooltip-container');
    const filterOptions = block.querySelectorAll('.container .select-item .tooltip-container');
    const inputContainer = block.querySelector('.input-container input');
    const filters = block.querySelectorAll('.container .header');
    const multipleSelectInputs = block.querySelectorAll('.select-selected');
    const priceRangeInputs = block.querySelector('.price .multiple-inputs');
    const filterContainer = block.querySelector('.filter-container');
    const filterBlock = block.querySelector('.filter-block');
    const filterButtons = block.querySelector('.filter-buttons');
    filterContainer.addEventListener('click', (e) => {
        if (filterBlock.classList.contains('hide')) {
            filterBlock.classList.remove('hide');
        } else {
            filterBlock.classList.add('hide');
        }
        //change icon for filter
        filterContainer.querySelectorAll('svg').forEach((el) => {
            if(el.classList.contains('hide')) {
                el.classList.remove('hide');
            } else {
                el.classList.add('hide');
            }
        });
    });
    //add logic on price range change
    priceRangeInputs.addEventListener('keyup', (e) => {
            const minPrice =  priceRangeInputs.querySelector('.price-range-input.min-price').value;
            const maxPrice = priceRangeInputs.querySelector('.price-range-input.max-price').value;
            //display datalist
            const activeElement = e.target.closest('.price-range-input');
            activeElement.list.innerHTML = createPriceList(activeElement.value);
            //update label
            block.querySelector('.price .title').innerText = formatPriceLabel(minPrice, maxPrice);
        });
    //close filters on click outside
    document.addEventListener('click', (e) => {
        if(!block.contains(e.target)) {
            filters.forEach((elem) => {
                if (elem.parentElement.classList.contains('opened')) {
                    closeSelect(elem.parentElement);
                }
            });
        }
    });

    filters.forEach((selectedFilter) => {
        selectedFilter.addEventListener('click', () => {
            //close all other elements
            filters.forEach((elem) => {
                if (elem.parentElement.hasAttribute('id')
                    && elem.parentElement.getAttribute('id') !== selectedFilter.parentElement.getAttribute('id')
                    && elem.parentElement.classList.contains('opened')
                ) {
                    closeSelect(elem.parentElement);
                }
            });
            if (selectedFilter.parentElement.classList.contains('opened')) {
                closeSelect(selectedFilter.parentElement);
            } else {
                openSelect(selectedFilter.parentElement);
            }
        })
    });

    multipleSelectInputs.forEach((el) => {
        el.addEventListener('click', () => {
            el.closest('section > div').querySelector('.select-item').classList.remove('hide');
        })
    })
    //update country name, flag, input placeholder on click
    filterOptions.forEach((element) => {
        element.addEventListener('click', (e) => {
            let selectedElValue = element.innerText;
            let container = element.closest('.container');
            const headerTitle = container.querySelector('.header .title');
            if (container.querySelector('.multiple-inputs')) {
                //logic
                element.closest('section > div').querySelector('.select-selected').innerHTML = selectedElValue;
                const headerItems = container.querySelectorAll('.multiple-inputs .select-selected');
                const fromSelectedValue = headerItems[0].innerText;
                const toSelectedValue = headerItems[1].innerText;
                if (fromSelectedValue === 'No Min' && toSelectedValue === 'No Max') {
                    selectedElValue = 'square feet';
                } else {
                    selectedElValue = fromSelectedValue + '-' + toSelectedValue;
                }
                element.closest('.select-item').classList.add('hide');
            }
            else if (headerTitle.childElementCount > 0) {
                const selectedCountry = e.target.closest('.tooltip-container').getAttribute('data-value');
                selectedElValue = `
                <img src="/icons/property-search/${selectedCountry}.png" alt="${selectedCountry}Country Flag" class="label-image">
                    <span>${selectedCountry}</span>`;
                //update input placeholder
                inputContainer.ariaLabel = getPlaceholder(selectedCountry);
                inputContainer.placeholder = getPlaceholder(selectedCountry);
                closeSelect(container);
            } else {
                closeSelect(container);
            }
            headerTitle.innerHTML = selectedElValue;
            //todo update logic for multiple select


        });
    });
    //display country tooltip on hover
    countriesListItems.forEach((element) => {
        element.addEventListener('pointerover', (e) => {
            if (e.target.querySelector('.custom-tooltip')) {
                e.target.querySelector('.custom-tooltip').classList.remove('hide');
            }
        });
        element.addEventListener('pointerleave', (e) => {
            if (e.target.querySelector('.custom-tooltip')) {
                e.target.querySelector('.custom-tooltip').classList.add('hide');
            }
        });
    })
}

  //ul tooltip.