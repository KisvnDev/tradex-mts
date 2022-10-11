import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { goToBiz } from 'navigations';
import config from 'config';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import { formatNumber, handleError } from 'utils/common';
import { SYSTEM_TYPE, ORDER_KIND, SELL_BUY_TYPE } from 'global';
import UserInactivity from 'components/UserInactivity';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { querySellableOddlotStocks } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ISellableOddlotStocksProps extends React.ClassAttributes<SellableOddlotStocks>, WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  sellableOddlotStocks: IObject | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  querySellableOddlotStocks(data: IObject): void;
}

class SellableOddlotStocks extends React.Component<ISellableOddlotStocksProps> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private symbolMap: { [s: string]: ISymbolInfo };

  constructor(props: ISellableOddlotStocksProps) {
    super(props);

    this.symbolMap = getSymbolMap(store.getState());

    this.configGrid = {
      columnFrozen: 3,
      header: [
        {
          label: '',
          width: 30,
          element: (key: string, rowData: IObject, index: number) =>
            (rowData.sellableQuantity as number) > 0 && (
              <TouchableOpacity onPress={() => this.onClickSell(rowData)}>
                <UIText
                  allowFontScaling={false}
                  style={[globalStyles.alignCenter, styles.data, globalStyles.down, globalStyles.boldText]}
                >
                  {this.props.t('Sell')}
                </UIText>
              </TouchableOpacity>
            ),
        },
        {
          label: 'Stock Code',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.stockCode, styles.data]}>
              {rowData.stockCode}
            </UIText>
          ),
        },
        {
          label: 'Balance',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.balanceQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Sellable Quantity',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {this.symbolMap && this.symbolMap[rowData.stockCode as string] ? rowData.sellableQuantity : 0}
            </UIText>
          ),
        },
        {
          label: 'Sell Today',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.todaySell as number)}
            </UIText>
          ),
        },
        {
          label: 'Buy Today',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.todayBuy as number)}
            </UIText>
          ),
        },
        {
          label: 'Sell T-1',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t1Sell as number)}
            </UIText>
          ),
        },
        {
          label: 'Buy T-1',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t1Buy as number)}
            </UIText>
          ),
        },
        {
          label: 'Sell T-2',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t2Sell as number)}
            </UIText>
          ),
        },
        {
          label: 'Buy T-2',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t2Buy as number)}
            </UIText>
          ),
        },
        {
          label: 'Order Today',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.orderToday as number)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ISellableOddlotStocksProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private onClickSell = (params: IObject) => {
    if (this.symbolMap) {
      const symbolInfo = this.symbolMap[params.stockCode as string];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        const sellableQuantity = params.sellableQuantity;

        params.availableQuantity = sellableQuantity;
        params.orderQuantity = sellableQuantity;

        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: ORDER_KIND.ODDLOT_ORDER,
            sellBuyType: SELL_BUY_TYPE.SELL,
          },
          this.props.componentId
        );
      }
    }
  };

  private requestData = (loadMore = false) => {
    const params = {
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.querySellableOddlotStocks(params);
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <UserInactivity>
        <View style={styles.container}>
          {refresh === true || this.props.sellableOddlotStocks == null ? (
            <ActivityIndicator />
          ) : (
            <SheetData
              config={this.configGrid}
              data={this.props.sellableOddlotStocks.data as IObject[]}
              nextData={this.props.sellableOddlotStocks.nextData as IObject[]}
              loadMore={this.props.sellableOddlotStocks.next as boolean}
              requestLoadMore={this.requestLoadMore}
              onRefreshData={this.handleRefreshData}
            />
          )}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  sellableOddlotStocks: state.sellableOddlotStocks,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setCurrentSymbol,
      querySellableOddlotStocks,
    })(SellableOddlotStocks)
  ),
  Fallback,
  handleError
);
