const apiBasePath = 'https://www.bhhs.com'

/**
 * Returns background color by block category name
 *
 * @param {string} category
 * @returns {string}
 */
export function getBackgroundColor(category) {
  let color;
  switch (category) {
    case 'Buyer Advice':
      color = 'var(--grey-background)';
      break;
    case 'Seller Advice':
      color = 'var(--beige)';
      break;
    case 'Home Improvement':
      color = 'var(--yellowbeige)';
      break;
    case 'Finance':
      color = 'var(--rose)';
      break;
    case 'Lifestyle':
      color = 'var(--mint)';
      break;
    case 'General':
      color = 'var(--lightrose)';
      break;
    default:
      color = 'var(--primary-color)';
  }
  return color;
}

function getBlogDetailsPath() {
  const url = window.location.pathname;
  const startIndex = url.indexOf("/blog/blog-detail/") + "/blog/blog-detail/".length;
  return  url.substring(startIndex);
}

function buildApiPath() {
  return `${apiBasePath}/blog/blog-detail/jcr:content/${getBlogDetailsPath()}.json`;
}

function buildImageUrl(path) {
  return `${apiBasePath}${path}`;
}

/**
 * Returns background color by block category name
 *
 * @param {string} category
 * @returns {string}
 */
function buildCategoryUrl(category) {
  const host = window.location.origin;
  let path = '/blog/';
  switch (category) {
    case 'Buyer Advice':
      path += 'buyer-advice/';
      break;
    case 'Seller Advice':
      path += 'seller-advice/';
      break;
    case 'Home Improvement':
      path += 'home-improvement/';
      break;
    case 'Finance':
      path += 'finance/';
      break;
    case 'Lifestyle':
      path += 'lifestyle/';
      break;
    case 'General':
      path += 'general/';
      break;
  }
  return host + path;
}

async function getData() {
  const url = buildApiPath();
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
  }
  return data;
}

function prepareLink(path) {
  return path.replace(/\.html$/, '');;
}

export default async function decorate(block) {
  // auto blocking
  const { title, description, image, mobileImage, tabletImage, publisheddate, category, previousarticle, previousarticlelink, relatedarticles } = await getData();
  //buildBlogNavigation(buildCategoryUrl(category));
  const blogNav = document.querySelector('.blog-nav');
  blogNav.style.backgroundColor = getBackgroundColor(category);
  blogNav.style.color = 'var(--primary-color)';
  blogNav.style.setProperty('--border-color', 'var(--primary-color)')
  block.innerHTML = `
    <div class="title-section">
        <p id="main-title" role="heading" aria-level="1" class="title">${title}</p>
    </div>
    <div class="content">
        <div class="left-section">
            <div class="image">
                <picture>
                    <source media="(max-width:900px)" srcset=${buildImageUrl(mobileImage)}>
                    <source media="(min-width:901px) and (max-width:1200px)" srcset=${buildImageUrl(tabletImage)}>
                    <img src=${buildImageUrl(image)} alt="article image">
                </picture>
            </div>
            <div class="description">
                ${description}
            </div>
        </div>
        <div class="right-section">
            <button type="button" class="share-page">
                <img src="/icons/ico-share.svg" alt="share-icon">
                <span class="share-this-page text-up">Share This Page</span></button>
            <div>
                <span>Published:</span>
                <span>${new Date(publisheddate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div>
                <span>Category:</span>
                <span><a href=${buildCategoryUrl(category)}>${category}</a></span>
            </div>
            <div class="related-articles">
                <p class="text-up">Related Articles:</p>
                <div>
                    <ul>${relatedarticles}</ul>
                </div>
            </div>
        </div>
        <div class="article-share-page">
            <div class="close-icon">✖</div>
            <div class="container">
                <h3>Share This Page</h3>
                <p class="article-share-page__description">Share this page on your social media platforms.</p>
                <ul class="article-share-page-icons">
                    <li class="araticle-share-page__item article-share-page__item--twitter">
                        <a href="https://twitter.com/share?text=${title}&amp;url=${window.location.href}"
                           data-text=${title}
                           data-url="${window.location.href}"
                           data-lang="en" data-show-count="false" target="_blank"
                           aria-label="twitter-icon" class=" twitter"></a>
                    </li>
                    <li data-href="${window.location.href}"
                        data-layout="button_count" data-size="small" data-keyboard="false" data-backdrop="static"
                        class="article-share-page__item article-share-page__item--facebook">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}"
                           target="_blank" aria-label="facebook-icon" class="facebook"></a>
                    </li>
                    <li class="article-share-page__item article-share-page__item--linkedin">
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}"
                           rel="noopener" target="_blank" aria-label="linkedin-icon" class="linkedin"></a>
                    </li>
                </ul>
                <button class="button secondary close-button">
                    <span class="text-up">cancel</span></button>
            </div>
        </div>
    </div>
    <div class="next-article">
            <img src="/icons/preview-arrow.svg" alt="previous-article">
            <a href=${prepareLink(previousarticlelink)}
               aria-label="previous-article-${previousarticle}"
               class="text-up">${previousarticle}</a>
    </div>
 `;
  const shareBlogContainer = block.querySelector('.article-share-page');

  block.querySelector('.share-page').addEventListener('click', () => {
    shareBlogContainer.style.visibility = 'visible';
    shareBlogContainer.classList.add('slide');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  block.querySelector('.close-icon').addEventListener('click', () => {
    shareBlogContainer.style.visibility = 'hidden';
  });

  block.querySelector('.close-button').addEventListener('click', () => {
    shareBlogContainer.style.visibility = 'hidden';
  })

}


// todo:
//articles logic
//     - franklin set up;
//   - change logic in blog listing
//   - details page mock up;
//   - update background details by styles;
