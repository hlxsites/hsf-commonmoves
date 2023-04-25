import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';

const marketTrendsAPI = 'https://www.bhhs.com/bin/bhhs/CregMarketTrends?PropertyId=343140756&Latitude=42.56574249267578&Longitude=-70.76632690429688&zipCode=01944';


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