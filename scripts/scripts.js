import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function isSelectedBlogCategory(block) {
  const catPath = block.querySelector('a').href;
  return catPath === window.location.href;
}
/**
 * Build blog navigation menu
 * @param {Element} main The container element
 */
function buildBlogNavigation(main) {
  const sections = main.querySelectorAll('.blog-listing-container');
  if (sections) {
    sections.forEach((section) => {
      const blogNav = document.createElement('nav');
      const blogNavContent = section.querySelector('.default-content-wrapper');
      const selectedCategoryEl = document.createElement('div');
      let categoryName = 'Blog Categories';
      selectedCategoryEl.classList.add('blog-nav-selected');
      blogNav.classList.add('blog-nav', 'sticky');
      [...blogNavContent.children].forEach((child) => {
        if (child.querySelector('li')) {
          [...child.children].forEach((category) => {
            if (isSelectedBlogCategory(category)) {
              category.querySelector('a').classList.add('selected-cat');
              categoryName = category.textContent;
            }
          });
          selectedCategoryEl.innerHTML = ` ${categoryName} <img src="/icons/dropdown-icon.svg" alt="dropdown-icon" loading="lazy" class="category-dropdown-icon">`;
          blogNav.appendChild(selectedCategoryEl);
        }
        blogNav.appendChild(child);
      });
      section.replaceChild(blogNav, blogNavContent);
      const categoriesList = section.querySelector('ul');

      selectedCategoryEl.addEventListener('click', () => {
        categoriesList.style.visibility = window.getComputedStyle(categoriesList).visibility === 'hidden' ? 'visible' : 'hidden';
      });

      // add logic to stick blog nav header to top of the page
      window.onscroll = () => {
        const sticky = blogNav.offsetTop;
        if (window.pageYOffset > sticky) {
          blogNav.classList.add('sticky');
        } else {
          blogNav.classList.remove('sticky');
        }
      };
    });
  }
}

/**
 * Build Floating image block
 * @param {Element} main The container element
 */
function buildFloatingImages(main) {
  const sections = main.querySelectorAll('.section.image-right .default-content-wrapper, .section.image-left .default-content-wrapper');
  if (sections) {
    sections.forEach((section) => {
      const image = document.createElement('div');
      image.classList.add('image');
      const picture = section.querySelector('picture');
      if (picture) {
        // Remove the <p> tag wrapper;
        const parent = picture.parentElement;
        image.prepend(picture);
        parent.remove();
      }

      const content = section.children;
      const contentContainer = document.createElement('div');
      contentContainer.append(...content);
      const left = document.createElement('div');
      left.classList.add('content');
      left.append(contentContainer);
      section.append(image, left);
    });
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  buildFloatingImages(main);
  buildBlogNavigation(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
