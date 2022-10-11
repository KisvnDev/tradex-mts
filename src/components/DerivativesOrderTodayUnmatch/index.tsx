import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { goToBiz } from 'navigations';
import { SYSTEM_TYPE, ORDER_FORM_ACTION_MODE, ORDER_KIND } from 'global';
import { formatNumber, handleError } from 'utils/common';
import { formatTimeToDisplay, formatDateToDisplay } from 'utils/datetime';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Fallback from 'components/Fallback';
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
import Picker from 'components/Picker';

interface IDerivativesOrderTodayUnmatchProps
  extends React.ClassAttributes<DerivativesOrderTodayUnmatch>,
    WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  orderTodayUnmatch: IObject | null;
  orderTrigger: IOrderTrigger | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryOrderTodayUnmatch(params: IObject): void;
}

interface IDerivativesOrderTodayUnmatchState {}
const ALL = 'ALL';

class DerivativesOrderTodayUnmatch extends React.Component<
  IDerivativesOrderTodayUnmatchProps,
  IDerivativesOrderTodayUnmatchState
> {
  private sellBuyTypeList = [
    { label: this.props.t('-- Sell/Buy --'), value: '' },
    { label: this.props.t('Sell'), value: 'S' },
    { label: this.props.t('Buy'), value: 'B' },
  ];
  private matchTypeList = [
    { label: this.props.t('-- Status --'), value: 'ALL' },
    { label: this.props.t('PENDING_APPROVAL'), value: 'PENDING_APPROVAL' },
    { label: this.props.t('READY_TO_SEND'), value: 'READY_TO_SEND' },
    { label: this.props.t('OUTSTANDING'), value: 'OUTSTANDING' },
    { label: this.props.t('SENDING'), value: 'SENDING' },
    { label: this.props.t('NOTIFIED'), value: 'NOTIFIED' },
    { label: this.props.t('REJECTED'), value: 'REJECTED' },
    { label: this.props.t('FILLED'), value: 'FILLED' },
    { label: this.props.t('CANCELLED'), value: 'CANCELLED' },
    { label: this.props.t('INACTIVE'), value: 'INACTIVE' },
    { label: this.props.t('KILLED'), value: 'KILLED' },
    { label: this.props.t('FILL_AND_KILL'), value: 'FILL_AND_KILL' },
    { label: this.props.t('QUEUE'), value: 'QUEUE' },
    { label: this.props.t('STOP_READY'), value: 'STOP_READY' },
    { label: this.props.t('STOP_FAILED'), value: 'STOP_FAILED' },
    { label: this.props.t('STOP_INACTIVE'), value: 'STOP_INACTIVE' },
  ];
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private sellBuyType: string;
  private matchType: string = this.matchTypeList[0].value;

  constructor(props: IDerivativesOrderTodayUnmatchProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 4,
      header: config.usingNewKisCore
        ? [
            {
              label: '',
              width: 30,
              element: (_key: string, rowData: IObject, _index: number) => {
                if (rowData.cancellable !== true) {
                  return null;
                }
                return (
                  <TouchableOpacity onPress={() => this.onClickModify(rowData)}>
                    <EvilIcons name="pencil" style={[globalStyles.alignCenter, styles.iconSize, globalStyles.GREEN]} />
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
              label: 'Series ID',
              width: 80,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.symbol}
                </UIText>
              ),
            },
            {
              label: 'Buy/Sel',
              width: 60,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
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
              width: 50,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false}>{formatNumber(rowData.orderQuantity as number)}</UIText>
              ),
            },
            {
              label: 'Order Price',
              width: 50,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.orderPrice as number)}
                </UIText>
              ),
            },
            {
              label: 'Order Type',
              width: 50,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.orderType!)}
                </UIText>
              ),
            },
            {
              label: 'Matched Qty',
              width: 50,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.matchedQuantity as number)}
                </UIText>
              ),
            },
            {
              label: 'Matched Price',
              width: 50,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.matchedPrice as number)}
                </UIText>
              ),
            },
            {
              label: 'Unmatched Qty',
              width: 50,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatNumber(rowData.unmatchedQuantity as number)}
                </UIText>
              ),
            },
            {
              label: 'Order Status',
              width: 60,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.orderStatus as string)}
                </UIText>
              ),
            },
            {
              label: 'Order No',
              width: 60,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.orderGroupID as string)}
                </UIText>
              ),
            },
            {
              label: 'Order Time',
              width: 120,
              element: (_key: string, rowData: OrderEnquiry, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {`${formatDateToDisplay(parseInt(`${+(rowData.orderTime ?? 0) / 10 ** 6}`, 10)?.toString() || '')}
                    ${formatTimeToDisplay(rowData.orderTime)}`}
                </UIText>
              ),
            },
          ]
        : [
            {
              label: '',
              width: 30,
              element: (_key: string, rowData: IObject, _index: number) => (
                <TouchableOpacity onPress={() => this.onClickModify(rowData)}>
                  <EvilIcons name="pencil" style={[globalStyles.alignCenter, styles.iconSize, globalStyles.GREEN]} />
                </TouchableOpacity>
              ),
            },
            {
              label: '',
              width: 30,
              element: (_key: string, rowData: IObject, _index: number) => (
                <TouchableOpacity onPress={() => this.onClickCancel(rowData)}>
                  <Feather name="x" style={[globalStyles.alignCenter, styles.iconSize, globalStyles.ORANGE]} />
                </TouchableOpacity>
              ),
            },
            {
              label: 'Code',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.code}
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
                  {this.props.t(rowData.sellBuyType as string)}
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
              label: 'Status',
              width: 60,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.orderStatus as string)}
                </UIText>
              ),
            },
            {
              label: 'Validity',
              width: 60,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {this.props.t(rowData.validity as string)}
                </UIText>
              ),
            },
            {
              label: 'Matched Quantity',
              width: 50,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.matchedQuantity as number)}
                </UIText>
              ),
            },
            {
              label: 'Unmatched Quantity',
              width: 80,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.unmatchedQuantity as number)}
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

  shouldComponentUpdate(nextProps: IDerivativesOrderTodayUnmatchProps) {
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

  private getSymbolInfo = (object: IObject): ISymbolInfo | undefined =>
    getSymbolMap(store.getState())?.[(config.usingNewKisCore ? object.symbol : object.code) as string];

  private onClickCancel = (params: IObject) => {
    const symbolInfo = this.getSymbolInfo(params);

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
  };

  private onClickModify = (params: IObject) => {
    const symbolInfo = this.getSymbolInfo(params);
    if (symbolInfo) {
      this.props.setCurrentSymbol(symbolInfo);

      goToBiz(
        'Order',
        {
          formData: params,
          orderKind: ORDER_KIND.NORMAL_ORDER,
          actionMode: ORDER_FORM_ACTION_MODE.MODIFY,
        },
        this.props.componentId,
        undefined,
        'OrderStack2'
      );
    }
  };

  private requestData = (loadMore = false) => {
    let params: IObject = {
      loadMore,
      fetchCount: config.fetchCount,
    };
    config.usingNewKisCore &&
      (params = { ...params, stockSymbol: ALL, sellBuyType: this.sellBuyType, status: this.matchType, validity: ALL });
    this.props.queryOrderTodayUnmatch(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  private onChangeSellBuyType = (_index: number, value: string) => {
    this.sellBuyType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private onChangeMatchType = (_index: number, value: string) => {
    this.matchType = value;
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
                  selectedValue={this.matchType}
                  onChange={this.onChangeMatchType}
                />
              </View>
            </View>
          </View>
        </View>
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
  orderTodayUnmatch: state.derivativesOrderTodayUnmatch,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, { queryOrderTodayUnmatch, setCurrentSymbol })(DerivativesOrderTodayUnmatch)
  ),
  Fallback,
  handleError
);
