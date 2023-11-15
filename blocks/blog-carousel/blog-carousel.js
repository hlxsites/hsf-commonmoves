import { createOptimizedPicture, readBlockConfig, toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  let sectionContent;
  sectionContent = [...block.children].map((row) => {
    const leftColumn = row.children[0];
    return {
      category: leftColumn.querySelector('h3').textContent,
      title: leftColumn.querySelector('h1').textContent,
      desc: leftColumn.querySelector('p').textContent,
      link: leftColumn.querySelector('a'),
      picture: row.querySelector('picture'),
    };
  });

  block.textContent = '';
  const { goToSlide } = setupSlideControls(block);

  const slideshowButtons = document.createElement('div');
  slideshowButtons.classList.add('slideshow-buttons');

  sectionContent.forEach((section, index) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');
    slide.style.setProperty('--white', `var(--${toClassName(section.category)})`);

    const imageSizes = [
      // desktop
      { media: '(min-width: 600px)', height: '600' },
      // tablet and mobile sizes:
      { media: '(min-width: 400px)', height: '600' },
      { width: '400' },
    ];
    const picture = section.picture || createOptimizedPicture(
      section.image,
      section.title,
      index === 0,
      imageSizes,
    );
    slide.innerHTML = `
      <div class="image">${picture.outerHTML}</div>
      <div class="text">
      <p class="category">${plainText(section.category)}</p>
      <p class="title">${plainText(section.title)}</p>
      <p class="desc">${plainText(section.desc)}</p>
      <a class="link" href='${section.link.href}'>${section.link.textContent}
      <img src="/icons/arrow-back.svg" aria-hidden="true" alt="Read More" width="20" height="12">
      </a>
      </div>`;

    block.append(slide);

    const button = document.createElement('button');
    button.ariaLabel = `go to slide ${section.category}`;
    button.addEventListener('click', () => goToSlide(index));
    slideshowButtons.append(button);

    if (index === 0) {
      slide.classList.add('active');
      button.classList.add('active');
    }
  });

  block.after(slideshowButtons);
}

function setupSlideControls(block) {
  function goToSlide(index) {
    block.querySelector('.slide.active').classList.remove('active');
    [...block.querySelectorAll('.slide')].at(index).classList.add('active');

    block.parentElement.querySelector('.slideshow-buttons .active')?.classList.remove('active');
    [...block.parentElement.querySelectorAll('.slideshow-buttons button')].at(index).classList.add('active');

    // automatically advance slides. Reset timer when user interacts with the slideshow
    autoplaySlides();
  }

  let autoSlideInterval = null;
  function autoplaySlides() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => advanceSlides(+1), 6000);
  }

  function advanceSlides(diff) {
    const allSlides = [...block.querySelectorAll('.slide')];
    const activeSlide = block.querySelector('.slide.active');
    const currentIndex = allSlides.indexOf(activeSlide);

    const newSlideIndex = (allSlides.length + currentIndex + diff) % allSlides.length;
    goToSlide(newSlideIndex);
  }

  /** detect swipe gestures on touch screens to advance slides */
  function gestureStart(event) {
    const touchStartX = event.changedTouches[0].screenX;

    function gestureEnd(endEvent) {
      const touchEndX = endEvent.changedTouches[0].screenX;
      const delta = touchEndX - touchStartX;
      if (delta < -5) {
        advanceSlides(+1);
      } else if (delta > 5) {
        advanceSlides(-1);
      } else {
        // finger not moved enough, do nothing
      }
    }

    block.addEventListener('touchend', gestureEnd, { once: true });
  }

  block.addEventListener('touchstart', gestureStart, { passive: true });

  autoplaySlides();
  return { goToSlide };
}

/**
 * make text safe to use in innerHTML
 * @param text any string
 * @return {string} sanitized html string
 */
function plainText(text) {
  const fragment = document.createElement('div');
  fragment.append(text);
  return fragment.innerHTML;
}
