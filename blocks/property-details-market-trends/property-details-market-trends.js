import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';

const marketTrendsAPI = 'https://www.bhhs.com/bin/bhhs/CregMarketTrends?PropertyId=347543300&Latitude=41.96909713745117&Longitude=-71.22725677490234&zipCode=02766';


export default async function decorate(block) {
  const resp = await fetch(marketTrendsAPI);
  if (resp.ok) {
    const data = await resp.json();
    console.log(data);
    var innerHTML = '';
    var accordionItem = createAccordionItem('market-trends', 'Market Trends', innerHTML);
    block.append(accordionItem);
    decorateIcons(block);
    loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details-table.css`);
  }
}