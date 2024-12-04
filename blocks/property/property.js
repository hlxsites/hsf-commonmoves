import { getDetails } from '../../scripts/apis/creg/creg.js';
import { a, div, img } from '../../scripts/dom-helpers.js';

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

export default async function decorate(block) {
  // let property = {};
  let propId = getPropIdFromPath(); // assumes the listing page pathname ends with the propId
  // TODO: remove this test propId
  if (!propId) propId = '370882966';

  const propertyData = await getDetails(propId)[0];
  if (propertyData) {
    block.innerHTML = '';
    const row = div({ class: 'row' },
      div({ class: 'back' },
        a({ onclick: 'window.history.back()' }, 'Back'),
      ),
      div({ class: 'luxury-property' },
        img({ src: 'lux_mark.png', alt: 'Luxury Property' }),
      ),

    );
    block.append(row);
  }
}
