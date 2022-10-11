function move(chart, event) {
  chart.crossLine2.hide();
  var y = event.changedTouches[0].pageY,
    path = ['M', chart.plotLeft, y, 'L', chart.plotLeft + chart.plotWidth, y];
  if (chart.plotHeight - y >= -2) {
    if (chart.crossLine) {
      // update lines
      chart.crossLine.attr({
        d: path,
      });
    } else {
      // draw lines
      chart.crossLine = chart.renderer
        .path(path)
        .attr({
          'stroke-width': 1,
          stroke: 'green',
          zIndex: 10,
        })
        .add();
    }
    var valueY = 0;
    if (chart.crossLabel) {
      // update label
      chart.crossLabel.attr({
        y: y - 9,
        text: chart.yAxis[0].toValue(y).toFixed(2),
      });
      valueY = chart.yAxis[0].toValue(y).toFixed(2);

      window.ReactNativeWebView.postMessage(valueY);
    } else {
      // draw label
      chart.crossLabel = chart.renderer
        .label(chart.yAxis[0].toValue(y).toFixed(2), chart.plotWidth - 12)
        .attr({ zIndex: 11, padding: 2, r: 5, fill: 'green' })
        .css({ color: 'white' })
        .add();
      valueY = chart.yAxis[0].toValue(y).toFixed(2);
      window.ReactNativeWebView.postMessage(valueY);
    }

    //Show Cross Line & Label
    chart.crossLabel.show();
    chart.crossLine.show();
  }
}
