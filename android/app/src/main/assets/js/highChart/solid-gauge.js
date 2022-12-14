/*
  Highcharts JS v7.0.3 (2019-02-06)
 Solid angular gauge module

 (c) 2010-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (g) {
  'object' === typeof module && module.exports
    ? ((g['default'] = g), (module.exports = g))
    : 'function' === typeof define && define.amd
    ? define(function () {
        return g;
      })
    : g('undefined' !== typeof Highcharts ? Highcharts : void 0);
})(function (g) {
  (function (f) {
    var g = f.pInt,
      u = f.pick,
      q = f.isNumber,
      v = f.wrap,
      t;
    v(f.Renderer.prototype.symbols, 'arc', function (a, h, d, c, f, b) {
      a = a(h, d, c, f, b);
      b.rounded &&
        ((c = ((b.r || c) - b.innerR) / 2),
        (b = ['A', c, c, 0, 1, 1, a[12], a[13]]),
        a.splice.apply(a, [a.length - 1, 0].concat(['A', c, c, 0, 1, 1, a[1], a[2]])),
        a.splice.apply(a, [11, 3].concat(b)));
      return a;
    });
    t = {
      initDataClasses: function (a) {
        var h = this.chart,
          d,
          c = 0,
          g = this.options;
        this.dataClasses = d = [];
        a.dataClasses.forEach(function (b, l) {
          b = f.merge(b);
          d.push(b);
          b.color ||
            ('category' === g.dataClassColor
              ? ((l = h.options.colors), (b.color = l[c++]), c === l.length && (c = 0))
              : (b.color = f.color(g.minColor).tweenTo(f.color(g.maxColor), l / (a.dataClasses.length - 1))));
        });
      },
      initStops: function (a) {
        this.stops = a.stops || [
          [0, this.options.minColor],
          [1, this.options.maxColor],
        ];
        this.stops.forEach(function (a) {
          a.color = f.color(a[1]);
        });
      },
      toColor: function (a, h) {
        var d = this.stops,
          c,
          f,
          b = this.dataClasses,
          g,
          e;
        if (b)
          for (e = b.length; e--; ) {
            if (((g = b[e]), (c = g.from), (d = g.to), (void 0 === c || a >= c) && (void 0 === d || a <= d))) {
              f = g.color;
              h && (h.dataClass = e);
              break;
            }
          }
        else {
          this.isLog && (a = this.val2lin(a));
          a = 1 - (this.max - a) / (this.max - this.min);
          for (e = d.length; e-- && !(a > d[e][0]); );
          c = d[e] || d[e + 1];
          d = d[e + 1] || c;
          a = 1 - (d[0] - a) / (d[0] - c[0] || 1);
          f = c.color.tweenTo(d.color, a);
        }
        return f;
      },
    };
    f.seriesType(
      'solidgauge',
      'gauge',
      { colorByPoint: !0 },
      {
        translate: function () {
          var a = this.yAxis;
          f.extend(a, t);
          !a.dataClasses && a.options.dataClasses && a.initDataClasses(a.options);
          a.initStops(a.options);
          f.seriesTypes.gauge.prototype.translate.call(this);
        },
        drawPoints: function () {
          var a = this,
            h = a.yAxis,
            d = h.center,
            c = a.options,
            t = a.chart.renderer,
            b = c.overshoot,
            l = q(b) ? (b / 180) * Math.PI : 0,
            e;
          q(c.threshold) && (e = h.startAngleRad + h.translate(c.threshold, null, null, null, !0));
          this.thresholdAngleRad = u(e, h.startAngleRad);
          a.points.forEach(function (b) {
            var e = b.graphic,
              k = h.startAngleRad + h.translate(b.y, null, null, null, !0),
              r = (g(u(b.options.radius, c.radius, 100)) * d[2]) / 200,
              m = (g(u(b.options.innerRadius, c.innerRadius, 60)) * d[2]) / 200,
              n = h.toColor(b.y, b),
              p = Math.min(h.startAngleRad, h.endAngleRad),
              q = Math.max(h.startAngleRad, h.endAngleRad);
            'none' === n && (n = b.color || a.color || 'none');
            'none' !== n && (b.color = n);
            k = Math.max(p - l, Math.min(q + l, k));
            !1 === c.wrap && (k = Math.max(p, Math.min(q, k)));
            p = Math.min(k, a.thresholdAngleRad);
            k = Math.max(k, a.thresholdAngleRad);
            k - p > 2 * Math.PI && (k = p + 2 * Math.PI);
            b.shapeArgs = m = { x: d[0], y: d[1], r: r, innerR: m, start: p, end: k, rounded: c.rounded };
            b.startR = r;
            e
              ? ((r = m.d), e.animate(f.extend({ fill: n }, m)), r && (m.d = r))
              : ((b.graphic = e = t.arc(m).attr({ fill: n, 'sweep-flag': 0 }).add(a.group)),
                a.chart.styledMode ||
                  ('square' !== c.linecap && e.attr({ 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
                  e.attr({ stroke: c.borderColor || 'none', 'stroke-width': c.borderWidth || 0 })));
            e && e.addClass(b.getClassName(), !0);
          });
        },
        animate: function (a) {
          a || ((this.startAngleRad = this.thresholdAngleRad), f.seriesTypes.pie.prototype.animate.call(this, a));
        },
      }
    );
  })(g);
});
//# sourceMappingURL=solid-gauge.js.map
