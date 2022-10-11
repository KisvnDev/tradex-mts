import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import MiniHighchart from 'components/Charts/HighCharts/MiniHighChart';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { formatStringToDate, formatDateToString } from 'utils/datetime';
import { getMiniChartData } from './actions';
import globalStyles from 'styles';
import config from 'config';

interface IMiniChartProps extends React.ClassAttributes<MiniChart> {
  currentSymbol: ISymbolInfo;

  miniChartData: IObject | null;

  getMiniChartData(payload: IObject): void;
}

class MiniChart extends React.Component<IMiniChartProps> {
  private refresh = true;

  constructor(props: IMiniChartProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.requestData(this.props.currentSymbol);
  }

  shouldComponentUpdate(nextProps: IMiniChartProps) {
    if (
      nextProps.currentSymbol !== this.props.currentSymbol &&
      nextProps.currentSymbol.s !== this.props.currentSymbol.s
    ) {
      this.refresh = true;
      this.requestData(nextProps.currentSymbol);
      return true;
    }

    if (
      nextProps.miniChartData !== this.props.miniChartData &&
      nextProps.miniChartData &&
      nextProps.miniChartData.code === this.props.currentSymbol.s
    ) {
      return true;
    }

    return false;
  }

  private requestData = (currentSymbol: ISymbolInfo) => {
    const params = {
      symbol: currentSymbol,
      minuteUnit: 1,
      fromTime: `${formatDateToString(new Date())}000000`,
      fetchCount: 300,
    };
    this.props.getMiniChartData(params);
  };

  render() {
    let refresh = this.refresh;
    this.refresh = false;

    const data = [];

    if (refresh !== true && this.props.miniChartData && this.props.miniChartData.data) {
      for (let i = (this.props.miniChartData.data as IObject[]).length - 1; i >= 0; i--) {
        if (config.usingNewKisCore) {
          const date = formatStringToDate(
            (this.props.miniChartData.data[i] as IObject).t as string,
            'yyyyMMddHHmmss'
          ).getTime();
          data.push([
            date, // the date
            (this.props.miniChartData.data[i] as IObject).l, // the volume
          ]);
        } else {
          const date = formatStringToDate(
            (this.props.miniChartData.data[i] as IObject).time as string,
            'yyyyMMddHHmmss'
          ).getTime();
          data.push([
            date, // the date
            (this.props.miniChartData.data[i] as IObject).last, // the volume
          ]);
        }
      }
    } else {
      return <ActivityIndicator />;
    }

    const referenceValue =
      global.symbolData &&
      global.symbolData[this.props.currentSymbol.s] &&
      global.symbolData[this.props.currentSymbol.s].re;
    const conf = {
      chart: {
        type: 'area',
      },

      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },

      title: {
        enabled: false,
      },
      plotOptions: {
        series: {
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
      yAxis: {
        gridLineWidth: 0,
        labels: {
          enabled: false,
        },
        crosshair: false,
        plotLines: [
          {
            color: '#20262E',
            width: 1,
            value: referenceValue,
            dashStyle: 'dash',
          },
        ],
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
      },
      xAxis: {
        visible: false,
        crosshair: false,
      },

      series: [
        {
          name: 'Price',
          lineWidth: 0.5,
          data,
          threshold: referenceValue,
          cropThreshold: 100000,
          zones: [
            {
              color: 'rgba(255, 0, 0, 1)',
              value: referenceValue,
              fillColor: {
                linearGradient: {
                  x1: -3,
                  y1: 2,
                  x2: 0,
                  y2: 0,
                },
                stops: [
                  [0, 'rgba(255, 0, 0, 1)'],
                  [1, 'rgba(255, 0, 0, 0.05)'],
                ],
              },
            },
            {
              color: 'rgb(0, 128, 0)',
              fillColor: {
                linearGradient: {
                  x1: 2,
                  y1: -3,
                  x2: 0,
                  y2: 0,
                },
                stops: [
                  [0, 'rgba(142, 176, 212, 1)'],
                  [1, 'rgba(142, 176, 212, 0.05)'],
                ],
              },
            },
          ],
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
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
        <MiniHighchart config={conf} options={options} stock={true} originWhitelist={['']} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  miniChartData: state.miniChartData,
});

const mapStateToIndexProps = (state: IState) => ({
  currentSymbol: state.currentIndex,
  miniChartData: state.miniChartData,
});

const mapDispatchToProps = {
  getMiniChartData,
};

export const SymbolMiniChart = connect(mapStateToProps, mapDispatchToProps)(MiniChart);

export const IndexMiniChart = connect(mapStateToIndexProps, mapDispatchToProps)(MiniChart);
