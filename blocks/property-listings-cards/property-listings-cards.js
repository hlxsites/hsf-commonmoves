import { decorateIcons, readBlockConfig } from '../../scripts/lib-franklin.js';
import { DOMAIN } from '../../scripts/apis/creg/creg.js';

const API_HOST = `https://${DOMAIN}`;

const defaultParameters = {
  minprice: '800000',
  newlisting: 'true',
  sort: 'DATE_DESCENDING',
  pagesize: '8',
  maximumlatitude: '42.88103227227745',
  maximumlongitude: '-68.5569598543709',
  minimumlatitude: '40.731686815498',
  minimumlongitude: '-71.8089129793709',
};

function createImage(listing) {
  if (listing.SmallMedia?.length > 0) {
    return `<img src="${listing.SmallMedia[0].mediaUrl} alt="property-image" loading="lazy" class="property-thumbnail">`;
  }
  return '<div class="property-no-available-image"><span>no images available</span></div>';
}

function createCard(listing) {
  const item = document.createElement('div');
  item.classList.add('listing-tile');
  if (listing.OpenHouses?.length > 0) {
    item.classList.add('has-open-houses');
  }

  if (listing.FeaturedListing) {
    item.classList.add('is-featured');
  }

  if (listing.newListing) {
    item.classList.add('is-new');
  }

  item.innerHTML = `
    <a href="${listing.PdpPath}" rel="noopener" aria-label="${listing.StreetName}">
      <div class="listing-image-container"> 
        <div class="property-image"> 
          ${createImage(listing)} 
        </div>
        <div class="image-position-top">
          <div class="property-labels">
            <div class="property-label open-house">
              <span class="icon icon-openhouse"></span>
              Open House
            </div>
          </div>
        </div>
        <div class="image-position-bottom"> 
          <div class="property-labels">
            <span class="property-label featured-listing">Featured Listing</span>
            <span class="property-label new-listing">New Listing</span>
          </div>
          <div class="property-price">
              ${listing.ListPriceUS}
          </div> 
        </div> 
      </div>
    </a>
    <div class="property-details">
      <div class="property-info-wrapper"> 
        <div class="property-info"> 
          <div class="address"> 
            ${listing.StreetName}
            <br> 
            ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode} 
          </div> 
          <div class="specs"> 
            ${listing.BedroomsTotal} Bed / ${listing.BathroomsTotal} Bath / ${listing.LivingArea} ${listing.LivingAreaUnits}
          </div> 
        </div> 
      </div> 
      <div class="property-buttons"> 
        <div class="buttons-row-flex"> 
          <a aria-label="Contact Form" href="#" class="button-property"> 
            <span class="icon icon-envelope"></span>
            <span class="icon icon-envelopedark"></span>
          </a> 
          <a aria-label="Save" href="#" class="button-property"> 
            <span class="icon icon-heartempty"></span>
            <span class="icon icon-heartemptydark"></span>
          </a>
        </div>
      </div>
    </div>
    <hr> 
    <div class="extra-info">
      <div> 
        <div class="courtesy-info">Listing courtesy of: ${listing.CourtesyOf}</div>
        <div class="courtesy-provided">Listing provided by: ${listing.listAor}</div>
      </div>
      <div class="listing-aor ${listing.listAor.toLowerCase()}">
        <img class="rimls-image" src="/styles/images/rimls_logo.jpg" alt="Disclaimer Logo Image" loading="lazy" height="20" width="33">
      </div>
    </div>
  `;
  return item;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.innerHTML = `
    <div class="header">
      <div>
        <span>${config.title}</span>
      </div>
      <div>
        <p class="button-container">
          <a href="" aria-label="${config['link-text'] || 'See More'}">${config['link-text'] || 'See More'}</a>
        </p>
      </div>
    </div>
  `;

  const apiParameters = {
    minprice: config.minprice || defaultParameters.minprice,
    newlisting: config.newlisting || defaultParameters.newlisting,
    pagesize: config.pagesize || defaultParameters.pagesize,
    maximumlatitude: config['max-lat'] || config['maximum-latitude'] || config['maximum-lat'] || config['max-latitude'] || defaultParameters.maximumlatitude,
    maximumlongitude: config['max-lon'] || config['maximum-longitude'] || config['maximum-lon'] || config['max-longitude'] || defaultParameters.maximumlongitude,
    minimumlatitude: config['min-lat'] || config['minimum-latitude'] || config['minimum-lat'] || config['min-latitude'] || defaultParameters.minimumlatitude,
    minimumlongitude: config['min-lon'] || config['minimum-longitude'] || config['minimum-lon'] || config['min-longitude'] || defaultParameters.minimumlongitude,
  };
  apiParameters.sort = config['sort-by'] && config['sort-direction'] ? `${config['sort-by']}_${config['sort-direction']}`.toUpperCase() : defaultParameters.sort;
  apiParameters.searchparameter = encodeURIComponent(`{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[${apiParameters.minimumlongitude}, ${apiParameters.maximumlatitude}],[${apiParameters.minimumlongitude}, ${apiParameters.minimumlatitude}],[${apiParameters.maximumlongitude}, ${apiParameters.minimumlatitude}],[${apiParameters.maximumlongitude}, ${apiParameters.maximumlatitude}],[${apiParameters.minimumlongitude}, ${apiParameters.maximumlatitude}]]]}}]}`);
  const apiUrl = `${API_HOST}/bin/bhhs/CregPropertySearchServlet?SearchType=Map&MinPrice=${apiParameters.minprice}&PropertyType=1,2,4&ApplicationType=FOR_SALE&ListingStatus=1&NewListing=${apiParameters.newlisting}&Sort=${apiParameters.sort}&PageSize=${apiParameters.pagesize}&Page=1&NorthEastLatitude=${apiParameters.maximumlatitude}&NorthEastLongitude=${apiParameters.maximumlongitude}&SouthWestLatitude=${apiParameters.minimumlatitude}&SouthWestLongitude=${apiParameters.minimumlongitude}&SearchParameter=${apiParameters.searchparameter}&MapSearchType=MapBounds&listingAgentId=&ucsid=false`;
  const resp = await fetch(apiUrl);
  if (resp.ok) {
    const data = await resp.json();
    const listings = data.properties;
    const list = document.createElement('div');
    list.classList.add('property-list');
    listings.forEach((listing) => {
      list.append(createCard(listing));
    });
    block.append(list);
  } else {
    // eslint-disable-next-line no-console
    console.log('Unable to retrieve properties from CREG API.');
  }
  decorateIcons(block);
}
