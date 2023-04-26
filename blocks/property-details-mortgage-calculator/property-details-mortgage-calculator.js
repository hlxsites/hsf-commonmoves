import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';
const propertyAPI = 'https://www.bhhs.com/bin/bhhs/CregPropertySearchServlet?ucsid=false&SearchType=Radius&ApplicationType=FOR_SALE&Sort=PRICE_ASCENDING&PageSize=9&MinPrice=7497500&MaxPrice=22492500&Latitude=42.56574249267578&Longitude=-70.76632690429688&Distance=2&CoverageZipcode=&teamNearBy=&teamCode=';
const propID = '343140756';


function inputSlider() {
  const min = this.min;
  const max = this.max;
  const value = this.value;
  this.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${(value-min)/(max-min)*100}%, #e7e7e7 ${(value-min)/(max-min)*100}%, #e7e7e7 100%)`;
  var parent = this.closest('.cmp-mtg-calc__input__slider');
  var fieldValue = parent.querySelector('.input-formatted');
  if(fieldValue.classList.contains('purchase-price')) {
    fieldValue.innerHTML = formatCurrency(Number(value));
  } else {
    fieldValue.innerHTML = value;
  }
  var container = this.closest('.property-row');
  var purchasePrice = Number(container.querySelector('.purchase-price-slider').value);
  var downPayment = Number(container.querySelector('.down-payment-slider').value);
  var interestRate = Number(container.querySelector('.interest-rate-slider').value);
  var loanTerm = Number(container.querySelector('.interest-rate-slider').value);
  var monthlyPayment = computeMortgage(purchasePrice, interestRate, downPayment, loanTerm).totalPayment;
  container.querySelector('.mortgage-payment').innerHTML = formatCurrency(monthlyPayment);
}

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
    const maxPurchasePrice = 2 * listPrice + 1000;
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
              $<span class="mortgage-payment">${formatCurrency(initialMortgageCalc.totalPayment)}</span>
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
                <div data-content="$" class="input input-currency has-input-formatted"><input name="purchase_price_input"
                    type="number" aria-label="Enter Purchase Price in Dollars">
                  <div class="input-formatted purchase-price-field">${formatCurrency(listPrice)}</div>
                </div>
                <div>
                  <div class="slider-wrapper">
                    <input type="range" value="${listPrice}" min="1000" max="${maxPurchasePrice}" step="10000" class="custom-slider purchase-price-slider">
                  </div>
                </div>
              </div>
            </div>
            <div class="cmp-mtg-calc__input">
              <div class="cmp-mtg-calc__input__label"><label for="down_payment">Down Payment</label> <span
                  class="extra">($3M)</span></div>
              <div class="cmp-mtg-calc__input__slider">
                <div data-content="%" class="input input-percent has-input-formatted"><input name="down_payment_input" type="number"
                    aria-label="Enter Down Payment in Percentage">
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
              <div class="cmp-mtg-calc__input__label cmp-mtg-calc__input__label--primary"><label
                  for="interest_rate">Interest Rate</label></div>
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
    decorateIcons(block);
    
    loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);

    const sliders = block.querySelectorAll('input.custom-slider');
    sliders.forEach((slider) => {
      const min = slider.min;
      const max = slider.max;
      const value = slider.value;
      slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${(value-min)/(max-min)*100}%, #e7e7e7 ${(value-min)/(max-min)*100}%, #e7e7e7 100%)`;
      slider.addEventListener('input', inputSlider);
    });
    /*
    sliders.forEach((slider) => {
      slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${(value-min)/(max-min)*100}%, #e7e7e7 ${(value-min)/(max-min)*100}%, #e7e7e7 100%)`;
      slider.addEventListener('input', inputSlider);
    });
    */
    
  }
  
}