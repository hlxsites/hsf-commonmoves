import { buildSearchBar, buildSelectionTags } from '../../agent-search/agent-search.js';

const formSubmitted = (e) => {
  // Don't want to submit the keyword input.
  const form = e.currentTarget.closest('form');
  const data = new FormData(form);
  data.delete('keyword');
  window.location.href = `${form.action}?${new URLSearchParams(data).toString()}`;
};

function buildForm() {
  const form = document.createElement('form');
  form.classList.add('agents', 'agent-search');
  form.setAttribute('action', '/search/agent');

  form.append(buildSearchBar());
  form.append(buildSelectionTags());
  form.querySelector('button[type="submit"]').addEventListener('click', formSubmitted);
  return form;
}

const agents = {
  buildForm,
};

export default agents;
