import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { SYSTEM_TYPE, ORDER_KIND, SELL_BUY_TYPE, MASSellBuyType, EnquiryOrderStatus } from 'global';
import {
  formatDateToString,
  formatDateToDisplay,
  formatTimeToDisplay,
  formatDateTimeDisplay,
  substractMonth,
} from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import DatePicker from 'components/DatePicker';
import Fallback from 'components/Fallback';
import config from 'config';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { queryOrderHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import Picker from '../Picker';
import UIText from 'components/UiText';

interface IDerivativesOrderHistoryProps extends React.ClassAttributes<DerivativesOrderHistory>, WithTranslation {
  selectedAccount: IAccount | null;
  orderHistory: IObject | null;
  orderTrigger: IOrderTrigger | null;

  queryOrderHistory(params: IObject): void;
}

interface IDerivativesOrderHistoryState {}

class DerivativesOrderHistory extends React.Component<IDerivativesOrderHistoryProps, IDerivativesOrderHistoryState> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private date: Date = new Date();
  private toDate: Date = new Date();
  private sellBuyTypeList: { label: string; value: string }[] = [
    { label: this.props.t('-- Sell/Buy --'), value: 'ALL' },
    { label: this.props.t('Sell'), value: 'SELL' },
    { label: this.props.t('Buy'), value: 'BUY' },
  ];
  private matchTypeList = [
    { label: this.props.t('-- Status --'), value: 'ALL' },
    { label: this.props.t('NONE'), value: 'NONE' },
    { label: this.props.t('FULLY_EXECUTED'), value: 'FULLYFILLED' },
    { label: this.props.t('QUEUE'), value: 'QUEUE' },
    { label: this.props.t('PARTIALLY_FILLED'), value: 'PARTIALLYFILL' },
    { label: this.props.t('REJECTED'), value: 'REJECTED' },
    { label: this.props.t('CANCELLED'), value: 'CANCELLED' },
    { label: this.props.t('NEW'), value: 'READYTOSEND' },
    { label: this.props.t('SENDING'), value: 'SENDING' },
    { label: this.props.t('WAITING'), value: 'PENDINGAPPROVAL' },
    { label: this.props.t('TRIGGER_ORDER'), value: 'STOP' },
    { label: this.props.t('WAITING_CANCEL'), value: 'WAITINGCANCEL' },
    { label: this.props.t('WAITING_MODIFY'), value: 'WAITINGMODIFY' },
    { label: this.props.t('INACTIVE'), value: 'INACTIVE' },
    { label: this.props.t('EXPIRED'), value: 'EXPIRED' },
  ];
  private status: string | string[] = this.sellBuyTypeList[0].value;
  private sellBuyType: string = this.sellBuyTypeList[0].value;
  private readonly isNewKisCore: boolean = config.usingNewKisCore;

  constructor(props: IDerivativesOrderHistoryProps) {
    super(props);

    this.configGrid = this.isNewKisCore
      ? {
          columnFrozen: 2,
          header: [
            {
              label: 'Series ID',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.symbol!}
                </UIText>
              ),
            },
            {
              label: 'Buy/Sell',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {config.usingNewKisCore
                    ? rowData.sellBuyType === 'SELL'
                      ? this.props.t('Sell')
                      : this.props.t('Buy')
                    : rowData.code}
                </UIText>
              ),
            },
            {
              label: 'Quantity',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.orderQuantity as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Order Price',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.orderPrice as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Order Type',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.orderType as string)}
                </UIText>
              ),
            },
            {
              label: 'Matched Qty',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.matchedQuantity as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Matched Price',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.matchedPrice as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Unmatched Qty',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.unmatchedQuantity as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Order Status',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.orderStatus as string)}
                </UIText>
              ),
            },
            {
              label: 'Order No',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => {
                return (
                  <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                    {rowData.orderNumber!}
                  </UIText>
                );
              },
            },
            {
              label: 'Order Time',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatDateTimeDisplay(rowData.orderTime as string)}
                </UIText>
              ),
            },
            {
              label: 'Reject Reason',
              width: 120,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.rejectReason as string)}
                </UIText>
              ),
            },
          ],
        }
      : {
          columnFrozen: 2,
          header: [
            {
              label: 'Date Time',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {config.domain !== 'kis'
                    ? `${formatDateToDisplay(rowData.orderDate as string)} ${formatTimeToDisplay(
                        rowData.orderTime as string,
                        'HH:mm:ss',
                        'HHmmss'
                      )}`
                    : formatDateTimeDisplay(rowData.orderTime as string)}
                </UIText>
              ),
            },
            {
              label: 'Code',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {config.usingNewKisCore ? rowData.symbol : rowData.code}
                </UIText>
              ),
            },
            {
              label: 'Order No',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
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
              label: 'Sell/Buy',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText
                  allowFontScaling={false}
                  style={[
                    globalStyles.alignCenter,
                    styles.data,
                    { ...(rowData.sellBuyType === 'SELL' ? globalStyles.down : globalStyles.up) },
                  ]}
                >
                  {this.props.t(rowData.sellBuyType as string)}
                </UIText>
              ),
            },
            {
              label: 'Quantity',
              width: 70,
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
              label: 'Order Type',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.orderType}
                </UIText>
              ),
            },
            {
              label: 'Validity',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.validity as string)}
                </UIText>
              ),
            },
            {
              label: 'Matched Quantity',
              width: 120,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.matchedQuantity as number)}
                </UIText>
              ),
            },
            {
              label: 'Unmatched Quantity',
              width: 120,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.unmatchedQuantity as number)}
                </UIText>
              ),
            },
            {
              label: 'Modify/Cancel Type',
              width: 120,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.modifyCancelType as string)}
                </UIText>
              ),
            },
            {
              label: 'Reject Message',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.rejectMessage}
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

  shouldComponentUpdate(nextProps: IDerivativesOrderHistoryProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES
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
    let params;
    if (this.isNewKisCore) {
      params = {
        fromDate: formatDateToString(substractMonth(this.date))!,
        toDate: formatDateToString(this.toDate)!,
        loadMore,
        fetchCount: config.fetchCount,
        status: [this.status],
        sellBuyType: this.sellBuyType,
        offset: loadMore === false ? 0 : this.props.orderHistory!.offset,
      };
    } else {
      params = {
        fromDate: formatDateToString(this.date)!,
        loadMore,
        fetchCount: config.fetchCount,
      };
    }
    this.props.queryOrderHistory(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private onChangeDate = (value: Date) => {
    this.date = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private onChangeToDate = (value: Date) => {
    this.toDate = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  private onChangeSellBuyType = (_index: number, value: SELL_BUY_TYPE | MASSellBuyType) => {
    this.sellBuyType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private onChangeMatchType = (_index: number, value: EnquiryOrderStatus) => {
    this.status = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  render() {
    const { t } = this.props;

    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        <View style={[styles.inputSection, this.isNewKisCore && styles.inputNewKisCore]}>
          {this.isNewKisCore && (
            <View style={[styles.itemSection, styles.itemSectionNewKis]}>
              <View style={styles.item}>
                <View style={[styles.labelContainer, styles.labelContainerKis]}>
                  <UIText style={styles.label}>{t('Buy/Sell')}</UIText>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    placeholder={{}}
                    list={this.sellBuyTypeList}
                    selectedValue={undefined}
                    onChange={this.onChangeSellBuyType}
                  />
                </View>
              </View>
              <View style={[styles.item, styles.toDate]}>
                <View style={[styles.labelContainer, styles.labelContainerKis]}>
                  <UIText style={styles.label}>{t('Status')}</UIText>
                </View>
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
          )}
          {!this.isNewKisCore && (
            <View style={styles.itemSection}>
              <View style={styles.item}>
                <View style={styles.labelContainer}>
                  <UIText style={styles.label}>{t('On Date')}</UIText>
                </View>
                <View style={styles.dataContainer}>
                  <DatePicker onChange={this.onChangeDate} />
                </View>
              </View>
            </View>
          )}
          {this.isNewKisCore && (
            <View style={[styles.itemSection, styles.itemSectionNewKis]}>
              <View style={[styles.labelContainer, styles.labelContainerKis]}>
                <UIText style={styles.label}>{t('Date')}</UIText>
              </View>
              <View style={styles.item}>
                <View style={styles.dataContainer}>
                  <DatePicker onChange={this.onChangeDate} defaultValue={substractMonth(this.date)} />
                </View>
              </View>
              <View style={[styles.item, styles.toDate]}>
                <View style={styles.dataContainer}>
                  <DatePicker onChange={this.onChangeToDate} />
                </View>
              </View>
            </View>
          )}
        </View>
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
  }
}

const mapStateToProps = (state: IState) => ({
  orderHistory: state.derivativesOrderHistory,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryOrderHistory })(DerivativesOrderHistory)),
  Fallback,
  handleError
);
