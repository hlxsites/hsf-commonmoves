import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';

let alreadyDeferred = false;
function initGoogleMapsAPI() {
  if (alreadyDeferred) {
    return;
  }
  alreadyDeferred = true;
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = `
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '${window.hlx.codeBasePath}/blocks/property-details-image-gallery-map/property-details-map-delayed.js';
    document.head.append(script);
  `;
  document.head.append(script);
}

function next(item, carousel) {
  if (item.nextElementSibling) {
    return item.nextElementSibling;
  }
  return carousel.firstElementChild;
}

function prev(item, carousel) {
  if (item.previousElementSibling) {
    return item.previousElementSibling;
  }
  return carousel.lastElementChild;
}

function getIndex(block) {
  const items = [...block.querySelectorAll('.carousel-seat')];
  let refIndex = items.findIndex((elem) => elem.classList.contains('is-ref'));
  refIndex += 2;
  if (refIndex > items.length) {
    refIndex -= items.length;
  }
  return refIndex;
}

function togglePhotosMap() {
  const parent = this.parentElement;
  [...parent.children].forEach((button) => {
    button.classList.toggle('disabled');
  });
  const photoGallery = document.querySelector('.image-gallery-container');
  const photoRow = document.querySelector('.pagination-row');
  const mapElem = document.querySelector('#cmp-map-canvas');
  if (this.classList.contains('photos')) {
    mapElem.classList.add('invisible');
    photoGallery.classList.remove('invisible');
    photoRow.classList.remove('invisible');
  } else if (this.classList.contains('map')) {
    const height = photoGallery.querySelector('img').offsetHeight;
    photoGallery.classList.add('invisible');
    photoRow.classList.add('invisible');
    mapElem.classList.remove('invisible');
    mapElem.style.height = `${height}px`;
  }
}

export default async function decorate(block) {
  if (window.property) {
    const media = window.property.Media || [];
    const photos = media.map((item) => item.mediaUrl);
    photos.unshift(photos.pop());
    const imageGalleryDiv = document.createElement('div');
    imageGalleryDiv.className = 'property-image-gallery';
    let carouselInnerHTML = `
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
        <div class="cmp-map">
          <div id="cmp-map-canvas" class="invisible">
          </div>
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
    const ref = carousel.lastElementChild;
    ref.classList.add('is-ref');
    const indexElem = block.querySelector('.num-index');
    indexElem.textContent = getIndex(block);
    const nextButton = block.querySelector('button[name="next"]');
    const prevButton = block.querySelector('button[name="prev"]');
    nextButton.addEventListener('click', () => {
      const item = block.querySelector('.is-ref');
      item.classList.remove('is-ref');
      let nextItem = next(item, carousel);
      carousel.classList.remove('is-reversing');
      nextItem.classList.add('is-ref');
      nextItem.style.order = 1;
      for (let i = 2; i <= items.length; i += 1) {
        nextItem = next(nextItem, carousel);
        nextItem.style.order = i;
      }
      indexElem.textContent = getIndex(block);
      carousel.classList.remove('is-set');
      return setTimeout(() => carousel.classList.add('is-set'), 50);
    });
    prevButton.addEventListener('click', () => {
      const item = block.querySelector('.is-ref');
      item.classList.remove('is-ref');
      let nextItem = prev(item, carousel);
      carousel.classList.add('is-reversing');
      nextItem.classList.add('is-ref');
      nextItem.style.order = 1;
      for (let i = 2; i <= items.length; i += 1) {
        nextItem = next(nextItem, carousel);
        nextItem.style.order = i;
      }
      indexElem.textContent = getIndex(block);
      carousel.classList.remove('is-set');
      return setTimeout(() => carousel.classList.add('is-set'), 50);
    });
    const buttonToggle = block.querySelectorAll('.button-toggle');
    buttonToggle.forEach((button) => {
      button.addEventListener('click', togglePhotosMap);
    });
    initGoogleMapsAPI();
  }
  decorateIcons(block);
  loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
}
