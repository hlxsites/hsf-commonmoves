import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';
import { currencyToNum } from './../property-details-mortgage-calculator/compute-mortgage.js';

import { getPropertyListing } from './../property-details/api.js';
const propID = '343140756';

const marketTrendsAPI = 'https://www.commonmoves.com/bin/bhhs/CregMarketTrends?PropertyId=343140756&Latitude=42.56574249267578&Longitude=-70.76632690429688&zipCode=01944';

function createInnerHTML(data, property) {
  const len = data.detailTrends.length;
  var last = {...data.detailTrends[len - 2]};
  var current = {...data.detailTrends[len - 1]};
  var transformTrend = (obj) => {
    delete obj.startDate;
    delete obj.endDate;
    Object.keys(obj).forEach((item) => {
      obj[item] = currencyToNum(obj[item])
    });
  };
  transformTrend(last);
  transformTrend(current);
  let percentDiff = Object.keys(current).reduce((a, k) => {
    var percent = (current[k] - last[k]) / last[k] * 100;
    a[k] = Number(percent.toFixed(0));
    return a;
}, {});

  return `
    <div class="cmp-property-details-market-trends__wrap pb-content">
      <div id="cmp-property-details-market-trends__table" class="cmp-property-details-market-trends__table">
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
                          ${data.total.medianListPrice.replace(" USD", "")}
                        </div>
                      </div>
                      <div class="chart" id="medianlistprice">
                        <div class="mini-chart">
                          <canvas id="medianlistprice-line-chart" width="300" height="190" class="chartjs-render-monitor"></canvas>
                        </div>
                        <div class="micro-trend ${percentDiff.medianListPrice >= 0 ? 'up' : 'down'}">${percentDiff.medianListPrice}%</div>
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
                          ${data.listingInfo.salePrice ? data.listingInfo.salePrice : '–'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="data">
                        <div class="label">Median Sold Price</div>
                        <div class="value">
                          ${data.total.medianSalesPrice.replace(" USD", "")}
                        </div>
                      </div>
                      <div class="chart" id="mediansoldprice">
                        <div class="mini-chart">
                          <canvas id="mediansoldprice-line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                        </div>
                        <div class="micro-trend ${percentDiff.medianSalesPrice >= 0 ? 'up' : 'down'}">${percentDiff.medianSalesPrice}%</div>
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
                          ${data.total.avgPriceArea.replace(" USD", "")}
                        </div>
                      </div>
                      <div class="chart" id="avgprice">
                        <div class="mini-chart">
                          <canvas id="avgprice-line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                        </div>
                        <div class="micro-trend ${percentDiff.avgPriceArea >= 0 ? 'up' : 'down'}">${percentDiff.avgPriceArea}%</div>
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
                      <div class="chart" id="avgdays">
                        <div class="mini-chart">
                          <canvas id="avgdays-line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                        </div>
                        <div class="micro-trend ${percentDiff.avgDaysOnMarket >= 0 ? 'up' : 'down'}">${percentDiff.avgDaysOnMarket}%</div>
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
                        <div class="label" style="display:none">Homes for Sale</div>
                        <div class="value">${data.total.homesForSale}</div>
                      </div>
                      <div class="chart" id="homesforsale">
                        <div class="mini-chart">
                          <canvas id="homesforsale-line-chart" width="300" height="190" style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                        </div>
                        <div class="micro-trend ${percentDiff.homesForSale >= 0 ? 'up' : 'down'}">${percentDiff.homesForSale}%</div>
                        <div class="arrow">
                          <span class="icon icon-expand_arrow"></span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="data">
                        <div class="label" style="display:none">Homes Sold</div>
                        <div class="value">${data.total.homesSold}</div>
                      </div>
                      <div class="chart" id="homessold">
                        <div class="mini-chart">
                          <canvas id="homessold-line-chart" width="300" height="190"
                            style="display: block; height: 95px; width: 150px;" class="chartjs-render-monitor"></canvas>
                        </div>
                        <div class="micro-trend ${percentDiff.homesSold >= 0 ? 'up' : 'down'}">${percentDiff.homesSold}%</div>
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
      <div id="cmp-property-details-market-trends__detail" class="cmp-property-details-market-trends__detail d-none">
        <div class="property-container">
          <div class="property-row">
            <div class="col col-12 col-md-10 offset-md-1">
              <div class="cmp-property-details-market-trends__detail__title"></div>
              <div class="cmp-property-details-market-trends__detail__value">
              </div>
              <div class="cmp-property-details-market-trends__detail__chart">
                <div class="detail-chart">
                  <canvas id="detail-line-chart" width="2146" height="800" class="chartjs-render-monitor"></canvas>
                </div>
              </div>
              <div class="close">
                <span class="icon icon-close_x"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sourceBy">
      <p>Source: LiveBy</p>
    </div>
  `;
}

export default async function decorate(block) {
  const resp = await fetch(marketTrendsAPI);
  if (resp.ok) {
    const data = await resp.json();
    var property = await getPropertyListing(propID);
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