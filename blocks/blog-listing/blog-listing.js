const DEFAULT_SCROLL_INTERVAL_MS = 6000;
let blogCategory = false;
let numCarouselItems;
let numBlogItems;
let offset = 0;
const host = 'https://www.commonmoves.com';
const event = new Event('startAutoScroll');
let scrollInterval;
async function getData(category, offset, count) {
  const url = buildApiPath(category, offset, count)
  const resp = await fetch(url, {
    headers: {
      accept: '*/*',
    },
    referrerPolicy: 'no-referrer',
    body: null,
    method: 'GET',
  });
   return resp.json();
}
function getCurrentSlideIndex(block) {
  return [...block.querySelectorAll('.carousel-list .blog-item')].findIndex(
      (child) => child.getAttribute('active') === 'true',
  );
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

function switchSlide(nextIndex, block) {
  // const key = getBlockId(block);
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
 * Stop auto-scroll animation
 *
 * @param {Element} block
 */
function stopAutoScroll(block) {
  clearInterval(scrollInterval);
  scrollInterval= undefined;
}
function getBlogCategory() {
  if (!blogCategory) {
    blogCategory = window.location.pathname.split('/').filter(Boolean)[1] ?? '';
  }
  return blogCategory;
}

function getBackgroundColor() {
  //add logic to set it per category list
  return 'var(--beige)'
}
function buildApiPath(blogCategory, offset, count) {
  let url = `https://www.commonmoves.com/content/bhhs-franchisee/ma312/en/us/blog/blog-category/jcr:content/root/blog_category.blogCategory.category_${blogCategory}.offset_${offset}.count_${count}.json`
  if (blogCategory === '') {
    url = `https://www.commonmoves.com/content/bhhs-franchisee/ma312/en/us/blog/jcr:content/root/blog_home.blogs.offset_${offset}.count_${count}.json`
  }
  return url;


}
function trimDescription(description) {
  const length = 141;
  return description.substring(0, length)+ '...';
}

function buildImageUrl(path) {
  return host + path
}

function buildBlogList(block, data) {
  const {category, description, image, link, mobileImage, tabletImage, title} = data;
  const blogContainer = document.createElement('div');
  blogContainer.classList.add('blog-item');
  blogContainer.innerHTML = `
    <div>
        <picture>
            <source media="(max-width:767px)" srcset="${buildImageUrl(mobileImage)}">
            <source media="(min-width:768px) and (max-width:1279px)" srcset="${buildImageUrl(tabletImage)}">
            <img data-src="${buildImageUrl(image)}" src="${buildImageUrl(image)}" class="image" aria-label="${title}">
        </picture>
    </div>
    <div class="blog-content">
        <p class="blog-category">${category}</p>
         <p role="heading" class="title">${title}</p>
        <div class="description">${trimDescription(description)}</div> 
        <a href="${link}" target="_blank" class="readmore">read more
      <img src="/icons/arrow-back.svg"  aria-hidden="true" alt="read-more-icon #1" class="arrowIcon"></a>
     </div>
    `;
  block.append(blogContainer);
}

export default async function decorate(block) {

//todo move here auto blocking for nav
  //todo fix carousel in a large screen flex-basics: 50%
  //todo fix alignment for block list
  //todo add logic for load more button


  //get config values
  [...block.children].forEach((child) => {
    if (child.textContent.includes('Carousel Items')) {
      numCarouselItems = parseInt(child.lastElementChild.textContent);
    } else if (child.textContent.includes('List Items')) {
      numBlogItems = parseInt(child.lastElementChild.textContent);
    }
    //clean up block
    block.removeChild(child);
  });
  if (numCarouselItems > numBlogItems) {
    console.error('number of carousel items should be less or equal to number of blogs in the list');
    return;
  }
  //build grid and carousel containers
  const carouselContainer = document.createElement('div');
  const blogsGridContainer = document.createElement('div');
  const carouselButtons = document.createElement('div');
  carouselContainer.classList.add('carousel-list');
  carouselContainer.innerHTML = `<div class="container"/>`
  carouselContainer.querySelector('.container').style.backgroundColor = getBackgroundColor();
  blogsGridContainer.classList.add('blogs-grid-list');
  carouselButtons.classList.add('owl-dots');
  //get blog items
  const {articles} = await getData(getBlogCategory(), offset, numBlogItems) ?? [];
  // const
  articles.forEach((blog, index) => {
    if (index < numCarouselItems) {
      const buttonElement = document.createElement('button');
      buildBlogList(carouselContainer.querySelector('.container'), blog);
      buttonElement.classList.add('owl-dot');
      buttonElement.ariaLabel = `carousel-slide-${index}`
      buttonElement.innerHTML = `<span/>`;
      buttonElement.addEventListener('click', () => {
        switchSlide((index) % numCarouselItems, block);
        stopAutoScroll(block);
      });
      carouselButtons.appendChild(buttonElement);
    }
    buildBlogList(blogsGridContainer, blog)
  });
  carouselButtons.querySelectorAll('.owl-dot')[0].classList.add('active');
  carouselContainer.append(carouselButtons);
  carouselContainer.querySelector('.container').children[0].setAttribute('active', true);
  //add logic for load more button
  block.append(carouselContainer, blogsGridContainer);
  //todo add logic to switch items on click
  block.addEventListener('startAutoScroll', () => {
    startAutoScroll(block);
  });
  block.dispatchEvent(event);

}
