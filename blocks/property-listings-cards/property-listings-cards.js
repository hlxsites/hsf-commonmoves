import { decorateIcons } from '../../scripts/lib-franklin.js';

const COMMONMOVES_API_PROPERTY = 'https://www.commonmoves.com/bin/bhhs/CregPropertySearchServlet?SearchType=Map&MinPrice=800000&PropertyType=1,2,4&ApplicationType=FOR_SALE&ListingStatus=1&NewListing=true&Sort=DATE_DESCENDING&PageSize=10&Page=1&NorthEastLatitude=42.88103227227745&NorthEastLongitude=-68.5569598543709&SouthWestLatitude=40.731686815498&SouthWestLongitude=-71.8089129793709&SearchParameter=%7B%22type%22:%22FeatureCollection%22,%22features%22:%5B%7B%22type%22:%22Feature%22,%22properties%22:%7B%7D,%22geometry%22:%7B%22type%22:%22Polygon%22,%22coordinates%22:%5B%5B%5B-71.8089129793709,42.88103227227745%5D,%5B-71.8089129793709,40.731686815498%5D,%5B-68.5569598543709,40.731686815498%5D,%5B-68.5569598543709,42.88103227227745%5D,%5B-71.8089129793709,42.88103227227745%5D%5D%5D%7D%7D%5D%7D&MapSearchType=MapBounds&listingAgentId=&ucsid=false';

function createCard(listing) {
  let html = `
    <li class="listing-tile"> 
      <div class="listing-image-container"> 
        <div class="property-image"> 
          <a href="${listing.PdpPath}" rel="noopener" aria-label="${listing.StreetName}"> 
            <img src="${listing.SmallMedia[0].mediaUrl} alt="property-image" loading="lazy" class="property-thumbnail">
          </a> 
        </div>
        <div class="image-position-top">
        </div>
        <div class="image-position-bottom"> 
          <div class="property-labels">`;
  if (listing.FeaturedListing) {
    html += '<span class="property-label featured-listing">Featured Listing</span>';
  }
  if (listing.newListing) {
    html += '<span class="property-label new-listing">NEW LISTING</span>';
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
        <div>`;
  if (listing.listAor === 'RIMLS') {
    html += `
      <div>
        <img class="rimls-image" src="https://hsfbhimages.fnistools.com/images/Common/brlogos/rimls_logo.jpg" alt="Disclaimer Logo Image" loading="lazy">
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
  const resp = await fetch(COMMONMOVES_API_PROPERTY);
  if (resp.ok) {
    const data = await resp.json();
    const listings = data.properties;
    const cards = listings.slice(0, 8);
    const ul = document.createElement('ul');
    cards.forEach((listing) => {
      ul.innerHTML += createCard(listing);
    });
    decorateIcons(ul);
    block.textContent = '';
    block.append(ul);
  }
}
