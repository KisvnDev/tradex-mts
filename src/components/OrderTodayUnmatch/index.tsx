import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { goToBiz } from 'navigations';
import {
  SYSTEM_TYPE,
  ORDER_FORM_ACTION_MODE,
  ORDER_KIND,
  SELL_BUY_TYPE,
  MASSellBuyType,
  EnquiryOrderStatus,
} from 'global';
import { formatTimeToDisplay, formatDateToString, formatDateToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryOrderTodayUnmatch } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IOrderTodayUnmatchProps extends React.ClassAttributes<OrderTodayUnmatch>, WithTranslation {
  selectedAccount: IAccount | null;
  orderTodayUnmatch: IObject | null;
  componentId: string;
  orderTrigger: IOrderTrigger | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryOrderTodayUnmatch(params: IObject): void;
}

interface IOrderTodayUnmatchState {}

class OrderTodayUnmatch extends React.Component<IOrderTodayUnmatchProps, IOrderTodayUnmatchState> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private sellBuyTypeList = [
    { label: this.props.t('-- Sell/Buy --'), value: 'ALL' },
    { label: this.props.t('Sell'), value: 'SELL' },
    { label: this.props.t('Buy'), value: 'BUY' },
  ];
  private matchTypeList = [
    { label: this.props.t('-- Status --'), value: 'ALL' },
    { label: this.props.t('FULLY_EXECUTED'), value: 'FULLYFILLED' },
    { label: this.props.t('QUEUE'), value: 'QUEUED' },
    { label: this.props.t('PARTIALLY_FILLED'), value: 'PARTIALLYFILL' },
    { label: this.props.t('REJECTED'), value: 'REJECTED' },
    { label: this.props.t('CANCELLED 1'), value: 'CANCELLED' },
    { label: this.props.t('SENDING'), value: 'SENDING' },
    { label: this.props.t('WAITING'), value: 'PENDINGAPPROVAL' },
    { label: this.props.t('WAITING_CANCEL'), value: 'WAITINGCANCEL' },
    { label: this.props.t('WAITING_MODIFY'), value: 'WAITINGMODIFY' },
    { label: this.props.t('INACTIVE'), value: 'INACTIVE' },
    { label: this.props.t('EXPIRED'), value: 'EXPIRED' },
    { label: this.props.t('READY_TO_SEND'), value: 'READYTOSEND' },
  ];
  private sellBuyType: MASSellBuyType;
  private matchType: EnquiryOrderStatus;

  constructor(props: IOrderTodayUnmatchProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 3,
      header:
        config.usingNewKisCore === false
          ? [
              {
                label: '',
                width: 30,
                element: (_key: string, rowData: IObject, _index: number) => {
                  const { orderStatus } = rowData;
                  if (orderStatus === 'RECEIPT') {
                    return null;
                  }

                  return (
                    <TouchableOpacity onPress={() => this.onClickModify(rowData)}>
                      <EvilIcons
                        name="pencil"
                        style={[globalStyles.alignCenter, styles.iconSize, globalStyles.GREEN]}
                      />
                    </TouchableOpacity>
                  );
                },
              },
              {
                label: '',
                width: 30,
                element: (_key: string, rowData: IObject, _index: number) => {
                  const { orderStatus } = rowData;
                  if (orderStatus === 'RECEIPT') {
                    return null;
                  }
                  return (
                    <TouchableOpacity onPress={() => this.onClickCancel(rowData)}>
                      <Feather name="x" style={[globalStyles.alignCenter, styles.iconSize, globalStyles.ORANGE]} />
                    </TouchableOpacity>
                  );
                },
              },
              {
                label: 'Stock Code',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.stockCode}
                  </UIText>
                ),
              },
              {
                label: 'Date Time',
                width: 60,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatTimeToDisplay(rowData.orderTime as string, 'HH:mm:ss', 'HHmmss')}
                  </UIText>
                ),
              },
              {
                label: 'Sell/Buy',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText
                    allowFontScaling={false}
                    style={[
                      globalStyles.alignCenter,
                      styles.data,
                      { ...(rowData.sellBuyType === 'SELL' ? globalStyles.down : globalStyles.up) },
                    ]}
                  >
                    {this.props.t(rowData.sellBuyType === SELL_BUY_TYPE.SELL ? 'Sell' : 'Buy')}
                  </UIText>
                ),
              },
              {
                label: 'Quantity',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatNumber(rowData.orderQuantity as number)}
                  </UIText>
                ),
              },
              {
                label: 'Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.orderPrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'Order No',
                width: 60,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.orderNumber}
                  </UIText>
                ),
              },
              {
                label: 'Status',
                width: 90,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {this.props.t(rowData.orderStatus as string)}
                  </UIText>
                ),
              },
              {
                label: 'Filled Quantity',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.matchedQuantity as number)}
                  </UIText>
                ),
              },
              {
                label: 'Filled Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.matchedPrice as number, 2)}
                  </UIText>
                ),
              },
            ]
          : [
              {
                label: '',
                width: 30,
                element: (_key: string, rowData: IObject, _index: number) => {
                  if (rowData.modifiable !== true) {
                    return null;
                  }

                  return (
                    <TouchableOpacity onPress={() => this.onClickModify(rowData)}>
                      <EvilIcons
                        name="pencil"
                        style={[
                          globalStyles.alignCenter,
                          styles.iconSize,
                          rowData.buySellOrder === 'SELL' ? globalStyles.down : globalStyles.GREEN,
                        ]}
                      />
                    </TouchableOpacity>
                  );
                },
              },
              {
                label: '',
                width: 30,
                element: (_key: string, rowData: IObject, _index: number) => {
                  if (rowData.cancellable !== true) {
                    return null;
                  }
                  return (
                    <TouchableOpacity onPress={() => this.onClickCancel(rowData)}>
                      <Feather name="x" style={[globalStyles.alignCenter, styles.iconSize, globalStyles.ORANGE]} />
                    </TouchableOpacity>
                  );
                },
              },
              {
                label: 'Stock Code',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.symbol}
                  </UIText>
                ),
              },
              {
                label: 'Date Time',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.orderTime != null
                      ? `${formatDateToDisplay((rowData.orderTime as string).substring(0, 8))} ${formatTimeToDisplay(
                          (rowData.orderTime as string).substring(8),
                          'HH:mm:ss',
                          'HHmmss',
                          true
                        )}`
                      : ''}
                  </UIText>
                ),
              },
              {
                label: 'Sell/Buy',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText
                    allowFontScaling={false}
                    style={[
                      globalStyles.alignCenter,
                      styles.data,
                      { ...(rowData.buySellOrder === 'SELL' ? globalStyles.down : globalStyles.up) },
                    ]}
                  >
                    {this.props.t(rowData.buySellOrder === SELL_BUY_TYPE.SELL ? 'Sell' : 'Buy')}
                  </UIText>
                ),
              },
              {
                label: 'Quantity',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatNumber(rowData.orderQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Order Type',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.orderType}
                  </UIText>
                ),
              },
              {
                label: 'Unmatched Quantity',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatNumber(rowData.unmatchedQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.orderPrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'Order No',
                width: 60,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.orderNo}
                  </UIText>
                ),
              },
              {
                label: 'Status',
                width: 90,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {this.props.t(rowData.orderStatus as string)}
                  </UIText>
                ),
              },
              {
                label: 'Matched Value',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.matchedValue as number)}
                  </UIText>
                ),
              },
              {
                label: 'Matched Qty',
                width: 50,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.matchedQty as number)}
                  </UIText>
                ),
              },
              {
                label: 'Matched Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.matchedPrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'Validity',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {rowData.validity}
                  </UIText>
                ),
              },
              {
                label: 'Reject Reason',
                width: 300,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {rowData.rejectReason}
                  </UIText>
                ),
              },
            ],
    };

    this.state = {};
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IOrderTodayUnmatchProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    if (
      this.props.orderTrigger !== nextProps.orderTrigger &&
      nextProps.orderTrigger &&
      nextProps.orderTrigger.orderKind === ORDER_KIND.NORMAL_ORDER
    ) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private onClickCancel = (params: IObject) => {
    if (config.usingNewKisCore === true) {
      params.orderQuantity = params.orderQty;
      params.sellBuyType = params.buySellOrder;
    }
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo =
        symbolMap[config.usingNewKisCore === false ? (params.stockCode as string) : (params.symbol as string)];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: ORDER_KIND.NORMAL_ORDER,
            actionMode: ORDER_FORM_ACTION_MODE.CANCEL,
          },
          this.props.componentId,
          undefined,
          'OrderStack2'
        );
      }
    }
  };

  private onClickModify = (params: IObject) => {
    if (config.usingNewKisCore === true) {
      params.orderQuantity = params.orderQty;
      params.sellBuyType = params.buySellOrder;
    }
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo =
        symbolMap[config.usingNewKisCore === false ? (params.stockCode as string) : (params.symbol as string)];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: ORDER_KIND.NORMAL_ORDER,
            actionMode: ORDER_FORM_ACTION_MODE.MODIFY,
            additionalPPForModify: (params.unmatchedQty as number) * (params.orderPrice as number),
          },
          this.props.componentId,
          undefined,
          'OrderStack2'
        );
      }
    }
  };

  private requestData = (loadMore = false) => {
    let params: IObject;
    if (config.usingNewKisCore === false) {
      params = {
        fromDate: formatDateToString(new Date())!,
        loadMore,
        fetchCount: config.fetchCount,
      };
    } else {
      params = {
        sellBuyType: this.sellBuyType == null ? this.sellBuyTypeList[0].value : this.sellBuyType,
        status: this.matchType == null ? this.matchTypeList[0].value : this.matchType,
        fetchCount: config.fetchCount,
        offset: loadMore === false ? 0 : this.props.orderTodayUnmatch!.offset,
        loadMore,
      };
    }

    this.props.queryOrderTodayUnmatch(params);
  };

  private onChangeMatchType = (_index: number, value: EnquiryOrderStatus) => {
    this.matchType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  private onChangeSellBuyType = (_index: number, value: MASSellBuyType) => {
    this.sellBuyType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        {config.usingNewKisCore === true && (
          <View style={styles.inputSection}>
            <View style={styles.itemSection}>
              <View style={styles.item}>
                <View style={styles.pickerContainer}>
                  <Picker
                    placeholder={{}}
                    list={this.sellBuyTypeList}
                    selectedValue={undefined}
                    onChange={this.onChangeSellBuyType}
                  />
                </View>
              </View>

              <View style={styles.item}>
                <View style={styles.pickerContainer}>
                  <Picker
                    placeholder={{}}
                    list={this.matchTypeList}
                    selectedValue={undefined}
                    onChange={this.onChangeMatchType}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
        {refresh === true || this.props.orderTodayUnmatch == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.orderTodayUnmatch.data as IObject[]}
            nextData={this.props.orderTodayUnmatch.nextData as IObject[]}
            loadMore={this.props.orderTodayUnmatch.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  orderTodayUnmatch: state.equityOrderTodayUnmatch,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { setCurrentSymbol, queryOrderTodayUnmatch })(OrderTodayUnmatch)),
  Fallback,
  handleError
);
