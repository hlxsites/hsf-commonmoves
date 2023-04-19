import { getMetadata } from '../../scripts/lib-franklin.js';
import { BREAKPOINTS } from '../../scripts/scripts.js';
import { getSuggestions } from '../../scripts/apis/suggestion/suggestion.js';

const SEARCH_TYPE = 'agent';
const getPlaceholder = () => (BREAKPOINTS.small.matches ? 'Search by Agent Name, Team Name, Location, Language or Designations' : 'Search by Name, Location and More...');

const noSuggestions = document.createElement('li');
noSuggestions.classList.add('list-title');
noSuggestions.textContent = 'No suggestions found. Please modify your search.';

const updateSuggestions = (suggestions, target) => {
  // Keep the first item - required character entry count.
  const first = target.querySelector(':scope li');
  target.replaceChildren(first, ...suggestions);
};

const buildSuggestions = (suggestions) => {
  const lists = [];
  Object.keys(suggestions).forEach((category) => {
    const item = document.createElement('li');
    item.classList.add('list-title');
    item.textContent = category;
    lists.push(item);
    const ul = document.createElement('ul');
    item.append(ul);
    suggestions[category].forEach((entry) => {
      const li = document.createElement('li');
      li.textContent = entry;
      ul.append(li);
    });
  });
  return lists;
};

/**
 * Handles the input changed event for the text field. Will add suggestions based on user input.
 *
 * @param {Event} e the change event
 * @param {HTMLElement} target the container in which to add suggestions
 */
const inputChanged = (e, target) => {
  const { value } = e.currentTarget;
  if (value.length > 0) {
    e.currentTarget.closest('.search-bar').classList.add('has-input');
  } else {
    e.currentTarget.closest('.search-bar').classList.remove('has-input');
  }

  if (value.length <= 2) {
    updateSuggestions([], target);
  } else {
    const officeId = getMetadata('office-id');
    getSuggestions(SEARCH_TYPE, officeId, value)
      .then((suggestions) => {
        let suggestionList = [noSuggestions];
        if (Object.keys(suggestions).length) {
          suggestionList = buildSuggestions(suggestions);
        }
        updateSuggestions(suggestionList, target);
      });
  }
};

function buildForm() {
  const placeholder = getPlaceholder();

  const form = document.createElement('form');
  form.classList.add('agents');
  form.setAttribute('action', '/agent-search-results');

  form.innerHTML = `
    <div class="search-bar" role="search">
      <div class="search-suggester">
        <input type="text" placeholder="${placeholder}" aria-label="${placeholder}">
        <ul class="suggester-results">
          <li class="list-title">Please enter at least 3 characters.</li>
        </ul>
      </div>
      <button class="search-submit" aria-label="Search Homes" type="submit">
        <span>Search</span>
      </button>
    </div>
  `;

  BREAKPOINTS.small.addEventListener('change', () => {
    const text = getPlaceholder();
    const input = form.querySelector('input');
    input.setAttribute('placeholder', text);
    input.setAttribute('aria-label', text);
  });

  const suggestionsTarget = form.querySelector('.search-suggester .suggester-results');
  form.querySelector('.search-suggester input').addEventListener('input', (e) => {
    inputChanged(e, suggestionsTarget);
  });

  return form;
}

const agents = {
  buildForm,
};

export default agents;
