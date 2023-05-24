import { nFormatter } from "../property-details-mortgage-calculator/compute-mortgage.js";

Chart.Tooltip.positioners.custom = function(items) {
  const pos = Chart.Tooltip.positioners.average(items);

  // Happens when nothing is found
  if (pos === false) {
    return false;
  }

  const chart = this.chart;
  
  return {
    x: pos.x,
    y: pos.y,
    xAlign: 'center',
    yAlign: pos.y < chart.chartArea.bottom - 80 ? 'top' : 'bottom',
  };
};

const labelFunc = (tooltipItem) => {
  return '$' + tooltipItem.formattedValue;
}

const miniConfig = {
  type: 'line',
  options: {
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        border: {
          display: false
        },
        ticks: {
          display: false
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        border: {
          display: false
        },
        ticks: {
          display: false,
          suggestedMin: 1E5
        },
        grid: {
          display: false
        }
      }
    }
  }
};

const detailConfig = {
  type: 'line',
  options: {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        displayColors: false,
        backgroundColor: '#3A3A3A',
        bodyFont: {
          size: 22,
          family: 'ProximaNova',
          weight: 300
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
          weight: 300
        },
        padding: {
          x: 15,
          y: 10
        },
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label.toUpperCase();
          }
        }
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        border: {
          display: false
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          padding: 10,
          callback: function(value, index, ticks)           {
             return ticks.length - 1 == index || index == 0 ? this.getLabelForValue(value).toUpperCase() : ""
          }
        },
        grid: {
          drawTicks: false
        }
      },
      y: {
        beginAtZero: true,
        border: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          padding: 10,
          suggestedMin: 5E4,
          callback: function(value, index, ticks)           {
             return ticks.length - 1 == index ? nFormatter(value, 0) : ""
          }
        },
        grid: {
          display: false,
          drawTicks: false
        }
      }
    }
  }
};

async function getMarketTrends() {
  const marketTrendsAPI = 'https://www.commonmoves.com/bin/bhhs/CregMarketTrends?PropertyId=347543300&Latitude=41.96909713745117&Longitude=-71.22725677490234&zipCode=02766';
  const resp = await fetch(marketTrendsAPI);
  console.log(resp);
  if (resp.ok) {
    const data = await resp.json();
    return data;
  }
  return null;
}

function initChart(ctx, xValues, yValues, dir, mini = true) {
  const backgroundColor = dir == "down" ? 'rgba(131, 43, 57, 0.1)' : 'rgba(43, 131, 79, 0.1)';
  var borderColor = dir == "down" ? '#832B39' : '#2B834F';
  var radius = new Array(xValues.length).fill(0);
  if(mini) {
    radius.splice(-1,1,3);
    miniConfig.data = {
      labels: xValues,
      datasets: [{
        data: yValues,
        fill: true,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2,
        pointRadius: radius,
        pointBackgroundColor: "#fff",
        tension: 0.4
      }]
    };
    return new Chart(ctx, miniConfig);
  } else {
    radius.splice(-1,1,4);
    detailConfig.data = {
      labels: xValues,
      datasets: [{
        data: yValues,
        fill: true,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 3,
        pointRadius: radius,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverBackgroundColor: '#3A3A3A',
        pointHoverRadius: 5,
        tension: 0.4
      }]
    };
    return new Chart(ctx, detailConfig);
  }
}

function getChange(values) {
  var change = (values.slice(-1)[0] - values.slice(-2)[0]) / values.slice(-2)[0];
  return change < 0 ? "down" : "up";
}
/*
getMarketTrends().then((data) => {
  var trends = data.detailTrends;
  var months = trends.map((item) => new Date(item.startDate).toLocaleString('default', { month: "short" }));
  console.log(months);
  var medianListPrice = trends.map((item) => Number(item.medianListPrice.replace(/[^0-9.-]+/g,"")));
  var medianSoldPrice = trends.map((item) => Number(item.medianSalesPrice.replace(/[^0-9.-]+/g,"")));
  var avgPrice = trends.map((item) => Number(item.avgPriceArea.replace(/[^0-9.-]+/g,"")));
  var homesSold = trends.map((item) => item.homesSold);
  var homesSale = trends.map((item) => item.homesForSale);
  var avgDays = trends.map((item) => item.avgDaysOnMarket);
  console.log(homesSold);
  const medianListPriceLineChart = initChart(document.getElementById("medianlistprice-line-chart"), months, medianListPrice, getChange(medianListPrice));
  const medianSoldPriceLineChart = initChart(document.getElementById("mediansoldprice-line-chart"), months, medianSoldPrice, getChange(medianSoldPrice));
  const avgPriceLineChart = initChart(document.getElementById("avgprice-line-chart"), months, avgPrice, getChange(avgPrice));
  const homesSoldLineChart = initChart(document.getElementById("homessold-line-chart"), months, homesSold, getChange(homesSold));
  const homesSaleLineChart = initChart(document.getElementById("homesforsale-line-chart"), months, homesSale, getChange(homesSale));
  const avgDaysLineChart = initChart(document.getElementById("avgdays-line-chart"), months, avgDays, getChange(avgDays));

  var charts = document.querySelectorAll('.cmp-property-details-market-trends__table .chart');

});
*/

var data = await getMarketTrends();
var trends = data.detailTrends;
var months = trends.map((item) => new Date(item.startDate).toLocaleString('default', { month: "short" }));
months.splice(-1, 1, "Current");
var medianListPrice = trends.map((item) => Number(item.medianListPrice.replace(/[^0-9.-]+/g,"")));
var medianSoldPrice = trends.map((item) => Number(item.medianSalesPrice.replace(/[^0-9.-]+/g,"")));
var avgPrice = trends.map((item) => Number(item.avgPriceArea.replace(/[^0-9.-]+/g,"")));
var homesSold = trends.map((item) => item.homesSold);
var homesSale = trends.map((item) => item.homesForSale);
var avgDays = trends.map((item) => item.avgDaysOnMarket);

var medianListPriceLineChart = null;
var medianSoldPriceLineChart = null;
var avgPriceLineChart = null;
var homesSoldLineChart = null;
var homesSaleLineChart = null;
var avgDaysLineChart = null;
/*
const medianListPriceLineChart = initChart(document.getElementById("medianlistprice-line-chart"), months, medianListPrice, getChange(medianListPrice));
const medianSoldPriceLineChart = initChart(document.getElementById("mediansoldprice-line-chart"), months, medianSoldPrice, getChange(medianSoldPrice));
const avgPriceLineChart = initChart(document.getElementById("avgprice-line-chart"), months, avgPrice, getChange(avgPrice));
const homesSoldLineChart = initChart(document.getElementById("homessold-line-chart"), months, homesSold, getChange(homesSold));
const homesSaleLineChart = initChart(document.getElementById("homesforsale-line-chart"), months, homesSale, getChange(homesSale));
const avgDaysLineChart = initChart(document.getElementById("avgdays-line-chart"), months, avgDays, getChange(avgDays));
*/
var div = document.getElementsByClassName('cmp-property-details-market-trends__wrap')[0];

function initCharts() {
  medianListPriceLineChart = medianListPriceLineChart || initChart(document.getElementById("medianlistprice-line-chart"), months, medianListPrice, getChange(medianListPrice));
  medianSoldPriceLineChart = medianSoldPriceLineChart || initChart(document.getElementById("mediansoldprice-line-chart"), months, medianSoldPrice, getChange(medianSoldPrice));
  avgPriceLineChart = avgPriceLineChart || initChart(document.getElementById("avgprice-line-chart"), months, avgPrice, getChange(avgPrice));
  homesSoldLineChart = homesSoldLineChart || initChart(document.getElementById("homessold-line-chart"), months, homesSold, getChange(homesSold));
  homesSaleLineChart = homesSaleLineChart || initChart(document.getElementById("homesforsale-line-chart"), months, homesSale, getChange(homesSale));
  avgDaysLineChart = avgDaysLineChart || initChart(document.getElementById("avgdays-line-chart"), months, avgDays, getChange(avgDays)); 
}

if(window.innerWidth >= 992) {
  initCharts();
}
window.addEventListener('resize', () => {
  if(window.innerWidth >= 992) {
    initCharts();
  }
});

var table = document.getElementById('cmp-property-details-market-trends__table');
var detail = document.getElementById('cmp-property-details-market-trends__detail');
var detailLineChart = initChart(document.getElementById('detail-line-chart'), months, new Array(months.length).fill(100), "up", false);

div.querySelectorAll('.cmp-property-details-market-trends__table .chart').forEach((chart) => {
  chart.addEventListener('click', (e) => {
    //console.log(e.currentTarget.id);
    var elem = e.currentTarget;
    console.log(elem);
    var dataElem = elem.previousElementSibling;
    var label = dataElem.firstElementChild.textContent;
    var value = dataElem.lastElementChild.textContent;
    var title = document.querySelector('.cmp-property-details-market-trends__detail__title');
    title.innerHTML = `${label} (1 Year)`;
    var val = document.querySelector('.cmp-property-details-market-trends__detail__value');
    val.innerHTML = value;
    var chartData = detailLineChart.data.datasets[0].data;
    switch(e.currentTarget.id) {
      case 'medianlistprice':
        chartData = medianListPrice;
        detailLineChart.options.plugins.tooltip.callbacks.label = labelFunc;
        break;
      case 'mediansoldprice':
        chartData = medianSoldPrice;
        detailLineChart.options.plugins.tooltip.callbacks.label = labelFunc;
        break;
      case 'avgprice':
        chartData = avgPrice;
        detailLineChart.options.plugins.tooltip.callbacks.label = labelFunc;
        break;
      case 'avgdays':
        chartData = avgDays;
        break;
      case 'homesforsale':
        chartData = homesSale;
        break;
      case 'homessold':
        chartData = homesSold;
        break;
    };
    const backgroundColor = getChange(chartData) == "down" ? 'rgba(131, 43, 57, 0.1)' : 'rgba(43, 131, 79, 0.1)';
    var borderColor = getChange(chartData) == "down" ? '#832B39' : '#2B834F';
    detailLineChart.data.datasets[0].data = chartData;
    detailLineChart.data.datasets[0].backgroundColor = backgroundColor;
    detailLineChart.data.datasets[0].borderColor = borderColor;
    detailLineChart.update(); 
    table.classList.toggle('d-none');
    detail.classList.toggle('d-none');
  });
});

var close = detail.querySelector('.close');
  console.log(close);
  close.addEventListener('click', () => {
    table.classList.toggle('d-none');
    detail.classList.toggle('d-none');
});