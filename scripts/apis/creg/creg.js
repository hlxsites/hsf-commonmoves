/* Wrapper for all Creg API endpoints */

// TODO: Use Sidekick Plugin for this
import { getMetadata } from '../../aem.js';

const urlParams = new URLSearchParams(window.location.search);
export const DOMAIN = urlParams.get('env') === 'stage' ? 'ignite-staging.bhhs.com' : 'www.bhhs.com';
const CREG_API_URL = `https://${DOMAIN}/bin/bhhs`;

/**
 * @typedef {Object} SearchResults
 * @property {Array<Object>} properties
 * @property {String} disclaimer
 * @property {Array<Object>} clusters
 * @property {String} pages
 * @property {String} count
 */

/**
 * Perform a search and return only the properties.
 *
 * @param {Search} search the Search object instance
 * @return {Promise<SearchResults>} resolving the properties fetched
 */
export async function propertySearch(search) {
  return new Promise((resolve) => {
    const worker = new Worker(`${window.hlx.codeBasePath}/scripts/apis/creg/workers/properties.js`, { type: 'module' });
    worker.onmessage = (e) => resolve(e.data);
    worker.postMessage({
      api: CREG_API_URL,
      search,
    });
  });
}

/**
 * Perform a search, returning the metadata.
 *
 * @param {Search} search the Search object instance
 * @return {Promise<Property[]>} resolving the properties fetched
 */
export async function metadataSearch(search) {
  return new Promise((resolve) => {
    const worker = new Worker(`${window.hlx.codeBasePath}/scripts/apis/creg/workers/metadata.js`, { type: 'module' });
    worker.onmessage = (e) => resolve(e.data);
    worker.postMessage({
      api: CREG_API_URL,
      search,
    });
  });
}

/**
 * Gets the details for the specified listings.
 *
 * @param {string[]} listingIds list of listing ids
 */
export async function getDetails(...listingIds) {
  return new Promise((resolve) => {
    const officeId = getMetadata('office-id');
    const worker = new Worker(`${window.hlx.codeBasePath}/scripts/apis/creg/workers/listing.js`, { type: 'module' });
    worker.onmessage = (e) => resolve(e.data);
    worker.postMessage({
      api: CREG_API_URL,
      ids: listingIds,
      officeId,
    });
  });
}

/**
 * Get saved properties for a user.
 *
 * @param {SearchParameters} params the parameters
 */
export function getSavedProperties(contactKey) {
  return new Promise((resolve) => {
    // get current timestamp
    const timestamp = Date.now();
    const url = `${CREG_API_URL}/cregPropertySaveServlet?ContactKey=${contactKey}&_=${timestamp}`;
    fetch(url).then(async (resp) => {
      if (resp.ok) {
        resolve(await resp.json());
      } else {
        resolve({});
      }
    });
  });
}

/**
 * Remove a saved property for a user.
 *
 * @param {String} contactKey the contact key
 * @param {String} propertyId the property id
 */
export function removeSavedProperty(contactKey, propertyId) {
  return new Promise((resolve) => {
    const url = `${CREG_API_URL}/cregPropertySaveServlet?notificationId=${propertyId}&ContactKey=${contactKey}`;
    fetch(url, {
      method: 'DELETE',
    }).then(async (resp) => {
      if (resp.ok) {
        resolve(await resp.json());
      } else {
        resolve({});
      }
    });
  });
}

/**
 * Save a property for a user.
 *
 * @param {String} contactKey the contact key
 * @param {String} propertyId the property id
 */
export function saveProperty(property) {
  return new Promise((resolve) => {
    // use property to create form data
    const formData = new FormData();
    Object.keys(property).forEach((key) => {
      formData.append(key, encodeURIComponent(property[key]));
    });
    const url = `${CREG_API_URL}/cregPropertySaveServlet`;
    fetch(url, {
      method: 'POST',
      headers: {
        'CSRF-Token': 'undefined',
      },
      body: formData,
    }).then(async (resp) => {
      if (resp.ok) {
        resolve(await resp.json());
      } else {
        resolve({});
      }
    });
  });
}
