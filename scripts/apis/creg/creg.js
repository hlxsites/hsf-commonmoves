/* Wrapper for all Creg API endpoints */

// TODO: Use Sidekick Plugin for this
import { getMetadata } from '../../aem.js';

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
      ids: listingIds,
      officeId,
    });
  });
}
