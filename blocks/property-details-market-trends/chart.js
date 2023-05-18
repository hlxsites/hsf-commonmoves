const optionsMini = {
  layout: {
      padding: 15
  },
  legend: {
      display: !1
  },
  maintainAspectRatio: !1,
  scales: {
      ticks: {
          display: !1
      },
      xAxes: [{
          display: !1
      }],
      yAxes: [{
          display: !1,
          ticks: {
              suggestedMin: 1E5
          }
      }]
  },
  tooltips: {
      enabled: !1
  }
};
const optionsDetail = {
  plugins: {
    legend: {
      display: false
    }
  },
  maintainAspectRatio: false,
  scales: {
      x: {
          grid: {
              display: false,
              drawTicks: false
          },
          ticks: {
              autoSkip: false,
              maxRotation: 0,
              padding: 10
          }
      },
      y: {
          grid: {
              display: false,
              drawTicks: false
          },
          ticks: {
              maxRotation: 0,
              padding: 10,
              suggestedMin: 5E4,
              callback: function(a, c, f) {
                  return 0 == c ? parseInt(a).nFormatter(0) : ""
              }
          }
      }
  },
  hover: {
      intersect: false,
      mode: "index"
  },
  tooltips: {
      backgroundColor: "#3A3A3A",
      bodyFontFamily: "proxima-light",
      bodyFontSize: 22,
      bodyAlign: "center",
      caretPadding: 12,
      caretSize: 8,
      cornerRadius: 0,
      enabled: !0,
      intersect: !1,
      mode: "index",
      position: "custom",
      titleAlign: "center",
      titleFontFamily: "proxima-light",
      xAlign: "center",
      xPadding: 15,
      yPadding: 10,
      custom: function(a) {
          if (a) {
              var c = this._chartInstance.chartArea.bottom
                , f = Window.market_trend_detail_current_tooltip;
              a.displayColors = !1;
              a.yAlign = f._view.y < c - 80 ? "top" : "bottom"
          }
      },
      callbacks: {
          title: function(a, c) {
              return Window.market_trend_detail_months[a[0].index]
          },
          label: function(a, c) {
              return Window.market_trend_detail_orig_values[a.value]
          }
      }
  }
}
const config = {

}