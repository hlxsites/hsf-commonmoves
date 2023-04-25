import { build as buildCountrySelect } from '../shared/search-countries/search-countries.js';
import {getPlaceholder} from './common-function.js';
import { build as buildAdditionFilters, buildFilterButtons} from './additional-filters.js';
import { build as buildTopMenu} from './top-menu.js';
let selectedParameters = {

};

 function closeSelect(element) {

     element.classList.remove('open');
     element.querySelector('.search-results-dropdown').classList.add('hide');
 }

 function openSelect(element) {
     element.classList.add('open');
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

export default async function decorate(block) {
     const overlay = document.createElement('div');
     overlay.classList.add('overlay');
    block.append(buildTopMenu(), buildAdditionFilters(), overlay, buildFilterButtons());
    const changeCountry = (country) => {
        const placeholder = getPlaceholder(country);
        const input = block.querySelector('.suggester-input input');
        input.setAttribute('placeholder', placeholder);
        input.setAttribute('aria-label', placeholder);
    };

    const countrySelect = await buildCountrySelect(changeCountry);
    countrySelect.setAttribute('id', 'country-select');
    block.querySelector('.primary-search').prepend(countrySelect);
    //add logic for select on click
    const filterOptions = block.querySelectorAll('.select-item .tooltip-container');
    const inputContainer = block.querySelector('.input-container input');
    const filters = block.querySelectorAll('.header');
    const multipleSelectInputs = block.querySelectorAll('.select-selected');
    const priceRangeInputs = block.querySelector('.price .multiple-inputs');
    const filterContainer = block.querySelector('.filter-container');
    const filterBlock = block.querySelector('.filter-block');
    filterContainer.addEventListener('click', (e) => {
        if (filterBlock.classList.contains('hide')) {
            filterBlock.classList.remove('hide');
        } else {
            filterBlock.classList.add('hide');
        }
        //change icon for filter
        filterContainer.querySelectorAll('svg').forEach((el) => {
            if (el.classList.contains('hide')) {
                el.classList.remove('hide');
            } else {
                el.classList.add('hide');
            }
        });
    });
    //add logic on price range change
    priceRangeInputs.addEventListener('keyup', (e) => {
        const minPrice = priceRangeInputs.querySelector('.price-range-input.min-price').value;
        const maxPrice = priceRangeInputs.querySelector('.price-range-input.max-price').value;
        //display datalist
        const activeElement = e.target.closest('.price-range-input');
        activeElement.list.innerHTML = createPriceList(activeElement.value);
        //update label
        block.querySelector('.price .title > span').innerText = formatPriceLabel(minPrice, maxPrice);
    });
    //close filters on click outside
    document.addEventListener('click', (e) => {
        if (!block.contains(e.target)) {
            filters.forEach((elem) => {
                if (elem.parentElement.classList.contains('open')) {
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
                    && elem.parentElement.classList.contains('open')
                ) {
                    closeSelect(elem.parentElement);
                }
            });
            if (selectedFilter.parentElement.classList.contains('open')) {
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
            let container = element.closest('.container-item');
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
            } else if (headerTitle.childElementCount > 0) {
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
    })
}
///
// buildSearchBar
//buildFilters
  //ul tooltip.