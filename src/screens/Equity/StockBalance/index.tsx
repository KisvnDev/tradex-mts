import React from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import RowData from 'components/RowData';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { goToBiz } from 'navigations';
import config from 'config';
import store from 'redux-sagas/store';
import { formatNumber, handleError } from 'utils/common';
import { SYSTEM_TYPE, ORDER_KIND, SELL_BUY_TYPE } from 'global';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import AccountPicker from 'components/AccountPicker';
import AccountBankPicker from 'components/AccountBankPicker';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount, IAccountBank } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryStockBalance } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IStockBalanceProps extends React.ClassAttributes<StockBalance>, WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  stockBalance: IObject | null;
  accountBank: IAccountBank | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryStockBalance(data: IObject): void;
}

class StockBalance extends React.Component<IStockBalanceProps> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private acquisitionValue: number = 0;
  private boughtT1: number = 0;
  private boughtT2: number = 0;

  constructor(props: IStockBalanceProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 4,
      header: [
        {
          label: '',
          width: 30,
          element: (key: string, rowData: IObject, index: number) =>
            (config.usingNewKisCore === false ? (rowData.sellableQuantity as number) : (rowData.sellable as number)) >
              0 && (
              <TouchableOpacity style={styles.touchArea} onPress={() => this.onClickSell(rowData)}>
                <UIText
                  allowFontScaling={false}
                  style={[globalStyles.alignRight, globalStyles.down, globalStyles.boldText, { fontSize: 9 }]}
                >
                  {this.props.t('Sell')}
                </UIText>
              </TouchableOpacity>
            ),
        },
        {
          label: 'Stock Code',
          width: 65,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText
              allowFontScaling={false}
              style={
                config.usingNewKisCore === false
                  ? (rowData.stockCode as string).length <= 7
                    ? [globalStyles.alignRight, styles.stockCode, styles.data]
                    : [globalStyles.alignRight, styles.stockCode, styles.bigdata]
                  : (rowData.symbol as string).length <= 7
                  ? [globalStyles.alignRight, styles.stockCode, styles.data]
                  : [globalStyles.alignRight, styles.stockCode, styles.bigdata]
              }
            >
              {config.usingNewKisCore === false ? rowData.stockCode : rowData.symbol}
            </UIText>
          ),
        },
        {
          label: config.usingNewKisCore === false ? 'Balance' : 'Total',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText
              allowFontScaling={false}
              style={[
                globalStyles.alignRight,
                styles.data,
                config.usingNewKisCore === false
                  ? rowData.profitLossRate === 0
                    ? globalStyles.steady
                    : (rowData.profitLossRate as number) > 0
                    ? globalStyles.up
                    : globalStyles.down
                  : rowData.unrealizedPLPercent === 0
                  ? globalStyles.steady
                  : (rowData.unrealizedPLPercent as number) > 0
                  ? globalStyles.up
                  : globalStyles.down,
              ]}
            >
              {config.usingNewKisCore === false
                ? formatNumber(rowData.balanceQuantity as number)
                : formatNumber(rowData.totalVol as number)}
            </UIText>
          ),
        },
        {
          label: 'Sellable Quantity',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {config.usingNewKisCore === false
                ? formatNumber(rowData.sellableQuantity as number)
                : formatNumber(rowData.sellable as number)}
            </UIText>
          ),
        },
        {
          label: 'Current Price',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {config.usingNewKisCore === false
                ? formatNumber(rowData.currentPrice as number, 2)
                : formatNumber(rowData.marketPrice as number)}
            </UIText>
          ),
        },
        {
          label: config.usingNewKisCore === false ? 'Profit/Loss rate' : 'Unrealizied P/L Rate',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText
              allowFontScaling={false}
              style={[
                globalStyles.alignRight,
                styles.data,
                config.usingNewKisCore === false
                  ? rowData.profitLossRate === 0
                    ? globalStyles.steady
                    : (rowData.profitLossRate as number) > 0
                    ? globalStyles.up
                    : globalStyles.down
                  : rowData.unrealizedPLPercent === 0
                  ? globalStyles.steady
                  : (rowData.unrealizedPLPercent as number) > 0
                  ? globalStyles.up
                  : globalStyles.down,
              ]}
            >
              {config.usingNewKisCore === false
                ? formatNumber(rowData.profitLossRate as number, 2)
                : formatNumber(rowData.unrealizedPLPercent as number, 2)}
              %
            </UIText>
          ),
        },
        {
          label: config.usingNewKisCore === false ? 'Profit/Loss' : 'Unrealized P/L',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText
              allowFontScaling={false}
              style={[
                globalStyles.alignRight,
                styles.data,
                config.usingNewKisCore === false
                  ? rowData.profitLoss === 0
                    ? globalStyles.steady
                    : (rowData.profitLoss as number) > 0
                    ? globalStyles.up
                    : globalStyles.down
                  : rowData.unrealizedPLValue === 0
                  ? globalStyles.steady
                  : (rowData.unrealizedPLValue as number) > 0
                  ? globalStyles.up
                  : globalStyles.down,
              ]}
            >
              {config.usingNewKisCore === false
                ? formatNumber(rowData.profitLoss as number, 2)
                : formatNumber(rowData.unrealizedPLValue as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Buying Quantity',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.buyingQuantity as number)}
            </UIText>
          ),
        },
        {
          label: config.usingNewKisCore === false ? 'Buying Price' : 'Average Price',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {config.usingNewKisCore === false
                ? formatNumber(rowData.buyingPrice as number, 2)
                : formatNumber(rowData.avgPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: config.usingNewKisCore === false ? 'Buy Amount' : 'Buy Value',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {config.usingNewKisCore === false
                ? formatNumber(rowData.buyingAmount as number, 2)
                : formatNumber(rowData.value as number, 2)}
            </UIText>
          ),
        },
        {
          label: config.usingNewKisCore === false ? 'Evaluated Amount' : 'Market Value',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {config.usingNewKisCore === false
                ? formatNumber(rowData.evaluationAmount as number, 2)
                : formatNumber(rowData.marketValue as number, 2)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IStockBalanceProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    if (
      this.props.accountBank !== nextProps.accountBank &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    if (config.usingNewKisCore === true) {
      if (this.props.stockBalance !== nextProps.stockBalance && nextProps.stockBalance != null) {
        this.acquisitionValue = 0;
        this.boughtT1 = 0;
        this.boughtT2 = 0;
        (nextProps.stockBalance.portfolioList as IObject[]).map((item, index) => {
          this.acquisitionValue += item.value as number;
          this.boughtT1 += item.boughtT1 as number;
          this.boughtT2 += item.boughtT2 as number;
        });
      }
    }

    return true;
  }

  private onClickSell = (params: IObject) => {
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo =
        symbolMap[config.usingNewKisCore === false ? (params.stockCode as string) : (params.symbol as string)];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        goToBiz(
          'Order',
          {
            sellBuyType: SELL_BUY_TYPE.SELL,
            orderKind: ORDER_KIND.NORMAL_ORDER,
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

    this.props.queryStockBalance(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  render() {
    const { t } = this.props;
    let data = this.props.stockBalance;

    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.inputSection}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker type="EQUITY" />
              </View>
              {config.usingNewKisCore === false && (
                <View style={styles.accountBankPicker}>
                  <AccountBankPicker />
                </View>
              )}
            </View>
          </View>
          <View style={styles.scrollContainer}>
            <ScrollView>
              <RowData
                label={config.usingNewKisCore === false ? 'Deposit' : 'Purchasing Power'}
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).depositAmount as number, 2)) as string)
                    : ((data &&
                        data.summary &&
                        (data.summary as IObject).PP &&
                        formatNumber((data.summary as IObject).PP as number, 2)) as string)
                }
              />
              <RowData
                label="Net Asset Value"
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).netAsset as number, 0)) as string)
                    : ((data &&
                        data.summary &&
                        (data.summary as IObject).netAssetValue &&
                        formatNumber((data.summary as IObject).netAssetValue as number, 0)) as string)
                }
                isShowRow={config.domain === 'kis'}
              />
              {config.usingNewKisCore === false && (
                <RowData
                  label="Estimated Value"
                  value={
                    config.usingNewKisCore === false
                      ? ((data &&
                          data.extraData &&
                          formatNumber((data.extraData as IObject).totalEvaluationAmount as number, 2)) as string)
                      : ((data &&
                          data.summary &&
                          (data.summary as IObject).totalStockMarketValue &&
                          formatNumber((data.summary as IObject).totalStockMarketValue as number, 2)) as string)
                  }
                />
              )}
              <RowData
                label={config.usingNewKisCore === false ? 'Evaluated Profit' : 'Unrealized P/L (Value)'}
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).totalProfitLoss as number, 2)) as string)
                    : ((data && data.summary && (data.summary as IObject).profitLoss != null
                        ? formatNumber(Math.round((data.summary as IObject).profitLoss as number) / 1000, 2)
                        : 0) as string)
                }
              />
              <RowData
                label={config.usingNewKisCore === false ? 'Earning Rate' : 'Unrealizied P/L (%)'}
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).totalProfitLossRate as number, 2)) as string)
                    : // `${(data && data.portfolioList && data.summary && (data.summary as IObject).profitLoss != null || this.acquisitionValue === 0 ? formatNumber(((data!.summary as IObject).profitLoss as number) / this.acquisitionValue * 100, 2) : 0) as string} %`
                      `${
                        data &&
                        data.portfolioList != null &&
                        (data.portfolioList as IObject[]).length > 0 &&
                        data.summary != null &&
                        (data.summary as IObject).profitLoss != null &&
                        this.acquisitionValue !== 0
                          ? formatNumber(
                              ((data.summary as IObject).profitLoss as number) / 10 / this.acquisitionValue,
                              2
                            )
                          : 0
                      } %`
                }
              />
              {config.usingNewKisCore === true && (
                <RowData
                  label="Account Ratio"
                  value={`${
                    (data &&
                      data.summary &&
                      (data.summary as IObject).marginRatio &&
                      formatNumber((data.summary as IObject).marginRatio as number, 2)) as string
                  } %`}
                />
              )}
              <RowData
                label={config.usingNewKisCore === false ? 'Estimated Deposit' : 'Market Value'}
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).estimatedDeposit as number, 2)) as string)
                    : ((data &&
                        data.summary &&
                        (data.summary as IObject).totalStockMarketValue &&
                        formatNumber((data.summary as IObject).totalStockMarketValue as number, 2)) as string)
                }
              />
              <RowData
                label={config.usingNewKisCore === false ? 'Acquisition Value' : 'Total Buy Value'}
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).totalBuyAmount as number, 0)) as string)
                    : ((data && data.portfolioList && formatNumber(this.acquisitionValue, 0)) as string)
                }
              />
              {config.usingNewKisCore === false && (
                <RowData
                  label="T Trade Value"
                  value={
                    (data &&
                      data.extraData &&
                      formatNumber((data.extraData as IObject).tTradeValue as number, 2)) as string
                  }
                />
              )}
              <RowData
                label="T+1"
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).t1Deposit as number, 2)) as string)
                    : ((data && data.portfolioList && formatNumber(this.boughtT1, 2)) as string)
                }
              />
              <RowData
                label="T+2"
                value={
                  config.usingNewKisCore === false
                    ? ((data &&
                        data.extraData &&
                        formatNumber((data.extraData as IObject).t2Deposit as number, 2)) as string)
                    : ((data && data.portfolioList && formatNumber(this.boughtT2, 2)) as string)
                }
              />
            </ScrollView>
          </View>
          {refresh === true || this.props.stockBalance == null ? (
            <ActivityIndicator />
          ) : config.usingNewKisCore === false ? (
            <SheetData
              config={this.configGrid}
              data={this.props.stockBalance.data as IObject[]}
              nextData={this.props.stockBalance.nextData as IObject[]}
              loadMore={this.props.stockBalance.next as boolean}
              requestLoadMore={this.requestLoadMore}
            />
          ) : (
            <SheetData
              config={this.configGrid}
              data={this.props.stockBalance.portfolioList as IObject[]}
              nextData={[]}
            />
          )}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  stockBalance: state.stockBalance,
  selectedAccount: state.selectedAccount,
  accountBank: state.accountBank,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setCurrentSymbol,
      queryStockBalance,
    })(StockBalance)
  ),
  Fallback,
  handleError
);
