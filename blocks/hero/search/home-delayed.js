import { getMetadata } from '../../../scripts/aem.js';
import { BREAKPOINTS } from '../../../scripts/scripts.js';
import {
  close as closeCountrySelect,
  getSelected as getSelectedCountry,
} from '../../shared/search-countries/search-countries.js';
import {
  abort as abortSuggestions,
  get as getSuggestions,
} from '../../../scripts/apis/creg/suggestion.js';
import {
  DOMAIN, metadataSearch,
} from '../../../scripts/apis/creg/creg.js';
import { getSpinner } from '../../../scripts/util.js';
import Search from '../../../scripts/apis/creg/search/Search.js';

const noOverlayAt = BREAKPOINTS.medium;

const MORE_INPUT_NEEDED = 'Please enter at least 3 characters.';
const NO_SUGGESTIONS = 'No suggestions found. Please modify your search.';
const SEARCHING_SUGGESTIONS = 'Looking up suggestions...';

const fixOverlay = () => {
  if (noOverlayAt.matches) {
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = null;
  }
};

const showFilters = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.currentTarget.closest('form').classList.add('show-filters');
  if (!noOverlayAt.matches) {
    document.body.style.overflowY = 'hidden';
  }
};

const closeFilters = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const thisForm = e.currentTarget.closest('form');
  thisForm.classList.remove('show-filters');
  thisForm.querySelectorAll('.select-wrapper.open').forEach((select) => {
    select.classList.remove('open');
  });

  if (!noOverlayAt.matches) {
    document.body.style.overflowY = 'hidden';
  }
};

const selectClicked = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const wrapper = e.currentTarget.closest('.select-wrapper');
  const wasOpen = wrapper.classList.contains('open');
  const thisForm = e.currentTarget.closest('form');
  thisForm.querySelectorAll('.select-wrapper.open').forEach((select) => {
    select.classList.remove('open');
  });
  closeCountrySelect(thisForm);
  if (!wasOpen) {
    wrapper.classList.add('open');
  }
};

const selectFilterClicked = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const count = e.currentTarget.textContent;
  const wrapper = e.currentTarget.closest('.select-wrapper');
  wrapper.querySelector('.selected').textContent = count;
  wrapper.querySelector('ul li.selected')?.classList.toggle('selected');
  e.currentTarget.classList.add('selected');
  wrapper.querySelector('select option[selected="selected"]')?.removeAttribute('selected');
  wrapper.querySelector(`select option[value="${count.replace('+', '')}"]`).setAttribute('selected', 'selected');
  wrapper.classList.toggle('open');
};

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

const formSubmitted = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const spinner = getSpinner();
  const form = e.currentTarget.closest('form');
  form.prepend(spinner);

  const franchisee = getMetadata('office-id');
  const search = await Search.fromSuggestionQuery(form.querySelector('input[name="query"]').value);
  search.input = form.querySelector('input[name="keyword"]').value;

  if (franchisee) {
    search.franchisee = franchisee;
  }
  metadataSearch(search).then((results) => {
    if (results) {
      if (!results.vanityDomain || getMetadata('vanity-domain') === results.vanityDomain) {
        window.location = `/search?${search.asURLSearchParameters()}`;
      } else {
        const paramStr = search.asCregURLSearchParameters().toString().replaceAll(/\+/g, '%20');
        window.location = `${results.vanityDomain}/search?${paramStr}&${form.querySelector('input[name="query"]').value}`;
      }
    }
    spinner.remove();
  });
};

function addEventListeners() {
  const form = document.querySelector('.hero.block form.homes');

  noOverlayAt.addEventListener('change', fixOverlay);

  form.querySelectorAll('button[type="submit"]').forEach((button) => {
    button.addEventListener('click', formSubmitted);
  });

  form.querySelector('button.filter').addEventListener('click', showFilters);

  form.querySelectorAll('button.close').forEach((button) => {
    button.addEventListener('click', closeFilters);
  });

  form.querySelectorAll('.select-wrapper .selected').forEach((button) => {
    button.addEventListener('click', selectClicked);
  });

  form.querySelectorAll('.select-wrapper .select-items li').forEach((li) => {
    li.addEventListener('click', selectFilterClicked);
  });

  const suggestionsTarget = form.querySelector('.suggester-input .suggester-results');
  form.querySelector('.suggester-input input').addEventListener('input', (e) => {
    inputChanged(e, suggestionsTarget);
  });
  suggestionsTarget.addEventListener('click', (e) => {
    suggestionSelected(e, form);
  });
}

addEventListeners();
