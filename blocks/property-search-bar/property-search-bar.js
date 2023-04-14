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
     {"value": "1", "label": "1+ beds"},
     {"value": "2", "label": "2+ beds"},
     {"value": "3", "label": "3+ beds"},
     {"value": "4", "label": "4+ beds"},
     {"value": "5", "label": "5+ beds"}
 ];

 const BATHROOMS = [
     {"value": "1", "label": "1+ baths"},
     {"value": "2", "label": "2+ baths"},
     {"value": "3", "label": "3+ baths"},
     {"value": "4", "label": "4+ baths"},
     {"value": "5", "label": "5+ baths"}
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
       optionsList+= `<option value=${country}><img src="/icons/property-search/${country}.png" alt="${country}" className="label-image"
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

 function buildDropdownElement(title) {
     const dropdownContainer = document.createElement('div');
     const className =  title.toLocaleLowerCase().replace(/ /g, '-');
     dropdownContainer.classList.add('container', className);
     dropdownContainer.innerHTML =
         `<div class="header">
             <div class="title text-up">${title}</div>
             <svg role="presentation" class="arrow">
                <use xlink:href="/icons/icons.svg#arrow-down-white"></use>
             </svg>
             </div>
       <div class="search-results-dropdown"/>`;

     return dropdownContainer
 }
 function addRangeOption(config, defaultValue, mode = '') {
    return `<div id="MinPrice" className="input-dropdown">
                <input type="text" maxLength="14" list="listMinPrice"
                    id="bbh-MinPrice" aria-describedby="MinPrice"
                    placeholder="No min" aria-label="Minimum Price"
                    className="form-control value1 price-list">
            <datalist id="listMinPrice" className="listPrices"></datalist>
            </div>
        <span className="range-label ml-3 mr-3">to</span>
        <div id="MaxPrice" className="input-dropdown">
            <input type="text" maxLength="14" list="listMaxPrice" id="bbh-MaxPrice" aria-describedby="MaxPrice"
                                                             placeholder="No max" aria-label="Maximum Price"
                                                             className="form-control value2 price-list">
            <datalist id="listMaxPrice" className="listPrices"></datalist></div>`

 }
 function addOptions(config, defaultValue, mode = '') {
    let selectedOptionHtml = `<div role="button" aria-haspopup="listbox">${defaultValue}</div>`;
    if (mode === 'country') {
        selectedOptionHtml =`
            <div role="button" aria-label="Select Country" class="selected-country">
                <img src="/icons/property-search/${defaultValue}.png" alt="${defaultValue}Country Flag" class="label-image">
                <span>${defaultValue}</span>
            </div>`;
    }
    return `<section>
        <div>
            <select class="hide" aria-label="${defaultValue}">${buildSelectOptions(config, defaultValue, mode)}</select>
            ${selectedOptionHtml}
            <ul class="select-item hide" role="listbox">${buildListBoxOptions(config, defaultValue, mode)}</ul>
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
         output += `<li data-value="" role="option">${defaultValue}</li>`
         config.forEach(config => {

             output += `<li data-value="${config.value}" role="option">${config.label}</li>`
         });
     }
     return output
 }

 function getPlaceholder(country) {
     return country === 'US' ? 'Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#' : 'Enter City'
 }

function getInternationalSearchOptions() {
    return `https://www.commonmoves.com/bin/bhhs/cregPropertySearchOptionsServlet`
}
export default function decorate(block) {
    const countrySelect = buildDropdownElement('Select Country');
    countrySelect.querySelector('.search-results-dropdown').innerHTML = addOptions(COUNTRIES, 'US', 'country');
    const defaultSuggestionMessage = 'Please enter at least 3 characters.';
    const priceSelect = buildDropdownElement('price');
    priceSelect.classList.add('container-item', 'left-border');
    const bedroomsSelect = buildDropdownElement('any beds');
    bedroomsSelect.classList.add('container-item', 'left-border');
    const bathroomsSelect = buildDropdownElement('any baths');
    bathroomsSelect.classList.add('container-item', 'left-border');
    const areaSelect = buildDropdownElement('square feet');
    areaSelect.classList.add('container-item', 'left-border');
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
    const countriesListItemsButtons = block.querySelectorAll('.container.select-country .select-item .tooltip-container > a')
    const selectElement = selectCountryElement.querySelector('.search-results-dropdown > section > div > ul');
    const inputContainer = block.querySelector('.input-container input');
    const filters = block.querySelectorAll('.container');
    filters.forEach((el) => {el.addEventListener('click', () => {
        if (el.classList.contains('opened')) {
            el.classList.remove('opened');
            //selectElement.classList.add('hide');
        } else {
            el.classList.add('opened');
            //selectElement.classList.remove('hide');
        }
    })
    });

    selectedCountryButton.addEventListener('click', () => {
        if (selectCountryElement.classList.contains('opened')) {
            selectCountryElement.classList.remove('opened');
            selectElement.classList.add('hide');
        } else {
            selectCountryElement.classList.add('opened');
            selectElement.classList.remove('hide');
        }
    });

    //update country name, flag, input placeholder on click
    countriesListItemsButtons.forEach((element) => {
        element.addEventListener('click', (e) => {
            const selectedCountry = e.target.closest('.tooltip-container').getAttribute('data-value');
            //@todo move to method???
            selectedCountryButton.innerHTML = `
            <img src="/icons/property-search/${selectedCountry}.png" alt="${selectedCountry}Country Flag" class="label-image">
                <span>${selectedCountry}</span>
            `;
            selectCountryElement.classList.remove('opened');
            selectElement.classList.add('hide');
            //update input placeholder
            inputContainer.ariaLabel = getPlaceholder(selectedCountry);
            inputContainer.placeholder = getPlaceholder(selectedCountry);
        });
    })
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