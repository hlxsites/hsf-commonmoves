import {
  div, domEl, span,
} from '../../scripts/dom-helpers.js';
import {
  formatNumber, phoneFormat, formatCurrency,
} from '../../scripts/util.js';
import { decorateIcons } from '../../scripts/aem.js';

function toggleAccordion(event) {
  const content = event.target;
  content.classList.toggle('active');
}

export function formatListToHTML(str) {
  const strParts = str.split(',').map((part) => part.trim());

  const strElements = [];
  strParts.forEach((part, index) => {
    if (index > 0) {
      strElements.push(document.createElement('br'));
    }
    strElements.push(part); // Push the trimmed string directly
  });

  return div({ class: 'td' }, ...strElements);
}

export default async function decorate(block) {
  block.innerHTML = '';

  if (!window.propertyData) {
    block.innerHTML = 'Property not found';
  } else {
    const property = window.propertyData.propertyDetails;
    const lotSF = property.lotSizeSquareFeet ? `${formatNumber(property.lotSizeSquareFeet)} ${property.interiorFeatures.livingAreaUnits}` : '';

    const title = div({ class: 'title' }, 'Property Details');
    const details = div({ class: 'attributes' },
      div({ class: 'table' },
        div({ class: 'label' }, 'Type'),
        div({ class: 'td' }, property.propertySubType),
        div({ class: 'label' }, 'Status'),
        div({ class: 'td' }, property.mlsStatus),
        div({ class: 'label' }, 'County'),
        div({ class: 'td' }, property.countyOrParish),
        div({ class: 'label' }, 'Year built'),
        div({ class: 'td' }, property.yearBuilt),
        div({ class: 'label' }, 'Beds'),
        div({ class: 'td' }, property.bedroomsTotal),
        div({ class: 'label' }, 'Full Baths'),
        div({ class: 'td' }, property.bathroomsFull),
        div({ class: 'label' }, 'Half Baths'),
        div({ class: 'td' }, property.bathroomsHalf),
      ),
      div({ class: 'table' },
        div({ class: 'label' }, 'Sq. Ft.'),
        div({ class: 'td' }, formatNumber(property.livingArea)),
        div({ class: 'label' }, 'Lot Size'),
        div({ class: 'td' }, `${lotSF}, ${formatNumber(property.lotSizeAcres, 2)} acres`),
        div({ class: 'label' }, 'Listing Id'),
        div({ class: 'td' }, property.listingId),
        div({ class: 'label' }, 'Courtesy Of'),
        div({ class: 'td' }, `${property.courtesyOf} ${phoneFormat(property.listAgentPreferredPhone || property.listOfficePhone)}`),
        div({ class: 'label' }, 'List Office Phone'),
        div({ class: 'td' }, phoneFormat(property.listOfficePhone)),
        div({ class: 'label' }, 'Buyer Agency Commission', div({ class: 'tooltip' },
          span({ class: 'icon icon-info-circle-dark' }),
          span({ class: 'tooltiptext' },
            'If the Buyer Agency Compensation provided for this listing is unclear, please contact the brokerage for more info.'),
        ),
        ),
        div({ class: 'td' }, property.buyerAgentCommission),
      ),
    );
    const features = div({ class: 'accordions' },
      div({ class: 'accordion' }, // we might have to generate this dynamically
        div({ class: 'accordion-header', onclick: (e) => toggleAccordion(e) }, 'Interior Features'),
        div({ class: 'accordion-content' },
          div({ class: 'table' },
            div({ class: 'label' }, 'Fireplaces Total'),
            div({ class: 'td' }, property.interiorFeatures.fireplaceFeatures || 0),
            div({ class: 'label' }, 'Flooring'),
            div({ class: 'td' }, formatListToHTML(property.interiorFeatures.flooring)),
            div({ class: 'label' }, 'Living Area Units'),
            div({ class: 'td' }, property.interiorFeatures.livingAreaUnits),
            div({ class: 'label' }, 'Rooms Total'),
            div({ class: 'td' }, property.bedroomsTotal + property.interiorFeatures.bathroomsTotal),
            div({ class: 'label' }, 'Full Baths'),
            div({ class: 'td' }, property.bathroomsFull),
            div({ class: 'label' }, 'Half Baths'),
            div({ class: 'td' }, property.bathroomsHalf),
            div({ class: 'label' }, 'Bathrooms Total'),
            div({ class: 'td' }, property.interiorFeatures.bathroomsTotal),
          ),
        ),
      ),
      div({ class: 'accordion' }, // we might have to generate this dynamically
        div({ class: 'accordion-header', onclick: (e) => toggleAccordion(e) }, 'Exterior Features'),
        div({ class: 'accordion-content' },
          div({ class: 'table' },
            div({ class: 'label' }, 'Lot/Land Description'),
            div({ class: 'td' }, property.interiorFeatures.description || 0),
            div({ class: 'label' }, 'Foundation'),
            div({ class: 'td' }, property.interiorFeatures.foundation),
            div({ class: 'label' }, 'Parking Spaces'),
            div({ class: 'td' }, property.interiorFeatures.parkingFeatures),
          ),
        ),
      ),
      div({ class: 'accordion' }, // we might have to generate this dynamically
        div({ class: 'accordion-header', onclick: (e) => toggleAccordion(e) }, 'Utility & Building Info'),
        div({ class: 'accordion-content' },
          div({ class: 'table' },
            div({ class: 'label' }, 'Sewer'),
            div({ class: 'td' }, property.utilityAndBuilding.sewer),
            div({ class: 'label' }, 'Parcel Number'),
            div({ class: 'td' }, property.utilityAndBuilding.parcelNumber),
            div({ class: 'label' }, 'Cooling'),
            div({ class: 'td' }, property.utilityAndBuilding.cooling),
            div({ class: 'label' }, 'Water Source'),
            div({ class: 'td' }, property.utilityAndBuilding.waterSource),
            div({ class: 'label' }, 'Heating'),
            div({ class: 'td' }, formatListToHTML(property.utilityAndBuilding.heating)),
            div({ class: 'label' }, 'Tax Amount'),
            div({ class: 'td' }, property.utilityAndBuilding.YrPropTax),
            div({ class: 'label' }, 'Building Area Total'),
            div({ class: 'td' }, formatNumber(property.utilityAndBuilding.buildingAreaTotal)),
            div({ class: 'label' }, 'Price Per Sq Ft'),
            div({ class: 'td' }, formatCurrency(property.utilityAndBuilding.pricePerSqFt)),
            div({ class: 'label' }, 'Architectural Style'),
            div({ class: 'td' }, property.utilityAndBuilding.architecturalStyle),
          ),
        ),
      ),
    );

    const disclaimer = div({ class: 'idxDisclaimer' },
      domEl('hr'),
      property.idxDisclaimer,
    );

    block.append(title, details, features);
    block.parentNode.parentNode.insertAdjacentElement('afterEnd', disclaimer);
  }

  decorateIcons(block);
  // disclaimer
  // market trends
  // calculator
  // schools
  // Occupancy
  // housing trends
  // load economic data block
}
