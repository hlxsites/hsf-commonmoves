export function formatInput(string) {
    return string.replace(/ /g, '-').toLowerCase();
}

export function getPlaceholder(country) {
    return country === 'US' ? 'Enter City, Address, Zip/Postal Code, Neighborhood, School or MLS#' : 'Enter City'
}

/**
 * Creates a Select dropdown for filtering search.
 * @param {String} name
 * @param {String} placeholder
 * @param {number} number
 * @returns {HTMLDivElement}
 */
function buildMultiSelect(name, placeholder, number) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('select-wrapper');
    wrapper.innerHTML = `
    <select name="${name}" aria-label="${placeholder}">
      <option value="">Bedrooms</option>
    </select>
    <div class="selected" role="button" aria-haspopup="listbox" aria-label="${placeholder}">${placeholder}</div>
    <ul class="select-items" role="listbox">
      <li role="option">${placeholder}</li>
    </ul>
  `;

    const select = wrapper.querySelector('select');
    const ul = wrapper.querySelector('ul');
    for (let i = 1; i <= number; i += 1) {
        const option = document.createElement('option');
        const li = document.createElement('li');
        li.setAttribute('role', 'option');

        option.value = `${i}`;
        // eslint-disable-next-line no-multi-assign
        option.textContent = li.textContent = `${i}+`;
        select.append(option);
        ul.append(li);
    }
    return wrapper;
}