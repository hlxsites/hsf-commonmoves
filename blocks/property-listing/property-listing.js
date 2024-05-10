import { getMetadata, readBlockConfig } from '../../scripts/aem.js';
import ApplicationType from '../../scripts/apis/creg/ApplicationType.js';
import SearchType, { searchTypeFor } from '../../scripts/apis/creg/SearchType.js';
import PropertyType from '../../scripts/apis/creg/PropertyType.js';
import MapSearch from './map-search.js';
import RadiusSearch from './radius-search.js';
import { isLoggedIn, getUserDetails } from '../../../scripts/apis/user.js';
import { getSavedProperties, saveProperty } from '../../../scripts/apis/creg/creg.js';

/* eslint-disable no-param-reassign */
const buildListingTypes = (configEntry) => {
  const types = [];
  if (!configEntry) {
    types.push(ApplicationType.FOR_SALE);
    return types;
  }

  const [, configStr] = configEntry;
  if (configStr.match(/sale/i)) {
    types.push(ApplicationType.FOR_SALE);
  }
  if (configStr.match(/rent/gi)) {
    types.push(ApplicationType.FOR_RENT);
  }
  if (configStr.match(/pending/gi)) {
    types.push(ApplicationType.PENDING);
  }
  if (configStr.match(/sold/gi)) {
    types.push(ApplicationType.RECENTLY_SOLD);
  }
  return types;
};
/* eslint-enable no-param-reassign */

const buildPropertyTypes = (configEntry) => {
  const types = [];
  if (!configEntry) {
    types.push(PropertyType.CONDO_TOWNHOUSE);
    types.push(PropertyType.SINGLE_FAMILY);
    return types;
  }

  const [, configStr] = configEntry;
  if (configStr.match(/(condo|townhouse)/i)) {
    types.push(PropertyType.CONDO_TOWNHOUSE);
  }
  if (configStr.match(/single\sfamily/gi)) {
    types.push(PropertyType.SINGLE_FAMILY);
  }
  if (configStr.match(/commercial/gi)) {
    types.push(PropertyType.COMMERCIAL);
  }
  if (configStr.match(/multi\s+family/gi)) {
    types.push(PropertyType.MULTI_FAMILY);
  }
  if (configStr.match(/(lot|land)/gi)) {
    types.push(PropertyType.LAND);
  }
  if (configStr.match(/(farm|ranch)/gi)) {
    types.push(PropertyType.FARM);
  }
  return types;
};

export default async function decorate(block) {
  // Find and process list type configurations.
  const config = readBlockConfig(block);

  if (config.title) {
    block.innerHTML = `
      <div class="header">
        <div>
          <span>${config.title}</span>
        </div>
      </div>
    `;
    if (config['link-text']) {
      const div = document.createElement('div');
      const url = config['link-url'] || '';
      div.innerHTML = `
      <p class="button-container">
        <a href="${url}" aria-label="${config['link-text'] || 'See More'}">${config['link-text'] || 'See More'}</a>
      </p>`;
      block.querySelector('.header').append(div);
    }
  } else {
    block.innerHTML = '';
  }

  let search;

  const entries = Object.entries(config);
  const type = searchTypeFor(entries.find(([k]) => k.match(/search.*type/i))[1]);

  if (type === SearchType.Map) {
    const minLat = entries.find(([k]) => k.includes('min') && k.includes('lat'))[1];
    const maxLat = entries.find(([k]) => k.includes('max') && k.includes('lat'))[1];
    const minLon = entries.find(([k]) => k.includes('min') && k.includes('lon'))[1];
    const maxLon = entries.find(([k]) => k.includes('max') && k.includes('lon'))[1];
    search = new MapSearch(minLat, minLon, maxLat, maxLon);
  } else if (type === SearchType.Radius) {
    let lat = entries.find(([k]) => k.includes('lat'))[1];
    let lon = entries.find(([k]) => k.includes('lon'))[1];
    const radius = entries.find(([k]) => k.includes('distance'))[1];

    // Go looking for the search parameters.
    if (!lat) {
      const urlParams = new URLSearchParams(window.location.search);
      lat = urlParams.get('latitude');
      lon = urlParams.get('longitude');
    }

    search = new RadiusSearch(lat, lon, radius);
  } else if (type === SearchType.Community) {
    const { bbox } = window.liveby.geometry;
    const minLon = Math.min(...bbox.map((e) => e[0]));
    const maxLon = Math.max(...bbox.map((e) => e[0]));
    const minLat = Math.min(...bbox.map((e) => e[1]));
    const maxLat = Math.max(...bbox.map((e) => e[1]));
    search = new MapSearch(minLat, minLon, maxLat, maxLon);
  } else {
    search = new MapSearch(0, 0, 0, 0);
  }

  search.listingTypes = buildListingTypes(entries.find(([k]) => k.match(/listing.*type/i)));
  search.propertyTypes = buildPropertyTypes(entries.find(([k]) => k.match(/property.*type/i)));

  search.isNew = !!entries.find(([k]) => k.match(/new/i));
  search.isOpenHouse = !!entries.find(([k]) => k.match(/open.*house/i));

  [, search.minPrice] = entries.find(([k]) => k.match(/min.*price/i)) || [];
  [, search.maxPrice] = entries.find(([k]) => k.match(/max.*price/i)) || [];

  [, search.pageSize] = entries.find(([k]) => k.match(/page.*size/i)) || [];
  search.sortBy = config['sort-by'];
  search.sortDirection = config['sort-direction'];
  search.officeId = getMetadata('office-id');

  await search.render(block, false);

  const user = await getUserDetails();
  if (!user) {
    return;
  }
  const contactKey = user.contactKey;

  getSavedProperties(contactKey).then((results) => {
    if (results?.properties) {
      results.properties.forEach((listing) => {
        const card = block.querySelector(`[data-id="${listing.PropId}"]`);
        if (card) {
          card.classList.add('saved');
        }
      });
    }
  });

  const saveButtons = block.querySelectorAll('.button-property.save-icon');
  saveButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      let property = {};
      property.Name = button.closest('.listing-tile').querySelector('a').getAttribute('aria-label');
      property.ContactKey = contactKey;
      property.PropertyId = button.closest('.listing-tile').dataset.id;
      property.ListingKey = button.closest('.listing-tile').dataset.id;
      property.FrequencyInstant = true;
      property.FrequencyDaily = false;
      property.FrequencyWeekly = false;
      property.FrequencyNever = false;
      property.Email = true;
      property.Push = true;
      property.Text = true;
      property.Active = true;
      property.Notes = [];
      property.NotificationMethod = 'status_change';
      property.leadParam = 'CompanyKey%253DWI303%2526LeadBrand%253D11413101981000010000';
      saveProperty(property).then((result) => {
      const listingTile = button.closest('.listing-tile');
      listingTile.classList.add('saved');
      });
    });
  });
}
