import { decorateIcons, readBlockConfig } from '../../scripts/lib-franklin.js';

const COMMONMOVES_API_BASE = 'https://www.bhhs.com';

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

function createCard(listing) {
  let html = `
    <li class="listing-tile"> 
      <div class="listing-image-container"> 
        <div class="property-image"> 
          <a href="${listing.PdpPath}" rel="noopener" aria-label="${listing.StreetName}">`;
  if (listing.SmallMedia.length > 0) {
    html += `<img src="${listing.SmallMedia[0].mediaUrl} alt="property-image" loading="lazy" class="property-thumbnail">`;
  } else {
    html += `
            <div class="property-no-available-image">
              <span>no images available</span>
            </div>
    `;
  }
  html += `          
          </a> 
        </div>
        <div class="image-position-top">`;
  if (listing.OpenHouses.length > 0) {
    html += `
          <div class="property-labels">
            <span class="property-label open-house">
              <span class="icon icon-openhouse"></span>
              Open House
            </span>
          </div>
    `;
  }
  html += `
        </div>
        <div class="image-position-bottom"> 
          <div class="property-labels">`;
  if (listing.FeaturedListing) {
    html += '<span class="property-label featured-listing">Featured Listing</span>';
  }
  if (listing.newListing) {
    html += '<span class="property-label new-listing">New Listing</span>';
  }
  html += `
        </div> 
          <div class="property-info-wrapper"> 
            <div class="property-price">
              ${listing.ListPriceUS}
            </div> 
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
      <hr> 
      <div class="extra-info"> 
          Listing courtesy of: ${listing.CourtesyOf}
      </div> 
      <div class="extra-info extra-info-flex"> 
        <div>
          Listing provided by: ${listing.listAor}
        </div>`;
  if (listing.listAor === 'RIMLS') {
    html += `
      <div>
        <img class="rimls-image" src="/styles/images/rimls_logo.jpg" alt="Disclaimer Logo Image" loading="lazy">
      </div>
    `;
  }
  html += `
      </div> 
    </li>
  `;
  return html;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
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
  const apiUrl = `${COMMONMOVES_API_BASE}/bin/bhhs/CregPropertySearchServlet?SearchType=Map&MinPrice=${apiParameters.minprice}&PropertyType=1,2,4&ApplicationType=FOR_SALE&ListingStatus=1&NewListing=${apiParameters.newlisting}&Sort=${apiParameters.sort}&PageSize=${apiParameters.pagesize}&Page=1&NorthEastLatitude=${apiParameters.maximumlatitude}&NorthEastLongitude=${apiParameters.maximumlongitude}&SouthWestLatitude=${apiParameters.minimumlatitude}&SouthWestLongitude=${apiParameters.minimumlongitude}&SearchParameter=${apiParameters.searchparameter}&MapSearchType=MapBounds&listingAgentId=&ucsid=false`;
  const resp = await fetch(apiUrl);
  if (resp.ok) {
    const data = await resp.json();
    const listings = data.properties;
    const ul = document.createElement('ul');
    listings.forEach((listing) => {
      ul.innerHTML += createCard(listing);
    });
    decorateIcons(ul);
    block.textContent = '';
    block.append(ul);
  }
}
