const SQUARE_FEET = [
    {"value": "500", "label": "500 Sq Ft"},
    {"value": "750", "label": "750 Sq Ft"},
    {"value": "1000", "label": "1,000 Sq Ft"},
    {"value": "1250", "label": "1,250  Sq Ft"},
    {"value": "1500", "label": "1,500 Sq Ft"},
    {"value": "1750", "label": "1,750 Sq Ft"},
    {"value": "2000", "label": "2,000 Sq Ft"},
    {"value": "2250", "label": "2,250 Sq Ft"},
    {"value": "2500", "label": "2,500 Sq Ft"},
    {"value": "2750", "label": "2,750 Sq Ft"},
    {"value": "3000", "label": "3,000 Sq Ft"},
    {"value": "3500", "label": "3,500 Sq Ft"},
    {"value": "4000", "label": "4,000 Sq Ft"},
    {"value": "5000", "label": "5,000 Sq Ft"},
    {"value": "7500", "label": "7,500 Sq Ft"},
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

export function formatInput(string) {
    return string.replace(/[\/\s]/g, '-').toLowerCase();
}

export function getPlaceholder(country) {
    return country === 'US' ? 'Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#' : 'Enter City'
}

export function addRangeOption(filterName) {
    const filterLabel = filterName.charAt(0).toLocaleUpperCase() + filterName.slice(1).toLowerCase();
    const fromLabel = 'No Min';
    const toLabel = 'No Max';
    const maxLength =14;
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
    } else if (filterName === 'square feet' || filterName === 'year built') {
        return `<div class="multiple-inputs">
                ${addOptions(filterName, fromLabel, 'multi')}
                <span class="range-label text-up">to</span>
                ${addOptions(filterName, toLabel, 'multi')}
                </section>
            </div>
            `
    }
}

/**
 *
 * @param {string} filterName
 * @param {string} defaultValue
 * @returns {string}
 */
function buildListBoxOptions(filterName, defaultValue) {
    const config = getConfig(filterName);
    let output = `<li data-value="" class="tooltip-container highlighted">${defaultValue}</li>`
    if (Array.isArray(config)) {
        config.forEach(config => {
            output += `<li data-value="${config.value}" class="tooltip-container">${config.label}</li>`

        })
    } else {
        const labelSuf = '+ ' + defaultValue.split(" ")[1];
        for (let i = 1; i <= config; i += 1) {
            let label = `${i} ${labelSuf}`;
            output += `<li  data-value="${i}" class="tooltip-container">${label}</li>`
        }
    }

    return output
}

/**
 *
 * @param {string} filterName
 * @param {string} defaultValue
 * @returns {string}
 */
function buildSelectOptions(filterName, defaultValue) {
    let config = getConfig(filterName);
    let output = `<option value="">${defaultValue}</option>`
    if (Array.isArray(config)) {
        config.forEach(el => {
            output += `<option value="${el.value}">${el.label}</option>`
        });
    } else {
        const labelSuf = '+ ' + defaultValue.split(" ")[1];
        for (let i = 1; i <= config; i += 1) {
            let label = `${i} ${labelSuf}`;
            output += `<option value="${i}">${label}</option>`
        }
    }
    return output;
}

function getConfig (filterName) {
    let config = '';
    switch (filterName) {
        case 'beds':
        case 'baths':
            config = 5;
            break;
        case 'square feet':
            config = SQUARE_FEET;
            break;
        case 'year built':
            config = YEAR_BUILT;
            break;
    }
    return config;
}

function capitalize(string) {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1).toLowerCase();
}


export function sanitizeString(str) {
    // replace all HTML tags with their entity-encoded equivalents
    str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // replace all script tags with an empty string
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // replace all on* event attributes with an empty string
    str = str.replace(/\bon\w+\s*=\s*"[^"]*"/gi, '');
    // replace all style attributes with an empty string
    str = str.replace(/\bstyle\s*=\s*"[^"]*"/gi, '');
    // return the sanitized string
    return str;
}

export function addOptions(filterName, defaultValue = '', mode = '') {

    if (['beds', 'baths'].includes(filterName)) {
        defaultValue = `Any ${capitalize(filterName)}`
    }
    let selectedHtml = mode === 'multi'
        ? `<div class="select-selected" role="button" aria-haspopup="listbox">${defaultValue}</div>
            `
        : '';

    return `<section>
        <div>
            <select class="hide" aria-label="${defaultValue}">${buildSelectOptions(filterName, defaultValue, mode)}</select>
            ${selectedHtml}
            <ul class="select-item" role="listbox">${buildListBoxOptions(filterName, defaultValue, mode)}</ul>
        </div>
    </section>`
}