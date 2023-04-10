// import { readBlockConfig } from '../../scripts/lib-franklin.js';

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg> 
          </a> 
          <a aria-label="Save" href="#" class="button-property"> 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg> 
          </a>
        </div>
      </div>
      <hr> 
      <div class="extra-info"> 
          Listing courtesy of: ${listing.CourtesyOf}
      </div> 
      <div class="extra-info"> 
          Listing provided by: ${listing.listAor}
      </div> 
    </li>
  `;
  return html;
}

export default async function decorate(block) {
  // const cfg = readBlockConfig(block);
  const resp = await fetch(COMMONMOVES_API_PROPERTY);
  if (resp.ok) {
    const data = await resp.json();
    const listings = data.properties;
    const cards = listings.slice(0, 8);
    let innerHTML = '<ul>';
    cards.forEach((listing) => {
      innerHTML += createCard(listing);
    });
    innerHTML += '</ul>';
    block.textContent = '';
    block.innerHTML = innerHTML;
  }
}
