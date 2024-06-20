import { a, div, img } from '../../scripts/dom-helpers.js';
import { getEnvelope } from '../../scripts/apis/creg/creg.js';

function builtCarousel(block) {
  const galleryContent = div({ class: 'gallery-content' },
    div({ class: 'gallery' }),
  );
  const galleryModal = div({ class: 'gallery-modal' });
  block.append(galleryContent, galleryModal);
}

/**
 * Retrieves the property ID from the current URL path.
 * @returns {string|null} The property ID if found in the URL path, or null if not found.
 */
function getPropIdFromPath() {
  const url = window.location.pathname;
  const match = url.match(/pid-(\d+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

async function getPropertyByPropId(propId) {
  const resp = await getEnvelope(propId);
  return resp;
}

export default async function decorate(block) {
  const propId = getPropIdFromPath();
  window.propertyData = await getPropertyByPropId(propId);
  block.innerHTML = '';

  // TODO: switch to use global propertyData
  if (!window.propertyData) {
    block.innerHTML = 'Property not found';
  } else {
    const property = window.propertyData.propertyDetails;
    builtCarousel(block);
  }
}
