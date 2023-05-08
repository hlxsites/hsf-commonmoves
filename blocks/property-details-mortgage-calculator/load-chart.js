const ctx = document.getElementById("doughnut-chart");
var xValues = ["Principal", "Interest"];
var yValues = [12474, 57698];
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
var doughnutChart = new Chart(ctx, config);