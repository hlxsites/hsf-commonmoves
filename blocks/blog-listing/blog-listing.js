const DEFAULT_SCROLL_INTERVAL_MS = 6000;
const DEFAULT_DESCRIPTION_LENGTH = 141;
let blogCategory = false;
let numCarouselItems;
let numBlogItems;
const loadMoreCount = 6;
let loadOffset = 0;
const apiBasePath = 'https://www.bhhs.com';
const event = new Event('startAutoScroll');
let scrollInterval;

/**
 * Returns background color by block category name
 *
 * @param {string} category
 * @returns {string}
 */
export function getBackgroundColor(category) {
  const colorString = category ? category.toLocaleLowerCase().replace(/\s+/g, '-') : 'primary-color';
  return `var(--${colorString})`;
}

function buildApiPath(category, offset, count) {
  let url = `${apiBasePath}/content/bhhs-franchisee/ma312/en/us/blog/blog-category/jcr:content/root/blog_category.blogCategory.category_${blogCategory}.offset_${offset}.count_${count}.json`;
  if (category === '') {
    url = `${apiBasePath}/content/bhhs-franchisee/ma312/en/us/blog/jcr:content/root/blog_home.blogs.offset_${offset}.count_${count}.json`;
  }
  return url;
}

async function getData(category, dataKey, offset, count) {
  const url = buildApiPath(category, offset, count);
  const resp = await fetch(url, {
    headers: {
      accept: '*/*',
    },
    referrerPolicy: 'no-referrer',
    body: null,
    method: 'GET',
  });
  let data = [];
  if (resp.ok) {
    data = await resp.json();
    data = data[dataKey];
    loadOffset += count;
  }
  return data;
}

function trimDescription(description) {
  const trimedDescription = description.replace(/(<([^>]+)>)/ig, '');
  return `${trimedDescription.substring(0, DEFAULT_DESCRIPTION_LENGTH)}...`;
}

function buildImageUrl(path) {
  return `${apiBasePath}${path}`;
}

function prepareBlogArticleUrl(link) {
  return link.replace(/\.html$/, '');
}

function buildBlogList(block, data, setBackgroundColor = false) {
  const {
    category, description, image, link, mobileImage, tabletImage, title,
  } = data;
  const blogContainer = document.createElement('div');
  // @todo can we change variable name(????)
  blogContainer.style.backgroundColor = setBackgroundColor ? getBackgroundColor(category) : 'inherit';
  blogContainer.classList.add('blog-item');
  blogContainer.innerHTML = `
    <div class="image-content">
        <picture>
            <source media="(max-width:767px)" srcset="${buildImageUrl(mobileImage)}">
            <source media="(min-width:768px) and (max-width:1279px)" srcset="${buildImageUrl(tabletImage)}">
            <img data-src="${buildImageUrl(image)}" src="${buildImageUrl(image)}" class="image" aria-label="${title}">
        </picture>
    </div>
    <div class="blog-content">
        <p class="blog-category text-up">${category}</p>
         <p class="title">${title}</p>
        <div class="description"><p>${trimDescription(description)}</p></div> 
        <a href="${prepareBlogArticleUrl(link)}" target="_blank" class="readmore text-up">read more
      <img src="/icons/arrow-back.svg"  aria-hidden="true" alt="read-more-icon #1" class="arrowIcon"></a>
     </div>
    `;
  block.append(blogContainer);
}

function getBlogCategory() {
  if (!blogCategory) {
    blogCategory = window.location.pathname.split('/').filter(Boolean)[1] ?? '';
  }
  return blogCategory;
}

function buildSeeMoreContentButton(block, dataKey) {
  const buttonContainer = document.createElement('button');
  const blogsGridContainer = block.querySelector('.blogs-grid-list');
  buttonContainer.classList.add('see-more-content', 'text-up');
  buttonContainer.innerHTML = `
  <span class="text">see more content</span>
  `;
  buttonContainer.addEventListener('click', async () => {
    buttonContainer.disabled = true;
    const articles = await getData(getBlogCategory(), dataKey, loadOffset, loadMoreCount);
    if (articles.length > 0 && articles.length === loadMoreCount) {
      articles.forEach((blog) => {
        buildBlogList(blogsGridContainer, blog);
      });
      buttonContainer.disabled = false;
    } else if (articles.length < loadMoreCount) {
      articles.forEach((blog) => {
        buildBlogList(blogsGridContainer, blog);
      });
      buttonContainer.remove();
    } else {
      buttonContainer.remove();
    }
    buttonContainer.disabled = false;
  });
  block.append(buttonContainer);
}

function getCurrentSlideIndex(block) {
  return [...block.querySelectorAll('.carousel-list .blog-item')].findIndex(
    (child) => child.getAttribute('active') === 'true',
  );
}

function switchSlide(nextIndex, block) {
  const slidesContainer = block.querySelector('.carousel-list .container');
  const slidesButtons = block.querySelector('.carousel-list .owl-dots');
  const currentIndex = getCurrentSlideIndex(slidesContainer);
  slidesContainer.children[currentIndex].removeAttribute('active');
  slidesContainer.children[nextIndex].setAttribute('active', true);
  slidesButtons.children[currentIndex].classList.remove('active');
  slidesButtons.children[nextIndex].classList.add('active');
  slidesContainer.style.transform = `translateX(-${nextIndex * 100}%)`;
}

/**
 * Start auto scroll
 *
 * @param {Element} block
 * @param {number} interval
 */
function startAutoScroll(block, interval = DEFAULT_SCROLL_INTERVAL_MS) {
  scrollInterval = setInterval(() => {
    const currentIndex = getCurrentSlideIndex(block);
    switchSlide((currentIndex + 1) % numCarouselItems, block);
  }, interval);
}

/**
 * Stop auto-scroll animation
 *
 */
function stopAutoScroll() {
  clearInterval(scrollInterval);
  scrollInterval = undefined;
}

export default async function decorate(block) {
  // get config values
  [...block.children].forEach((child) => {
    if (child.textContent.includes('Carousel Items')) {
      numCarouselItems = parseInt(child.lastElementChild.textContent, 10);
    } else if (child.textContent.includes('List Items')) {
      numBlogItems = parseInt(child.lastElementChild.textContent, 10);
    }
    // clean up block
    block.removeChild(child);
  });
  if (numCarouselItems > numBlogItems) {
    // eslint-disable-next-line no-console
    console.error('number of carousel items should be less or equal to number of blogs in the list');
    return;
  }
  // build grid and carousel containers
  const carouselContainer = document.createElement('div');
  const blogsGridContainer = document.createElement('div');
  const carouselButtons = document.createElement('div');
  let dataKey = 'articles';
  carouselContainer.classList.add('carousel-list');
  carouselContainer.innerHTML = '<div class="container"/>';
  blogsGridContainer.classList.add('blogs-grid-list');
  carouselButtons.classList.add('owl-dots');
  // get blog items
  if (getBlogCategory() === '') {
    dataKey = 'gridList';
  }
  const articles = await getData(getBlogCategory(), dataKey, loadOffset, numBlogItems);
  articles.forEach((blog, index) => {
    if (index < numCarouselItems) {
      const buttonElement = document.createElement('button');
      buildBlogList(carouselContainer.querySelector('.container'), blog, true);
      buttonElement.classList.add('owl-dot');
      buttonElement.ariaLabel = `carousel-slide-${index}`;
      buttonElement.innerHTML = '<span/>';
      // switch carousel items on click
      buttonElement.addEventListener('click', () => {
        switchSlide((index) % numCarouselItems, block);
        stopAutoScroll();
      });
      carouselButtons.appendChild(buttonElement);
    }
    buildBlogList(blogsGridContainer, blog);
  });
  carouselButtons.querySelectorAll('.owl-dot')[0].classList.add('active');
  carouselContainer.append(carouselButtons);
  carouselContainer.querySelector('.container').children[0].setAttribute('active', true);
  // add logic for load more button
  block.append(carouselContainer, blogsGridContainer);

  block.addEventListener('startAutoScroll', () => {
    startAutoScroll(block);
  });
  buildSeeMoreContentButton(block, dataKey);
  block.dispatchEvent(event);
}
