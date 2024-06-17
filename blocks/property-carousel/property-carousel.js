import { a, div, img } from '../../scripts/dom-helpers.js';

let slideIndex = 1;
function showSlides(n) {
  const slides = document.getElementsByClassName('slide');
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  slides.forEach((slide) => {
    slide.style.display = 'none';
  });
  slides[slideIndex - 1].style.display = 'block';
}

showSlides(slideIndex);

function moveSlide(n) {
  showSlides(slideIndex += n);
}
// Call showSlides function every 5 seconds
let autoSlide = setInterval(() => {
  moveSlide(1);
}, 5000);

function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Add pause on hover (optional)
document.querySelector('.aem-EdgeCarousel').addEventListener('mouseover', () => {
  clearInterval(autoSlide);
});

document.querySelector('.aem-EdgeCarousel').addEventListener('mouseout', () => {
  autoSlide = setInterval(() => {
    moveSlide(1);
  }, 5000);
});

function builtCarousel(block) {
  const carousel = div({ class: 'carousel' },
    div({ class: 'slide' }),
    a({ class: 'prev', onclick: 'moveSlide(-1)' }, '❮'),
    a({ class: 'next', onclick: 'moveSlide(1)' }, '❯'),
  );

  const thumbs = div({ class: 'carousel-thumbnails' },
    img({ class: 'thumbnail', src: 'path-to-your-image-1.jpg', onclick: 'currentSlide(1)' }),
  );
  block.append(carousel, thumbs);
}

export default function decorate(block) {
  builtCarousel(block);
}
