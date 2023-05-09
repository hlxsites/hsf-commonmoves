export function computeMortgage(purchasePrice, interestRate = 5, downpaymentPercent = 20, loanTerm = 30) {
  const downpaymentAmount = downpaymentPercent / 100.0 * purchasePrice;
  const principalAmount = purchasePrice - downpaymentAmount;
  const interestPayment = interestRate / 100 * principalAmount / 12;
  var k = interestRate / 100 / 12;
  var m = Math.pow(1 + k, 12 * loanTerm);
  var monthlyMortgage = k * m / (m - 1) * principalAmount;
  const principalPayment = monthlyMortgage - interestPayment;
  return {
    downpayment: downpaymentAmount,
    interest: interestPayment,
    principal: principalPayment,
    totalPayment: monthlyMortgage
  }
}

export function addCommaSeparators(price) {
  return price.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
}

export function removeCommas(price) {
  return price.toString().replace(/,/g,'',);
}