import React from 'react';
import { View, ActivityIndicator, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { formatDateToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import { getForeignerSymbolData } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IForeignerTabProps extends React.ClassAttributes<ForeignerTab> {
  symbolForeignerData: IObject | null;
  currentSymbol: ISymbolInfo;

  getForeignerSymbolData(payload: IObject): void;
}

class ForeignerTab extends React.Component<IForeignerTabProps> {
  private refresh = false;
  private configGrid: ISheetDataConfig;

  constructor(props: IForeignerTabProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 1,
      header: [
        {
          label: 'Date',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignCenter}>
              {formatDateToDisplay(rowData.date as string)}
            </UIText>
          ),
        },
        {
          label: 'Net Volume',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber((rowData.foreignerBuyVolume as number) - (rowData.foreignerSellVolume as number))}
            </UIText>
          ),
        },
        {
          label: 'Buy Volume',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.foreignerBuyVolume as number)}
            </UIText>
          ),
        },
        {
          label: 'Sell Volume',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.foreignerSellVolume as number)}
            </UIText>
          ),
        },
        {
          label: 'Hold Volume',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.foreignerHoldVolume as number)}
            </UIText>
          ),
        },
        {
          label: 'Room',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.foreignerCurrentRoom as number)}
            </UIText>
          ),
        },
        {
          label: 'Hold Ratio',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.foreignerHoldRatio as number, 2)}%
            </UIText>
          ),
        },
        {
          label: 'Buyable Ratio',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={globalStyles.alignRight}>
              {formatNumber(rowData.foreignerBuyableRatio as number, 2)}%
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.requestData(this.props.currentSymbol);
    });
  }

  shouldComponentUpdate(nextProps: IForeignerTabProps) {
    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      this.refresh = true;
      this.setState({}, () => this.requestData(nextProps.currentSymbol));
      return true;
    }

    if (
      this.props.symbolForeignerData !== nextProps.symbolForeignerData &&
      nextProps.symbolForeignerData != null &&
      nextProps.symbolForeignerData.code === nextProps.currentSymbol.s
    ) {
      return true;
    }

    return false;
  }

  private requestData = (symbol: ISymbolInfo, loadMore = false) => {
    const param = {
      symbol,
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.getForeignerSymbolData(param);
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
    if (this.props.symbolForeignerData == null) {
      refresh = true;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.symbolForeignerData == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.symbolForeignerData.data as IObject[]}
            nextData={this.props.symbolForeignerData.nextData as IObject[]}
            loadMore={this.props.symbolForeignerData.next as boolean}
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
  symbolForeignerData: state.symbolForeignerData,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    getForeignerSymbolData,
  })(ForeignerTab),
  Fallback,
  handleError
);
