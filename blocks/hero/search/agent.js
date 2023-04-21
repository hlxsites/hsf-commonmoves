import { BREAKPOINTS } from '../../../scripts/scripts.js';

export const getPlaceholder = () => (BREAKPOINTS.small.matches ? 'Search by Agent Name, Team Name, Location, Language or Designations' : 'Search by Name, Location and More...');

function observeForm() {
  const block = document.querySelector('.hero.block');
  const callback = (mutations, observer) => {
    if (block.getAttribute('data-block-status') === 'loaded') {
      // Delay the loading of the event listeners - it doesn't need to happen immediately.
      const script = document.createElement('script');
      script.type = 'module';
      script.src = `${window.hlx.codeBasePath}/blocks/hero/search/agent-delayed.js`;
      document.head.append(script);
      observer.disconnect();
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(block, { attributes: true, attributeFilter: ['data-block-status'] });
}

function buildForm() {
  const placeholder = getPlaceholder();

  const form = document.createElement('form');
  form.classList.add('agents');
  form.setAttribute('action', '/agent-search-results');

  form.innerHTML = `
    <div class="search-bar" role="search">
      <div class="search-suggester">
        <input type="text" placeholder="${placeholder}" aria-label="${placeholder}" name="keyword">
        <ul class="suggester-results">
          <li class="list-title">Please enter at least 3 characters.</li>
        </ul>
      </div>
      <button class="search-submit" aria-label="Search Agents" type="submit">
        <span>Search</span>
      </button>
    </div>
    <div class="selection-tags">
      <ul class="selection-tags-list" role="presentation">
      </ul>
    </div>
  `;
  observeForm();
  return form;
}

const agents = {
  buildForm,
};

export default agents;
