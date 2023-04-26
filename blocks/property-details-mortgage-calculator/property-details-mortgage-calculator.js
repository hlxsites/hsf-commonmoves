import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';
const propertyAPI = 'https://www.bhhs.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=7497500&MaxPrice=22492500&Latitude=42.56574249267578&Longitude=-70.76632690429688&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';
const propID = '343140756';

function computeMortgage(purchasePrice, interestRate, downpaymentPercent, loanTerm) {
  const downpaymentAmount = (downpaymentPercent / 100) * purchasePrice;
  const principalAmount = purchasePrice - downpaymentAmount;
  const interestPayment = ((interestRate / 100) * principalAmount) / 12;
  const k = (interestRate / 100) / 12;
  const m = Math.pow(1 + k, 12 * loanTerm);
  const monthlyMortgage = principalAmount * k * (m / (m - 1));
  const principalPayment = monthlyMortgage - interestPayment;
  return {
    downpayment: downpaymentAmount,
    interest: interestPayment,
    principal: principalPayment,
    totalPayment: monthlyMortgage
  }
}

function formatCurrency(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

export default async function decorate(block) {
  const resp = await fetch(propertyAPI);
  if (resp.ok) {
    const data = await resp.json();
    const listing = data.properties.find((item) => item.PropId == propID);
    const listPriceUSD = listing.ListPriceUS;
    const listPrice = Number(listPriceUSD.replace(/[^\d.]+/g, ''));
    const defaultInterestRate = 5;
    const defaultDownpaymentPercent = 20;
    const defaultTerm = 30;
    const initialMortgageCalc = computeMortgage(listPrice, defaultInterestRate, defaultDownpaymentPercent, defaultTerm);
    console.log(initialMortgageCalc);
    var calcHTML = `
      <div class="property-container">
        <div class="property-row">
          <div class="col col-12 col-md-10 offset-md-1 col-xl-4">
            <div class="cmp-mtg-calc__intro">
              Estimated Mortgage Payment
            </div>
            <div class="cmp-mtg-calc__summary">
              Your total payment will be
              $${formatCurrency(initialMortgageCalc.totalPayment)}
            </div>
            <figure class="cmp-mtg-calc__chart">
              <div class="property-row align-items-center">
                <div id="doughnutChartContainer" class="col col-7 col-lg-5">
                  <div class="">
                    <div class="chartjs-size-monitor">
                      <div class="chartjs-size-monitor-expand">
                        <div class=""></div>
                      </div>
                      <div class="chartjs-size-monitor-shrink">
                        <div class=""></div>
                      </div>
                    </div><canvas id="doughnut-chart" width="296" height="296"
                      style="display: block; height: 148px; width: 148px;" class="chartjs-render-monitor"></canvas>
                  </div>
                </div>
                <div class="col col-5 col-lg-7">
                  <ol>
                    <li><span class="swatch bg-cabernet "></span> <span class="label">Principal</span> <span
                        class="sr-only">${formatCurrency(initialMortgageCalc.principal)}</span></li>
                    <li><span class="swatch bg-cabernet-50 "></span> <span class="label">Interest</span> <span
                        class="sr-only">${formatCurrency(initialMortgageCalc.interest)}</span></li>
                  </ol>
                </div>
              </div>
            </figure>
          </div>
          <div class="col col-12 col-md-5 offset-md-1 col-xl-2">
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label cmp-mtg-calc__input__label--primary"><label
                  for="purchase_price">Purchase Price</label></div>
              <div class="cmp-mtg-calc__input__slider">
                <div data-content="$" class="input-currency has-input-formatted"><input name="purchase_price_input"
                    type="number" aria-label="Enter Purchase Price in Dollars">
                  <div class="input-formatted">${listPriceUSD}</div>
                </div>
                <div>
                  <div class="vue-slider-component vue-slider-horizontal" style="width: auto; padding: 8px;">
                    <div aria-hidden="true" class="vue-slider" style="height: 6px;">
                      <!---->
                      <div class="vue-slider-none vue-slider-dot"
                        style="width: 16px; height: 16px; top: -5px; transition-duration: 0s; transform: translateX(76px);">
                        <div class="vue-slider-dot-handle"></div>
                        <div class="vue-slider-tooltip-top vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">${listPrice}</span></div>
                      </div>
                      <ul class="vue-slider-piecewise"></ul>
                      <div class="vue-slider-process" style="transition-duration: 0s; width: 83.9944px; left: 0px;">
                        <div class="vue-merged-tooltip vue-slider-tooltip-t vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">

                          </span></div>
                      </div> <input type="range" min="1000" max="29991000" class="vue-slider-sr-only">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label"><label for="down_payment">Down Payment</label> <span
                  class="extra">($3M)</span></div>
              <div class="cmp-mtg-calc__input__slider">
                <div data-content="%" class="input-percent"><input name="down_payment_input" type="number"
                    aria-label="Enter Down Payment in Percentage"></div>
                <div>
                  <div class="vue-slider-component vue-slider-horizontal" style="width: auto; padding: 8px;">
                    <div aria-hidden="true" class="vue-slider" style="height: 6px;">
                      <!---->
                      <div class="vue-slider-none vue-slider-dot"
                        style="width: 16px; height: 16px; top: -5px; transition-duration: 0s; transform: translateX(59px);">
                        <div class="vue-slider-dot-handle"></div>
                        <div class="vue-slider-tooltip-top vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">20</span></div>
                      </div>
                      <ul class="vue-slider-piecewise"></ul>
                      <div class="vue-slider-process" style="transition-duration: 0s; width: 67.2px; left: 0px;">
                        <div class="vue-merged-tooltip vue-slider-tooltip-t vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">
                          </span></div>
                      </div> <input type="range" min="0" max="50" class="vue-slider-sr-only">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-5 col-xl-2">
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label cmp-mtg-calc__input__label--primary"><label
                  for="interest_rate">Interest Rate</label></div>
              <div class="cmp-mtg-calc__input__slider">
                <div data-content="%" class="input-percent has-input-formatted"><input name="interest_rate_input"
                    type="number" aria-label="Enter Interest Rate in Percentage">
                  <div class="input-formatted">5.000</div>
                </div>
                <div>
                  <div class="vue-slider-component vue-slider-horizontal" style="width: auto; padding: 8px;">
                    <div aria-hidden="true" class="vue-slider" style="height: 6px;">
                      <!---->
                      <div class="vue-slider-none vue-slider-dot"
                        style="width: 16px; height: 16px; top: -5px; transition-duration: 0s; transform: translateX(76px);">
                        <div class="vue-slider-dot-handle"></div>
                        <div class="vue-slider-tooltip-top vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">5</span></div>
                      </div>
                      <ul class="vue-slider-piecewise"></ul>
                      <div class="vue-slider-process" style="transition-duration: 0s; width: 84px; left: 0px;">
                        <div class="vue-merged-tooltip vue-slider-tooltip-t vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">
                          </span></div>
                      </div> <input type="range" min="0" max="10" class="vue-slider-sr-only">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label"><label for="loan_term">Term</label> <span class="extra">(Years)</span>
              </div>
              <div class="cmp-mtg-calc__input__slider">
                <div class="input-standard has-input-formatted"><input name="loan_term_input" type="number"
                    aria-label="Enter Loan Term in Years">
                  <div class="input-formatted">30</div>
                </div>
                <div>
                  <div class="vue-slider-component vue-slider-horizontal" style="width: auto; padding: 8px;">
                    <div aria-hidden="true" class="vue-slider" style="height: 6px;">
                      <!---->
                      <div class="vue-slider-none vue-slider-dot"
                        style="width: 16px; height: 16px; top: -5px; transition-duration: 0s; transform: translateX(160px);">
                        <div class="vue-slider-dot-handle"></div>
                        <div class="vue-slider-tooltip-top vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">30</span></div>
                      </div>
                      <ul class="vue-slider-piecewise"></ul>
                      <div class="vue-slider-process" style="transition-duration: 0s; width: 168px; left: 0px;">
                        <div class="vue-merged-tooltip vue-slider-tooltip-t vue-slider-tooltip-wrap"><span
                            class="vue-slider-tooltip">
                          </span></div>
                      </div> <input type="range" min="5" max="30" class="vue-slider-sr-only">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-10 offset-md-1 col-xl-4 offset-xl-6">
            <div class="text-disclaimer text-right">
              Estimate does not reflect Property Tax, PMI or Homeowner Insurance. Mortgage Calculator provided by Berkshire
              Hathaway HomeServices.
            </div>
          </div>
        </div>
      </div>
    `;
    var accordionItem = createAccordionItem('mortgage-calculator', 'Mortgage Calculator', calcHTML);
    block.append(accordionItem);
    decorateIcons(block);
    loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
  }
  
}