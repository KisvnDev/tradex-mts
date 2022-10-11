import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { isAfter } from 'date-fns';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { goToBiz } from 'navigations';
import { SYSTEM_TYPE, DERIVATIVES_ADVANCE_ORDER_TYPE, ORDER_KIND, ORDER_FORM_ACTION_MODE } from 'global';
import { formatDateToString, formatDateToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import Picker from 'components/Picker';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryAdvanceOrderHistory } from './actions';
import globalStyles, { Colors } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IDerivativesAdvanceOrderHistoryProps
  extends React.ClassAttributes<DerivativesAdvanceOrderHistory>,
    WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  advanceOrderHistory: IObject | null;
  orderTrigger: IOrderTrigger | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryAdvanceOrderHistory(params: IObject): void;
}

interface IDerivativesAdvanceOrderHistoryState {}

class DerivativesAdvanceOrderHistory extends React.Component<
  IDerivativesAdvanceOrderHistoryProps,
  IDerivativesAdvanceOrderHistoryState
> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private advanceOrderType: DERIVATIVES_ADVANCE_ORDER_TYPE = DERIVATIVES_ADVANCE_ORDER_TYPE.AO;

  private advanceOrderTypes = [
    { label: 'AO', value: DERIVATIVES_ADVANCE_ORDER_TYPE.AO },
    { label: 'CAO', value: DERIVATIVES_ADVANCE_ORDER_TYPE.CAO },
  ];

  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: IDerivativesAdvanceOrderHistoryProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 3,
      header: [
        {
          label: '',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <TouchableOpacity
              onPress={() => this.onClickCancel(rowData)}
              disabled={rowData.orderSendStatus !== 'NOT_SENT'}
            >
              <Feather
                name="x"
                style={[
                  globalStyles.alignCenter,
                  styles.iconSize,
                  globalStyles.ORANGE,
                  rowData.orderSendStatus !== 'NOT_SENT' && styles.disableButton,
                ]}
              />
            </TouchableOpacity>
          ),
        },
        {
          label: 'Create Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.registeredDate as string, 'dd/MM/yyyy HH:mm:ss', 'yyyyMMddHHmmss')}
            </UIText>
          ),
        },
        {
          label: 'Code',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.code}
            </UIText>
          ),
        },
        {
          label: 'Sequence No',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.sequenceNumber}
            </UIText>
          ),
        },
        {
          label: 'Sell/Buy',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
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
          label: 'Order Type',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.orderType}
            </UIText>
          ),
        },
        {
          label: 'Advance Order Type',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.advanceOrderType}
            </UIText>
          ),
        },
        {
          label: 'Market Session',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.marketSession}
            </UIText>
          ),
        },
        {
          label: 'From Date',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.fromDate as string)}
            </UIText>
          ),
        },
        {
          label: 'To Date',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.toDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Quantity',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatNumber(rowData.orderQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.orderPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Order No',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.orderNumber}
            </UIText>
          ),
        },
        {
          label: 'Matched Quantity',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatNumber(rowData.matchedQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Unmatched Quantity',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatNumber(rowData.unmatchedQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Order Send Status',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.orderSendStatus as string)}
            </UIText>
          ),
        },
        {
          label: 'Matched Status',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.matchedStatus as string)}
            </UIText>
          ),
        },
        {
          label: 'User',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.username}
            </UIText>
          ),
        },
        {
          label: 'Cancel User',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.cancelUsername}
            </UIText>
          ),
        },
        {
          label: 'Cancel Date Time',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.cancelDateTime as string, 'dd/MM/yyyy HH:mm:ss', 'yyyyMMddHHmmss')}
            </UIText>
          ),
        },
        {
          label: 'Status',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.isValid === true ? 'Valid' : 'Invalid'}
            </UIText>
          ),
        },
        {
          label: 'Modify/Cancel Quantity',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatNumber(rowData.modifyCancelQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Error Code',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.errorCode}
            </UIText>
          ),
        },
        {
          label: 'Error Message',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.errorMessage}
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

  shouldComponentUpdate(nextProps: IDerivativesAdvanceOrderHistoryProps) {
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
      nextProps.orderTrigger.orderKind === ORDER_KIND.ADVANCE_ORDER
    ) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private onClickCancel = (params: IObject) => {
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo = symbolMap[params.code as string];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: ORDER_KIND.ADVANCE_ORDER,
            actionMode: ORDER_FORM_ACTION_MODE.CANCEL,
          },
          this.props.componentId,
          undefined,
          'OrderStack2'
        );
      }
    }
  };

  private requestData = (loadMore = false) => {
    const params = {
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      advanceOrderType: this.advanceOrderType,
      loadMore,
      fetchCount: config.fetchCount,
      isRegistered: true,
    };
    this.props.queryAdvanceOrderHistory(params);
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

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private onChangeAdvanceOrderType = (index: number, value: DERIVATIVES_ADVANCE_ORDER_TYPE) => {
    this.advanceOrderType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  render() {
    const { t } = this.props;

    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

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
                  valueContainer={{
                    borderColor: Colors.DARK_GREY,
                  }}
                  list={this.advanceOrderTypes}
                  selectedValue={DERIVATIVES_ADVANCE_ORDER_TYPE.AO}
                  onChange={this.onChangeAdvanceOrderType}
                />
              </View>
            </View>
          </View>
        </View>
        {refresh === true || this.props.advanceOrderHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.advanceOrderHistory.data as IObject[]}
            nextData={this.props.advanceOrderHistory.nextData as IObject[]}
            loadMore={this.props.advanceOrderHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  advanceOrderHistory: state.derivativesAdvanceOrderHistory,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, { queryAdvanceOrderHistory, setCurrentSymbol })(DerivativesAdvanceOrderHistory)
  ),
  Fallback,
  handleError
);
