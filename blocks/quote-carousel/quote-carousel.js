/**
 * Returns block content from the spreadsheet
 *
 * @param {Element} block
 * @returns {Promise<any>}
 */
async function getContent(block) {
  const url = block.querySelector('div > div > div:nth-child(2) > a').href;
  let data = { data: [] };
  try {
    const resp = await fetch(url);
    if (resp.ok) {
      data = resp.json();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load block content', error);
  }
  return data;
}

function getTitle(block) {
  const titleElem = [...block.querySelectorAll('div')]
    .filter((e) => e.innerText.toLowerCase() === 'title');
  return titleElem.length > 0 ? titleElem[0].nextElementSibling.innerText : '';
}

export default async function decorate(block) {
  const blockId = crypto.randomUUID();
  const content = await getContent(block);
  const title = getTitle(block);
  // generate carousel content from loaded data
  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('carousel-content');
  block.setAttribute('id', blockId);
  block.innerHTML = '';
  if (content.data.length > 0) {
    [...content.data].forEach((row) => {
      const rowContent = document.createElement('div');
      if (!row.quote.startsWith('"')) {
        row.quote = `"${row.quote}`;
      }
      if (!row.quote.endsWith('"')) {
        row.quote = `${row.quote}"`;
      }
      rowContent.classList.add('item');
      rowContent.innerHTML = `
                <p class="title">${title}</p>
                <p class="quote">${row.quote}</p>
                <p class="author">${row.author}</p>
                <p class="position">${row.position}</p>
                `;
      rowContent.classList.add('item');
      slidesContainer.appendChild(rowContent);
    });
    slidesContainer.children[0].setAttribute('active', true);

    // generate container for carousel controls
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('controls-container');
    controlsContainer.innerHTML = `
      <div class="pagination">
          <span class="index">1</span>
          &nbsp;of&nbsp;
          <span class="total">${content.total}</span>
      </div>
      <button name="prev" aria-label="Previous" class="control-button" disabled><svg><use xlink:href="/icons/icons.svg#carrot"/></svg></button>
      <button name="next" aria-label="Next" class="control-button"><svg><use xlink:href="/icons/icons.svg#carrot"/></svg></button>
    `;
    block.replaceChildren(slidesContainer, controlsContainer);
    observeCarousel();
  }
}

let alreadyDeferred = false;
function observeCarousel() {
  if (alreadyDeferred) {
    return;
  } else {
    alreadyDeferred = true;
  }
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = `
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '${window.hlx.codeBasePath}/blocks/quote-carousel/quote-carousel-delayed.js';
    document.head.append(script);
  `;
  document.head.append(script);
}
