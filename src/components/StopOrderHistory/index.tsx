import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import { isAfter } from 'date-fns';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { goToBiz } from 'navigations';
import {
  SELL_BUY_TYPE,
  SYSTEM_TYPE,
  STOP_ORDER_STATUS,
  ORDER_KIND,
  ORDER_FORM_ACTION_MODE,
  STOP_ORDER_TYPE,
} from 'global';
import { formatDateToString, formatTimeToDisplay, formatDateToDisplay } from 'utils/datetime';
import { formatNumber, isBlank, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig, ISheetDataColumn } from 'components/SheetData';
import Picker from 'components/Picker';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryAllStopOrderHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import moment from 'moment';
import UIText from 'components/UiText';

interface IStopOrderHistoryProps extends React.ClassAttributes<StopOrderHistory>, WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  stopOrderHistory: IObject | null;
  orderTrigger: IOrderTrigger | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryAllStopOrderHistory(params: IObject): void;
}

interface IStopOrderHistoryState {}

class StopOrderHistory extends React.Component<IStopOrderHistoryProps, IStopOrderHistoryState> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private sellBuyType: SELL_BUY_TYPE;
  private stopOrderStatus: STOP_ORDER_STATUS = STOP_ORDER_STATUS.ALL;
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;
  private isErrorMonth: boolean = false;

  private sellBuyTypeList =
    config.usingNewKisCore === false
      ? [
          { label: this.props.t('-- Sell/Buy --'), value: '' },
          { label: this.props.t('Sell'), value: SELL_BUY_TYPE.SELL },
          { label: this.props.t('Buy'), value: SELL_BUY_TYPE.BUY },
        ]
      : [
          { label: this.props.t('-- Sell/Buy --'), value: undefined },
          { label: this.props.t('Sell'), value: SELL_BUY_TYPE.SELL },
          { label: this.props.t('Buy'), value: SELL_BUY_TYPE.BUY },
        ];

  private stopOrderStatusList =
    config.usingNewKisCore === false
      ? [
          { label: this.props.t('-- Status --'), value: '' },
          { label: this.props.t('STOP_ORDER_STATUS_PENDING'), value: STOP_ORDER_STATUS.PENDING },
          { label: this.props.t('STOP_ORDER_STATUS_COMPLETED'), value: STOP_ORDER_STATUS.COMPLETED },
          { label: this.props.t('STOP_ORDER_STATUS_CANCELLED'), value: STOP_ORDER_STATUS.CANCELLED },
          { label: this.props.t('STOP_ORDER_STATUS_FAILED'), value: STOP_ORDER_STATUS.FAILED },
        ]
      : [
          { label: this.props.t('-- Status --'), value: STOP_ORDER_STATUS.ALL },
          { label: this.props.t('STOP_ORDER_STATUS_PENDING'), value: STOP_ORDER_STATUS.PENDING },
          { label: this.props.t('STOP_ORDER_STATUS_COMPLETED'), value: STOP_ORDER_STATUS.COMPLETED },
          { label: this.props.t('STOP_ORDER_STATUS_CANCELLED'), value: STOP_ORDER_STATUS.CANCELLED },
          { label: this.props.t('STOP_ORDER_STATUS_FAILED'), value: STOP_ORDER_STATUS.FAILED },
          { label: this.props.t('STOP_ORDER_STATUS_SENDING'), value: STOP_ORDER_STATUS.SENDING },
        ];

  constructor(props: IStopOrderHistoryProps) {
    super(props);
    this.isErrorMonth = false;
    this.initSheetData();

    this.state = {};
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IStopOrderHistoryProps) {
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
      (nextProps.orderTrigger.orderKind === ORDER_KIND.STOP_ORDER ||
        nextProps.orderTrigger.orderKind === ORDER_KIND.STOP_LIMIT_ORDER)
    ) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private initSheetData = () => {
    this.configGrid = {
      columnFrozen: 4,
      header:
        config.usingNewKisCore === false
          ? [
              {
                label: 'Create Time',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatTimeToDisplay(rowData.createTime as string, 'dd/MM/yyyy HH:mm:ss', 'yyyyMMddHHmmss')}
                  </UIText>
                ),
              },
              {
                label: 'Stock Code',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.stockCode}
                  </UIText>
                ),
              },
              {
                label: 'Type',
                width: 60,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {this.props.t(`${rowData.orderType}`)}
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
                label: 'Stop Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.stopPrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'Status',
                width: 90,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {this.props.t(
                      rowData.status === 'PENDING' ? 'STOP_ORDER_STATUS_PENDING' : (rowData.status as string)
                    )}
                  </UIText>
                ),
              },
              {
                label: 'Limit Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.orderPrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'From Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.fromDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'To Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.toDate as string)}
                  </UIText>
                ),
              },
            ]
          : [
              {
                label: '',
                width: 30,
                element: (_key: string, rowData: IObject, _index: number) => {
                  if (rowData.status !== STOP_ORDER_STATUS.PENDING) {
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
                  if (rowData.status !== STOP_ORDER_STATUS.PENDING) {
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
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {rowData.code}
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
                label: 'Type of Order',
                width: 85,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {this.props.t(`${rowData.orderType}`)}
                  </UIText>
                ),
              },
              {
                label: 'Stop Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.stopPrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'Limit Price',
                width: 80,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {formatNumber(rowData.orderPrice as number, 2)}
                  </UIText>
                ),
              },
              {
                label: 'Order Status',
                width: 90,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {this.props.t(
                      rowData.status === 'PENDING' ? 'STOP_ORDER_STATUS_PENDING' : (rowData.status as string)
                    )}
                  </UIText>
                ),
              },
              {
                label: 'Order Time',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatTimeToDisplay(rowData.createTime as string, 'dd/MM/yyyy HH:mm:ss', 'yyyyMMddHHmmss')}
                  </UIText>
                ),
              },
              {
                label: 'Quantity',
                width: 55,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatNumber(rowData.orderQuantity as number)}
                  </UIText>
                ),
              },
              {
                label: 'From Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.fromDate as string)}
                  </UIText>
                ),
              },
              {
                label: 'To Date',
                width: 70,
                element: (_key: string, rowData: IObject, _index: number) => (
                  <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                    {formatDateToDisplay(rowData.toDate as string)}
                  </UIText>
                ),
              },
            ],
    };

    if (config.usingNewKisCore === false) {
      if (this.stopOrderStatus === STOP_ORDER_STATUS.PENDING || isBlank(this.stopOrderStatus)) {
        this.configGrid.header = ([
          {
            label: '',
            width: 30,
            element: (_key: string, rowData: IObject, _index: number) => (
              <TouchableOpacity
                onPress={() => this.onClickModify(rowData)}
                disabled={rowData.status !== STOP_ORDER_STATUS.PENDING}
              >
                <EvilIcons
                  name="pencil"
                  style={[
                    globalStyles.alignCenter,
                    styles.iconSize,
                    globalStyles.GREEN,
                    { ...(rowData.status !== STOP_ORDER_STATUS.PENDING && styles.disableButton) },
                  ]}
                />
              </TouchableOpacity>
            ),
          },
          {
            label: '',
            width: 30,
            element: (_key: string, rowData: IObject, _index: number) => (
              <TouchableOpacity
                onPress={() => this.onClickCancel(rowData)}
                disabled={rowData.status !== STOP_ORDER_STATUS.PENDING}
              >
                <Feather
                  name="x"
                  style={[
                    globalStyles.alignCenter,
                    styles.iconSize,
                    globalStyles.ORANGE,
                    rowData.status !== STOP_ORDER_STATUS.PENDING && styles.disableButton,
                  ]}
                />
              </TouchableOpacity>
            ),
          },
        ] as ISheetDataColumn[]).concat(this.configGrid.header);
      }
    } else {
      if (this.stopOrderStatus === undefined) {
        this.configGrid.header = ([
          {
            label: '',
            width: 30,
            element: (_key: string, rowData: IObject, _index: number) => (
              <TouchableOpacity
                onPress={() => this.onClickModify(rowData)}
                disabled={rowData.status !== STOP_ORDER_STATUS.PENDING}
              >
                <EvilIcons
                  name="pencil"
                  style={[
                    globalStyles.alignCenter,
                    styles.iconSize,
                    globalStyles.GREEN,
                    { ...(rowData.status !== STOP_ORDER_STATUS.PENDING && styles.disableButton) },
                  ]}
                />
              </TouchableOpacity>
            ),
          },
          {
            label: '',
            width: 30,
            element: (_key: string, rowData: IObject, _index: number) => (
              <TouchableOpacity
                onPress={() => this.onClickCancel(rowData)}
                disabled={rowData.status !== STOP_ORDER_STATUS.PENDING}
              >
                <Feather
                  name="x"
                  style={[
                    globalStyles.alignCenter,
                    styles.iconSize,
                    globalStyles.ORANGE,
                    rowData.status !== STOP_ORDER_STATUS.PENDING && styles.disableButton,
                  ]}
                />
              </TouchableOpacity>
            ),
          },
        ] as ISheetDataColumn[]).concat(this.configGrid.header);
      }
    }
  };

  private onClickCancel = (params: IObject) => {
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo =
        symbolMap[config.usingNewKisCore === false ? (params.stockCode as string) : (params.code as string)];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: params.orderType === STOP_ORDER_TYPE.STOP ? ORDER_KIND.STOP_ORDER : ORDER_KIND.STOP_LIMIT_ORDER,
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
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo =
        symbolMap[config.usingNewKisCore === false ? (params.stockCode as string) : (params.code as string)];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: config.usingNewKisCore
              ? ORDER_KIND.STOP_LIMIT_ORDER
              : params.orderType === STOP_ORDER_TYPE.STOP
              ? ORDER_KIND.STOP_ORDER
              : ORDER_KIND.STOP_LIMIT_ORDER,
            actionMode: ORDER_FORM_ACTION_MODE.MODIFY,
          },
          this.props.componentId,
          undefined,
          'OrderStack2'
        );
      }
    }
  };

  private requestData = (loadMore = false) => {
    let params: IObject = {};
    // if (config.usingNewKisCore === false) {
    //   params = {
    //     sellBuyType: this.sellBuyType,
    //     fromDate: formatDateToString(this.fromDate)!,
    //     toDate: formatDateToString(this.toDate)!,
    //     loadMore,
    //     fetchCount: config.fetchCount,
    //   };

    //   if (!isBlank(this.stopOrderStatus)) {
    //     params.status = this.stopOrderStatus;
    //   }
    // } else {
    params = {
      sellBuyType: this.sellBuyType,
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      loadMore,
      fetchCount: config.fetchCount,
    };

    if (!this.props.stopOrderHistory?.data?.[0]?.stopOrderId && loadMore) {
      params = { ...params, lastStopOrderId: this.props.stopOrderHistory?.data?.[0]?.stopOrderId };
    }

    if (!isBlank(this.stopOrderStatus)) {
      params.status = this.stopOrderStatus;
    }
    // }

    this.props.queryAllStopOrderHistory(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private onChangeDateFrom = (value: Date) => {
    this.fromDate = value;

    if (isAfter(this.fromDate, this.toDate)) {
      this.toDate = this.fromDate;

      if (this.toDateRef) {
        this.toDateRef.setValue(this.toDate);
      }
    }
    let start = moment(this.fromDate);
    let end = moment(this.toDate);
    const countMonth = end.diff(start, 'months') + 1;
    if (countMonth > 6) {
      this.isErrorMonth = true;
      this.setState({});
      return;
    } else {
      this.isErrorMonth = false;
    }

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private onChangeDateTo = (value: Date) => {
    this.toDate = value;

    if (isAfter(this.fromDate, this.toDate)) {
      this.fromDate = this.toDate;

      if (this.fromDateRef) {
        this.fromDateRef.setValue(this.fromDate);
      }
    }

    let start = moment(this.fromDate);
    let end = moment(this.toDate);
    const countMonth = end.diff(start, 'months') + 1;
    if (countMonth > 6) {
      this.isErrorMonth = true;
      this.setState({});
      return;
    } else {
      this.isErrorMonth = false;
    }

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private onChangeSellBuyType = (_index: number, value: SELL_BUY_TYPE) => {
    this.sellBuyType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  private onChangeStopOrderStatus = (_index: number, value: STOP_ORDER_STATUS) => {
    this.stopOrderStatus = value;

    this.initSheetData();

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  renderData = () => {
    if (this.isErrorMonth) {
      return (
        <View>
          <UIText style={styles.txtMonths}>{this.props.t('Data is only queried within 6 months')}</UIText>
        </View>
      );
    }
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.sheetData}>
        {refresh === true || this.props.stopOrderHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.stopOrderHistory.data as IObject[]}
            nextData={this.props.stopOrderHistory.nextData as IObject[]}
            loadMore={this.props.stopOrderHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.inputSection}>
          <View style={styles.itemSection}>
            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('From')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker ref={(ref: DatePickerComp) => (this.fromDateRef = ref)} onChange={this.onChangeDateFrom} />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('To')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker ref={(ref: DatePickerComp) => (this.toDateRef = ref)} onChange={this.onChangeDateTo} />
              </View>
            </View>
          </View>
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
                  list={this.stopOrderStatusList}
                  selectedValue={this.stopOrderStatus}
                  onChange={this.onChangeStopOrderStatus}
                />
              </View>
            </View>
          </View>
        </View>
        {this.renderData()}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  stopOrderHistory: state.equityStopOrderHistory,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryAllStopOrderHistory, setCurrentSymbol })(StopOrderHistory)),
  Fallback,
  handleError
);
