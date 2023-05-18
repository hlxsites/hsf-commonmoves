function initChart() {
  const ctx = document.getElementById("medianlistprice-line-chart");
  const xValues = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Current"];
  const yValues = [529950, 514900, 499900, 522450, 569450, 510450, 677400, 714450, 566450, 679900, 599900, 565000];
  const data = {
    labels: xValues,
    datasets: [{
      data: yValues,
      fill: true,
      backgroundColor: 'rgba(131, 43, 57, 0.1)',
      borderColor: '#832B39',
      borderWidth: 2,
      pointRadius: [0,0,0,0,0,0,0,0,0,0,0,3],
      pointBackgroundColor: "#fff",
      tension: 0.5
    }]
  };
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
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
  return new Chart(ctx, config);
}

const lineChart = initChart();