import { LIVEBY_API } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/aem.js';

const dollarFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const percFormatter = new Intl.NumberFormat('en-US', { style: 'percent' });

export default async function decorate(block) {
  if (window.liveby && window.liveby.communityId) {
    // Fetch the census data.
    const resp = await fetch(`${LIVEBY_API}/pages/census?boundaryId=${window.liveby.communityId}`);

    if (resp.ok) {
      const data = await resp.json();
      const div = document.createElement('div');
      div.innerHTML = `
      <div class="census-item">
        <div class="icon-bubble"><span class="icon icon-users"></span></div>
        <span class="census-value">${data.medianAge}</span>
        <span class="census-name">Median Age</span>
      </div>
      <div class="census-item">
        <div class="icon-bubble"><span class="icon icon-house"></span></div>
        <span class="census-value">${dollarFormatter.format(data.medianHouseholdIncome)}</span>
        <span class="census-name">Median Household Income</span>
      </div>
      <div class="census-item">
        <div class="icon-bubble"><span class="icon icon-graduation_cap"></span></div>
        <span class="census-value">${percFormatter.format(data.collegeEducated)}</span>
        <span class="census-name">College Educated</span>
      </div>
      <div class="census-item">
        <div class="icon-bubble"><span class="icon icon-family"></span></div>
        <span class="census-value">${percFormatter.format(data.percentHouseholdsWithChildren)}</span>
        <span class="census-name">Households with Children</span>
      </div>
    `;

      decorateIcons(div);
      block.replaceChildren(div);
    }
  }
}
