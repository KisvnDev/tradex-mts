import React from 'react';
import { View, ActivityIndicator, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import CandleStick from 'components/CandleStick';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolInfo, ISymbolData } from 'interfaces/market';
import { formatDateToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import { PERIOD_OPTIONS } from 'global';
import { getHistorySymbolData } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IHistoryTabProps extends React.ClassAttributes<HistoryTab> {
  symbolPeriodData: IObject | null;
  currentSymbol: ISymbolInfo;
  period: PERIOD_OPTIONS;
  symbolData?: ISymbolData;

  getHistorySymbolData(payload: IObject): void;
}

class HistoryTab extends React.Component<IHistoryTabProps> {
  private refresh = false;
  private configGrid: ISheetDataConfig;

  constructor(props: IHistoryTabProps) {
    super(props);

    this.configGrid = config.usingNewKisCore
      ? {
          columnFrozen: 1,
          header: [
            {
              label: 'Date',
              width: 95,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText allowFontScaling={false} style={globalStyles.alignCenter}>
                  {formatDateToDisplay((rowData.ti ?? rowData.d) as string)}
                </UIText>
              ),
            },
            {
              label: 'Last',
              width: 70,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText
                  allowFontScaling={false}
                  style={[
                    globalStyles.alignRight,
                    (rowData.ch as number) === 0
                      ? globalStyles.reference
                      : (rowData.ch as number) > 0
                      ? globalStyles.up
                      : globalStyles.down,
                  ]}
                >
                  {formatNumber(rowData.c as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Change',
              width: 65,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText
                  allowFontScaling={false}
                  style={[
                    globalStyles.alignRight,
                    (rowData.ch as number) === 0
                      ? globalStyles.reference
                      : (rowData.ch as number) > 0
                      ? globalStyles.up
                      : globalStyles.down,
                  ]}
                >
                  {formatNumber(rowData.ch as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Rate',
              width: 80,
              element: (key: string, rowData: IObject, index: number) => (
                <View style={styles.rateContainer}>
                  {this.props.currentSymbol.t === 'INDEX' ? (
                    Number(rowData.ra) > 0 ? (
                      <View style={styles.rate}>
                        <FontAwesomeIcon style={[styles.iconChange, globalStyles.up]} name="caret-up" />
                        <UIText allowFontScaling={false} style={[globalStyles.alignRight, globalStyles.up]}>
                          {formatNumber(rowData.ra as number, 2)}%
                        </UIText>
                      </View>
                    ) : Number(rowData.ra) < 0 ? (
                      <View style={styles.rate}>
                        <FontAwesomeIcon style={[styles.iconChange, globalStyles.down]} name="caret-down" />
                        <UIText allowFontScaling={false} style={[globalStyles.alignRight, globalStyles.down]}>
                          {formatNumber(rowData.ra as number, 2)}%
                        </UIText>
                      </View>
                    ) : (
                      <View style={styles.steadyRate}>
                        <UIText allowFontScaling={false} style={[globalStyles.alignRight, globalStyles.reference]}>
                          {formatNumber(rowData.ra as number, 2)}%
                        </UIText>
                      </View>
                    )
                  ) : (
                    <View style={(rowData.ch as number) !== 0 ? styles.rate : styles.steadyRate}>
                      {(rowData.ch as number) !== 0 && (
                        <FontAwesomeIcon
                          style={[styles.iconChange, (rowData.ch as number) > 0 ? globalStyles.up : globalStyles.down]}
                          name={`caret-${(rowData.ch as number) > 0 ? 'up' : 'down'}`}
                        />
                      )}
                      <UIText
                        allowFontScaling={false}
                        style={[
                          globalStyles.alignRight,
                          rowData.ch === 0
                            ? globalStyles.reference
                            : (rowData.ch as number) > 0
                            ? globalStyles.up
                            : globalStyles.down,
                        ]}
                      >
                        {formatNumber(rowData.ra as number, 2)}%
                      </UIText>
                    </View>
                  )}
                </View>
              ),
            },
            {
              label: 'Trading Volume',
              width: 100,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText allowFontScaling={false} style={globalStyles.alignRight}>
                  {formatNumber(rowData.vo as number)}
                </UIText>
              ),
            },
            {
              label: 'Trading Value (mils)',
              width: 100,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText allowFontScaling={false} style={globalStyles.alignRight}>
                  {formatNumber(rowData.va as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'OHLC',
              width: 70,
              element: (key: string, rowData: IObject, index: number) => (
                <View style={styles.candleStickContainer}>
                  <CandleStick
                    size={1}
                    height={35}
                    data={{
                      s: rowData.mb as string,
                      o: rowData.o as number,
                      h: rowData.h as number,
                      l: rowData.l as number,
                      c: rowData.c as number,
                    }}
                  />
                </View>
              ),
            },
          ],
        }
      : {
          columnFrozen: 1,
          header: [
            {
              label: 'Date',
              width: 95,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText allowFontScaling={false} style={globalStyles.alignCenter}>
                  {formatDateToDisplay(rowData.date as string)}
                </UIText>
              ),
            },
            {
              label: 'Last',
              width: 70,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText
                  allowFontScaling={false}
                  style={[
                    globalStyles.alignRight,
                    (rowData.change as number) === 0
                      ? globalStyles.reference
                      : (rowData.change as number) > 0
                      ? globalStyles.up
                      : globalStyles.down,
                  ]}
                >
                  {formatNumber(rowData.last as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Change',
              width: 65,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText
                  allowFontScaling={false}
                  style={[
                    globalStyles.alignRight,
                    (rowData.change as number) === 0
                      ? globalStyles.reference
                      : (rowData.change as number) > 0
                      ? globalStyles.up
                      : globalStyles.down,
                  ]}
                >
                  {formatNumber(rowData.change as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Rate',
              width: 80,
              element: (key: string, rowData: IObject, index: number) => (
                <View style={styles.rateContainer}>
                  {this.props.currentSymbol.t === 'INDEX' ? (
                    Number(rowData.rate) > 0 ? (
                      <View style={styles.rate}>
                        <FontAwesomeIcon style={[styles.iconChange, globalStyles.up]} name="caret-up" />
                        <UIText allowFontScaling={false} style={[globalStyles.alignRight, globalStyles.up]}>
                          {formatNumber(rowData.rate as number, 2)}%
                        </UIText>
                      </View>
                    ) : Number(rowData.rate) < 0 ? (
                      <View style={styles.rate}>
                        <FontAwesomeIcon style={[styles.iconChange, globalStyles.down]} name="caret-down" />
                        <UIText allowFontScaling={false} style={[globalStyles.alignRight, globalStyles.down]}>
                          {formatNumber(rowData.rate as number, 2)}%
                        </UIText>
                      </View>
                    ) : (
                      <View style={styles.steadyRate}>
                        <UIText allowFontScaling={false} style={[globalStyles.alignRight, globalStyles.reference]}>
                          {formatNumber(rowData.rate as number, 2)}%
                        </UIText>
                      </View>
                    )
                  ) : (
                    <View style={(rowData.change as number) !== 0 ? styles.rate : styles.steadyRate}>
                      {(rowData.change as number) !== 0 && (
                        <FontAwesomeIcon
                          style={[
                            styles.iconChange,
                            (rowData.change as number) > 0 ? globalStyles.up : globalStyles.down,
                          ]}
                          name={`caret-${(rowData.change as number) > 0 ? 'up' : 'down'}`}
                        />
                      )}
                      <UIText
                        allowFontScaling={false}
                        style={[
                          globalStyles.alignRight,
                          rowData.change === 0
                            ? globalStyles.reference
                            : (rowData.change as number) > 0
                            ? globalStyles.up
                            : globalStyles.down,
                        ]}
                      >
                        {formatNumber(rowData.rate as number, 2)}%
                      </UIText>
                    </View>
                  )}
                </View>
              ),
            },
            {
              label: 'Trading Volume',
              width: 100,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText allowFontScaling={false} style={globalStyles.alignRight}>
                  {formatNumber(rowData.tradingVolume as number)}
                </UIText>
              ),
            },
            {
              label: 'Trading Value (mils)',
              width: 100,
              element: (key: string, rowData: IObject, index: number) => (
                <UIText allowFontScaling={false} style={globalStyles.alignRight}>
                  {formatNumber(rowData.tradingValue as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'OHLC',
              width: 70,
              element: (key: string, rowData: IObject, index: number) => (
                <View style={styles.candleStickContainer}>
                  <CandleStick
                    size={1}
                    height={35}
                    data={{
                      s: rowData.code as string,
                      o: rowData.open as number,
                      h: rowData.high as number,
                      l: rowData.low as number,
                      c: rowData.last as number,
                    }}
                  />
                </View>
              ),
            },
          ],
        };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.requestData(this.props.currentSymbol, this.props.period);
    });
  }

  shouldComponentUpdate(nextProps: IHistoryTabProps) {
    if (this.props.currentSymbol !== nextProps.currentSymbol || this.props.period !== nextProps.period) {
      this.refresh = true;
      this.setState({}, () => this.requestData(nextProps.currentSymbol, nextProps.period));
      return true;
    }

    if (
      this.props.symbolPeriodData !== nextProps.symbolPeriodData &&
      nextProps.symbolPeriodData != null &&
      nextProps.symbolPeriodData.code === nextProps.currentSymbol.s
    ) {
      return true;
    }

    return false;
  }

  private requestData = (symbol: ISymbolInfo, period: PERIOD_OPTIONS, loadMore = false) => {
    const param = {
      symbol,
      periodType: period,
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.getHistorySymbolData(param);
  };

  private requestLoadMore = () => {
    this.requestData(this.props.currentSymbol, this.props.period, true);
  };

  private handleRefreshData = () => {
    this.requestData(this.props.currentSymbol, this.props.period);
  };

  render() {
    let refresh = this.refresh;
    this.refresh = false;
    if (this.props.symbolPeriodData == null) {
      refresh = true;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.symbolPeriodData == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.symbolPeriodData.data as IObject[]}
            nextData={this.props.symbolPeriodData.nextData as IObject[]}
            loadMore={this.props.symbolPeriodData.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolPeriodData: state.symbolPeriodData,
  symbolData: state.currentSymbolQuote,
});

const mapStateToIndexProps = (state: IState) => ({
  currentSymbol: state.currentIndex,
  symbolPeriodData: state.symbolPeriodData,
});

const mapDispatchToProps = {
  getHistorySymbolData,
};

export const SymbolHistoryTab = withErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(HistoryTab),
  Fallback,
  handleError
);

export const IndexHistoryTab = withErrorBoundary(
  connect(mapStateToIndexProps, mapDispatchToProps)(HistoryTab),
  Fallback,
  handleError
);
