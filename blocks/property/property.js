import { decorateIcons } from '../../scripts/aem.js';
import { getEnvelope } from '../../scripts/apis/creg/creg.js';
import { a, div, img, p, span } from '../../scripts/dom-helpers.js';
import { formatCurrency, formatNumber } from '../../scripts/util.js';

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
  // let property = {};
  let propId = getPropIdFromPath(); // assumes the listing page pathname ends with the propId
  // TODO: remove this test propId
  if (!propId) propId = '370882966';

  window.propertyData = await getPropertyByPropId(propId);
  block.innerHTML = '';

  if (!window.propertyData) {
    block.innerHTML = 'Property not found';
  } else {
    const property = window.propertyData.propertyDetails;
    const propertyPrice = formatCurrency(property.listPrice);
    const propertyAddress = window.propertyData.addressLine1;
    const propertyAddress2 = window.propertyData.addressLine2;
    const rooms = property.bedroomsTotal + property.interiorFeatures.bathroomsTotal;
    const bedBath = property.bedroomsTotal ? `${property.bedroomsTotal} bed / ${property.interiorFeatures.bathroomsTotal} bath` : '';
    const livingSpace = property.livingArea ? `${formatNumber(property.livingArea)} ${property.interiorFeatures.livingAreaUnits}` : '';
    const lotSF = property.lotSizeSquareFeet ? `${formatNumber(property.lotSizeSquareFeet)} ${property.interiorFeatures.livingAreaUnits}` : '';
    const lotAcre = property.lotSizeAcres ? `${formatNumber(property.lotSizeAcres, 2)} acres lot size` : '';
    let propertySpecs = bedBath;
    propertySpecs += rooms ? ` / ${livingSpace}` : livingSpace;
    propertySpecs += rooms ? ` / ${lotSF}` : '';
    propertySpecs += property.lotSizeArea ? `, ${lotAcre}` : '';
    propertySpecs += propertySpecs.length ? ` / ${property.propertySubType}` : '';
    const propertyCourtesyOf = property.courtesyOf;

    const propertyDetails = div({ class: 'property-details' },
      div({ class: 'property-info' },
        div({ class: 'property-address' }, propertyAddress, document.createElement('br'), propertyAddress2),
        div({ class: 'property-specs' }, propertySpecs),
        div({ class: 'courtesy' }, propertyCourtesyOf),
      ),
      div({ class: 'property-price' }, propertyPrice),
      div({ class: 'save-share' },
        p({ class: 'button-container' },
          a({ href: '', 'aria-label': 'Save property listing', class: 'save button secondary' },
            span({ class: 'icon icon-heartempty' }),
            'Save',
          ),
        ),
        p({ class: 'button-container' },
          a({ href: '', 'aria-label': 'Share property listing', class: 'share button secondary' },
            span({ class: 'icon icon-share-empty' }),
            'Share',
          ),
        ),
      ),
    );
    block.append(propertyDetails);

    if (property.isLuxury) {
      const luxury = div({ class: 'luxury' },
        img({ src: '/icons/lux_mark_classic_blk.svg', alt: 'Luxury Property' }),
      );
      propertyDetails.prepend(luxury);
    }
    const nav = div({ class: 'backnav' },
      div({ class: 'back' },
        a({ href: '#' }, 'Back'),
      ),
    );
    propertyDetails.prepend(nav);
    decorateIcons(block);
  }
}
