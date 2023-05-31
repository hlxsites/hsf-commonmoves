export function computeMortgage(
  purchasePrice,
  interestRate = 5,
  downpaymentPercent = 20,
  loanTerm = 30,
) {
  const downpaymentAmount = (downpaymentPercent / 100.0) * purchasePrice;
  const principalAmount = purchasePrice - downpaymentAmount;
  const interestPayment = ((interestRate / 100) * principalAmount) / 12;
  const k = interestRate / 100 / 12;
  const m = (1 + k) ** (12 * loanTerm);
  const monthlyMortgage = k * (m / (m - 1)) * principalAmount;
  const principalPayment = monthlyMortgage - interestPayment;
  return {
    downpayment: downpaymentAmount,
    interest: interestPayment,
    principal: principalPayment,
    totalPayment: monthlyMortgage,
  };
}

export function addCommaSeparators(price) {
  return price.toString().replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
}

export function removeCommas(price) {
  return price.toString().replace(/,/g, '');
}

export function currencyToNum(price) {
  return Number(price.toString().replace(/[^0-9.-]+/g, ''));
}

export function nFormatter(val, a) {
  const c = [
    {
      value: 1,
      symbol: '',
    },
    {
      value: 1E3,
      symbol: 'k',
    },
    {
      value: 1E6,
      symbol: 'M',
    },
    {
      value: 1E9,
      symbol: 'G',
    },
    {
      value: 1E12,
      symbol: 'T',
    },
    {
      value: 1E15,
      symbol: 'P',
    },
    {
      value: 1E18,
      symbol: 'E',
    },
  ];
  let f = c.length - 1;
  for (; f > 0 && !(Number(val) >= c[f].value); f -= 1);
  return (Number(val) / c[f].value).toFixed(a).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + c[f].symbol;
}
