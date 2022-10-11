/* tslint:disable */
import React from 'react';
import { ScrollView, NativeSyntheticEvent } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';
import { handleError } from 'utils/common';
import HighChart from '../HighCharts/HighChart';
import Fallback from 'components/Fallback';
import { IObject, IWindow } from 'interfaces/common';
import { formatDateToString, formatTimeToDisplay } from 'utils/datetime';
import globalStyles from 'styles';
import config from 'config';

const HIGHCHART_TIMEZONE_OFFSET = -840;

declare var window: IWindow;

interface ITickChartProps extends React.ClassAttributes<TickChart> {
  code: string;
  next?: boolean;
  data: IObject[];
  frequency: number;
  defaultPointCount?: number;

  loadMore?(): void;
}

class TickChart extends React.Component<ITickChartProps> {
  static defaultProps = {
    defaultPointCount: 100,
  };

  private tickData: IObject[] = [];
  private volume: IObject[] = [];
  private highChart: HighChart;

  constructor(props: ITickChartProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: ITickChartProps) {
    if (nextProps.code === this.props.code) {
      if (nextProps.next === true) {
        const { tickData, volume } = this.processData(nextProps.data);

        this.tickData = this.tickData.concat(tickData);
        this.volume = this.volume.concat(volume);

        (this.highChart.webview as any).postMessage(
          JSON.stringify({
            ohlc: this.tickData,
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
    const tickData: IObject[] = [];
    const volume: IObject[] = [];

    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      if (config.usingNewKisCore) {
        const point = {
          x: item.c as number,
          y: item.l as number,
          name: formatTimeToDisplay(formatDateToString(new Date((item.t as number) * 1000)) as string) as string,
        };

        tickData.push(point as any);

        let color = 'green';
        if (i === data.length - 1 || item.pv! > data[i + 1].pv!) {
          color = 'green';
        } else {
          color = 'red';
        }
        volume.push(
          {
            x: item.c as number,
            y: item.pv as number,
            name: formatTimeToDisplay(formatDateToString(new Date((item.t as number) * 1000)) as string) as string,
            color,
          } // the volume
        );
      } else {
        const point = {
          x: item.lastValue as number,
          y: item.last as number,
          name: formatTimeToDisplay(item.time as string) as string,
        };

        tickData.push(point as any);

        let color = 'green';
        if (i === data.length - 1 || item.periodTradingVolume! > data[i + 1].periodTradingVolume!) {
          color = 'green';
        } else {
          color = 'red';
        }
        volume.push(
          {
            x: item.lastValue as number,
            y: item.periodTradingVolume as number,
            name: formatTimeToDisplay(item.time as string) as string,
            color,
          } // the volume
        );
      }
    }

    return { tickData, volume };
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
    const { tickData, volume } = this.processData(this.props.data);
    this.tickData = tickData;
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
      xAxis: {
        range: this.props.defaultPointCount! * this.props.frequency,
        events: {
          afterSetExtremes(e: any) {
            const extremes = e.target.chart.xAxis[0].getExtremes();
            if (extremes && extremes.min === extremes.dataMin) {
              window.ReactNativeWebView.postMessage('loadmore');
              e.target.chart.showLoading();
            }
          },
        },
        labels: {
          enabled: false,
        },
      },
      yAxis: [
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Ticks',
          },
          height: '60%',
          lineWidth: 1,
          resize: {
            enabled: true,
          },
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
          lineWidth: 1,
        },
      ],

      series: [
        {
          name: 'Ticks',
          data: this.tickData,
          step: true,
          tooltip: {
            valueDecimals: 2,
          },
          color: 'black',
        },
        {
          type: 'column',
          name: 'Volume',
          data: this.volume,
          yAxis: 1,
          tooltip: {
            valueDecimals: 2,
          },
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
        decimalPoint: '.',
        thousandsSep: ',',
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

export default withErrorBoundary(TickChart, Fallback, handleError);
