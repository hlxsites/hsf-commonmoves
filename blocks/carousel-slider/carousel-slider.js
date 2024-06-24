import { getEnvelope } from '../../scripts/apis/creg/creg.js';
import { button, div, img } from '../../scripts/dom-helpers.js';

async function getPropertyByPropId(propId) {
  const resp = await getEnvelope(propId);
  return resp;
}


const SLIDE_ID_PREFIX = 'slide';
const SLIDE_CONTROL_ID_PREFIX = 'carousel-slide-control';

let curSlide = 0;
let maxSlide = 0;
let autoScroll;
let scrollInterval;
let scrollDuration = '1000';

/**
 * Synchronizes the active thumbnail with the active slide in the carousel.
 * @param {HTMLElement} carousel - The carousel element.
 * @param {number} activeSlide - The index of the active slide.
 */
function syncActiveThumb(carousel, activeSlide) {
  carousel.querySelectorAll('div.thumbs div').forEach((item, index) => {
    const btn = item.querySelector('button');
    if (index === activeSlide) {
      item.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.setAttribute('tabindex', '0');
    } else {
      item.classList.remove('active');
      btn.removeAttribute('aria-selected');
      btn.setAttribute('tabindex', '-1');
    }
  });
}

/**
 * Scrolls the carousel to the specified slide index and updates the active thumbnail.
 * @param {HTMLElement} carousel - The carousel element.
 * @param {number} [slideIndex=0] - The index of the slide to scroll to.
 */
function scrollToSlide(carousel, slideIndex = 0) {
  const slideWidth = carousel.querySelector('.slide').offsetWidth + 5;
  const carouselSlider = carousel.querySelector('.slide-container');
  carouselSlider.style.transform = `translateX(${-curSlide * slideWidth}px)`;
  const thumbSlider = carousel.querySelector('.thumbs');
  if (curSlide > 1) thumbSlider.scrollTo({ left: thumbSlider.querySelector('div').offsetWidth * (curSlide - 1), behavior: 'smooth' });

  syncActiveThumb(carousel, curSlide);
  // sync slide
  [...carouselSlider.children].forEach((slide, index) => {
    if (index === slideIndex) {
      slide.removeAttribute('tabindex');
      slide.setAttribute('aria-hidden', 'false');
    } else {
      slide.setAttribute('tabindex', '-1');
      slide.setAttribute('aria-hidden', 'true');
    }
  });
  curSlide = slideIndex;
}

/**
 * start auto scroll
 */
function startAutoScroll(block) {
  if (!scrollInterval) {
    scrollInterval = setInterval(() => {
      scrollToSlide(block, curSlide < maxSlide ? curSlide + 1 : 0);
    }, scrollDuration);
  }
}

/**
 * stop auto scroll
 */
function stopAutoScroll() {
  clearInterval(scrollInterval);
  scrollInterval = undefined;
}

/**
 * Scrolls the element to the nearest block based on the scroll direction.
 *
 * @param {HTMLElement} el - The element to be scrolled.
 * @param {number} [dir=1] - The scroll direction. Positive value for right, negative value for left.
 */
function snapScroll(el, dir = 1) {
  if (!el) {
    return;
  }
  let threshold = el.offsetWidth * 0.5;
  if (dir >= 0) {
    threshold -= (threshold * 0.5);
  } else {
    threshold += (threshold * 0.5);
  }
  const block = Math.floor(el.scrollLeft / el.offsetWidth);
  const pos = el.scrollLeft - (el.offsetWidth * block);
  const snapToBlock = pos <= threshold ? block : block + 1;
  const carousel = el.closest('.carousel-slider');
  scrollToSlide(carousel, snapToBlock);
}

/**
 * Builds a navigation arrow element for the carousel slider.
 *
 * @param {string} dir - The direction of the arrow ('prev' or 'next').
 * @returns {HTMLElement} - The navigation arrow element.
 */
function buildNav(dir) {
  const arrow = div({
    class: `btn-${dir}`,
    'aria-label': dir === 'prev' ? 'Previous Image' : 'Next Image',
    role: 'button',
    tabindex: dir === 'prev' ? '0' : '-1',
  });
  arrow.addEventListener('click', (e) => {
    let nextSlide = 0;
    if (dir === 'prev') {
      nextSlide = curSlide === 0 ? maxSlide : curSlide - 1;
    } else {
      nextSlide = curSlide === maxSlide ? 0 : curSlide + 1;
    }
    const carousel = e.target.closest('.carousel-slider');
    scrollToSlide(carousel, nextSlide);
  });
  return arrow;
}

/**
 * Builds the thumbnail elements for the carousel slider.
 *
 * @param {Array} slides - An array of slide objects.
 * @returns {HTMLElement} - The thumbnails container element.
 */
function buildThumbnails(slides = []) {
  const thumbnails = div({ class: 'thumbs', role: 'tablist', style: `width: ${Math.round(window.innerWidth * 0.9)}px` });
  slides.forEach((slide, index) => {
    const thumb = div({
      role: 'presentation',
      class: index === 0 ? 'active' : '',
    });
    const btn = button({
      type: 'button',
      role: 'tab',
      'aria-controls': `${SLIDE_ID_PREFIX}${index}`,
      'aria-selected': index === 0 ? 'true' : 'false',
      tabindex: index === 0 ? '0' : '-1',
      'aria-label': 'View Enlarged Image',
      style: `background-image: url(${slide.mediaUrl})`,
    });
    thumb.append(btn);
    btn.addEventListener('click', (e) => {
      curSlide = index;
      const carousel = e.target.closest('.carousel-slider');
      scrollToSlide(carousel, curSlide);
    });
    thumbnails.append(thumb);
  });
  return thumbnails;
}

/**
 * Decorate a base slide element.
 *
 * @param item A base block slide element
 * @param index The slide's position
 * @return {HTMLUListElement} A decorated carousel slide element
 */
function buildSlide(item, index) {
  const slide = div({
    class: 'slide',
    id: `${SLIDE_ID_PREFIX}${index}`,
    'data-slide-index': index,
    role: 'tabpanel',
    'aria-hidden': index === 0 ? 'false' : 'true',
    'aria-describedby': `${SLIDE_CONTROL_ID_PREFIX}${index}`,
    tabindex: index === 0 ? '0' : '-1',
    style: `width: ${Math.round(window.innerWidth * 0.9)}px`,
  },
  img({ src: item.mediaUrl }),
  div({ class: 'new-listing' }, 'New Listing'),
  );
  return slide;
}

/**
 * Decorate and transform a carousel block.
 *
 * @param block HTML block from Franklin
 */
export default async function decorate(block) {
  const propId = '370882966';

  window.propertyData = await getPropertyByPropId(propId);
  block.innerHTML = '';

  const carousel = document.createElement('div');

  carousel.classList.add('slide-container');

  // if block contains class auto-scroll add scroll functionality and get interval
  const blockClasses = block.className.split(' ');
  const autoScrollClass = blockClasses.find((className) => className.startsWith('auto-scroll-'));

  if (autoScrollClass) {
    autoScroll = true;
    // get scroll duration
    // eslint-disable-next-line prefer-destructuring
    scrollDuration = autoScrollClass.match(/\d+/)[0];
  }

  // make carousel draggable
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let prevScroll = 0;

  carousel.addEventListener('mouseenter', () => {
    if (autoScroll) stopAutoScroll();
  });

  carousel.addEventListener('mouseleave', () => {
    if (isDown) {
      snapScroll(carousel, carousel.scrollLeft > startScroll ? 1 : -1);
    }
    if (autoScroll) startAutoScroll(block);
    isDown = false;
  });

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    startScroll = carousel.scrollLeft;
    prevScroll = startScroll;
  });

  carousel.addEventListener('mouseup', () => {
    if (isDown) {
      snapScroll(carousel, carousel.scrollLeft > startScroll ? 1 : -1);
    }
    isDown = false;
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX);
    carousel.scrollLeft = prevScroll - walk;
  });

  // process each slide
  const slides = [...window.propertyData.propertyDetails.smallPhotos];
  maxSlide = slides.length - 1;
  slides.forEach((slide, index) => {
    carousel.appendChild(buildSlide(slide, index));
  });

  block.append(carousel);

  // add nav buttons and thumbs to block
  if (slides.length > 1) {
    const prevBtn = buildNav('prev');
    const nextBtn = buildNav('next');
    const btns = div({ class: 'btns', style: `width: ${Math.round(window.innerWidth * 0.9)}px` }, prevBtn, nextBtn);
    const thumbs = buildThumbnails(slides);
    block.append(btns, thumbs);
    syncActiveThumb(block, 0);
  }

  // autoscroll functionality
  if (autoScroll) {
    // auto scroll when visible
    const intersectionOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const handleAutoScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoScroll(block);
        } else {
          stopAutoScroll();
        }
      });
    };

    const carouselObserver = new IntersectionObserver(handleAutoScroll, intersectionOptions);
    carouselObserver.observe(block);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoScroll();
      } else {
        startAutoScroll(block);
      }
    });
  }
}
