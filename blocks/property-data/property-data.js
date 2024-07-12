import { getMarketTrends } from '../../scripts/apis/creg/creg.js';
import { div } from '../../scripts/dom-helpers.js';
import {
  formatCurrency,
} from '../../scripts/util.js';

function daysOnMarket(listingContractDate) {
  const listingDate = new Date(listingContractDate);
  const currentDate = new Date();
  const timeDifference = currentDate - listingDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}

export default async function decorate(block) {
  block.innerHTML = '';
  let property;
  let marketdata;

  if (window.envelope.propertyDetails) {
    property = window.envelope.propertyDetails;
    const data = await getMarketTrends(
      property.PropId,
      property.Latitude,
      property.Longitude,
      property.PostalCode,
    );
    if (data) {
      [marketdata] = data;
    }
  }

  const trends = div({ class: 'accordions' },
    div({ class: 'accordion' },
      div({ class: 'accordion-header', onclick: (e) => toggleAccordion(e) }, 'Market Trends'),
      div({ class: 'accordion-content' },
        div({ class: 'row' },
          div({ class: 'address' }, property.unstructuredAddress),
          div({ class: 'zip' }, `ZIP Code: ${property.postalCode}`),
        ),
        div({ class: 'row' },
          div({ class: 'td' },
            div({ class: 'label' }, 'List Price'),
            div({ class: 'value' }, formatCurrency(property.listPrice)),
          ),
          div({ class: 'td' },
            div({ class: 'label' }, 'Median List Price'),
            div({ class: 'value' }, marketdata.total.medianListPrice.split(' ')[0]),
            div({ class: 'chart' }),
          ),
        ),
        div({ class: 'row' },
          div({ class: 'td' },
            div({ class: 'label' }, 'Sale Price'),
            div({ class: 'value' }, property.closePrice || '-'),
          ),
          div({ class: 'td' },
            div({ class: 'label' }, 'Median Sold Price'),
            div({ class: 'value' }, marketdata.total.medianSalesPrice.split(' ')[0]),
            div({ class: 'chart' }),
          ),
        ),
        div({ class: 'row' },
          div({ class: 'td' },
            div({ class: 'label' }, 'Price/SQFT'),
            div({ class: 'value' }, formatCurrency(property.utilityAndBuilding.pricePerSqFt)),
          ),
          div({ class: 'td' },
            div({ class: 'label' }, 'AVG Price/SQFT'),
            div({ class: 'value' }, marketdata.total.avgPriceArea.split(' ')[0]),
            div({ class: 'chart' }),
          ),
        ),
        div({ class: 'row' },
          div({ class: 'td' },
            div({ class: 'label' }, 'Days on Market'),
            div({ class: 'value' }, property.closePrice ? 0 : daysOnMarket(property.listingContractDate)),
          ),
          div({ class: 'td' },
            div({ class: 'label' }, 'AVG Days on Market'),
            div({ class: 'value' }, marketdata.total.avgDaysOnMarket),
            div({ class: 'chart' }),
          ),
        ),
        div({ class: 'row' },
          div({ class: 'label' }, 'Homes for Sale'),
          div({ class: 'label' }, 'Homes Sold'),
        ),
        div({ class: 'row' },
          div({ class: 'td' },
            div({ class: 'value' }, marketdata.total.homesForSale),
            div({ class: 'chart' }),
          ),
          div({ class: 'td' },
            div({ class: 'value' }, marketdata.total.homesSold),
            div({ class: 'chart' }),
          ),
        ),
      ),
    ),
  );
  block.append(trends);
}
