import {
  computeMortgage,
  addCommaSeparators,
  removeCommas,
  nFormatter,
} from './compute-mortgage.js';

function initChart() {
  const ctx = document.getElementById('doughnut-chart');
  const principalElem = document.getElementById('principal-amount');
  const initialPrincipal = Number(principalElem.innerHTML);
  const interestElem = document.getElementById('interest-amount');
  const initialInterest = Number(interestElem.innerHTML);
  const xValues = ['Principal', 'Interest'];
  const yValues = [initialPrincipal, initialInterest];
  const barColors = [
    'rgba(85, 36, 72, 1.0)',
    'rgba(85,36,72,0.5)',
  ];
  const dataDoughnut = {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues,
      borderWidth: 0,
    }],
  };
  const config = {
    type: 'doughnut',
    data: dataDoughnut,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: '70%',
    },
  };
  /* eslint-disable-next-line no-undef */
  return new Chart(ctx, config);
}

const doughnutChart = initChart();

function adjustSlider() {
  const { min, max, value } = this;
  this.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${((value - min) / (max - min)) * 100}%, #e7e7e7 ${((value - min) / (max - min)) * 100}%, #e7e7e7 100%)`;
  const parent = this.closest('.cmp-mtg-calc__input__slider');
  const fieldValue = parent.querySelector('.input-formatted');
  if (fieldValue.classList.contains('purchase-price-field')) {
    fieldValue.innerHTML = addCommaSeparators(value);
  } else if (fieldValue.classList.contains('interest-rate-field')) {
    fieldValue.innerHTML = Number(value).toFixed(3);
  } else {
    fieldValue.innerHTML = value;
  }
  const block = this.closest('.mortage-calc-body');
  const purchasePrice = removeCommas(block.querySelector('.purchase-price-field').innerHTML);
  const downPayment = block.querySelector('.down-payment-field').innerHTML;
  const interestRate = block.querySelector('.interest-rate-field').innerHTML;
  const loanTerm = block.querySelector('.loan-term-field').innerHTML;
  const mortgage = computeMortgage(purchasePrice, interestRate, downPayment, loanTerm);
  const spanLabel = block.querySelector('label[for=down_payment]').nextElementSibling;
  spanLabel.innerHTML = `($${nFormatter(mortgage.downpayment, 1)})`;
  const monthlyPayment = mortgage.totalPayment.toFixed(0);
  const principal = mortgage.principal.toFixed(0);
  const interest = mortgage.interest.toFixed(0);
  doughnutChart.data.datasets[0].data[0] = Number(principal);
  doughnutChart.data.datasets[0].data[1] = Number(interest);
  doughnutChart.update();
  block.querySelector('.mortgage-payment').innerHTML = addCommaSeparators(monthlyPayment);
}

function focusOnInput() {
  this.style.opacity = 1;
  const num = Number(this.nextElementSibling.innerHTML.replace(/,/g, ''));
  this.nextElementSibling.innerHTML = '';
  this.value = num;
}

function focusOutInput() {
  this.style.opacity = 0;
  const parent = this.closest('.cmp-mtg-calc__input__slider');
  const slider = parent.querySelector('.custom-slider');
  const { min, max } = slider;
  if (this.value) {
    const value = Number(this.value);
    if (value < min) {
      this.value = min;
    }
    if (value > max) {
      this.value = max;
    }
  } else {
    this.value = min;
  }
  if (this.nextElementSibling.classList.contains('down-payment-field')) {
    this.nextElementSibling.innerHTML = addCommaSeparators(this.value);
  } else {
    this.nextElementSibling.innerHTML = this.value;
  }
  slider.value = this.value;
  slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e7e7e7 ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e7e7e7 100%)`;
  const block = this.closest('.mortage-calc-body');
  const purchasePrice = block.querySelector('.purchase-price-field').innerHTML ? removeCommas(block.querySelector('.purchase-price-field').innerHTML) : this.value;
  const downPayment = block.querySelector('.down-payment-field').innerHTML ? block.querySelector('.down-payment-field').innerHTML : this.value;
  const interestRate = block.querySelector('.interest-rate-field').innerHTML ? block.querySelector('.interest-rate-field').innerHTML : this.value;
  const loanTerm = block.querySelector('.loan-term-field').innerHTML ? block.querySelector('.loan-term-field').innerHTML : this.value;
  const mortgage = computeMortgage(purchasePrice, interestRate, downPayment, loanTerm);
  const spanLabel = block.querySelector('label[for=down_payment]').nextElementSibling;
  spanLabel.innerHTML = `($${nFormatter(mortgage.downpayment, 1)})`;
  const monthlyPayment = mortgage.totalPayment.toFixed(0);
  const principal = mortgage.principal.toFixed(0);
  const interest = mortgage.interest.toFixed(0);
  block.querySelector('.purchase-price-field').innerHTML = addCommaSeparators(purchasePrice);
  block.querySelector('.mortgage-payment').innerHTML = addCommaSeparators(monthlyPayment);
  doughnutChart.data.datasets[0].data[0] = Number(principal);
  doughnutChart.data.datasets[0].data[1] = Number(interest);
  doughnutChart.update();
}

function adjustField() {
  const parent = this.closest('.cmp-mtg-calc__input__slider');
  const slider = parent.querySelector('.custom-slider');
  if (this.value) {
    slider.value = this.value;
    slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e7e7e7 ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e7e7e7 100%)`;
    const block = this.closest('.mortage-calc-body');
    const purchasePrice = block.querySelector('.purchase-price-field').innerHTML ? removeCommas(block.querySelector('.purchase-price-field').innerHTML) : this.value;
    const downPayment = block.querySelector('.down-payment-field').innerHTML ? block.querySelector('.down-payment-field').innerHTML : this.value;
    const interestRate = block.querySelector('.interest-rate-field').innerHTML ? block.querySelector('.interest-rate-field').innerHTML : this.value;
    const loanTerm = block.querySelector('.loan-term-field').innerHTML ? block.querySelector('.loan-term-field').innerHTML : this.value;
    const mortgage = computeMortgage(purchasePrice, interestRate, downPayment, loanTerm);
    const spanLabel = block.querySelector('label[for=down_payment]').nextElementSibling;
    spanLabel.innerHTML = `($${nFormatter(mortgage.downpayment, 1)})`;
    const monthlyPayment = mortgage.totalPayment.toFixed(0);
    const principal = mortgage.principal.toFixed(0);
    const interest = mortgage.interest.toFixed(0);
    block.querySelector('.mortgage-payment').innerHTML = addCommaSeparators(monthlyPayment);
    doughnutChart.data.datasets[0].data[0] = Number(principal);
    doughnutChart.data.datasets[0].data[1] = Number(interest);
    doughnutChart.update();
  }
}

const sliders = document.querySelectorAll('input.custom-slider');
sliders.forEach((slider) => {
  const { min, max } = slider;
  const textValue = slider.closest('.cmp-mtg-calc__input__slider').querySelector('.input-formatted').innerHTML;
  const value = removeCommas(textValue);
  slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${((value - min) / (max - min)) * 100}%, #e7e7e7 ${((value - min) / (max - min)) * 100}%, #e7e7e7 100%)`;
  slider.addEventListener('input', adjustSlider);
});

const inputFields = document.querySelectorAll('.has-input-formatted input');
inputFields.forEach((elem) => {
  elem.addEventListener('focus', focusOnInput);
  elem.addEventListener('input', adjustField);
  elem.addEventListener('focusout', focusOutInput);
});
