import { close as closeCountrySelect } from '../../../shared/search-countries/search-countries.js';
import { BREAKPOINTS } from '../../../../scripts/scripts.js';

const noOverlayAt = BREAKPOINTS.medium;

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

function addEventListeners() {
  const form = document.querySelector('.hero.block form.homes');
  noOverlayAt.addEventListener('change', fixOverlay);

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
}

addEventListeners();
