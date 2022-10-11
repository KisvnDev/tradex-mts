/* tslint:disable */

import React from 'react';
import { ScrollView, NativeSyntheticEvent } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';
import { handleError } from 'utils/common';
import { formatStringToDate } from 'utils/datetime';
import Fallback from 'components/Fallback';
import HighChart from '../HighCharts/HighChart';
import { IObject, IWindow } from 'interfaces/common';
import { ISymbolData } from 'interfaces/market';
import { IState } from 'redux-sagas/reducers';
import globalStyles from 'styles';
import config from 'config';

const HIGHCHART_TIMEZONE_OFFSET = -840;

declare var window: IWindow;

interface IChartProps extends React.ClassAttributes<Chart> {
  code: string;
  type: 'minutes' | 'period';
  next?: boolean;
  data: IObject[];
  frequency: number;
  defaultPointCount?: number;

  quote: ISymbolData | null;

  loadMore?(): void;
}

class Chart extends React.Component<IChartProps> {
  static defaultProps = {
    defaultPointCount: 100,
  };

  private ohlc: {
    x: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[] = [];
  private volume: {
    x: number;
    y: number;
    vo?: number;
    color?: string;
  }[] = [];
  private highChart: HighChart;
  private isUsingNewKisCore = config.usingNewKisCore;

  constructor(props: IChartProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: IChartProps) {
    if (nextProps.quote !== this.props.quote) {
      if (nextProps.quote != null && nextProps.quote.s === nextProps.code) {
        if (nextProps.type === 'period') {
          const ohlc = this.ohlc[this.ohlc.length - 1];
          const volume = this.volume[this.volume.length - 1];

          if (nextProps.quote.c != null) {
            ohlc.close = nextProps.quote.c;
          }

          if (nextProps.quote.h != null && ohlc.high < nextProps.quote.h) {
            ohlc.high = nextProps.quote.h;
          }

          if (nextProps.quote.l != null && ohlc.low > nextProps.quote.l) {
            ohlc.low = nextProps.quote.l;
          }

          if (nextProps.quote.vo != null) {
            volume.y = nextProps.quote.vo;
          }

          (this.highChart.webview as any).postMessage(
            JSON.stringify({
              type: 'quote',
              ohlc,
              volume,
            })
          );
        } else {
          let ohlc = this.ohlc[this.ohlc.length - 1];
          let volume = this.volume[this.volume.length - 1];

          if (nextProps.quote.ti != null) {
            const dateTime = formatStringToDate(nextProps.quote.ti, 'HHmmss');
            dateTime.setSeconds(0);
            const time = dateTime.getTime();

            if (
              nextProps.quote.o != null &&
              nextProps.quote.h != null &&
              nextProps.quote.l != null &&
              nextProps.quote.c != null
            ) {
              if (time === ohlc.x) {
                ohlc.close = nextProps.quote.c;

                if (ohlc.high < nextProps.quote.c) {
                  ohlc.high = nextProps.quote.c;
                }

                if (ohlc.low > nextProps.quote.c) {
                  ohlc.low = nextProps.quote.c;
                }
              } else {
                ohlc = {
                  x: time,
                  open: nextProps.quote.c,
                  high: nextProps.quote.c,
                  low: nextProps.quote.c,
                  close: nextProps.quote.c,
                };

                this.ohlc.push(ohlc);
              }
            }

            if (nextProps.quote.vo != null && volume.vo != null) {
              if (time === volume.x) {
                volume.y += volume.vo - nextProps.quote.vo;
              } else {
                volume = {
                  x: time,
                  y: volume.vo - nextProps.quote.vo,
                };

                this.volume.push(volume);
              }
            }

            (this.highChart.webview as any).postMessage(
              JSON.stringify({
                type: 'quote',
                newPoint: time === volume.x,
                periodType: 'minutes',
                totalOhlc: this.ohlc,
                totalVolume: this.volume,
                ohlc,
                volume,
              })
            );
          }
        }
      }
      return false;
    }

    if (nextProps.code === this.props.code) {
      if (nextProps.next === true) {
        const { ohlc, volume } = this.processData(nextProps.data);

        this.ohlc = ohlc.concat(this.ohlc);
        this.volume = volume.concat(this.volume);

        (this.highChart.webview as any).postMessage(
          JSON.stringify({
            type: 'more',
            ohlc: this.ohlc,
            volume: this.volume,
          })
        );
      }
      return false;
    } else {
      return true;
    }
  }

  private processData = (data: IObject[]) => {
    const ohlc: {
      x: number;
      open: number;
      high: number;
      low: number;
      close: number;
    }[] = [];
    const volume: {
      x: number;
      y: number;
      vo?: number;
      color?: string;
    }[] = [];
    const timeFormat = this.props.type === 'period' ? 'yyyyMMdd' : 'yyyyMMddHHmmss';

    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];

      if (this.isUsingNewKisCore) {
        const date = formatStringToDate((item.t ?? item.d) as string, timeFormat).getTime();
        const point = {
          x: date as number,
          open: item.o as number, // open
          high: item.h as number, // high
          low: item.l as number, // low
          close: item.c as number, // close
        };

        ohlc.push(point as any);

        let color = 'green';

        if (this.props.type === 'minutes') {
          if (i == data.length - 1 || (item.pv as number) > (data[i + 1].pv as number)) {
            color = 'green';
          } else {
            color = 'red';
          }

          volume.push(
            {
              x: date as number, // the date
              y: item.pv as number,
              vo: item.vo as number,
              color: color,
            } // the volume
          );
        } else {
          if (i == data.length - 1 || (item.vo as number) > (data[i + 1].vo as number)) {
            color = 'green';
          } else {
            color = 'red';
          }

          volume.push(
            {
              x: date as number, // the date
              y: item.vo as number,
              color: color,
            } // the volume
          );
        }
      } else {
        const date = formatStringToDate(
          this.props.type === 'period' ? (item.date as string) : (item.time as string),
          timeFormat
        ).getTime();
        const point = {
          x: date as number,
          open: item.open as number, // open
          high: item.high as number, // high
          low: item.low as number, // low
          close: item.last as number, // close
        };

        ohlc.push(point as any);

        let color = 'green';

        if (this.props.type === 'minutes') {
          if (
            i == data.length - 1 ||
            (item.periodTradingVolume as number) > (data[i + 1].periodTradingVolume as number)
          ) {
            color = 'green';
          } else {
            color = 'red';
          }

          volume.push(
            {
              x: date as number, // the date
              y: item.periodTradingVolume as number,
              vo: item.tradingVolume as number,
              color: color,
            } // the volume
          );
        } else {
          if (i == data.length - 1 || (item.tradingVolume as number) > (data[i + 1].tradingVolume as number)) {
            color = 'green';
          } else {
            color = 'red';
          }

          volume.push(
            {
              x: date as number, // the date
              y: item.tradingVolume as number,
              color: color,
            } // the volume
          );
        }
      }
    }
    return { ohlc, volume };
  };

  private onMessage = (event: NativeSyntheticEvent<WebViewMessage>) => {
    let message = event.nativeEvent.data;
    if (message === 'loadmore') {
      if (this.props.loadMore) {
        this.props.loadMore();
      }
    }
  };

  render() {
    const { ohlc, volume } = this.processData(this.props.data);
    this.ohlc = ohlc;
    this.volume = volume;

    const conf = {
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: true,
      },
      exporting: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },

      chart: {
        events: {
          load: function () {
            try {
              const priceYAxis = (this as any).yAxis[0];
              const points = (this as any).series[0].points;
              if (points.length > 0) {
                (this as any).yValue = points[points.length - 1].y;
                (this as any).y = priceYAxis.toPixels((this as any).yValue);

                (this as any).staticLabel = (this as any).renderer
                  .label((this as any).yValue, (this as any).plotWidth + 9, (this as any).y - 9)
                  .attr({ zIndex: 11, padding: 1, r: 1, fill: 'green' })
                  .css({ color: 'white', fontSize: '9px' })
                  .add();
                const path = [
                  'M',
                  (this as any).plotLeft,
                  (this as any).y,
                  'L',
                  (this as any).plotLeft + (this as any).plotWidth,
                  (this as any).y,
                ];
                // draw lines
                (this as any).staticCrossLine = (this as any).renderer
                  .path(path)
                  .attr({
                    'stroke-width': 1,
                    stroke: 'green',
                    zIndex: 10,
                  })
                  .add();
              }
            } catch (error) {
              //Swallow
            }
          },
        },
      },
      xAxis: {
        range: this.props.defaultPointCount! * this.props.frequency,
        events: {
          afterSetExtremes: function (e: any) {
            const extremes = e.target.chart.xAxis[0].getExtremes();
            if (extremes && extremes.min === extremes.dataMin) {
              window.ReactNativeWebView.postMessage('loadmore');
              e.target.chart.showLoading();
            }
          },
        },
      },
      yAxis: [
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],

      tooltip: {
        split: true,
      },

      series: [
        {
          type: 'candlestick',
          name: this.props.code,
          data: this.ohlc,
          dataGrouping: {
            enabled: false,
          },
          maxPointWidth: 20,
          minPointLength: 3,
          cropThreshold: 100000,
        },
        {
          type: 'column',
          name: 'Volume',
          data: this.volume,
          yAxis: 1,
          dataGrouping: {
            enabled: false,
          },
          maxPointWidth: 20,
          minPointLength: 3,
          cropThreshold: 100000,
        },
      ],
      time: {
        timezoneOffset: HIGHCHART_TIMEZONE_OFFSET,
      },
    };
    const options = {
      global: {
        useUTC: false,
      },
      lang: {
        decimalPoint: ',',
        thousandsSep: '.',
      },
    };
    return (
      <ScrollView scrollEnabled={false} contentContainerStyle={globalStyles.chartContainer}>
        <HighChart
          ref={(ref: HighChart) => (this.highChart = ref)}
          onMessage={this.onMessage}
          config={conf}
          options={options}
          stock={true}
          originWhitelist={['']}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  quote: state.currentSymbolQuote,
});

const mapStateToIndexProps = (state: IState) => ({
  quote: state.currentIndexQuote,
});

export const SymbolChart = withErrorBoundary(connect(mapStateToProps)(Chart), Fallback, handleError);

export const IndexChart = withErrorBoundary(connect(mapStateToIndexProps)(Chart), Fallback, handleError);
