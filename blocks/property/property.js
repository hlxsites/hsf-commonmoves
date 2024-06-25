import { decorateIcons, loadBlock } from '../../scripts/aem.js';
import { getEnvelope } from '../../scripts/apis/creg/creg.js';
import {
  a, button, div, domEl, img, p, span,
} from '../../scripts/dom-helpers.js';
import { formatCurrency, formatNumber, getImageURL } from '../../scripts/util.js';

function toggleHeight() {
  const content = document.getElementById('remark-content');
  const link = document.querySelector('.remarks .view');
  if (content.style.height === '149px') {
    content.style.height = 'auto';
    link.textContent = 'View Less';
    link.classList.remove('more');
    link.classList.add('less');
  } else {
    content.style.height = '149px';
    link.textContent = 'View More';
    link.classList.remove('less');
    link.classList.add('more');
  }
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
  // let property = {};
  let propId = getPropIdFromPath(); // assumes the listing page pathname ends with the propId
  // TODO: remove this test propId
  if (!propId) propId = '358207023'; // commercial '368554873'; // '375215759'; // luxury '358207023';

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

    // Load the carousel slider block
    /* const carousel = await loadBlock('carousel-slider');
    block.append(carousel); */

    // create contact info
    const description = div({ class: 'details-description' },
      div({ class: 'row' },
        div({ class: 'details' },
          div({ class: 'notes' },
            div({ class: 'notes-header' }, 'Your Notes'),
            div({ class: 'notes-body' },
              div({ class: 'placeholder' }, 'To add notes, please save this property.'),
            ),
          ),
          domEl('hr'),
          div({ class: 'remarks' },
            div({ id: 'remark-content'}, property.publicRemarks),
            a({
              href: '#', rel: 'noopener', class: 'view more', onclick: toggleHeight,
            }, 'View More'),
          ),
        ),
        div({ class: 'contact-details' },
          div({ class: 'contact-info' },
            div({ class: 'company-name' }, 'Berkshire Hathaway HomeServices', domEl('br'), 'Commonwealth Real Estate'),
            domEl('hr', { width: '130px', height: '1px', textAlign: 'left' }),
            div({ class: 'company-email' }, a({ href: 'mailto:realestateinquiry@commonmoves.com' }, 'realestateinquiry@commonmoves.com')),
            div({ class: 'company-phone' }, a({ href: 'tel:(508) 810-0700' }, '(508) 810-0700')),
          ),
          div({ class: 'cta' },
            p({ class: 'button-container' }, button({ class: 'contact', href: '/fragments/contact-property-form' }, 'Contact')),
            p({ class: 'button-container' }, button({ href: '/fragments/contact-property-form' }, 'See the property')),
            p({ class: 'button-container' }, button({ href: '/fragments/contact-property-form' }, 'Make an offer')),
          ),
        ),
      ),
    );
    block.append(description);

    if (property.listAgentCd) {
      const agent = window.propertyData.listAgent.reAgentDetail;
      const info = block.querySelector('.contact-info');
      const pic = getImageURL(agent.image);
      const profile = div({ class: 'profile' }, img({ src: pic, alt: agent.name, width: '82px' }));
      info.insertAdjacentElement('beforebegin', profile);
      const name = block.querySelector('.company-name');
      const link = a({ href: '#' }, agent.name); // TODO: add link to agent profile
      name.replaceChildren(link);
      if (agent.jobTitle) {
        name.append(div({ class: 'title' }, JSON.parse(agent.jobTitle)));
      }
      if (agent.team) {
        // name.append(div({ class: 'team' }, agent.team));
      }
      const email = block.querySelector('.company-email a');
      email.textContent = agent.email;
      email.href = `mailto:${agent.email}`;
      const label = block.querySelector('.company-phone');
      label.prepend('Direct: ');
      const phone = block.querySelector('.company-phone a');
      phone.textContent = agent.telephone;
      phone.href = `tel:${agent.telephone}`;
    }

    // new section with property details
    // disclaimer
    // market trends
    // calculator
    // schools
    // Occupancy
    // housing trends
    // load economic data block
  }
}
