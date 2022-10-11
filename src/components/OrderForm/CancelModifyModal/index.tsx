import React from 'react';
import { connect } from 'react-redux';
import { Modal, View, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { FlatList } from 'react-native-gesture-handler';
import { isAfter } from 'date-fns';
import AntDesign from 'react-native-vector-icons/AntDesign';
import config from 'config';
import Fallback from 'components/Fallback';
import {
  ORDER_KIND,
  STOP_ORDER_STATUS,
  SYSTEM_TYPE,
  DERIVATIVES_ADVANCE_ORDER_TYPE,
  ORDER_FORM_ACTION_MODE,
  STOP_ORDER_TYPE,
} from 'global';
import { goToBiz } from 'navigations';
import { handleError, getColor } from 'utils/common';
import { formatDateToString, formatDateToDisplay } from 'utils/datetime';
import { IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { IOrderForm } from '..';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import Picker from 'components/Picker';
import OrderModal from '../OrderModal';
import { IOrderInput } from '../reducers';
import { IState } from 'redux-sagas/reducers';
import store from 'redux-sagas/store';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryOrderTodayUnmatch } from 'components/OrderTodayUnmatch/actions';
import { queryAdvanceOrderHistory } from 'components/AdvanceOrderHistory/actions';
import { queryStopOrderHistory } from 'components/StopOrderHistory/actions';
import { queryStopOrderHistory as queryDerivativesStopOrderHistory } from 'components/DerivativesStopOrderHistory/actions';
import { queryOrderTodayUnmatch as queryDerivativesOrderTodayUnmatch } from 'components/DerivativesOrderTodayUnmatch/actions';
import { queryAdvanceOrderHistory as queryDerivativesAdvanceOrderHistory } from 'components/DerivativesAdvanceOrderHistory/actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ICancelModifyModalProps extends React.ClassAttributes<CancelModifyModal>, WithTranslation {
  componentId: string;
  equityOrderTodayUnmatch: IObject | null;
  equityAdvanceOrderHistory: IObject | null;
  equityStopOrderHistory: IObject | null;
  derivativesAdvanceOrderHistory: IObject | null;
  derivativesOrderTodayUnmatch: IObject | null;
  derivativesStopOrderHistory: IObject | null;
  orderKind: ORDER_KIND;
  systemType: SYSTEM_TYPE;
  type: ORDER_FORM_ACTION_MODE;
  orderInput: IOrderInput;
  stockSymbol: string;

  queryOrderTodayUnmatch(params: IObject): void;

  queryAdvanceOrderHistory(params: IObject): void;

  queryStopOrderHistory(params: IObject): void;

  queryDerivativesStopOrderHistory(params: IObject): void;

  queryDerivativesOrderTodayUnmatch(params: IObject): void;

  queryDerivativesAdvanceOrderHistory(params: IObject): void;

  closeModal?(renderModal: boolean): void;

  onPressItem?(): void;

  setCurrentSymbol(payload: ISymbolInfo): void;

  confirmCancelOrder?(formData: IOrderForm, orderKind: ORDER_KIND): void;
}

interface ICancelModifyModalState {
  modalVisible?: boolean;
}

class CancelModifyModal extends React.Component<ICancelModifyModalProps, ICancelModifyModalState> {
  private formData: IOrderForm;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;
  private advanceOrderType: DERIVATIVES_ADVANCE_ORDER_TYPE = DERIVATIVES_ADVANCE_ORDER_TYPE.AO;
  private data: IObject[] = [];
  private hasMore: boolean = true;
  private orderKind: ORDER_KIND = ORDER_KIND.NORMAL_ORDER;
  private advanceOrderTypes = [
    { label: 'AO', value: DERIVATIVES_ADVANCE_ORDER_TYPE.AO },
    { label: 'CAO', value: DERIVATIVES_ADVANCE_ORDER_TYPE.CAO },
  ];

  constructor(props: ICancelModifyModalProps) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ICancelModifyModalProps) {
    if (this.props.derivativesStopOrderHistory !== nextProps.derivativesStopOrderHistory) {
      this.getData(this.props.derivativesStopOrderHistory, nextProps.derivativesStopOrderHistory);
    } else if (this.props.derivativesAdvanceOrderHistory !== nextProps.derivativesAdvanceOrderHistory) {
      this.getData(this.props.derivativesAdvanceOrderHistory, nextProps.derivativesAdvanceOrderHistory);
    } else if (this.props.derivativesOrderTodayUnmatch !== nextProps.derivativesOrderTodayUnmatch) {
      const [derivativesOrderTodayUnmatch, derivativesOrderTodayUnmatchNext] = this.filterData(
        this.props.derivativesOrderTodayUnmatch,
        nextProps.derivativesOrderTodayUnmatch
      );
      this.getData(derivativesOrderTodayUnmatch, derivativesOrderTodayUnmatchNext);
    } else if (this.props.equityStopOrderHistory !== nextProps.equityStopOrderHistory) {
      this.getData(this.props.equityStopOrderHistory, nextProps.equityStopOrderHistory);
    } else if (this.props.equityAdvanceOrderHistory !== nextProps.equityAdvanceOrderHistory) {
      this.getData(this.props.equityAdvanceOrderHistory, nextProps.equityAdvanceOrderHistory);
    } else {
      this.getData(this.props.equityOrderTodayUnmatch, nextProps.equityOrderTodayUnmatch);
    }
    return true;
  }

  private filterData = (data: any, newData: any) => {
    const stockSymbol = this.props.stockSymbol || '';
    const newResultData = data?.data?.filter((item: any) => item.symbol === stockSymbol);
    const newResultNewData = newData?.data?.filter((item: any) => item.symbol === stockSymbol);
    data && (data = { ...newResultData, data: newResultData });
    newData && (newData = { ...newData, data: newResultNewData });

    return [data, newData];
  };

  private getData = (currentData: IObject | null, newData: IObject | null) => {
    if (newData != null) {
      if (newData.next === false) {
        if (currentData?.data !== newData?.data) {
          this.data = newData.data as IObject[];
          if (this.data.length < config.fetchCount && this.data.length !== 0) {
            this.hasMore = false;
          }
        }
      } else {
        if (currentData?.nextData !== newData?.nextData) {
          this.data = this.data.concat(newData.nextData as IObject[]);
          if ((newData.nextData as IObject[]).length < config.fetchCount) {
            this.hasMore = false;
          }
        }
      }
    }

    if (this.props.systemType === SYSTEM_TYPE.DERIVATIVES && !config.usingNewKisCore) {
      if (this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER || this.props.orderKind === ORDER_KIND.STOP_ORDER) {
        this.data = this.data.filter((item) => {
          return item.isSent !== true && item.isRegistered === true;
        });
      } else if (this.props.orderKind === ORDER_KIND.ADVANCE_ORDER) {
        this.data = this.data.filter((item) => {
          return item.orderSendStatus === 'NOT_SENT';
        });
      }
    }
  };

  private requestData = (loadMore = false) => {
    const stockSymbol = this.props.stockSymbol || '';

    if (this.props.systemType === SYSTEM_TYPE.EQUITY) {
      if (this.props.orderKind === ORDER_KIND.NORMAL_ORDER) {
        let params;
        if (config.usingNewKisCore === false) {
          params = {
            fromDate: formatDateToString(new Date())!,
            loadMore,
            fetchCount: config.fetchCount,
          };
        } else {
          params = {
            fetchCount: config.fetchCount,
            offset: loadMore === false ? 0 : this.props.equityOrderTodayUnmatch!.offset,
            status: 'ALL',
            sellBuyType: 'ALL',
            stockSymbol,
          };
        }

        this.props.queryOrderTodayUnmatch(params);
      } else if (this.props.orderKind === ORDER_KIND.ADVANCE_ORDER) {
        const params = {
          loadMore,
          fetchCount: config.fetchCount,
        };
        this.props.systemType === SYSTEM_TYPE.EQUITY
          ? this.props.queryAdvanceOrderHistory(params)
          : this.props.queryDerivativesAdvanceOrderHistory(params);
      } else if (
        this.props.orderKind === ORDER_KIND.STOP_ORDER ||
        this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER
      ) {
        let params: IObject = {};

        if (config.usingNewKisCore) {
          params = {
            fromDate: formatDateToString(this.fromDate)!,
            toDate: formatDateToString(this.toDate)!,
            code: stockSymbol!,
          };
        } else {
          params = {
            fromDate: formatDateToString(this.fromDate)!,
            toDate: formatDateToString(this.toDate)!,
            loadMore,
            fetchCount: config.fetchCount,
            status: STOP_ORDER_STATUS.PENDING,
          };
        }
        this.props.systemType === SYSTEM_TYPE.EQUITY
          ? this.props.queryStopOrderHistory(params)
          : this.props.queryDerivativesStopOrderHistory(params);
      }
    } else {
      if (this.props.orderKind === ORDER_KIND.NORMAL_ORDER) {
        let params: IObject = {
          loadMore,
          fetchCount: config.fetchCount,
        };

        if (config.usingNewKisCore) {
          params = {
            ...params,
            fromDate: formatDateToString(this.fromDate)!,
            toDate: formatDateToString(this.toDate)!,
            loadMore,
            status: ['READYTOSEND', 'QUEUE', 'SENDING'],
            sellBuyType: 'ALL',
            stockSymbol: this.props.stockSymbol,
            validity: true,
          };
        }

        this.props.queryDerivativesOrderTodayUnmatch(params);
      } else if (this.props.orderKind === ORDER_KIND.ADVANCE_ORDER) {
        const params = {
          fromDate: formatDateToString(this.fromDate)!,
          toDate: formatDateToString(this.toDate)!,
          advanceOrderType: this.advanceOrderType,
          loadMore,
          fetchCount: config.fetchCount,
          isRegistered: true,
        };
        this.props.queryDerivativesAdvanceOrderHistory(params);
      } else if (
        this.props.orderKind === ORDER_KIND.STOP_ORDER ||
        this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER
      ) {
        let params: IObject = {};

        if (config.usingNewKisCore) {
          params = {
            fromDate: formatDateToString(this.fromDate)!,
            toDate: formatDateToString(this.toDate)!,
            code: stockSymbol!,
          };
        } else {
          params = {
            fromDate: formatDateToString(this.fromDate)!,
            toDate: formatDateToString(this.toDate)!,
            loadMore,
            fetchCount: config.fetchCount,
            status: STOP_ORDER_STATUS.PENDING,
          };
        }

        this.props.queryDerivativesStopOrderHistory(params);
      }
    }
  };

  private onChangeAdvanceOrderType = (index: number, value: DERIVATIVES_ADVANCE_ORDER_TYPE) => {
    this.advanceOrderType = value;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private renderItem = ({ item, index }: ListRenderItemInfo<IObject>) => {
    const { t } = this.props;
    const isEquity = this.props.systemType === SYSTEM_TYPE.EQUITY;
    const symbolData = global.symbolData[isEquity ? ((item.stockCode ?? item.code) as string) : (item.code as string)];
    const symbolColor = getColor(
      symbolData?.c as number,
      symbolData?.re as number,
      symbolData?.ce as number,
      symbolData?.fl as number,
      symbolData!
    ).textStyle;

    if (this.props.orderKind === ORDER_KIND.NORMAL_ORDER || this.props.orderKind === ORDER_KIND.ADVANCE_ORDER) {
      if (!item.cancellable) {
        return null;
      }

      return (
        <TouchableOpacity onPress={() => this.onPressItem(item)}>
          <View style={styles.itemContainer}>
            <View style={styles.itemSection}>
              <View style={styles.itemCode}>
                <View style={styles.codeSection}>
                  <UIText allowFontScaling={false} style={[styles.text, symbolColor]}>
                    {isEquity ? item.stockCode ?? item.code : item.code}
                  </UIText>
                  <UIText
                    allowFontScaling={false}
                    style={[
                      (item.sellBuyType ?? item.buySellOrder) === 'SELL' ? globalStyles.down : globalStyles.up,
                      styles.buySell,
                    ]}
                  >
                    {t((item.sellBuyType ?? item.buySellOrder) === 'SELL' ? 'Sell' : 'Buy')}
                  </UIText>
                  {!isEquity && this.props.orderKind === ORDER_KIND.ADVANCE_ORDER && (
                    <View style={styles.dateTime}>
                      <UIText allowFontScaling={false} style={[styles.paddingLeft, styles.textBold]}>
                        {formatDateToDisplay(item.fromDate as string, 'dd/MM/yyyy')}
                      </UIText>
                      {this.advanceOrderType === DERIVATIVES_ADVANCE_ORDER_TYPE.CAO && (
                        <View style={styles.codeSection}>
                          <UIText allowFontScaling={false} style={styles.textBold}>
                            -
                          </UIText>
                          <UIText allowFontScaling={false} style={styles.textBold}>
                            {formatDateToDisplay(item.toDate as string, 'dd/MM/yyyy')}
                          </UIText>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.itemSection}>
              <View style={styles.itemLeft}>
                <UIText allowFontScaling={false}>{t('Order Type')}:</UIText>
                <UIText allowFontScaling={false} style={[styles.marginRight, styles.textBold]}>
                  {item.orderType}
                </UIText>
              </View>
              <View style={styles.itemRight}>
                <UIText allowFontScaling={false} style={styles.marginLeft}>
                  {t('Qty')}:
                </UIText>
                <UIText allowFontScaling={false} style={styles.textBold}>
                  {item.orderQuantity ?? item.orderQty}
                </UIText>
              </View>
            </View>
            {this.props.orderKind === ORDER_KIND.NORMAL_ORDER && (
              <View style={styles.itemSection}>
                <View style={styles.itemLeft}>
                  <UIText allowFontScaling={false}>{t('Price')}:</UIText>
                  <UIText allowFontScaling={false} style={[styles.marginRight, styles.textBold]}>
                    {item.orderPrice}
                  </UIText>
                </View>
                <View style={styles.itemRight}>
                  <UIText allowFontScaling={false} style={styles.marginLeft}>
                    {t('Matched Qty')}:
                  </UIText>
                  <UIText allowFontScaling={false} style={styles.textBold}>
                    {item.matchedQuantity ?? item.matchedQty}
                  </UIText>
                </View>
              </View>
            )}
            {this.props.orderKind === ORDER_KIND.ADVANCE_ORDER && (
              <View style={styles.itemSection}>
                <View style={styles.itemLeft}>
                  <UIText allowFontScaling={false}>{isEquity ? `${t('Order number')}:` : `${t('Type')}:`}</UIText>
                  <UIText allowFontScaling={false} style={styles.marginRight}>
                    {isEquity ? item.orderNumber : `${item.advanceOrderType} - ${t(`${item.marketSession}`)}`}
                  </UIText>
                </View>
                <View style={styles.itemRight}>
                  <UIText allowFontScaling={false} style={styles.marginLeft}>
                    {t('Price')}:
                  </UIText>
                  <UIText allowFontScaling={false} style={styles.textBold}>
                    {item.orderPrice}
                  </UIText>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    } else {
      if (
        (item.status !== STOP_ORDER_STATUS.PENDING ||
          (item.status !== STOP_ORDER_STATUS.SENDING && item.status !== STOP_ORDER_STATUS.PENDING)) &&
        config.usingNewKisCore
      ) {
        return null;
      }

      return (
        <TouchableOpacity onPress={() => this.onPressItem(item)}>
          <View style={styles.itemContainer}>
            <View style={styles.itemSection}>
              <View style={styles.itemCode}>
                <View style={styles.codeSection}>
                  <UIText allowFontScaling={false} style={[styles.text, symbolColor]}>
                    {isEquity ? item.stockCode : item.code}
                  </UIText>
                  <UIText
                    allowFontScaling={false}
                    style={[item.sellBuyType === 'SELL' ? globalStyles.down : globalStyles.up, styles.buySell]}
                  >
                    {t(item.sellBuyType === 'SELL' ? 'Sell' : 'Buy')}
                  </UIText>
                </View>
                {isEquity ? (
                  <View style={styles.dateTime}>
                    <UIText allowFontScaling={false} style={styles.textBold}>
                      {formatDateToDisplay(item.fromDate as string, 'dd/MM/yyyy')}
                    </UIText>
                    <UIText allowFontScaling={false} style={styles.textBold}>
                      -
                    </UIText>
                    <UIText allowFontScaling={false} style={styles.textBold}>
                      {formatDateToDisplay(item.toDate as string, 'dd/MM/yyyy')}
                    </UIText>
                  </View>
                ) : (
                  <View style={styles.dateTimeDerivatives}>
                    <UIText allowFontScaling={false} style={styles.textBold}>
                      {formatDateToDisplay(item.fromDate as string, 'dd/MM/yyyy')}
                    </UIText>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.itemSection}>
              <View style={styles.itemLeft}>
                <UIText allowFontScaling={false}>{t('Type')}:</UIText>
                <UIText allowFontScaling={false} style={[styles.marginRight, styles.textBold]}>
                  {t(item.orderType as string)}
                </UIText>
              </View>
              <View style={styles.itemRight}>
                <UIText allowFontScaling={false} style={styles.marginLeft}>
                  {t('Stop Price')}:
                </UIText>
                <UIText allowFontScaling={false} style={styles.textBold}>
                  {item.stopPrice}
                </UIText>
              </View>
            </View>
            <View style={styles.itemSection}>
              <View style={styles.itemLeft}>
                <UIText allowFontScaling={false}>{t('Qty')}:</UIText>
                <UIText allowFontScaling={false} style={[styles.marginRight, styles.textBold]}>
                  {item.orderQuantity}
                </UIText>
              </View>
              <View style={styles.limitPriceContainer}>
                {item.orderType !== STOP_ORDER_TYPE.STOP && (
                  <View style={styles.itemRight}>
                    <UIText allowFontScaling={false} style={styles.marginLeft}>
                      {t('Limit Price')}:
                    </UIText>
                    <UIText allowFontScaling={false} style={styles.textBold}>
                      {item.orderPrice}
                    </UIText>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  private onPressCancel = () => {
    this.hasMore = true;
    if (this.props.closeModal) {
      this.props.closeModal(false);
    }
  };

  private onPressItem = (item: IObject) => {
    const isEquity = this.props.systemType === SYSTEM_TYPE.EQUITY;
    const symbolMap = getSymbolMap(store.getState());
    this.hasMore = true;
    if (this.props.type === ORDER_FORM_ACTION_MODE.MODIFY) {
      if (symbolMap) {
        let symbolInfo;
        if (config.usingNewKisCore) {
          symbolInfo =
            symbolMap[isEquity ? ((item.symbol || item.code) as string) : ((item?.symbol || item.code) as string)];
        } else {
          symbolInfo = symbolMap[isEquity ? (item.stockCode as string) : (item.code as string)];
        }

        let orderKind = ORDER_KIND.NORMAL_ORDER;
        if (this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER || this.props.orderKind === ORDER_KIND.STOP_ORDER) {
          orderKind = item.orderType === STOP_ORDER_TYPE.STOP ? ORDER_KIND.STOP_ORDER : ORDER_KIND.STOP_LIMIT_ORDER;
        } else {
          orderKind = this.props.orderKind;
        }

        if (this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER && config.usingNewKisCore) {
          orderKind = ORDER_KIND.STOP_LIMIT_ORDER;
        }

        if (symbolInfo) {
          this.props.setCurrentSymbol(symbolInfo);

          let formData = {};

          if (config.usingNewKisCore) {
            formData = {
              ...item,
              orderQuantity: item.orderQty || item.orderQuantity || item.unmatchedQuantity,
              sellBuyType: item.buySellOrder || item.sellBuyType,
            };
          } else {
            formData = { ...item };
          }

          goToBiz(
            'Order',
            {
              formData,
              orderKind,
              actionMode: ORDER_FORM_ACTION_MODE.MODIFY,
              additionalPPForModify:
                ((formData as IObject).unmatchedQty as number) * ((formData as IObject).orderPrice as number),
            },
            this.props.componentId,
            undefined,
            'OrderStack2'
          );
        }
      }

      this.props?.onPressItem?.();
    } else {
      this.formData = { ...item };
      if (this.props.orderKind === ORDER_KIND.STOP_ORDER || this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
        this.orderKind = item.orderType === STOP_ORDER_TYPE.STOP ? ORDER_KIND.STOP_ORDER : ORDER_KIND.STOP_LIMIT_ORDER;
      } else {
        this.orderKind = this.props.orderKind;
      }

      this.setState({ modalVisible: true });
    }
  };

  private onChangeDateFrom = (value: Date) => {
    this.fromDate = value;

    if (isAfter(this.fromDate, this.toDate)) {
      this.toDate = this.fromDate;

      if (this.toDateRef) {
        this.toDateRef.setValue(this.toDate);
      }
    }

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

    this.setState({}, () => {
      this.requestData();
    });
  };

  private handleScrollEndReached = () => {
    if (this.hasMore === true) {
      this.setState({}, () => {
        this.requestLoadMore();
      });
    }
  };

  private confirm = () => {
    if (this.props.confirmCancelOrder) {
      this.props.confirmCancelOrder(this.formData, this.orderKind);
    }
    this.setState({ modalVisible: false });
  };

  private closeModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { t } = this.props;
    const renderDateTimePicker =
      this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER ||
      this.props.orderKind === ORDER_KIND.STOP_ORDER ||
      (this.props.orderKind === ORDER_KIND.ADVANCE_ORDER && this.props.systemType === SYSTEM_TYPE.DERIVATIVES);
    const renderPicker =
      this.props.systemType === SYSTEM_TYPE.DERIVATIVES && this.props.orderKind === ORDER_KIND.ADVANCE_ORDER;
    return (
      <Modal visible={true}>
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={this.onPressCancel}>
            <AntDesign name="arrowleft" style={styles.icon} />
          </TouchableOpacity>
          <UIText allowFontScaling={false} style={[styles.textHeader]}>
            {this.props.type === ORDER_FORM_ACTION_MODE.CANCEL
              ? t('Choose order to cancel')
              : t('Choose order to modify')}
          </UIText>
        </View>
        <View style={styles.listContainer}>
          {renderDateTimePicker && (
            <View style={styles.dateTimeSection}>
              <View style={styles.itemDateTime}>
                <View style={styles.labelContainer}>
                  <UIText allowFontScaling={false} style={styles.label}>
                    {t('From')}
                  </UIText>
                </View>
                <View style={styles.dataContainer}>
                  <DatePicker
                    ref={(ref: DatePickerComp) => (this.fromDateRef = ref)}
                    onChange={this.onChangeDateFrom}
                  />
                </View>
              </View>

              <View style={styles.itemDateTime}>
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
          )}
          {renderPicker && (
            <View style={styles.dateTimeSection}>
              <View style={styles.itemDateTime}>
                <View style={styles.pickerContainer}>
                  <Picker
                    placeholder={{}}
                    list={this.advanceOrderTypes}
                    selectedValue={DERIVATIVES_ADVANCE_ORDER_TYPE.AO}
                    onChange={this.onChangeAdvanceOrderType}
                  />
                </View>
              </View>
            </View>
          )}
          {this.data && (
            <FlatList
              data={this.data}
              renderItem={this.renderItem}
              onEndReached={this.handleScrollEndReached}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.01}
            />
          )}
        </View>
        {this.state.modalVisible && (
          <OrderModal
            formData={this.formData}
            confirm={this.confirm}
            closeModal={this.closeModal}
            orderInput={this.props.orderInput}
            orderKind={this.orderKind}
            orderType={this.formData.orderType}
            actionMode={ORDER_FORM_ACTION_MODE.CANCEL}
          />
        )}
      </Modal>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  equityOrderTodayUnmatch: state.equityOrderTodayUnmatch,
  equityAdvanceOrderHistory: state.equityAdvanceOrderHistory,
  equityStopOrderHistory: state.equityStopOrderHistory,
  derivativesAdvanceOrderHistory: state.derivativesAdvanceOrderHistory,
  derivativesOrderTodayUnmatch: state.derivativesOrderTodayUnmatch,
  derivativesStopOrderHistory: state.derivativesStopOrderHistory,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryOrderTodayUnmatch,
      queryAdvanceOrderHistory,
      queryStopOrderHistory,
      queryDerivativesStopOrderHistory,
      queryDerivativesOrderTodayUnmatch,
      queryDerivativesAdvanceOrderHistory,
      setCurrentSymbol,
    })(CancelModifyModal)
  ),
  Fallback,
  handleError
);
