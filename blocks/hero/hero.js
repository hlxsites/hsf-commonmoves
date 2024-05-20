import {
  preloadHeroImage,
} from '../../scripts/scripts.js';
import buildSearch from './search/search.js';

const decorateVideo = (link) => {
  const { parentElement } = link;
  const video = document.createElement('video');
  video.classList.add('hero-video');
  video.loop = true;
  const source = document.createElement('source');
  source.src = link.href;
  source.type = 'video/mp4';
  video.appendChild(source);
  parentElement.appendChild(video);
  link.remove();
  video.muted = true;
  video.play();
};

async function getPictures(block) {
  let pictures = block.querySelectorAll('picture');
  if (!pictures.length) {
    const link = block.querySelector('a');
    if (link) {
      const resp = await fetch(`${link.href}.plain.html`);
      if (resp.ok) {
        const html = await resp.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        pictures = tmp.querySelectorAll('picture');
      }
    }
  }
  pictures.forEach((picture) => {
    picture.querySelector('img').setAttribute('loading', 'eager');
  });
  return pictures;
}

function rotateImage(images) {
  const active = images.querySelector('picture.active');
  const next = active.nextElementSibling ? active.nextElementSibling : images.querySelector('picture');
  active.classList.remove('active');
  next.classList.add('active');
}

export default async function decorate(block) {
  // check if it has a video
  const video = block.querySelector('a[href*=".mp4"]');
  const videoWrapper = video && video.closest('div');
  videoWrapper.classList.add('video-wrapper');
  const videoLink = videoWrapper?.firstElementChild;
  // transform link into a video tag
  if (videoLink) {
    setTimeout(() => {
      decorateVideo(videoLink);
    }, 3000);
  }

  const pictures = await getPictures(block);
  preloadHeroImage(pictures[0]);
  pictures[0].classList.add('active');
  const images = document.createElement('div');
  images.classList.add('images');
  images.append(...pictures);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('content');
  const content = block.querySelector('h1, h2')?.parentElement;
  if (content) {
    contentWrapper.append(...content.childNodes);
    block.classList.add('has-content');
  }

  const options = block.querySelector('ul');
  if (options) {
    const types = Object.values(options.querySelectorAll('li')).map((opt) => opt.textContent);
    const search = await buildSearch(types);
    if (search) {
      contentWrapper.append(search);
    }
  }

  const headline = block.querySelectorAll('div.hero > div > div');
  const validInnerHtml = new Set(['headline', 'description', 'cta']);
  const filteredList = Array.from(headline)
    .filter((node) => validInnerHtml.has(node.innerHTML.trim().toLowerCase()));

  const headlineWrapper = document.createElement('div');
  if (filteredList.length) {
    headlineWrapper.classList.add('headline');
    filteredList.forEach((div) => {
      const nextElement = div.nextElementSibling;
      if (div.innerHTML.toLowerCase() === 'headline') nextElement.classList.add('title');
      else if (div.innerHTML.toLowerCase() === 'description') nextElement.classList.add('desc');
      else if (div.innerHTML.toLowerCase() === 'cta') {
        const button = document.createElement('p');
        button.innerHTML = nextElement.innerHTML;
        button.classList.add('button-container');
        div.parentNode.replaceChild(button, nextElement);
      }
      headlineWrapper.append(nextElement);
    });
  }

  const wrapper = document.createElement('div');
  wrapper.append(images);
  if (videoWrapper) wrapper.append(videoWrapper);
  // don't add contentWrapper if it's empty
  if (contentWrapper.innerHTML !== '') wrapper.append(contentWrapper);
  if (headlineWrapper.hasChildNodes()) {
    wrapper.classList.add('row');
    wrapper.append(headlineWrapper);
  }
  block.replaceChildren(wrapper);

  if (pictures.length > 1) {
    window.setInterval(() => rotateImage(images), 4000);
  }
}
