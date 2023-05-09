import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { SearchParameters, SearchTypes } from '../../scripts/apis/creg/creg.js';

async function getListings(config) {
  const params = new SearchParameters(SearchTypes.Map);
  params.PageSize = 8;
  params.
}

export default async function decorate(block) {
  const config = readBlockConfig(block);

  const listings = await getListings(config);

  block.innerHTML = `
    <div class="listing-title"><span>${config.title}</span></div>
    <div class="listing-link">
       <p class="button-container"><a href="/search">${config.link}</a></p>
    </div>
    <div class="listing-grid">
    </div>
  `;
}
