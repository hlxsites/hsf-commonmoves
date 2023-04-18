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
    {"value": "500", "label": "1,750 sq ft"},
    {"value": "500", "label": "2,000 sq ft"},
    {"value": "500", "label": "2,250 sq ft"},
    {"value": "500", "label": "2,500 sq ft"},
    {"value": "500", "label": "2,750 sq ft"},
    {"value": "500", "label": "3,000 sq ft"},
    {"value": "500", "label": "3,500 sq ft"},
    {"value": "500", "label": "4,000 sq ft"},
    {"value": "500", "label": "5,000 sq ft"},
    {"value": "500", "label": "7,500 sq ft"},
    ];

function buildCountriesList(config) {
    let optionsList = '';
    Object.keys(config).forEach(country => {
       optionsList+= `<option value=${country}><img src="/icons/property-search/${country}.png" alt="${country}"
                                role="presentation" aria-hidden="true" tabIndex="-1">
                                ${country}</option>`
    });
    return optionsList;
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
                ${addOptions(SQUARE_FEET, 'No Min', 'area')}
                <span class="range-label text-up">to</span>
                ${addOptions(SQUARE_FEET, 'No Max', 'area')}
                </section>
            </div>
            `
 }

 function addRangeOption(filterName, fromLabel = 'No Min', toLabel = 'No Max', maxLength = 14) {
    const filterLabel = filterName.charAt(0).toLocaleUpperCase() + filterName.slice(1).toLowerCase();
    return `<div class="multiple-inputs ">
                <div id="Min${filterLabel}" class="input-dropdown">
                <input type="text" maxLength="${maxLength}" list="listMin${filterLabel}"
                    id="bbh-Min${filterLabel}" aria-describedby="Min${filterLabel}"
                    placeholder="${fromLabel}" aria-label="Minimum ${filterLabel}"
                    class="form-control value1 price-list">
                <datalist id="listMinPrice" class="list${filterLabel}"></datalist>
            </div>
        <span class="range-label text-up">to</span>
        <div id="Max{filterLabel}" class="input-dropdown">
            <input type="text" maxLength="${maxLength}" list="listMax${filterLabel}" id="bbh-Max${filterLabel}" aria-describedby="Max${filterLabel}"
                  placeholder="${toLabel}" aria-label="Maximum ${filterLabel}"
                  class="form-control ${filterLabel}-list">
            <datalist id="listMax${filterLabel}" class="list${filterLabel}"></datalist>
            </div>
        </div>`
 }
 function addOptions(config, defaultValue, mode = '') {
    let selectedHtml = '';
    if (mode === 'area') {
        selectedHtml = `
            <div class="select-selected" data-ol-has-click-handler="" role="button" aria-haspopup="listbox">${defaultValue}</div>
            `;
    }
    return `<section>
        <div>
            <select class="hide" aria-label="${defaultValue}">${buildSelectOptions(config, defaultValue, mode)}</select>
            ${selectedHtml}
            <ul class="select-item" role="listbox">${buildListBoxOptions(config, defaultValue, mode)}</ul>
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

 function getPlaceholder(country) {
     return country === 'US' ? 'Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#' : 'Enter City'
 }

 function closeSelect(element) {

     element.classList.remove('opened');
     element.querySelector('.search-results-dropdown').classList.add('hide');
 }

 function createPriceList(d) {
     var h = []
         , k = [10, 100, 1E3, 1E4, 1E5, 1E6];
     if (d)
         for (var m = 1; 6 >= m; m++)
             h.push(d * k[m - 1]);
     return h
 }

 function openSelect(element) {
     element.classList.add('opened');
     // element.querySelectorAll('.hide').forEach((el) => {
     //     el.classList.remove('hide');
     //     }
     // );
     element.querySelector('.search-results-dropdown').classList.remove('hide');
 }
function getInternationalSearchOptions() {
    return `https://www.commonmoves.com/bin/bhhs/cregPropertySearchOptionsServlet`
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
            </a>
        </div>
        <div class="button-container container-item save-search">
        <a target="_blank" tabindex="" class="btn btn-search" role="button">
            <span>save search</span>
        </a>
    </div>
</div>`;

    //add logic for select on click
    const selectCountryElement = block.querySelector('.container.select-country');
    const selectedCountryButton = block.querySelector('.container.select-country .selected-country');
    const countriesListItems = block.querySelectorAll('.container.select-country .select-item .tooltip-container');
    const countriesListItemsButtons = block.querySelectorAll('.container.select-country .select-item .tooltip-container > a');
    const filterOptions = block.querySelectorAll('.container .select-item .tooltip-container');
    const selectElement = selectCountryElement.querySelector('.search-results-dropdown > section > div > ul');
    const inputContainer = block.querySelector('.input-container input');
    const filters = block.querySelectorAll('.container .header');
    const multipleSelectInputs = block.querySelectorAll('.select-selected');
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
                container = element.closest('.select-item');
            }
            else if (headerTitle.childElementCount > 0) {
                const selectedCountry = e.target.closest('.tooltip-container').getAttribute('data-value');
                selectedElValue = `
                <img src="/icons/property-search/${selectedCountry}.png" alt="${selectedCountry}Country Flag" class="label-image">
                    <span>${selectedCountry}</span>`;
                //update input placeholder
                inputContainer.ariaLabel = getPlaceholder(selectedCountry);
                inputContainer.placeholder = getPlaceholder(selectedCountry);
            }
            headerTitle.innerHTML = selectedElValue;
            //todo update logic for multiple select
            closeSelect(container);

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