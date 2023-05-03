import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';
const propertyAPI = 'https://www.bhhs.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=7497500&MaxPrice=22492500&Latitude=42.56574249267578&Longitude=-70.76632690429688&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';
const propID = '343140756';

function next(item, carousel) {
  if (item.nextElementSibling) {
    return item.nextElementSibling;
  } else {
    return carousel.firstElementChild;
  }
}

function prev(item, carousel) {
  if (item.previousElementSibling) {
    return item.previousElementSibling;
  } else {
    return carousel.lastElementChild;
  }
}

function getIndex(block) {
  var items = [...block.querySelectorAll('.carousel-seat')];
  var refIndex = items.findIndex(
    (elem) => elem.classList.contains('is-ref')
  );
  refIndex += 2;
  if (refIndex > items.length) {
    refIndex -= items.length;
  }
  return refIndex;
}

export default async function decorate(block) {
  const resp = await fetch(propertyAPI);
  if (resp.ok) {
    const data = await resp.json();
    console.log(data);
    const listing = data.properties.find((item) => item.PropId == propID);
    var media = listing['Media'];
    var photos = media.map((item) => item['mediaUrl']);
    photos.unshift(photos.pop());
    const div = document.createElement('div');
    div.className = 'property-container';
    var infoHTML = `
      <div class="property-details-summary">
        <div class="property-row">
          <div class="col d-none d-lg-block col-lg-1 order-1"></div>
          <div class="col col-12 col-md-6 order-2">
            <div class="property-row">
              <div class="col col-12">
                <div class="property-details-address">
                  ${listing.StreetName}
                  <br>
                  ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}
                </div>
              </div>
              <div class="col col-10">
                <div class="property-details-specs mt-2 mt-lg-3">
                  ${listing.SpecsLabel} ${listing.LivingAreaUnits} / ${listing.LotSizeSquareFeet} Sq. Ft., ${listing.LotSizeAcres} acres lot size / Single Family
                </div>
              </div>
    `;
    if(listing.CourtesyOf) {
      infoHTML += `
              <div class="col col-12"></div>
              <div class="col col-12">
                <div class="courtesyOf">
                  Listing Courtesy of: ${listing.CourtesyOf}
                </div>
              </div>
      `;
    }
    infoHTML += `   
            </div>
          </div>
          <div class="col col-12 col-md-4 col-lg-3 order-3">
            <div class="mt-3 mt-md-0">
              <div class="property-details-price">
                ${listing.ListPriceUS}
              </div>
            </div>
          </div>
          <div class="d-block col col-lg-2 order-0 order-lg-4 mb-3 mb-md-0">
            <div class="d-flex d-lg-flex">
              <a class="btn-property mr-2 mb-lg-2">
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
    div.innerHTML = infoHTML;
    //decorateIcons(div);
    block.append(div);
    const imageGalleryDiv = document.createElement('div');
    imageGalleryDiv.className = 'property-image-gallery';
    var carouselInnerHTML = `
      <div class="image-gallery-content">
        <div class="image-gallery-container">
          <ul class="carousel is-set">`;
    photos.forEach((photo) => {
      carouselInnerHTML += `
            <li class="carousel-seat">
              <div class="img-wrapper">
                <img src=${photo}>
              </div>
            </li>
      `;
    });
    carouselInnerHTML += `
          </ul>
        </div>
        <div class="map">
        </div>
        <div class="image-gallery-nav">
          <div class="property-row">
            <div class="nav-row-offset">
              <div class="nav-row-icons">
                <div class="photos-map">
                  <a class="button-prop button-toggle photos disabled">
                    <span class="icon icon-photos"></span>
                    photos
                  </a>
                  <a class="button-prop button-toggle map">
                    <span class="icon icon-map"></span>
                    map
                  </a>
                </div>
                <div class="pagination-row">
                  <div class="num-image">
                    <span class="num-index">1</span> of ${photos.length}
                  </div>
                  <div class="controls">
                    <button name="prev" class="toggle first-carrot">
                      <span class="icon icon-carrot"></span>
                    </a>
                    <button name="next" class="toggle">
                      <span class="icon icon-carrot"></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="image-gallery-modal">
      </div>
    `;
    imageGalleryDiv.innerHTML = carouselInnerHTML;
    block.append(imageGalleryDiv);
    const carousel = block.querySelector('.carousel');
    const items = block.querySelectorAll('.carousel-seat');
    var ref = carousel.lastElementChild;
    ref.classList.add('is-ref');
    const indexElem = block.querySelector('.num-index');
    indexElem.textContent = getIndex(block);
    const nextButton = block.querySelector('button[name="next"]');
    const prevButton = block.querySelector('button[name="prev"]');
    nextButton.addEventListener('click', () => {
      const item = block.querySelector('.is-ref');
      item.classList.remove('is-ref');
      var nextItem = next(item, carousel);
      carousel.classList.remove('is-reversing');
      nextItem.classList.add('is-ref');
      nextItem.style.order = 1;
      for(var i = 2; i <= items.length; i++) {
        nextItem = next(nextItem, carousel);
        nextItem.style.order = i;
      }
      indexElem.textContent = getIndex(block);
      carousel.classList.remove('is-set');
      return setTimeout(function() {
        return carousel.classList.add('is-set');
      }, 50);
    });
    prevButton.addEventListener('click', () => {
      const item = block.querySelector('.is-ref');
      item.classList.remove('is-ref');
      var nextItem = prev(item, carousel);
      carousel.classList.add('is-reversing');
      nextItem.classList.add('is-ref');
      nextItem.style.order = 1;
      for(var i = 2; i <= items.length; i++) {
        nextItem = next(nextItem, carousel);
        nextItem.style.order = i;
      }
      indexElem.textContent = getIndex(block);
      carousel.classList.remove('is-set');
      return setTimeout(function() {
        return carousel.classList.add('is-set');
      }, 50);
    });
    
  }
  decorateIcons(block);
  loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
}