import React from 'react';
import { View, ActivityIndicator, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import config from 'config';
import SheetData, { SheetData as SheetDataPlain, ISheetDataConfig } from 'components/SheetData';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import CandleStick from 'components/CandleStick';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolData, ISymbolInfo } from 'interfaces/market';
import { formatTimeToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import { reverseMarketData } from 'utils/market';
import { SYMBOL_TYPE } from 'global';
import { getQuoteSymbolData } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import { last } from 'lodash';
import UIText from 'components/UiText';

interface IQuoteTabProps extends React.ClassAttributes<QuoteTab> {
  currentSymbol: ISymbolInfo;
  symbolQuoteData: IObject | null;
  currentSymbolQuote: ISymbolData | null;

  getQuoteSymbolData(data: IObject): void;
}

class QuoteTab extends React.Component<IQuoteTabProps> {
  private refresh = true;
  private configGrid: ISheetDataConfig;
  private sheetDataRef: SheetDataPlain;

  constructor(props: IQuoteTabProps) {
    super(props);
    this.initConfig();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.requestData(this.props.currentSymbol);
    });
  }

  shouldComponentUpdate(nextProps: IQuoteTabProps) {
    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      this.initConfig();

      this.refresh = true;
      this.setState({}, () => this.requestData(nextProps.currentSymbol));
      return true;
    }

    if (this.props.currentSymbolQuote !== nextProps.currentSymbolQuote) {
      if (
        nextProps.currentSymbolQuote != null &&
        nextProps.currentSymbolQuote.s === nextProps.currentSymbol.s &&
        this.sheetDataRef != null
      ) {
        this.sheetDataRef.addRowDataToTop((reverseMarketData(nextProps.currentSymbolQuote) as unknown) as IObject);
      }

      return false;
    }

    if (
      this.props.symbolQuoteData !== nextProps.symbolQuoteData &&
      nextProps.symbolQuoteData != null &&
      nextProps.symbolQuoteData.code === nextProps.currentSymbol.s
    ) {
      return true;
    }

    return false;
  }

  private initConfig = () => {
    this.configGrid = {
      columnFrozen: 1,
      header: [
        {
          label: 'Time',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignCenter}>
              {formatTimeToDisplay(rowData.time as string, 'HH:mm:ss', 'HHmmss')}
            </UIText>
          ),
        },
        {
          label: 'Last',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText
              allowFontScaling={false}
              style={[
                globalStyles.alignRight,
                (rowData.rate as number) > 0
                  ? globalStyles.up
                  : (rowData.change as number) < 0
                  ? globalStyles.down
                  : globalStyles.reference,
              ]}
            >
              {formatNumber(rowData.last as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Change',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText
              allowFontScaling={false}
              style={[
                globalStyles.alignRight,
                (rowData.rate as number) > 0
                  ? globalStyles.up
                  : (rowData.change as number) < 0
                  ? globalStyles.down
                  : globalStyles.reference,
              ]}
            >
              {formatNumber(rowData.change as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Rate',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <View style={styles.changeRate}>
              {(rowData.rate as number) > 0 ? (
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
              )}
            </View>
          ),
        },
        {
          label: 'Trading Volume',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.tradingVolume as number)}
            </UIText>
          ),
        },
        {
          label: 'Trading Amount (mils)',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.tradingValue as number, 2)}
            </UIText>
          ),
        },
      ],
    };

    if (this.props.currentSymbol.t !== SYMBOL_TYPE.INDEX) {
      this.configGrid = {
        ...this.configGrid,
        header: this.configGrid.header.reduce((arr, value) => {
          if (value.label === 'Trading Volume') {
            return [
              ...arr,
              {
                label: 'Matching Volume',
                width: 100,
                element: (key: string, rowData: IObject, index: number) => (
                  <View style={styles.item}>
                    <UIText
                      allowFontScaling={false}
                      style={[
                        globalStyles.alignRight,
                        rowData.matchedBy === 'BID' ? globalStyles.down : globalStyles.up,
                      ]}
                    >
                      {formatNumber(rowData.matchingVolume as number, 2)}
                    </UIText>
                  </View>
                ),
              },
              value,
            ];
          }

          return [...arr, value];
        }, []),
      };
    }
    this.configGrid.header.push({
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
    });
  };

  private requestData = (symbol: ISymbolInfo, loadMore = false) => {
    const params: IObject = {
      symbol,
      fetchCount: config.fetchCount,
      loadMore,
    };

    if (loadMore) {
      const data = last(
        (this.props.symbolQuoteData?.data || this.props.symbolQuoteData?.nextData) as IObject[]
      ) as IObject;

      if (data?.tradingValue) {
        params.lastTradingVolume = data?.tradingVolume as number;
      }
    }

    this.props.getQuoteSymbolData(params);
  };

  private requestLoadMore = () => {
    this.requestData(this.props.currentSymbol, true);
  };

  private handleRefreshData = () => {
    this.requestData(this.props.currentSymbol);
  };

  render() {
    let refresh = this.refresh;
    this.refresh = false;
    if (this.props.symbolQuoteData == null) {
      refresh = true;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.symbolQuoteData == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            ref={(ref: SheetDataPlain) => (this.sheetDataRef = ref)}
            config={this.configGrid}
            data={this.props.symbolQuoteData.data as IObject[]}
            nextData={this.props.symbolQuoteData.nextData as IObject[]}
            loadMore={this.props.symbolQuoteData.next as boolean}
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
  symbolQuoteData: state.symbolQuoteData,
  currentSymbolQuote: state.currentSymbolQuote,
});

const mapStateToIndexProps = (state: IState) => ({
  currentSymbol: state.currentIndex,
  symbolQuoteData: state.symbolQuoteData,
  currentSymbolQuote: state.currentIndexQuote,
});

const mapDispatchToProps = {
  getQuoteSymbolData,
};

export const SymbolQuoteTab = withErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(QuoteTab),
  Fallback,
  handleError
);

export const IndexQuoteTab = withErrorBoundary(
  connect(mapStateToIndexProps, mapDispatchToProps)(QuoteTab),
  Fallback,
  handleError
);
