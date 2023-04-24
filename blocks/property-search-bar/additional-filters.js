import { formatInput } from './common-function.js';

export function buildFilterSearchTypesElement() {
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

export function buildFilterPlaceholder(label, callback) {
    return `<div class="filter">
     <label class="section-label text-up" role="presentation">${label}</label>
     ${callback(label)}
     </div>`
}

export async function build(...callbacks) {

}
