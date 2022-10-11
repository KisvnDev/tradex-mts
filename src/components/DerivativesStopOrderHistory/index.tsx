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
import { SYSTEM_TYPE, SELL_BUY_TYPE, STOP_ORDER_TYPE, ORDER_KIND, ORDER_FORM_ACTION_MODE } from 'global';
import { formatDateToString, formatDateToDisplay, formatTimeToDisplay } from 'utils/datetime';
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
import { queryStopOrderHistory } from './actions';
import globalStyles, { Colors } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IDerivativesStopOrderHistoryProps
  extends React.ClassAttributes<DerivativesStopOrderHistory>,
    WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  stopOrderHistory: IObject | null;
  orderTrigger: IOrderTrigger | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryStopOrderHistory(params: IObject): void;
}

interface IDerivativesStopOrderHistoryState {}

class DerivativesStopOrderHistory extends React.Component<
  IDerivativesStopOrderHistoryProps,
  IDerivativesStopOrderHistoryState
> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private sellBuyType: SELL_BUY_TYPE;

  private sellBuyTypeList = [
    { label: this.props.t('-- Sell/Buy --'), value: '' },
    { label: this.props.t('Sell'), value: 'SELL' },
    { label: this.props.t('Buy'), value: 'BUY' },
  ];

  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: IDerivativesStopOrderHistoryProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 4,
      header: [
        {
          label: '',
          width: 30,
          element: (key: string, rowData: IObject, index: number) => (
            <TouchableOpacity
              onPress={() => this.onClickModify(rowData)}
              disabled={rowData.isSent === true || rowData.isRegistered !== true}
            >
              <EvilIcons
                name="pencil"
                style={[
                  globalStyles.alignCenter,
                  styles.iconSize,
                  globalStyles.GREEN,
                  (rowData.isSent === true || rowData.isRegistered !== true) && styles.disableButton,
                ]}
              />
            </TouchableOpacity>
          ),
        },
        {
          label: '',
          width: 30,
          element: (key: string, rowData: IObject, index: number) => (
            <TouchableOpacity
              onPress={() => this.onClickCancel(rowData)}
              disabled={rowData.isSent === true || rowData.isRegistered !== true}
            >
              <Feather
                name="x"
                style={[
                  globalStyles.alignCenter,
                  styles.iconSize,
                  globalStyles.ORANGE,
                  (rowData.isSent === true || rowData.isRegistered !== true) && styles.disableButton,
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
              {formatDateToDisplay(rowData.date as string)}
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
          label: 'Order Type',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.orderType}
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
          label: 'Effective Date',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.fromDate as string)}
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
          label: 'Stop Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.stopPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Order Price',
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
          label: 'Order Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.tradingDate as string)}
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
              {formatTimeToDisplay(rowData.cancelDateTime as string)}
            </UIText>
          ),
        },
        {
          label: 'Status',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.isSent === true ? this.props.t('Sent') : ''}
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

  shouldComponentUpdate(nextProps: IDerivativesStopOrderHistoryProps) {
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
      nextProps.orderTrigger.orderKind === ORDER_KIND.STOP_LIMIT_ORDER
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
      const symbolInfo = symbolMap[params.code as string];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);
        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: params.orderType === STOP_ORDER_TYPE.STOP ? ORDER_KIND.STOP_ORDER : ORDER_KIND.STOP_LIMIT_ORDER,
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
    const params = {
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      sellBuyType: this.sellBuyType,
      loadMore,
      fetchCount: config.fetchCount,
    };
    this.props.queryStopOrderHistory(params);
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

  private onChangeSellBuyType = (index: number, value: SELL_BUY_TYPE) => {
    this.sellBuyType = value;
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
                  list={this.sellBuyTypeList}
                  selectedValue={undefined}
                  onChange={this.onChangeSellBuyType}
                />
              </View>
            </View>
          </View>
        </View>
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
  }
}

const mapStateToProps = (state: IState) => ({
  stopOrderHistory: state.derivativesStopOrderHistory,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryStopOrderHistory, setCurrentSymbol })(DerivativesStopOrderHistory)),
  Fallback,
  handleError
);
