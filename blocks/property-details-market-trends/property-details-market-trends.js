import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';
import { getPropertyListing } from './../property-details/api.js';
const propID = '347543300';

const marketTrendsAPI = 'https://www.commonmoves.com/bin/bhhs/CregMarketTrends?PropertyId=347543300&Latitude=41.96909713745117&Longitude=-71.22725677490234&zipCode=02766';

function createInnerHTML(data, property) {
  return `
    <div class="cmp-property-details-market-trends__table active">
      <div class="property-container">
        <div class="property-row">
          <div class="col col-12 col-md-10 offset-md-1">
            <table>
              <thead>
                <tr>
                  <th><span class="pr-2">${property.StreetName}</span></th>
                  <th>ZIP Code: ${property.PostalCode}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="data">
                      <div class="label">List Price</div>
                      <div class="value">
                        <div class="currency md-length">${property.ListPriceUS}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="data">
                      <div class="label">Median List Price</div>
                      <div class="value">
                        <div class="currency">${data.total.medianListPrice.replace(" USD", "")}</div>
                      </div>
                    </div>
                    <div class="chart">
                      <div class="mini-chart">
                        <canvas id="medianlistprice-line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                      </div>
                      <div class="micro-trend up">16%</div>
                      <div class="arrow">
                        <span class="icon icon-expand_arrow"></span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="data">
                      <div class="label">Sale Price</div>
                      <div class="value">
                        <div class="currency">${data.listingInfo.salePrice}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="data">
                      <div class="label">Median Sold Price</div>
                      <div class="value">
                        <div class="currency">${data.total.medianSalesPrice.replace(" USD", "")}</div>
                      </div>
                    </div>
                    <div class="chart">
                      <div class="mini-chart">
                        <canvas id="line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                      </div>
                      <div class="micro-trend down">-55%</div>
                      <div class="arrow">
                        <span class="icon icon-expand_arrow"></span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="data">
                      <div class="label">price/Sqft</div>
                      <div class="value">
                        <div class="currency">$1,500</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="data">
                      <div class="label">Avg Price/Sqft</div>
                      <div class="value">
                        <div class="currency">${data.total.avgPriceArea.replace(" USD", "")}</div>
                      </div>
                    </div>
                    <div class="chart">
                      <div class="mini-chart">
                        <canvas id="line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                      </div>
                      <div class="micro-trend up">1%</div>
                      <div class="arrow">
                        <span class="icon icon-expand_arrow"></span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="data">
                      <div class="label">Days on Market</div>
                      <div class="value">51</div>
                    </div>
                  </td>
                  <td>
                    <div class="data">
                      <div class="label">Avg Days on Market</div>
                      <div class="value">${data.total.avgDaysOnMarket}</div>
                    </div>
                    <div class="chart">
                      <div class="mini-chart">
                        <canvas id="line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                      </div>
                      <div class="micro-trend down">-13%</div>
                      <div class="arrow">
                        <span class="icon icon-expand_arrow"></span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Homes for Sale</th>
                  <th>Homes Sold</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="data">
                      <div class="value">${data.total.homesForSale}</div>
                    </div>
                    <div class="chart">
                      <div class="mini-chart">
                        <canvas id="line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                      </div>
                      <div class="micro-trend up">20%</div>
                      <div class="arrow">
                        <span class="icon icon-expand_arrow"></span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="data">
                      <div class="value">${data.total.homesSold}</div>
                    </div>
                    <div class="chart">
                      <div class="mini-chart">
                        <canvas id="line-chart" width="300" height="190"
                          style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                      </div>
                      <div class="micro-trend up">67%</div>
                      <div class="arrow">
                        <span class="icon icon-expand_arrow"></span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
export default async function decorate(block) {
  const resp = await fetch(marketTrendsAPI);
  if (resp.ok) {
    const data = await resp.json();
    var property = await getPropertyListing(propID);
    console.log(property);
    var innerHTML = createInnerHTML(data, property);
    var accordionItem = createAccordionItem('market-trends', 'Market Trends', innerHTML);
    block.append(accordionItem);
    decorateIcons(block);
    loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details-table.css`);

    var scriptSrc = document.createElement('script');
    scriptSrc.type = 'module';
    scriptSrc.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.3.0/chart.umd.js';
    document.head.append(scriptSrc);

    const script = document.createElement('script');
    script.type = 'text/partytown';
    script.innerHTML = `
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '${window.hlx.codeBasePath}/blocks/property-details-market-trends/load-chart.js';
      document.head.append(script);
    `;
    document.body.append(script);
  }
}