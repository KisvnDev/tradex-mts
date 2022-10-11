import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import { SELL_BUY_TYPE, SYSTEM_TYPE, ORDER_KIND, MASSellBuyType, orderBook_HisStatus } from 'global';
import { formatDateToString, formatDateToDisplay, formatTimeToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Picker from 'components/Picker';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import Fallback from 'components/Fallback';
import config from 'config';
import { IState } from 'redux-sagas/reducers';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { IAccount, IObject } from 'interfaces/common';
import { queryOrderHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import moment from 'moment';
import UIText from 'components/UiText';

interface IOrderHistoryProps extends React.ClassAttributes<OrderHistory>, WithTranslation {
  selectedAccount: IAccount | null;
  orderHistory: IObject | null;
  orderTrigger: IOrderTrigger | null;

  queryOrderHistory(params: IObject): void;
}

interface IOrderHistoryState {}

class OrderHistory extends React.Component<IOrderHistoryProps, IOrderHistoryState> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private sellBuyType: SELL_BUY_TYPE | MASSellBuyType;
  private matchType: string;
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;
  private isErrorMonth: boolean = false;

  private sellBuyTypeList =
    config.usingNewKisCore === false
      ? [
          { label: this.props.t('-- Sell/Buy --'), value: '' },
          { label: this.props.t('Sell'), value: 'SELL' },
          { label: this.props.t('Buy'), value: 'BUY' },
        ]
      : [
          { label: this.props.t('-- Sell/Buy --'), value: 'ALL' },
          { label: this.props.t('Sell'), value: 'SELL' },
          { label: this.props.t('Buy'), value: 'BUY' },
        ];

  private matchTypeList = [
    { label: this.props.t('All'), value: orderBook_HisStatus.ALL },
    { label: this.props.t('None'), value: orderBook_HisStatus.SELECT },
    { label: this.props.t('FULLYFILLED'), value: orderBook_HisStatus.FULLY_EXECUTED },
    { label: this.props.t('QUEUE'), value: orderBook_HisStatus.QUEUED },
    { label: this.props.t('PARTIALLYFILL'), value: orderBook_HisStatus.PARTIALLY_FILLED },
    { label: this.props.t('REJECTED'), value: orderBook_HisStatus.REJECTED },
    { label: this.props.t('CANCELLED'), value: orderBook_HisStatus.CANCELLED },
    { label: this.props.t('READYTOSEND'), value: orderBook_HisStatus.NEW },
    { label: this.props.t('SENDING'), value: orderBook_HisStatus.SENDING },
    { label: this.props.t('PENDINGAPPROVAL'), value: orderBook_HisStatus.WAITING },
    { label: this.props.t('STOP'), value: orderBook_HisStatus.TRIGGER_ORDER },
    { label: this.props.t('WAITINGCANCEL'), value: orderBook_HisStatus.WAITING_CANCEL },
    { label: this.props.t('WAITINGMODIFY'), value: orderBook_HisStatus.WAITING_MODIFY },
    { label: this.props.t('INACTIVE'), value: orderBook_HisStatus.INACTIVE },
    { label: this.props.t('EXPIRED'), value: orderBook_HisStatus.EXP },
    { label: this.props.t('ACTIVESENDING'), value: orderBook_HisStatus.ACTIVESENDING },
    { label: this.props.t('ACTIVE'), value: orderBook_HisStatus.ACTIVE },
  ];

  constructor(props: IOrderHistoryProps) {
    super(props);

    const isKisNewCore = config.usingNewKisCore === true;

    this.isErrorMonth = false;
    this.configGrid = {
      columnFrozen: 2,
      header: isKisNewCore
        ? [
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
              label: 'Stock Code',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.symbol}
                </UIText>
              ),
            },
            {
              label: 'Sell/Buy',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText
                  allowFontScaling={false}
                  style={[
                    globalStyles.alignCenter,
                    styles.data,
                    { ...(rowData.sellBuyType === 'BUY' ? globalStyles.up : globalStyles.down) },
                  ]}
                >
                  {this.props.t(rowData.sellBuyType === SELL_BUY_TYPE.BUY ? 'Buy' : 'Sell')}
                </UIText>
              ),
            },
            {
              label: 'Quantity',
              width: 60,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.orderQty as number)}
                </UIText>
              ),
            },
            {
              label: 'Price',
              width: 60,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.orderPrice as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Unmatched Qty',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.unmatchedQty as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Order Type',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {rowData.orderType}
                </UIText>
              ),
            },
            {
              label: 'Matched Value',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.matchedValue as number, 2)}
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
              label: 'Matched Qty',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.matchedQty as number)}
                </UIText>
              ),
            },
            {
              label: 'Matched Price',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.matchedPrice as number, 2)}
                </UIText>
              ),
            },
          ]
        : [
            {
              label: 'Date Time',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {`${formatDateToDisplay(rowData.orderDate as string)} ${formatTimeToDisplay(
                    rowData.orderTime as string,
                    'HH:mm:ss',
                    'HHmmss'
                  )}`}
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
              label: 'Modify/Cancel Type',
              width: 110,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.modifyCancelType as string)}
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
              width: 60,
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
              label: 'Org Order No',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.originalOrderNumber}
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
              width: 90,
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
            {
              label: 'Modify/Cancel Quantity',
              width: 120,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.modifyCancelQuantity as number)}
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

  shouldComponentUpdate(nextProps: IOrderHistoryProps) {
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

  private requestData = (loadMore = false) => {
    const params = {
      sellBuyType:
        config.usingNewKisCore === false
          ? this.sellBuyType
          : this.sellBuyType == null
          ? this.sellBuyTypeList[0].value
          : this.sellBuyType,
      status: this.matchType,
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      loadMore,
      offset: loadMore === false ? 0 : this.props.orderHistory!.offset,
      fetchCount: config.fetchCount,
    };

    this.props.queryOrderHistory(params);
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

  private onChangeSellBuyType = (_index: number, value: SELL_BUY_TYPE | MASSellBuyType) => {
    this.sellBuyType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  private onChangeMatchType = (_index: number, value: string) => {
    this.matchType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  renderData = () => {
    if (this.isErrorMonth && config.usingNewKisCore === false) {
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
        {refresh === true || this.props.orderHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.orderHistory.data as IObject[]}
            nextData={this.props.orderHistory.nextData as IObject[]}
            loadMore={this.props.orderHistory.next as boolean}
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
                  list={this.matchTypeList}
                  selectedValue={undefined}
                  onChange={this.onChangeMatchType}
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
  orderHistory: state.equityOrderHistory,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryOrderHistory })(OrderHistory)),
  Fallback,
  handleError
);
