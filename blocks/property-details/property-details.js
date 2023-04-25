import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getSchoolData } from './schools.js';
import { getEconData } from './occupancy.js';
const propertyAPI = 'https://www.bhhs.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=7497500&MaxPrice=22492500&Latitude=42.56574249267578&Longitude=-70.76632690429688&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';
const socioEconomicAPI = 'https://www.bhhs.com/bin/bhhs/pdp/socioEconomicDataServlet?latitude=42.56574249267578&longitude=-70.76632690429688';
const marketTrendsAPI = 'https://www.bhhs.com/bin/bhhs/CregMarketTrends?PropertyId=343140756&Latitude=42.56574249267578&Longitude=-70.76632690429688&zipCode=01944';
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

function openAccordion(e) {
  var parent = this.closest('.accordion-item');
  parent.classList.toggle('collapse');
}

function createAccordionHeader(heading, tooltipText) {
  const accordionTitle = document.createElement('div');
  accordionTitle.className = 'accordion-title';
  accordionTitle.innerHTML = `
    <div class="property-container">
      <div class="property-row">
        <div class="accordion-title-col">
          <div class="accordion-header">
            <h2 class="accordion-header-title">${heading}</h2>
            <div class="tooltip">
              <span class="icon icon-info_circle"></span>
              <span class="icon icon-info_circle_dark"></span>
              <span class="tooltiptext">${tooltipText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  return accordionTitle;
}

function createSchoolTableHTML(type, schools) {
  var schoolHTML = `
    <div class="property-container">
  `;
  schools.forEach((school) => {
    schoolHTML += `
      <div class="property-row">
        <div class="schools-col-1">
          <div class="schools-cell">
            <div class="schools-type">${type}</div>
          </div>
        </div>
        <div class="schools-col-2">
          <div class="schools-cell">
            <span class="school-name">
              ${school.schoolName}
            </span>
            <span class="school-grades">
              ${school.lowGrade}-${school.highGrade}
            </span>
          </div>
        </div>
        <div class="schools-col-3">
          <div class="schools-cell">
            <div class="school-qty">
              ${school.schoolYearlyDetails[0].numberOfStudents} students
            </div>
          </div>
        </div>
        <div class="schools-col-4">
          <div class="schools-cell">
            <div class="school-dist">
              ${school.distanceStr}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  schoolHTML += `
    </div>
  `;
  return schoolHTML;
}
function createSchoolsAccordionItem() {
  var schoolData = getSchoolData();
  console.log(schoolData);
  const accordionItem = document.createElement('div');
  accordionItem.className = 'accordion-item schools';
  const accordionTitle = createAccordionHeader('Your Schools', schoolData.citation);
  const accordionBody = document.createElement('div');
  accordionBody.className = 'accordion-body';
  var publicSchools = schoolData.schoolResults.public;
  var privateSchools = schoolData.schoolResults.private;
  var schoolsHTML = `
    <div class="schools-wrap">
      <div class="schools-table active">
  `;
  if (publicSchools.length != 0) {
    schoolsHTML += createSchoolTableHTML('Public', publicSchools);
  }
  if (privateSchools.length != 0) {
    schoolsHTML += createSchoolTableHTML('Private', privateSchools);
  }
  schoolsHTML += `
      </div>
      <div class="schools-detail"></div>
    </div>
  `;
  accordionBody.innerHTML = schoolsHTML;
  accordionItem.append(accordionTitle);
  accordionItem.append(accordionBody);
  return accordionItem;
}
function createOccupancyAccordionItem() {
  var econData = getEconData();
  console.log(econData);
  var levelData = econData.data.find((elem) => elem.level == 'zipcode');
  var countyData = econData.data.find((elem) => elem.level == 'county');
  var countryData = econData.data.find((elem) => elem.level == 'country');
  const accordionItem = document.createElement('div');
  accordionItem.className = 'accordion-item occupancy';
  const citation = 'Market data provided by U.S. Census Bureau';
  const accordionTitle = createAccordionHeader('Occupancy', citation);
  const accordionBody = document.createElement('div');
  accordionBody.className = 'accordion-body';
  var occupancyTableHTML = `
    <div class="property-container">
      <div class="property-row">
        <div class="col col-12 col-lg-10 offset-lg-1 col-md-10 offset-md-1">
        <table class="cmp-socio-economic-data--table">
          <thead slot="head">
            <th aria-label="No value"></th>
            <th>Owned</th>
            <th>Rented</th>
            <th aria-label="No value">Vacant</th>
          </thead>
          <tbody>
            <tr>
              <td>
                <h6>Zip Code: ${levelData.label}</h6>
              </td>
              <td class="cmp-socio-economic-data__stat">
                ${levelData.ownerOccupiedPercent}
                <span class="percentage">%</span>
                <div class="progress-bar"><span class="progress-owner" style="width: ${levelData.ownerOccupiedPercent}%;"></span> <span class="progress-renter"
                    style="width: ${levelData.renterOccupiedPercent}%;"></span></div>
              </td>
              <td class="cmp-socio-economic-data__stat percentage">
                ${levelData.renterOccupiedPercent}
                <span class="percentage">%</span></td>
              <td class="cmp-socio-economic-data__stat percentage">
                ${levelData.vacancyPercent}
                <span class="percentage">%</span></td>
            </tr>
            <tr>
              <td>
                <h6>${countyData.label}</h6>
              </td>
              <td class="cmp-socio-economic-data__stat">
                ${countyData.ownerOccupiedPercent}
                <span class="percentage">%</span>
                <div class="progress-bar"><span class="progress-owner" style="width: ${countyData.ownerOccupiedPercent}%;"></span> <span class="progress-renter"
                    style="width: ${countyData.renterOccupiedPercent}%;"></span></div>
              </td>
              <td class="cmp-socio-economic-data__stat percentage">
                ${countyData.renterOccupiedPercent}
                <span class="percentage">%</span></td>
              <td class="cmp-socio-economic-data__stat percentage">
                ${countyData.vacancyPercent}
                <span class="percentage">%</span></td>
            </tr>
            <tr>
              <td>
                <h6>${countryData.label}</h6>
              </td>
              <td class="cmp-socio-economic-data__stat">
                ${countryData.ownerOccupiedPercent}
                <span class="percentage">%</span>
                <div class="progress-bar"><span class="progress-owner" style="width: ${countryData.ownerOccupiedPercent}%;"></span> <span class="progress-renter"
                    style="width: ${countryData.renterOccupiedPercent}%;"></span></div>
              </td>
              <td class="cmp-socio-economic-data__stat percentage">
                ${countryData.renterOccupiedPercent}
                <span class="percentage">%</span></td>
              <td class="cmp-socio-economic-data__stat percentage">
                ${countryData.vacancyPercent}
                <span class="percentage">%</span></td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  `;
  accordionBody.innerHTML = occupancyTableHTML;
  accordionItem.append(accordionTitle);
  accordionItem.append(accordionBody);
  return accordionItem;
}
function createHousingTrendsAccordionItem() {
  var econData = getEconData();
  console.log(econData);
  var levelData = econData.data.find((elem) => elem.level == 'zipcode');
  var countyData = econData.data.find((elem) => elem.level == 'county');
  var countryData = econData.data.find((elem) => elem.level == 'country');
  const accordionItem = document.createElement('div');
  accordionItem.className = 'accordion-item housing-trends';
  const citation = 'Market data provided by U.S. Census Bureau';
  const accordionTitle = createAccordionHeader('Housing Trends', citation);
  const accordionBody = document.createElement('div');
  accordionBody.className = 'accordion-body';
  var housingTableHTML = `
    <div class="property-container">
      <div class="property-row">
        <div class="col col-12 col-lg-10 offset-lg-1 col-md-10 offset-md-1">
          <table class="cmp-socio-economic-data--table">
            <thead slot="head">
              <th aria-label="No value"></th>
              <th>Home Appreciation</th>
              <th>Median Age</th>
              <th aria-label="No value"></th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h6>Zip Code: ${levelData.label}</h6>
                </td>
                <td class="cmp-socio-economic-data__stat percentage">
                  ${levelData.homeValueAppreciationPercent}
                  <span class="percentage">%</span></td>
                <td class="cmp-socio-economic-data__stat year">${levelData.medianHomeAge}y</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <h6>${countyData.label}</h6>
                </td>
                <td class="cmp-socio-economic-data__stat percentage">
                  ${countyData.homeValueAppreciationPercent}
                  <span class="percentage">%</span></td>
                <td class="cmp-socio-economic-data__stat year">${countyData.medianHomeAge}y</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <h6>${countryData.label}</h6>
                </td>
                <td class="cmp-socio-economic-data__stat percentage">
                  ${countryData.homeValueAppreciationPercent}
                  <span class="percentage">%</span></td>
                <td class="cmp-socio-economic-data__stat year">${countryData.medianHomeAge}y</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  accordionBody.innerHTML = housingTableHTML;
  accordionItem.append(accordionTitle);
  accordionItem.append(accordionBody);
  return accordionItem;
}
function createEconomicDataAccordionItem() {
  var econData = getEconData();
  console.log(econData);
  var levelData = econData.data.find((elem) => elem.level == 'zipcode');
  var countyData = econData.data.find((elem) => elem.level == 'county');
  var countryData = econData.data.find((elem) => elem.level == 'country');
  const accordionItem = document.createElement('div');
  accordionItem.className = 'accordion-item economic-data';
  const citation = 'Data provided by U.S. Census Bureau';
  const accordionTitle = createAccordionHeader('Economic Data', citation);
  const accordionBody = document.createElement('div');
  accordionBody.className = 'accordion-body';
  var econTableHTML = `
    <div class="property-container">
      <div class="property-row">
        <div class="col col-12 col-lg-10 offset-lg-1 col-md-10 offset-md-1">
          <table class="cmp-socio-economic-data--table">
            <thead slot="head">
              <th aria-label="No value"></th>
              <th>Median House. Income</th>
              <th>Unemployment</th>
              <th>Cost of Living Index</th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h6>Zip Code: ${levelData.label}</h6>
                </td>
                <td class="cmp-socio-economic-data__stat usd">
                  <div class="currency">${levelData.medianIncome}</div>
                </td>
                <td class="cmp-socio-economic-data__stat percentage">
                  ${levelData.unemploymentPercent}
                  <span class="percentage">%</span></td>
                <td class="cmp-socio-economic-data__stat">
                  ${levelData.costOfLivingIndex}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>${countyData.label}</h6>
                </td>
                <td class="cmp-socio-economic-data__stat usd">
                  <div class="currency">${countyData.medianIncome}</div>
                </td>
                <td class="cmp-socio-economic-data__stat percentage">
                  ${countyData.unemploymentPercent}
                  <span class="percentage">%</span></td>
                <td class="cmp-socio-economic-data__stat">
                  ${countyData.costOfLivingIndex}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>${countryData.label}</h6>
                </td>
                <td class="cmp-socio-economic-data__stat usd">
                  <div class="currency">${countryData.medianIncome}</div>
                </td>
                <td class="cmp-socio-economic-data__stat percentage">
                  ${countryData.unemploymentPercent}
                  <span class="percentage">%</span></td>
                <td class="cmp-socio-economic-data__stat">
                  ${countryData.costOfLivingIndex}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  accordionBody.innerHTML = econTableHTML;
  accordionItem.append(accordionTitle);
  accordionItem.append(accordionBody);
  return accordionItem;
}
export default async function decorate(block) {
  const resp = await fetch(propertyAPI);
  if (resp.ok) {
    const data = await resp.json();
    const listing = data.properties.find((item) => item.PropId == propID);
    var media = listing['Media'];
    var photos = media.map((item) => item['mediaUrl']);
    photos.unshift(photos.pop());
    const div = document.createElement('div');
    div.className = 'property-container';
    div.innerHTML = `
      <div class="property-details-summary">
        <div class="property-row">
          <div class="none"></div>
          <div class="property-details-info">
            <div class="property-row">
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
    const accordionTwo = document.createElement('div');
    accordionTwo.className = 'property-accordion-two property-container';
    var schoolsAccordionItem = createSchoolsAccordionItem();
    accordionTwo.append(schoolsAccordionItem);
    var occupancyAccordionItem = createOccupancyAccordionItem();
    accordionTwo.append(occupancyAccordionItem);
    var housingAccordionItem = createHousingTrendsAccordionItem();
    accordionTwo.append(housingAccordionItem);
    var econItem = createEconomicDataAccordionItem();
    accordionTwo.append(econItem);
    block.append(accordionTwo);
    var accordionHeaders = block.querySelectorAll('.accordion-header');
    for(var i = 0; i < accordionHeaders.length; i++) {
      accordionHeaders[i].addEventListener('click', openAccordion);
    }
    decorateIcons(block);
  }
}