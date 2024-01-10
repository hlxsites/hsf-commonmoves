import {
  getSelected as getSelectedCountry,
} from '../../../shared/search-countries/search-countries.js';
import {
  abort as abortSuggestions,
  get as getSuggestions,
} from '../../../../scripts/apis/creg/suggestion.js';

const MORE_INPUT_NEEDED = 'Please enter at least 3 characters.';
const NO_SUGGESTIONS = 'No suggestions found. Please modify your search.';
const SEARCHING_SUGGESTIONS = 'Looking up suggestions...';

const updateSuggestions = (suggestions, target) => {
  // Keep the first item - required character entry count.
  const first = target.querySelector(':scope li');
  target.replaceChildren(first, ...suggestions);
};

const buildSuggestions = (suggestions) => {
  const lists = [];
  suggestions.forEach((category) => {
    const list = document.createElement('li');
    list.classList.add('list-title');
    list.textContent = category.displayText;
    lists.push(list);
    const ul = document.createElement('ul');
    list.append(ul);
    category.results.forEach((result) => {
      const li = document.createElement('li');
      li.setAttribute('category', category.searchType);
      li.setAttribute('display', result.displayText);
      li.setAttribute('query', result.QueryString);
      li.setAttribute('type', result.type);
      li.textContent = result.SearchParameter;
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
  const { currentTarget } = e;
  const { value } = currentTarget;
  if (value.length > 0) {
    currentTarget.closest('.search-bar').classList.add('show-suggestions');
  } else {
    currentTarget.closest('.search-bar').classList.remove('show-suggestions');
  }

  if (value.length <= 2) {
    abortSuggestions();
    target.querySelector(':scope > li:first-of-type').textContent = MORE_INPUT_NEEDED;
    updateSuggestions([], target);
  } else {
    target.querySelector(':scope > li:first-of-type').textContent = SEARCHING_SUGGESTIONS;
    getSuggestions(value, getSelectedCountry(currentTarget.closest('form')))
      .then((suggestions) => {
        if (!suggestions) {
          // Undefined suggestions means it was aborted, more input coming.
          updateSuggestions([], target);
          return;
        }
        if (suggestions.length) {
          updateSuggestions(buildSuggestions(suggestions), target);
        } else {
          target.querySelector(':scope > li:first-of-type').textContent = NO_SUGGESTIONS;
        }
      });
  }
};

const suggestionSelected = (e, form) => {
  const query = e.target.getAttribute('query');
  const keyword = e.target.getAttribute('display');
  const type = e.target.getAttribute('type');
  if (!query) {
    return;
  }
  form.querySelector('input[name="keyword"]').value = keyword;
  form.querySelector('input[name="query"]').value = query;
  form.querySelector('input[name="type"]').value = type;
  form.querySelector('.search-bar').classList.remove('show-suggestions');
};

function addEventListeners() {
  const form = document.querySelector('.hero.block form.homes');

  const suggestionsTarget = form.querySelector('.suggester-input .suggester-results');
  form.querySelector('.suggester-input input').addEventListener('input', (e) => {
    inputChanged(e, suggestionsTarget);
  });
  suggestionsTarget.addEventListener('click', (e) => {
    suggestionSelected(e, form);
  });
}

addEventListeners();
