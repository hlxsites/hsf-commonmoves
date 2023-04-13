import { decorateIcons } from '../../scripts/lib-franklin.js';

const API = 'https://www.bhhs.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=7497500&MaxPrice=22492500&Latitude=42.56574249267578&Longitude=-70.76632690429688&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';

export default async function decorate(block) {
  const resp = await fetch(API);
  if (resp.ok) {
    const data = await resp.json();
    console.log(data);
    const listing = data.properties[0];
    console.log(listing);
    const div = document.createElement('div');
    div.className = 'property-details-top-container';
    div.innerHTML = `
      <div class="property-details-summary">
        <div class="property-details-summary-row">
          <div class="none"></div>
          <div class="property-details-info">
            <div class="property-details-info-row">
              <div class="property-details-info-col-1">
                <div class="property-details-address">
                  ${listing.StreetName}
                  <br>
                  ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}
                </div>
              </div>
              <div class="property-details-info-col-2">
                <div class="property-details-specs">
                  ${listing.SpecsLabel} ${listing.LivingAreaUnits} / ${listing.LotSizeSquareFeet} Sq. Ft., ${listing.LotSizeAcres} acres lot size / Single Family
                </div>
              </div>
            </div>
          </div>
          <div class="property-details-price">
            ${listing.ListPriceUS}
          </div>
          <div class="property-details-top-buttons-wrapper">
            <div class="property-details-top-buttons-row">
              <a class="btn-property">
                <span class="icon icon-heartempty"></span>
                save
              </a>
              <a class="btn-property">
                <span class="icon icon-shareempty"></span>
                share
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    decorateIcons(div);
    block.append(div);
    const imageGalleryDiv = document.createElement('div');
    imageGalleryDiv.className = 'property-image-gallery';
    imageGalleryDiv.innerHTML = `
      <div class="image-gallery-content">
        <div class="image-gallery-container">

        </div>
        <div class="map">

        </div>
        <div class="image-gallery-nav">

        </div>
      </div>
      <div class="image-gallery-modal">
      </div>
    `;
    block.append(imageGalleryDiv);
  }
}