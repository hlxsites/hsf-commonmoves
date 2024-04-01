import {
  a, div, domEl, hr, img, input, label, li, option, p, select, span, ul,
} from '../../scripts/dom-helpers.js';
import Search, { EVENT_NAME, SEARCH_URL, STORAGE_KEY } from '../../scripts/apis/creg/search/Search.js';
import PropertyType from '../../scripts/apis/creg/search/types/PropertyType.js';
import ListingType from '../../scripts/apis/creg/search/types/ListingType.js';
import { render as renderCards } from '../shared/property/cards.js';
import { propertySearch } from '../../scripts/apis/creg/creg.js';
import { getMetadata } from '../../scripts/aem.js';
import { closeOnBodyClick } from '../shared/search/util.js';
import { updateForm } from '../property-search-bar/delayed.js';

let searchController;

/**
 * Builds the pagination of results
 * @param {Number} total total number of pages
 * @param {Number} current current page number
 */
function buildPagination(total, current) {
  if (Number.isNaN(total) || Number.isNaN(current)) return div();
  const options = [];
  const lis = [];
  for (let i = 1; i <= total; i += 1) {
    options.push(option({ value: i }, i));
    const config = { 'data-value': i };
    if (i === current) config.class = 'selected';
    lis.push(li(config, i));
  }
  const displayLabel = `${current} of ${total}`;
  const wrapper = div({ class: 'pagination-wrapper' },
    div({ class: 'select-wrapper' },
      select({ name: 'page', 'aria-label': displayLabel }, ...options),
      div({
        class: 'selected',
        role: 'button',
        'aria-haspopup': 'listbox',
        'aria-label': displayLabel,
        'aria-expanded': false,
        tabindex: 0,
      }, span(displayLabel)),
      ul({ class: 'select-items', role: 'listbox' }, ...lis),
    ),
    div({ class: 'link-wrapper' }),
  );

  const prev = a({
    class: 'prev',
    'aria-label': 'Previous Page',
    role: 'button',
    'data-value': `${current - 1}`,
  });
  prev.innerHTML = '<svg><use xlink:href="/icons/icons.svg#carrot"/></svg>';
  const next = a({
    class: 'next',
    'aria-label': 'Next Page',
    role: 'button',
    'data-value': `${current + 1}`,
  });
  next.innerHTML = '<svg><use xlink:href="/icons/icons.svg#carrot"/></svg>';

  if (current === 1) {
    prev.classList.add('disabled');
  } else if (current === total) {
    next.classList.add('disabled');
  }

  wrapper.querySelector('.link-wrapper').append(prev, next);

  closeOnBodyClick(wrapper);
  const selectWrapper = wrapper.querySelector('.select-wrapper');
  selectWrapper.querySelector('.selected').addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const open = selectWrapper.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', open);
  });

  const changePage = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const page = e.currentTarget.getAttribute('data-value');
    const search = await Search.fromQueryString(window.location.search);
    search.page = page;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: search }));
  };

  selectWrapper.querySelectorAll('.select-items li').forEach((opt) => {
    opt.addEventListener('click', changePage);
  });
  prev.addEventListener('click', changePage);
  next.addEventListener('click', changePage);
  return wrapper;
}

/**
 * Converts the Dislaimer returned from search results and extracts images and text.
 * @param {String} disclaimer
 */
function sanitizeDisclaimer(disclaimer) {
  const tmp = document.createElement('div');
  tmp.innerHTML = disclaimer;
  const content = [];
  tmp.querySelectorAll(':scope > div').forEach((d) => {
    const text = [];
    let image;
    let imgFirst = false;
    // eslint-disable-next-line no-bitwise
    const walker = document.createTreeWalker(d, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let next = walker.firstChild();
    while (next) {
      if (next.nodeType === Node.TEXT_NODE && next.textContent.trim() !== '') {
        text.push(p(next.textContent));
      } else if (next.nodeName === 'IMG') {
        if (text.length === 0) imgFirst = true;
        const config = { src: next.src };
        if (next.height) config.height = next.height;
        if (next.width) config.width = next.width;
        image = p({ class: `image ${imgFirst ? 'img-first' : ''}` }, img(config));
      }
      next = walker.nextNode();
    }
    if (image) {
      if (imgFirst) {
        text.unshift(image);
      } else {
        text.push(image);
      }
    }
    content.push(div(...text));
  });
  return content;
}

function updateFilters(search) {
  const filters = document.querySelector('.property-search-results.block .property-search-filters');
  filters.querySelectorAll('.listing-types .filter-toggle.disabled').forEach((t) => t.classList.remove('disabled'));
  filters.querySelectorAll('.listing-types .filter-toggle input[type="checkbox"]').forEach((c) => {
    c.removeAttribute('checked');
    c.nextElementSibling.classList.remove('checked');
  });
  search.listingTypes.forEach((t) => {
    const chkbx = filters.querySelector(`.listing-types .filter-toggle input[name="${t.type}"]`);
    chkbx.setAttribute('checked', 'checked');
    chkbx.nextElementSibling.classList.add('checked');
    if (t.type === ListingType.FOR_RENT.type) {
      filters.querySelector(`.listing-types .filter-toggle input[name="${ListingType.PENDING.type}"]`).closest('.filter-toggle').classList.add('disabled');
    } else if (t.type === ListingType.PENDING.type) {
      filters.querySelector(`.listing-types .filter-toggle input[name="${ListingType.FOR_RENT.type}"]`).closest('.filter-toggle').classList.add('disabled');
    }
  });

  const sort = `${search.sortBy}_${search.sortDirection}`;
  filters.querySelector('.sort-options ul li.selected').classList.remove('selected');
  filters.querySelector(`.sort-options select option[value="${sort}"]`).selected = true;
  filters.querySelector(`.sort-options ul li[data-value="${sort}"]`).classList.add('selected');
  filters.querySelector('.selected span').textContent = filters.querySelector('.sort-options ul li.selected').textContent;
}

/**
 * Perform the search
 * @param {Search} search
 * @return {Promise<void>}
 */
async function doSearch(search) {
  searchController?.abort();
  searchController = new AbortController();
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(search));
  search.franchiseeCode = getMetadata('office-id');
  const contentWrapper = document.querySelector('.property-search-results.block .search-results-wrapper');
  contentWrapper.classList.add('loading');
  const parent = document.querySelector('.property-search-results.block .search-results-cards');
  const pagination = document.querySelector('.property-search-results.block .search-results-pagination');
  const disclaimer = document.querySelector('.property-search-results.block .search-results-disclaimer');
  const clearer = window.setTimeout(() => {
    parent.replaceChildren();
    pagination.replaceChildren();
    disclaimer.replaceChildren();
  }, 1000);
  return new Promise((resolve) => {
    const controller = searchController;
    propertySearch(search).then((results) => {
      if (!controller.signal.aborted) {
        window.clearTimeout(clearer);
        renderCards(parent, results.properties);
        pagination.replaceChildren(buildPagination(parseInt(results.pages, 10), parseInt(search.page, 10)));
        disclaimer.replaceChildren(...sanitizeDisclaimer(results.disclaimer));
        contentWrapper.classList.remove('loading');
      }
      resolve();
    });
  });
}

export default async function decorate(block) {
  block.classList.add('list-view');
  /* @formatter:off */
  const filters = div({ class: 'property-search-filters' },
    div({ class: 'listing-types' },
      div({ class: 'filter-toggle' },
        input({
          name: 'FOR_SALE',
          hidden: 'hidden',
          type: 'checkbox',
          'aria-label': 'Hidden Checkbox',
          checked: 'checked',
          value: `${ListingType.FOR_SALE.type}`,
        }),
        div({ class: 'checkbox checked' }),
        label({ role: 'presentation' }, ListingType.FOR_SALE.label),
      ),
      div({ class: 'filter-toggle' },
        input({
          name: 'FOR_RENT',
          hidden: 'hidden',
          type: 'checkbox',
          'aria-label': 'Hidden Checkbox',
          value: `${ListingType.FOR_RENT.type}`,
        }),
        div({ class: 'checkbox' }),
        label({ role: 'presentation' }, ListingType.FOR_RENT.label),
      ),
      div({ class: 'filter-toggle' },
        input({
          name: 'PENDING',
          hidden: 'hidden',
          type: 'checkbox',
          'aria-label': 'Hidden Checkbox',
          value: `${ListingType.PENDING.type}`,
        }),
        div({ class: 'checkbox' }),
        label({ role: 'presentation' }, ListingType.PENDING.label),
      ),
      div({ class: 'filter-toggle' },
        input({
          name: 'RECENTLY_SOLD',
          hidden: 'hidden',
          type: 'checkbox',
          'aria-label': 'Hidden Checkbox',
          value: `${ListingType.RECENTLY_SOLD.type}`,
        }),
        div({ class: 'checkbox' }),
        label({ role: 'presentation' }, 'Sold'),
      ),
    ),
    div({ class: 'sort-options' },
      label({ role: 'presentation' }, 'Sort by'),
      div({ class: 'select-wrapper' },
        select({ name: 'sort', 'aria-label': 'Distance' },
          // eslint-disable-next-line object-curly-newline
          option({ value: 'DISTANCE_ASC', 'data-sort-by': 'DISTANCE', 'data-sort-direction': 'ASC', selected: 'selected' }, 'Distance'),
          option({ value: 'PRICE_DESC', 'data-sort-by': 'PRICE', 'data-sort-direction': 'DESC' }, 'Price (Hi-Lo)'),
          option({ value: 'PRICE_ASC', 'data-sort-by': 'PRICE', 'data-sort-direction': 'ASC' }, 'Price (Lo-Hi)'),
          option({ value: 'DATE_DESC', 'data-sort-by': 'DATE', 'data-sort-direction': 'DESC' }, 'Date (New-Old)'),
          option({ value: 'DATE_ASC', 'data-sort-by': 'DATE', 'data-sort-direction': 'ASC' }, 'Date (Old-New)'),
        ),
        // eslint-disable-next-line object-curly-newline
        div({ class: 'selected', role: 'combobox', 'aria-haspopup': 'listbox', 'aria-label': 'Distance', 'aria-expanded': false, 'aria-controls': 'search-results-sort', tabindex: 0 },
          span('Distance'),
        ),
        ul({ id: 'search-results-sort', class: 'select-items', role: 'listbox' },
          li({ 'data-value': 'DISTANCE_ASC', role: 'option', class: 'selected' }, 'Distance'),
          li({ 'data-value': 'PRICE_DESC', role: 'option' }, 'Price (Hi-Lo)'),
          li({ 'data-value': 'PRICE_ASC', role: 'option' }, 'Price (Lo-Hi)'),
          li({ 'data-value': 'DATE_DESC', role: 'option' }, 'Date (New-Old)'),
          li({ 'data-value': 'DATE_ASC', role: 'option' }, 'Date (Old-New)'),
        ),
      ),
    ),
    div({ class: 'desktop-view-options view-options' },
      p({ class: 'button-container' },
        a({ class: 'map-view', role: 'button', rel: 'noopener noreferrer' }, 'Map View'),
        a({ class: 'list-view', role: 'button', rel: 'noopener noreferrer' }, 'List View'),
      ),
    ),
  );
  /* @formatter:on */

  const map = div({ class: 'property-map-wrapper' });

  const loader = div({ class: 'search-results-loader' },
    /* @formatter:off */
    domEl('video', {
      autoplay: true, loop: true, muted: true, playsInline: true,
    }, domEl('source', {
      src: '/icons/maps/loader_opt.webm',
      type: 'video/webm',
    }), domEl('source', { src: '/icons/maps/loader_opt.mp4', type: 'video/mp4' }),
    ),
    /* @formatter:on */
  );
  const list = div({ class: 'search-results-content' },
    div({ class: 'search-results-cards property-list-cards' }),
    div({ class: 'search-results-pagination' }),
    div({ class: 'search-results-disclaimer-wrapper' },
      hr({ role: 'presentation', 'aria-hidden': true, tabindex: -1 }),
      div({ class: 'search-results-disclaimer' }),
    ),
  );

  const content = div({ class: 'search-results-wrapper loading' }, loader, list);

  const buttons = div({ class: 'mobile-view-options view-options' },
    p({ class: 'button-container' },
      a({ target: '_blank', role: 'button', rel: 'noopener noreferrer' }, 'Save'),
      a({ class: 'map-view', role: 'button', rel: 'noopener noreferrer' }, 'Map View'),
      a({ class: 'list-view', role: 'button', rel: 'noopener noreferrer' }, 'List View'),
    ),
  );

  block.replaceChildren(filters, map, content, buttons);

  block.querySelector('a.map-view').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const blk = e.currentTarget.closest('.block');
    blk.classList.remove('list-view');
    blk.classList.add('map-view');
  });

  block.querySelector('a.list-view').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const blk = e.currentTarget.closest('.block');
    blk.classList.remove('map-view');
    blk.classList.add('list-view');
  });

  block.querySelectorAll('.listing-types .filter-toggle').forEach((t) => {
    t.addEventListener('click', async (e) => {
      e.preventDefault();
      const { currentTarget } = e;
      const search = await Search.fromQueryString(window.location.search);
      const checked = currentTarget.querySelector('div.checkbox').classList.toggle('checked');
      const ipt = currentTarget.querySelector('input');
      input.checked = checked;
      if (checked) {
        search.addListingType(ipt.value);
      } else {
        search.removeListingType(ipt.value);
      }
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: search }));
    });
  });

  block.querySelector('.listing-types').addEventListener('click', (e) => {
    e.preventDefault();
    const ipt = e.target.closest('.filter-toggle')?.querySelector('input');
    if (ipt && ipt.value === ListingType.FOR_RENT.type) {
      e.currentTarget.querySelector(`input[value="${ListingType.PENDING.type}"]`).closest('.filter-toggle').classList.toggle('disabled');
    } else if (ipt && ipt.value === ListingType.PENDING.type) {
      e.currentTarget.querySelector(`input[value="${ListingType.FOR_RENT.type}"]`).closest('.filter-toggle').classList.toggle('disabled');
    }
  });

  const sortSelect = block.querySelector('.sort-options .select-wrapper div.selected');
  sortSelect.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.currentTarget;
    const wrapper = button.closest('.select-wrapper');
    const open = wrapper.classList.toggle('open');
    button.setAttribute('aria-expanded', open);
    if (open) {
      closeOnBodyClick(wrapper);
    }
  });

  sortSelect.querySelectorAll('.select-items li').forEach((opt) => {
    opt.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget;
      const value = target.getAttribute('data-value');
      const wrapper = target.closest('.select-wrapper');
      wrapper.querySelector('.selected span').textContent = target.textContent;
      wrapper.querySelector('ul li.selected')?.classList.toggle('selected');
      const selected = wrapper.querySelector(`select option[value="${value}"]`);
      selected.selected = true;
      target.classList.add('selected');
      wrapper.classList.remove('open');
      wrapper.querySelector('[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
      const search = await Search.fromQueryString(window.location.search);
      search.sortBy = selected.getAttribute('data-sort-by');
      search.sortDirection = selected.getAttribute('data-sort-direction');
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: search }));
    });
  });

  // Default the search results.
  let search;
  if (window.location.search === '') {
    const data = window.sessionStorage.getItem(STORAGE_KEY);
    if (data) {
      search = await Search.fromJSON(JSON.parse(data));
    } else {
      search = new Search();
      search.propertyTypes = [PropertyType.CONDO_TOWNHOUSE, PropertyType.SINGLE_FAMILY, PropertyType.MULTI_FAMILY, PropertyType.LAND, PropertyType.FARM];
      search.pageSize = 36;
      search.sortBy = 'PRICE';
      search.sortDirection = 'DESC';
      search.listingTypes = [ListingType.FOR_SALE];
    }
    window.history.replaceState(null, '', new URL(`/search?${search.asURLSearchParameters()}`, window.location));
  } else {
    search = await Search.fromQueryString(window.location.search);
  }
  updateFilters(search);
  updateForm(search);
  doSearch(search);

  window.addEventListener('popstate', async () => {
    const newSearch = await Search.fromQueryString(window.location.search);
    document.querySelectorAll('.property-search-bar .open').forEach((el) => el.classList.remove('open'));
    document.querySelectorAll('.property-search-bar .search-overlay.visible').forEach((el) => el.classList.remove('visible'));
    document.querySelectorAll('.property-search-bar [aria-expanded="true"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
    updateFilters(newSearch);
    updateForm(newSearch);
    await doSearch(newSearch);
  });

  window.addEventListener(EVENT_NAME, async (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newSearch = e.detail;
    window.history.pushState(null, '', new URL(`${SEARCH_URL}?${newSearch.asURLSearchParameters().toString()}`, window.location));
    doSearch(newSearch);
  });
}
