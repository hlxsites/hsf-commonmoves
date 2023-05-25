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
  getMetadata,
} from './lib-franklin.js';

export const LIVEBY_API = 'https://api.liveby.com/v1/';

export const BREAKPOINTS = {
  small: window.matchMedia('(min-width: 600px)'),
  medium: window.matchMedia('(min-width: 900px)'),
  large: window.matchMedia('(min-width: 1200px)'),
};

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'bhhs-commonmoves'; // add your RUM generation information here

export function preloadHeroImage(picture) {
  const src = [...picture.querySelectorAll('source')]
    .filter((source) => source.getAttribute('type') === 'image/webp')
    .find((source) => {
      const media = source.getAttribute('media');
      return !media || window.matchMedia(media).matches;
    });

  const link = document.createElement('link');
  link.setAttribute('rel', 'preload');
  link.setAttribute('fetchpriority', 'high');
  link.setAttribute('as', 'image');
  link.setAttribute('href', src.getAttribute('srcset'));
  link.setAttribute('type', src.getAttribute('type'));
  document.head.append(link);
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  let block = main.querySelector('.hero');
  if (!block) {
    const h1 = main.querySelector('h1');
    const picture = main.querySelector('picture');
    // eslint-disable-next-line no-bitwise
    if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
      block = buildBlock('hero', [['Images', picture], ['Title', h1]]);
    }
  }

  if (block) {
    const section = document.createElement('div');
    const metadata = document.createElement('div');
    metadata.classList.add('section-metadata');
    metadata.innerHTML = '<div><div>Style</div><div>wide</div></div>';
    section.append(block, metadata);
    main.prepend(section);
  }
}

function buildBlogNav(main) {
  const blogTemplates = ['blog-landing-template', 'blog-detail-template'];
  const template = getMetadata('template');
  if (blogTemplates.includes(template)) {
    const h1 = main.querySelector('div:first-of-type > h1');
    const nav = main.querySelector('div:first-of-type > ul');
    if (h1 && nav && (nav.compareDocumentPosition(h1) && Node.DOCUMENT_POSITION_PRECEDING)) {
      const section = document.createElement('div');
      section.append(buildBlock('blog-menu', { elems: [h1, nav] }));
      main.prepend(section);
    }
  }
}

function buildBlogDetails(main) {
  if (getMetadata('template') === 'blog-detail-template') {
    const section = document.createElement('div');
    section.append(buildBlock('blog-details', { elems: [] }));
    main.append(section);
  }
}

function buildLiveByMetadata(main) {
  const community = getMetadata('liveby-community');
  if (community) {
    const section = document.createElement('div');
    section.append(buildBlock('liveby-metadata', { elems: [] }));
    main.prepend(section);
    main.classList.add('liveby-community');
    loadCSS(`${window.hlx.codeBasePath}/styles/community-styles.css`);

    const attribution = document.createElement('div');
    attribution.append(buildBlock('liveby-attribution', { elems: [] }));
    main.append(attribution);
  }
}

function buildPropertyDetailsMetadata(main) {
  if (getMetadata('template') === 'property-details-template') {
    const section = document.createElement('div');
    section.append(buildBlock('property-details-metadata', { elems: [] }));
    main.prepend(section);
  }
}

/**
 * Build Floating image block
 * @param {Element} main The container element
 */
function buildFloatingImages(main) {
  main.querySelectorAll('.section-metadata').forEach((metadata) => {
    let style;
    [...metadata.querySelectorAll(':scope > div')].every((div) => {
      const match = div.children[1]?.textContent.toLowerCase().trim().match(/(image-(left|right))/);
      if (div.children[0]?.textContent.toLowerCase().trim() === 'style' && match) {
        [, style] = match;
        return false;
      }
      return true;
    });
    if (style) {
      const section = metadata.parentElement;
      const left = [];
      const right = [];
      [...section.children].forEach((child) => {
        const picture = child.querySelector(':scope > picture');
        if (picture) {
          right.push(picture);
          child.remove();
        } else if (!child.classList.contains('section-metadata')) {
          left.push(child);
        }
      });
      const block = buildBlock('floating-images', [[{ elems: left }, { elems: right }]]);
      block.classList.add(style);
      section.prepend(block);
    }
  });
}

function buildSeparator(main) {
  main.querySelectorAll('.section-metadata').forEach((metadata) => {
    [...metadata.querySelectorAll(':scope > div')].every((div) => {
      const match = div.children[1]?.textContent.toLowerCase().trim().match(/separator/);
      if (div.children[0]?.textContent.toLowerCase().trim() === 'style' && match) {
        metadata.parentElement.prepend(buildBlock('separator', [[]]));
        return false;
      }
      return true;
    });
  });
}

/**
 * Build Property Search Block top nav menu
 * @param main
 */
function buildPropertySearchBlock(main) {
  if (getMetadata('template') === 'property-search-template') {
    const section = document.createElement('div');
    section.append(buildBlock('property-search-bar', { elems: [] }));
    main.prepend(section);
  }
}

function buildPropertyDetailNearbyBlock(main) {
  if(getMetadata('template') == 'property-details-template') {
    var forSaleHomes = document.createElement('div');
    forSaleHomes.setAttribute('id', 'nearby-homes');
    forSaleHomes.append(buildBlock('property-listing', 
    [
      ["Title", "Nearby Homes For Sale"],
      ["Listing Type", "For Sale"],
      ["MinPrice", "412450"],
      ["MaxPrice", "1237350"],
      ["PageSize", "8"],
      ["Sort By", "Price"],
      ["Sort Direction", "ASCENDING"],
      ["Lat", "41.96909713745117"],
      ["Lon", "-71.22725677490234"],
      ["Distance", "2"],
      ["Search Type", "Radius"]
    ]));
    const recentlySoldHomes = document.createElement('div');
    recentlySoldHomes.append(buildBlock('property-listing', [
      ["Title", "Recent Sales Nearby"],
      ["Listing Type", "Recently Sold"],
      ["MinPrice", "659920"],
      ["MaxPrice", "989880"],
      ["PageSize", "4"],
      ["Sort By", "Price"],
      ["Sort Direction", "ASCENDING"],
      ["Lat", "41.96909713745117"],
      ["Lon", "-71.22725677490234"],
      ["Distance", "2"],
      ["Search Type", "Radius"]
    ]));
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details-listings.css`);
    main.append(forSaleHomes);
    main.append(recentlySoldHomes);


  }
}
/**
 * Add luxury collection css for page with template
 */
function buildLuxuryTheme() {
  if (document.querySelector('.luxury-collection')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/templates/luxury-collection/styles.css`);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    buildPropertyDetailsMetadata(main);
    buildLiveByMetadata(main);
    buildFloatingImages(main);
    buildSeparator(main);
    buildBlogDetails(main);
    buildBlogNav(main);
    buildPropertySearchBlock(main);
    buildLuxuryTheme();
    buildPropertyDetailNearbyBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
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

function initPartytown() {
  window.partytown = {
    lib: '/scripts/partytown/',
  };
  import('./partytown/partytown.js');
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
  initPartytown();
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
