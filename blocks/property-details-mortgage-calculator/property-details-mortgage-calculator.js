import { createAccordionItem } from '../../scripts/accordion.js';
import { loadCSS } from '../../scripts/lib-franklin.js';
import { computeMortgage, addCommaSeparators, nFormatter } from './compute-mortgage.js';
const propertyAPI = 'https://www.commonmoves.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=7497500&MaxPrice=22492500&Latitude=42.56574249267578&Longitude=-70.76632690429688&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';
const propID = '343140756';

export default async function decorate(block) {
  const resp = await fetch(propertyAPI);
  if (resp.ok) {
    const data = await resp.json();
    const listing = data.properties.find((item) => item.PropId == propID);
    const listPriceUSD = listing.ListPriceUS;
    const listPrice = listPriceUSD.replace(/[^\d.]+/g, '');
    const maxPurchasePrice = 2 * listPrice + 1000;
    const initialMortgageCalc = computeMortgage(listPrice);
    var calcHTML = `
      <div class="property-container">
        <div class="property-row mortage-calc-body">
          <div class="col col-12 col-md-10 offset-md-1 col-xl-4">
            <div class="cmp-mtg-calc__intro">
              Estimated Mortgage Payment
            </div>
            <div class="cmp-mtg-calc__summary">
              Your total payment will be
              $<span class="mortgage-payment">${addCommaSeparators(initialMortgageCalc.totalPayment.toFixed(0))}</span>
            </div>
            <figure class="cmp-mtg-calc__chart">
              <div class="property-row align-items-center">
                <div id="doughnutChartContainer">
                  <canvas id="doughnut-chart"></canvas>
                </div>
                <div class="col col-5 col-lg-7">
                  <ol>
                    <li><span class="swatch bg-cabernet "></span> <span class="label">Principal</span> <span
                        class="sr-only" id="principal-amount">${initialMortgageCalc.principal.toFixed(0)}</span></li>
                    <li><span class="swatch bg-cabernet-50 "></span> <span class="label">Interest</span> <span
                        class="sr-only" id="interest-amount">${initialMortgageCalc.interest.toFixed(0)}</span></li>
                  </ol>
                </div>
              </div>
            </figure>
          </div>
          <div class="col col-12 col-md-5 offset-md-1 col-xl-2">
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label cmp-mtg-calc__input__label--primary">
                <label for="purchase_price_input">Purchase Price</label>
              </div>
              <div class="cmp-mtg-calc__input__slider">
                <div data-content="$" class="input input-currency has-input-formatted">
                  <input name="purchase_price_input" type="number" min="1000" max="${maxPurchasePrice}" aria-label="Enter Purchase Price in Dollars">
                  <div class="input-formatted purchase-price-field">${addCommaSeparators(listPrice)}</div>
                </div>
                <div>
                  <div class="slider-wrapper">
                    <input name="purchase_price_slider" type="range" value="${listPrice}" min="1000" max="${maxPurchasePrice}" step="10000" class="custom-slider purchase-price-slider">
                  </div>
                </div>
              </div>
            </div>
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label"><label for="down_payment">Down Payment</label> <span
                  class="extra">($${nFormatter(initialMortgageCalc.downpayment, 0)})</span>
              </div>
              <div class="cmp-mtg-calc__input__slider">
                <div data-content="%" class="input input-percent has-input-formatted">
                  <input name="down_payment_input" type="number" aria-label="Enter Down Payment in Percentage">
                  <div class="input-formatted down-payment-field">20</div>
                </div>
                <div>
                  <div class="slider-wrapper">
                    <input type="range" value="20" min="0" max="50" step="1" class="custom-slider down-payment-slider">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-5 col-xl-2">
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label cmp-mtg-calc__input__label--primary"><label for="interest_rate">Interest
                  Rate</label></div>
              <div class="cmp-mtg-calc__input__slider">
                <div data-content="%" class="input input-percent has-input-formatted"><input name="interest_rate_input"
                    type="number" aria-label="Enter Interest Rate in Percentage">
                  <div class="input-formatted interest-rate-field">5.000</div>
                </div>
                <div>
                  <div class="slider-wrapper">
                    <input type="range" value="5" min="0" max="10" step=".001" class="custom-slider interest-rate-slider">
                  </div>
                </div>
              </div>
            </div>
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label"><label for="loan_term">Term</label> <span class="extra">(Years)</span>
              </div>
              <div class="cmp-mtg-calc__input__slider">
                <div class="input input-standard has-input-formatted"><input name="loan_term_input" type="number"
                    aria-label="Enter Loan Term in Years">
                  <div class="input-formatted loan-term-field">30</div>
                </div>
                <div>
                  <div class="slider-wrapper">
                    <input type="range" value="30" min="5" max="30" step="1" class="custom-slider loan-term-slider">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col col-12 col-md-10 offset-md-1 col-xl-4 offset-xl-6">
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
    
    loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);

    var scriptSrc = document.createElement('script');
    scriptSrc.type = 'module';
    scriptSrc.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.3.0/chart.umd.js';
    document.head.append(scriptSrc);
    
    const script = document.createElement('script');
    script.type = 'text/partytown';
    script.innerHTML = `
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '${window.hlx.codeBasePath}/blocks/property-details-mortgage-calculator/load-chart.js';
      document.head.append(script);
    `;
    document.body.append(script);
  }
  
}