import { getMetadata } from '../../scripts/lib-franklin.js';
import { BREAKPOINTS } from '../../scripts/scripts.js';
import { abortSuggestions, getSuggestions, typeFor as suggestionTypeFor } from '../../scripts/apis/agent/suggestion.js';

const MORE_INPUT_NEEDED = 'Please enter at least 3 characters.';
const NO_SUGGESTIONS = 'No suggestions found. Please modify your search.';
const SEARCHING_SUGGESTIONS = 'Looking up suggestions...';

export const getPlaceholder = () => (BREAKPOINTS.small.matches ? 'Search by Agent Name, Team Name, Location, Language or Designations' : 'Search by Name, Location and More...');

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
      li.setAttribute('category', category);
      li.textContent = entry;
      ul.append(li);
    });
  });
  return lists;
};

const createSelectionTag = (selection) => {
  const category = selection.getAttribute('category');
  const value = selection.textContent;
  const text = `${value} (${suggestionTypeFor(category).label})`;
  const li = document.createElement('li');
  li.classList.add('selection-tags-item');
  li.innerHTML = `
    <span class="selection">${text}</span>
    <span class="close" aria-label="Remove - ${text}" role="button" tabindex="0">x</span>
    <input type="hidden" name="${category}" value="${value}"/>
  `;
  return li;
};

const suggestionSelected = (e, wrapper) => {
  e.preventDefault();
  e.stopPropagation();
  const category = e.target.getAttribute('category');
  if (!category) {
    return;
  }
  wrapper.querySelector('.selection-tags-list').append(createSelectionTag(e.target));
  wrapper.querySelector('.search-bar').classList.remove('show-suggestions');
  updateSuggestions([], wrapper.querySelector('.search-suggester .suggester-results'));
};

const removeSelection = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.target.classList.contains('close')) {
    e.target.closest('li').remove();
  }
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
    e.currentTarget.closest('.search-bar').classList.add('show-suggestions');
  } else {
    e.currentTarget.closest('.search-bar').classList.remove('show-suggestions');
  }

  if (value.length <= 2) {
    abortSuggestions();
    target.querySelector(':scope > li:first-of-type').textContent = MORE_INPUT_NEEDED;
    updateSuggestions([], target);
  } else {
    target.querySelector(':scope > li:first-of-type').textContent = SEARCHING_SUGGESTIONS;
    const officeId = getMetadata('office-id');
    getSuggestions(officeId, value)
      .then((suggestions) => {
        if (!suggestions) {
          // Undefined suggestions means it was aborted, more input coming.
          updateSuggestions([], target);
          return;
        }
        if (Object.keys(suggestions).length > 0) {
          updateSuggestions(buildSuggestions(suggestions), target);
        } else {
          updateSuggestions([], target);
          target.querySelector(':scope > li:first-of-type').textContent = NO_SUGGESTIONS;
        }
      });
  }
};

const formSubmitted = () => {

};

/**
 * Builds the Container for the search bar selections.
 *
 * @return {HTMLDivElement}
 */
export function buildSelectionTags() {
  const div = document.createElement('div');
  div.classList.add('selection-tags');
  div.innerHTML = '<ul class="selection-tags-list" role="presentation"></ul>';
  div.querySelector('.selection-tags-list').addEventListener('click', removeSelection);
  return div;
}

/**
 * Builds the Search Bar and suggester container.
 *
 * @return {HTMLDivElement}
 */
export function buildSearchBar() {
  const placeholder = getPlaceholder();
  const searchBar = document.createElement('div');
  searchBar.classList.add('search-bar');
  searchBar.setAttribute('role', 'search');
  searchBar.innerHTML = `
    <div class="search-suggester">
      <input type="text" placeholder="${placeholder}" aria-label="${placeholder}" name="keyword">
      <ul class="suggester-results">
        <li class="list-title">Please enter at least 3 characters.</li>
      </ul>
    </div>
    <button class="search-submit" aria-label="Search Agents" type="submit">
      <span>Search</span>
    </button>
  `;

  BREAKPOINTS.small.addEventListener('change', () => {
    const text = getPlaceholder();
    const input = searchBar.querySelector('input[name="keyword"]');
    input.setAttribute('placeholder', text);
    input.setAttribute('aria-label', text);
  });

  const suggestionsTarget = searchBar.querySelector('.search-suggester .suggester-results');
  searchBar.querySelector('.search-suggester input').addEventListener('input', (e) => {
    inputChanged(e, suggestionsTarget);
  });
  suggestionsTarget.addEventListener('click', (e) => {
    suggestionSelected(e, searchBar.parentElement);
  });

  searchBar.querySelector('button[type="submit"]').addEventListener('click', formSubmitted);

  return searchBar;
}

export default async function decorate(block) {
  block.innerHTML = `
    <div class="sort">
    </div>
    <div class="results">
    </div>
    <div class="pagination">
    </div>
  `;
  block.prepend(buildSelectionTags());
  block.prepend(buildSearchBar());
}
