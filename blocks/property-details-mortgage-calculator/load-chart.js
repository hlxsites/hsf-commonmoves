import { computeMortgage, addCommaSeparators, removeCommas } from './compute-mortgage.js';

function initChart() {
  const ctx = document.getElementById("doughnut-chart");
  const principalElem = document.getElementById("principal-amount");
  const initialPrincipal = Number(principalElem.innerHTML);
  const interestElem = document.getElementById("interest-amount");
  const initialInterest = Number(interestElem.innerHTML);
  var xValues = ["Principal", "Interest"];
  var yValues = [initialPrincipal, initialInterest];
  var barColors = [
    "rgba(85, 36, 72, 1.0)",
    "rgba(85,36,72,0.5)"
  ];
  const dataDoughnut = {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues,
      borderWidth: 0
    }]
  };
  const config = {
    type: 'doughnut',
    data: dataDoughnut,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      cutout: '70%',
      responsive: true
    },
  };
  return new Chart(ctx, config);
}

const doughnutChart = initChart();

function adjustSlider() {
  const min = this.min;
  const max = this.max;
  const value = this.value;
  this.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${(value-min)/(max-min)*100}%, #e7e7e7 ${(value-min)/(max-min)*100}%, #e7e7e7 100%)`;
  var parent = this.closest('.cmp-mtg-calc__input__slider');
  var fieldValue = parent.querySelector('.input-formatted');
  if(fieldValue.classList.contains('purchase-price-field')) {
    fieldValue.innerHTML = addCommaSeparators(value);
  } else if(fieldValue.classList.contains('interest-rate-field')) {
    fieldValue.innerHTML = Number(value).toFixed(3);
  }
  else {
    fieldValue.innerHTML = value;
  }
  var block = this.closest('.mortage-calc-body');
  var purchasePrice = removeCommas(block.querySelector('.purchase-price-field').innerHTML);
  var downPayment = block.querySelector('.down-payment-field').innerHTML;
  var interestRate = block.querySelector('.interest-rate-field').innerHTML;
  var loanTerm = block.querySelector('.loan-term-field').innerHTML;
  var mortgage = computeMortgage(purchasePrice, interestRate, downPayment, loanTerm);
  var monthlyPayment = mortgage.totalPayment.toFixed(0);
  var principal = mortgage.principal.toFixed(0);
  var interest = mortgage.interest.toFixed(0);
  doughnutChart.data.datasets[0].data[0] = Number(principal);
  doughnutChart.data.datasets[0].data[1] = Number(interest);
  doughnutChart.update();
  block.querySelector('.mortgage-payment').innerHTML = addCommaSeparators(monthlyPayment);
}


function focusOnInput() {
  this.style.opacity = 1;
  var num = Number(this.nextElementSibling.innerHTML.replace(/,/g,''));
  this.nextElementSibling.innerHTML = '';
  this.value = num;
}

function focusOutInput() {
  this.style.opacity = 0;
  var parent = this.closest('.cmp-mtg-calc__input__slider');
  var slider = parent.querySelector('.custom-slider');
  var min = slider.min;
  var max = slider.max;
  if(this.value) {
    var value = Number(this.value);
    if(value < min) {
      this.value = min;
    }
    if(value > max) {
      this.value = max;
    }
  } else {
    this.value = slider.min;
  }
  if(this.nextElementSibling.classList.contains('down-payment-field')) {
    this.nextElementSibling.innerHTML = addCommaSeparators(this.value);
  } else {
    this.nextElementSibling.innerHTML = this.value;
  }
  slider.value = this.value;
  slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${(slider.value-slider.min)/(slider.max-slider.min)*100}%, #e7e7e7 ${(slider.value-slider.min)/(slider.max-slider.min)*100}%, #e7e7e7 100%)`; 
  var block = this.closest('.mortage-calc-body');
  var purchasePrice = block.querySelector('.purchase-price-field').innerHTML ? removeCommas(block.querySelector('.purchase-price-field').innerHTML) : this.value;
  var downPayment = block.querySelector('.down-payment-field').innerHTML ? block.querySelector('.down-payment-field').innerHTML : this.value;
  var interestRate = block.querySelector('.interest-rate-field').innerHTML ? block.querySelector('.interest-rate-field').innerHTML : this.value;
  var loanTerm = block.querySelector('.loan-term-field').innerHTML ? block.querySelector('.loan-term-field').innerHTML : this.value;
  var mortgage = computeMortgage(purchasePrice, interestRate, downPayment, loanTerm)
  var monthlyPayment = mortgage.totalPayment.toFixed(0);
  var principal = mortgage.principal.toFixed(0);
  var interest = mortgage.interest.toFixed(0);
  block.querySelector('.purchase-price-field').innerHTML = addCommaSeparators(purchasePrice);
  block.querySelector('.mortgage-payment').innerHTML = addCommaSeparators(monthlyPayment);
  doughnutChart.data.datasets[0].data[0] = Number(principal);
  doughnutChart.data.datasets[0].data[1] = Number(interest);
  doughnutChart.update();
}

function adjustField() {
  var parent = this.closest('.cmp-mtg-calc__input__slider');
  var slider = parent.querySelector('.custom-slider');
  if(this.value) {
    slider.value = this.value;
    slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${(slider.value-slider.min)/(slider.max-slider.min)*100}%, #e7e7e7 ${(slider.value-slider.min)/(slider.max-slider.min)*100}%, #e7e7e7 100%)`; 
    var block = this.closest('.mortage-calc-body');
    var purchasePrice = block.querySelector('.purchase-price-field').innerHTML ? removeCommas(block.querySelector('.purchase-price-field').innerHTML) : this.value;
    var downPayment = block.querySelector('.down-payment-field').innerHTML ? block.querySelector('.down-payment-field').innerHTML : this.value;
    var interestRate = block.querySelector('.interest-rate-field').innerHTML ? block.querySelector('.interest-rate-field').innerHTML : this.value;
    var loanTerm = block.querySelector('.loan-term-field').innerHTML ? block.querySelector('.loan-term-field').innerHTML : this.value;
    var mortgage = computeMortgage(purchasePrice, interestRate, downPayment, loanTerm)
    var monthlyPayment = mortgage.totalPayment.toFixed(0);
    var principal = mortgage.principal.toFixed(0);
    var interest = mortgage.interest.toFixed(0);  
    block.querySelector('.mortgage-payment').innerHTML = addCommaSeparators(monthlyPayment);
    doughnutChart.data.datasets[0].data[0] = Number(principal);
    doughnutChart.data.datasets[0].data[1] = Number(interest);  
    doughnutChart.update();
  }
}

var sliders = document.querySelectorAll('input.custom-slider');
sliders.forEach((slider) => {
  const min = slider.min;
  const max = slider.max;
  var textValue = slider.closest('.cmp-mtg-calc__input__slider').querySelector('.input-formatted').innerHTML;
  var value = removeCommas(textValue);
  slider.style.background = `linear-gradient(to right, #aaa 0%, #aaa ${(value-min)/(max-min)*100}%, #e7e7e7 ${(value-min)/(max-min)*100}%, #e7e7e7 100%)`;
  slider.addEventListener('input', adjustSlider);
});

const inputFields = document.querySelectorAll('.has-input-formatted input');
inputFields.forEach((elem) => {
  elem.addEventListener('focus', focusOnInput);
  elem.addEventListener('input', adjustField);
  elem.addEventListener('focusout', focusOutInput);
});