import { BREAKPOINTS, LIVEBY_API } from '../../scripts/scripts.js';

const limits = {
  large: 8,
  medium: 8,
  small: 4,
};
const pages = {};

async function getAmenities(category, page, limit) {
  const resp = await fetch(`${LIVEBY_API}/yelp-businesses`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: 'en',
      offset: page * limit,
      limit,
      categories: [category],
      lat: window.liveby.geometry.coordinates[0][0][1],
      lon: window.liveby.geometry.coordinates[0][0][0],
      geometry: window.liveby.geometry,
    }),
  });

  if (resp.ok) {
    const data = await resp.json();
    return data[category].business;
  }
  return undefined;
}

const buildItem = (business) => {
  const li = document.createElement('li');
  li.classList.add('amenity-item');
  li.style.backgroundImage = `linear-gradient(transparent 50%, rgb(0 0 0)), url("${business.image_url}")`;
  li.innerHTML = `
      <a href="${business.url}" target="_blank">
        <span class="name">${business.name}</span>
        <span class="rating" data-rating="${business.rating}">${business.rating}</span>
        <span class="reviews">${business.review_count} Yelp ${business.review_count === 1 ? 'review' : 'reviews'}</span>
      </a>
  `;
  return li;
};

async function addPage(ul) {
  const category = ul.getAttribute('data-category');
  if (pages[category] === undefined) {
    pages[category] = 0;
  } else {
    pages[category] += 1;
  }

  const size = Object.keys(limits).find((k) => BREAKPOINTS[k].matches);
  const amount = limits[size] || 2;
  const businesses = await getAmenities(category, pages[category], amount);
  ul.append(...businesses.map(buildItem));
}

async function checkAndFillContent(ul) {
  const category = ul.getAttribute('data-category');
  const size = Object.keys(limits).find((k) => BREAKPOINTS[k].matches);
  const amount = limits[size] || 2;

  const items = ul.querySelectorAll('li');
  if (items.length < amount) {
    const businesses = await getAmenities(category, 0, amount - items.length);
    ul.append(...businesses.map(buildItem));
  }
}

export default async function decorate(block) {
  if (window.liveby && window.liveby.communityId && window.liveby.geometry) {
    const amenities = [];

    block.children[0].children[1].querySelectorAll('li').forEach((li) => amenities.push(li.textContent));
    block.innerHTML = amenities;

    const categories = document.createElement('div');
    categories.classList.add('categories');

    const yelp = document.createElement('div');
    yelp.classList.add('yelp-trademark');
    yelp.innerHTML = '<img src="/icons/yelp.png" alt="yelp trademark" />';

    const amenitiesWrapper = document.createElement('div');
    amenitiesWrapper.classList.add('amenities');
    amenitiesWrapper.innerHTML = '<div class="spinner"><span></span></div>';

    amenities.forEach((category) => {
      const container = document.createElement('div');
      container.classList.add('button-container');
      container.innerHTML = `<a href="#" class="category" data-category="${category.toLowerCase()}">${category}</a>`;
      categories.append(container);

      const ul = document.createElement('ul');
      ul.setAttribute('data-category', category.toLowerCase());
      ul.classList.add(`amenities-${category.toLowerCase()}`);
      amenitiesWrapper.append(ul);
    });

    const active = categories.querySelector('a').getAttribute('data-category');
    categories.querySelector('a').classList.add('active');
    amenitiesWrapper.querySelector(`ul[data-category="${active}"]`).classList.add('active');

    categories.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        amenitiesWrapper.classList.add('loading');
        categories.querySelector('a.active').classList.remove('active');
        e.currentTarget.classList.add('active');
        const ul = block.querySelector(`ul[data-category="${e.currentTarget.getAttribute('data-category')}"]`);
        await checkAndFillContent(ul);
        block.querySelector('ul.active').classList.remove('active');
        ul.classList.add('active');
        amenitiesWrapper.classList.remove('loading');
      });
    });

    const more = document.createElement('div');
    more.classList.add('load-more');
    more.innerHTML = `
      <p class="button-container">
        <a href="#">Load More</a>
      </p>
    `;
    more.querySelector('a').addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const loading = e.currentTarget.closest('.block').querySelector('.amenities');
      loading.classList.add('loading');
      await addPage(loading.querySelector('ul.active'));
      loading.classList.remove('loading');
    });

    block.replaceChildren(categories, yelp, amenitiesWrapper, more);

    // TODO: Possibly make this party of Party Town loading?
    await addPage(block.querySelector('ul.active'));
  } else {
    block.remove();
  }
}
