import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getSchoolData } from './schools.js';
const API = 'https://www.bhhs.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=7497500&MaxPrice=22492500&Latitude=42.56574249267578&Longitude=-70.76632690429688&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';

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
  var accordionBody = parent.querySelector('.accordion-body');
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
export default async function decorate(block) {
  const resp = await fetch(API);
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
    block.append(accordionTwo);
    var accordionHeaders = block.querySelectorAll('.accordion-header');
    for(var i = 0; i < accordionHeaders.length; i++) {
      accordionHeaders[i].addEventListener('click', openAccordion);
    }
    decorateIcons(block);
  }
}