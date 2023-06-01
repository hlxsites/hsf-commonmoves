import { nFormatter } from '../property-details-mortgage-calculator/compute-mortgage.js';

// eslint-disable-next-line no-undef, func-names
Chart.Tooltip.positioners.custom = function (items) {
  // eslint-disable-next-line no-undef
  const pos = Chart.Tooltip.positioners.average(items);
  // Happens when nothing is found
  if (pos === false) {
    return false;
  }
  return {
    x: pos.x,
    y: pos.y,
    xAlign: 'center',
    yAlign: pos.y < this.chart.chartArea.bottom - 80 ? 'top' : 'bottom',
  };
};

const labelFunc = (tooltipItem) => `$${tooltipItem.formattedValue}`;

function tickFunc(value, index, ticks) {
  return (ticks.length - 1 === index || index === 0) ? this.getLabelForValue(value).toUpperCase() : '';
}

const miniConfig = {
  type: 'line',
  options: {
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        border: {
          display: false,
        },
        ticks: {
          display: false,
          suggestedMin: 1E5,
        },
        grid: {
          display: false,
        },
      },
    },
  },
};

const detailConfig = {
  type: 'line',
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        displayColors: false,
        backgroundColor: '#3A3A3A',
        bodyFont: {
          size: 22,
          family: 'ProximaNova',
          weight: 300,
        },
        bodyAlign: 'center',
        caretPadding: 12,
        caretSize: 8,
        cornerRadius: 0,
        intersect: false,
        mode: 'index',
        position: 'custom',
        titleAlign: 'center',
        titleFont: {
          family: 'ProximaNova',
          weight: 300,
        },
        padding: {
          x: 15,
          y: 10,
        },
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label.toUpperCase(),
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          padding: 10,
          callback: tickFunc,
        },
        grid: {
          drawTicks: false,
        },
      },
      y: {
        border: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          padding: 10,
          suggestedMin: 5E4,
          callback: (value, index, ticks) => (ticks.length - 1 === index ? nFormatter(value, 0) : ''),
        },
        grid: {
          display: false,
          drawTicks: false,
        },
      },
    },
  },
};

function initChart(ctx, xValues, yValues, dir, beginAtZero = false, mini = true) {
  if (ctx) {
    const backgroundColor = dir === 'down' ? 'rgba(131, 43, 57, 0.1)' : 'rgba(43, 131, 79, 0.1)';
    const borderColor = dir === 'down' ? '#832B39' : '#2B834F';
    const radius = new Array(xValues.length).fill(0);
    if (mini) {
      radius.splice(-1, 1, 3);
      miniConfig.options.scales.y.beginAtZero = beginAtZero;
      miniConfig.data = {
        labels: xValues,
        datasets: [{
          data: yValues,
          fill: true,
          backgroundColor,
          borderColor,
          borderWidth: 2,
          pointRadius: radius,
          pointBackgroundColor: '#fff',
          tension: 0.4,
        }],
      };
      // eslint-disable-next-line no-undef
      return new Chart(ctx, miniConfig);
    }
    radius.splice(-1, 1, 4);
    detailConfig.options.scales.y.beginAtZero = beginAtZero;
    detailConfig.data = {
      labels: xValues,
      datasets: [{
        data: yValues,
        fill: true,
        backgroundColor,
        borderColor,
        borderWidth: 3,
        pointRadius: radius,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverBackgroundColor: '#3A3A3A',
        pointHoverRadius: 5,
        tension: 0.4,
      }],
    };
    // eslint-disable-next-line no-undef
    return new Chart(ctx, detailConfig);
  }
  return null;
}

function getChange(values) {
  const change = (values.slice(-1)[0] - values.slice(-2)[0]) / values.slice(-2)[0];
  return change < 0 ? 'down' : 'up';
}

if (window.marketTrends) {
  const data = window.marketTrends;
  const trends = data.detailTrends;
  const months = trends.map((item) => new Date(item.startDate).toLocaleString('default', { month: 'short' }));
  months.splice(-1, 1, 'Current');
  const medianListPrice = trends.map((item) => (item.medianListPrice ? Number(item.medianListPrice.replace(/[^0-9.-]+/g, '')) : 0));
  const medianSoldPrice = trends.map((item) => (item.medianSalesPrice ? Number(item.medianSalesPrice.replace(/[^0-9.-]+/g, '')) : 0));
  const avgPrice = trends.map((item) => (item.avgPriceArea ? Number(item.avgPriceArea.replace(/[^0-9.-]+/g, '')) : 0));
  const homesSold = trends.map((item) => (item.homesSold ? item.homesSold : 0));
  const homesSale = trends.map((item) => (item.homesForSale ? item.homesForSale : 0));
  const avgDays = trends.map((item) => (item.avgDaysOnMarket ? item.avgDaysOnMarket : 0));

  let medianListPriceLineChart = null;
  let medianSoldPriceLineChart = null;
  let avgPriceLineChart = null;
  let homesSoldLineChart = null;
  let homesSaleLineChart = null;
  let avgDaysLineChart = null;

  const div = document.getElementsByClassName('cmp-property-details-market-trends__wrap')[0];

  const initCharts = () => {
    medianListPriceLineChart = medianListPriceLineChart || initChart(document.getElementById('medianlistprice-line-chart'), months, medianListPrice, getChange(medianListPrice), true);
    medianSoldPriceLineChart = medianSoldPriceLineChart || initChart(document.getElementById('mediansoldprice-line-chart'), months, medianSoldPrice, getChange(medianSoldPrice), true);
    avgPriceLineChart = avgPriceLineChart || initChart(document.getElementById('avgprice-line-chart'), months, avgPrice, getChange(avgPrice));
    homesSoldLineChart = homesSoldLineChart || initChart(document.getElementById('homessold-line-chart'), months, homesSold, getChange(homesSold));
    homesSaleLineChart = homesSaleLineChart || initChart(document.getElementById('homesforsale-line-chart'), months, homesSale, getChange(homesSale));
    avgDaysLineChart = avgDaysLineChart || initChart(document.getElementById('avgdays-line-chart'), months, avgDays, getChange(avgDays));
  };

  if (window.innerWidth >= 992) {
    initCharts();
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      initCharts();
    }
  });

  const table = document.getElementById('cmp-property-details-market-trends__table');
  const detail = document.getElementById('cmp-property-details-market-trends__detail');
  const detailLineChart = initChart(document.getElementById('detail-line-chart'), months, new Array(months.length).fill(100), 'up', false, false);

  div.querySelectorAll('.cmp-property-details-market-trends__table .chart').forEach((chart) => {
    chart.addEventListener('click', (e) => {
      const elem = e.currentTarget;
      const dataElem = elem.previousElementSibling;
      const label = dataElem.firstElementChild.textContent;
      const value = dataElem.lastElementChild.textContent;
      const title = document.querySelector('.cmp-property-details-market-trends__detail__title');
      title.innerHTML = `${label} (1 Year)`;
      const val = document.querySelector('.cmp-property-details-market-trends__detail__value');
      val.innerHTML = value;
      let chartData = detailLineChart.data.datasets[0].data;
      switch (e.currentTarget.id) {
        case 'medianlistprice':
          chartData = medianListPrice;
          detailLineChart.options.plugins.tooltip.callbacks.label = labelFunc;
          detailLineChart.options.scales.y.beginAtZero = true;
          break;
        case 'mediansoldprice':
          chartData = medianSoldPrice;
          detailLineChart.options.plugins.tooltip.callbacks.label = labelFunc;
          detailLineChart.options.scales.y.beginAtZero = true;
          break;
        case 'avgprice':
          chartData = avgPrice;
          detailLineChart.options.plugins.tooltip.callbacks.label = labelFunc;
          detailLineChart.options.scales.y.beginAtZero = false;
          break;
        case 'avgdays':
          chartData = avgDays;
          detailLineChart.options.scales.y.beginAtZero = false;
          break;
        case 'homesforsale':
          chartData = homesSale;
          detailLineChart.options.scales.y.beginAtZero = false;
          break;
        case 'homessold':
          chartData = homesSold;
          detailLineChart.options.scales.y.beginAtZero = false;
          break;
        default:
          break;
      }
      const backgroundColor = getChange(chartData) === 'down' ? 'rgba(131, 43, 57, 0.1)' : 'rgba(43, 131, 79, 0.1)';
      const borderColor = getChange(chartData) === 'down' ? '#832B39' : '#2B834F';
      detailLineChart.data.datasets[0].data = chartData;
      detailLineChart.data.datasets[0].backgroundColor = backgroundColor;
      detailLineChart.data.datasets[0].borderColor = borderColor;
      detailLineChart.update();
      table.classList.toggle('d-none');
      detail.classList.toggle('d-none');
    });
  });

  const close = detail.querySelector('.close');
  close.addEventListener('click', () => {
    table.classList.toggle('d-none');
    detail.classList.toggle('d-none');
  });
}
