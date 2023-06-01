import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';

function tConv24(time24) {
  let ts = time24;
  const H = +ts.substr(0, 2);
  let h = (H % 12) || 12;
  h = (h < 10) ? `0${h}` : h; // leading 0 at the left for 1 digit hours
  const ampm = H < 12 ? ' AM' : ' PM';
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
}

function createPropertyDetailsTop(listing) {
  const div = document.createElement('div');
  div.className = 'cmp-property-details-main-attributes-summary';
  let infoHTML = `
      <div class="cmp-property-details-main-attributes-summary__content">
        <div class="property-container">
          <div class="property-row">
            <div class="col col-11 offset-lg-1">
              <div class="back hidden">
                <a href="">back</a>
              </div>
            </div>
            <div class="d-none d-lg-block col-lg-1 order-1">
            </div>
            <div class="col col-12 col-md-6 order-2">
              <div class="property-row">
                <div class="col col-12">
                  <div class="address">
                    <h1>
                      ${listing.StreetName}
                      <br>
                      ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}
                    </h1>
                  </div>
                </div>
                <div class="col col-10">
                  <div class="specs mt-2 mt-lg-3">
                    ${listing.BedroomsTotal} bed / ${listing.BathroomsTotal} bath / ${listing.LivingArea} ${listing.LivingAreaUnits} / ${listing.LotSizeSquareFeet} Sq. Ft., ${listing.LotSizeAcres} acres lot size / Single Family
                  </div>
                </div>
  `;
  if (listing.CourtesyOf) {
    infoHTML += `
                <div class="col col-12"></div>
                <div class="col col-12">
                  <div class="courtesyOf">
                    Listing Courtesy of: ${listing.CourtesyOf}
                  </div>
                </div>
    `;
  }
  if (listing.OpenHouses.length > 0) {
    infoHTML += `
                <div class="col col-12"></div>
                <div class=" col col-12">
                  <div class="open-house property-row mt-3">
                    <div class="col col-auto">
                      <div class="open-house__icon">
                        <span class="icon icon-openhouse"></span> 
                        <span class="label">open house</span>
                      </div>
                    </div> 
                    <div class="col col-auto">
                      <div class="open-house__meta">
    `;
    for (let i = 0; i < listing.OpenHouses.length; i += 1) {
      const date = new Date(listing.OpenHouses[i].OpenHouseDate);
      const dayOfTheWeek = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(date);
      const dayMonth = new Intl.DateTimeFormat(undefined, { month: 'numeric', day: 'numeric' }).format(date);
      const startTime = tConv24(listing.OpenHouses[i].OpenHouseStartTime);
      const endTime = tConv24(listing.OpenHouses[i].OpenHouseEndTime);
      infoHTML += `
                        <div class="open-house__datetime">
                          <div class="date">${dayOfTheWeek} ${dayMonth}.</div> 
                          <div class="time">${startTime} to ${endTime}</div>
                        </div> 
      `;
    }
    infoHTML += `
                      </div>
                    </div>
                  </div>
                </div>
    `;
  }
  infoHTML += `   
              </div>
            </div>
            <div class="col col-12 col-md-4 col-lg-3 order-3">
              <div class="mt-3 mt-md-0">
                <div class="price">
                  ${listing.ListPriceUS}
                </div>
              </div>
            </div>
            <div class="d-block col col-lg-2 order-0 order-lg-4 mb-3 mb-md-0">
              <div class="d-flex d-lg-flex">
                <div class="d-flex justify-content-end">
                  <a class="btn-save-property mr-2 mb-lg-2">
                    <span class="icon icon-heartempty"></span>
                    save
                  </a>
                  <a class="btn-share-property">
                    <span class="icon icon-shareempty"></span>
                    share
                  </a> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  `;
  div.innerHTML = infoHTML;
  return div;
}

export default function decorate(block) {
  if (window.property) {
    const topDiv = createPropertyDetailsTop(window.property);
    block.append(topDiv);
    decorateIcons(block);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
  }
}
