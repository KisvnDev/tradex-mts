import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
  InputAccessoryView,
} from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { Navigation } from 'react-native-navigation';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { ImageSource } from 'react-native-vector-icons/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RecyclerListView, LayoutProvider, Dimension, DataProvider } from 'recyclerlistview';
import { Big } from 'big.js';
import { goToSymbolSearch } from 'navigations';
import {
  getSystemType,
  getPriceStep,
  getFuturesPriceStep,
  getSuggestedQuantity,
  isStockType,
  roundLot,
} from 'utils/market';
import { formatDateToString } from 'utils/datetime';
import UserInactivity from 'components/UserInactivity';
import OrderModal from './OrderModal';
import PriceRow from './PriceRow';
import SummaryRow from './SummaryRow';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import QuantityInput, { QuantityInput as QuantityInputComp } from 'components/QuantityInput';
import SymbolHeader from 'components/SymbolHeader';
import AccountPicker from 'components/AccountPicker';
import AccountBankPicker from 'components/AccountBankPicker';
import {
  SYSTEM_TYPE,
  ORDER_KIND,
  ORDER_TYPE,
  STOP_ORDER_STATUS,
  STOP_ORDER_TYPE,
  QUANTITY_LIST,
  SYMBOL_TYPE,
  SELL_BUY_TYPE,
  INPUT_QUANTIY_ID_KEY,
} from 'global';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccountBank } from 'interfaces/common';
import { ISymbolInfo, ISymbolData } from 'interfaces/market';
import { ICurrentRow, getSpeedOrderInput, ISpeedOrderInput, PROMPT_MODE } from './reducers';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import config from 'config';
import {
  placeSpeedOrder,
  placeDerivativesSpeedOrder,
  modifySpeedOrder,
  cancelSpeedOrder,
  cancelDerivativesSpeedOrder,
  moveSpeedOrder,
  moveDerivativesSpeedOrder,
  queryOrderHistory,
  queryOrderUnMatchToday,
  queryOrderUnMatchDerivativesToday,
  queryStopOrderHistory,
  queryDerivativesOrderHistory,
  queryDerivativesStopOrderHistory,
  setCurrentRow,
  queryEquitySellableInfo,
  queryDerivativesOpenPosition,
} from './actions';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { width, Colors } from 'styles';
import styles from './styles';
import _ from 'lodash';
import UIText from 'components/UiText';

interface ISpeedOrderProps extends React.ClassAttributes<SpeedOrder>, WithTranslation {
  quote: ISymbolData;
  orderTrigger: IOrderTrigger | null;
  speedOrderInput: ISpeedOrderInput;
  currentRow: ICurrentRow;
  componentId: string;
  parentId?: string;
  equitySellable: IObject | null;
  derivativesOpenPosition: IObject | null;
  currentSymbol: ISymbolInfo | null;
  speedOrderHistory: IObject | null;
  stopSpeedOrderHistory: IObject | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryOrderHistory(params: IObject): void;

  queryOrderUnMatchToday(params: IObject): void;

  queryOrderUnMatchDerivativesToday(params: IObject): void;

  queryStopOrderHistory(params: IObject): void;

  queryDerivativesOrderHistory(params: IObject): void;

  queryDerivativesStopOrderHistory(params: IObject): void;

  placeSpeedOrder(params: IObject, orderKind: ORDER_KIND): void;

  placeDerivativesSpeedOrder(params: IObject, orderKind: ORDER_KIND): void;

  modifySpeedOrder(params: IObject, orderKind: ORDER_KIND): void;

  cancelSpeedOrder(params: IObject, orderKind: ORDER_KIND): void;

  cancelDerivativesSpeedOrder(params: IObject, orderKind: ORDER_KIND): void;

  moveSpeedOrder(params: IObject, orderKind: ORDER_KIND): void;

  moveDerivativesSpeedOrder(params: IObject, orderKind: ORDER_KIND): void;

  setCurrentRow(currentRow: ICurrentRow | null): void;

  queryDerivativesOpenPosition(params: IObject): void;

  queryEquitySellableInfo(symbolCode?: string): void;
}

interface ISpeedOrderState {
  visible: boolean;
  errorQuantity: boolean;
  errorQuantityContent: string;
  redraw: boolean;
}

class SpeedOrder extends React.Component<ISpeedOrderProps, ISpeedOrderState> {
  private orderQuantity = 0;
  private searchIcon: ImageSource;
  private layoutProvider: LayoutProvider;
  private dataProvider: DataProvider;
  private priceList: Big[] = [];
  private initialRenderIndex = 0;
  private reload = false;
  private reset = false;
  private disabled = false;
  private quantityInput: QuantityInputComp;
  private quote: ISymbolData;
  private readonly isUsingNewKisCore = config.usingNewKisCore;

  constructor(props: ISpeedOrderProps) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {
      visible: false,
      errorQuantity: false,
      errorQuantityContent: '',
      redraw: false,
    };

    this.layoutProvider = new LayoutProvider(
      (index: number) => 0,
      (type: number, dim: Dimension) => {
        dim.width = width;
        dim.height = 40;
      }
    );

    this.dataProvider = new DataProvider((r1: Big, r2: Big) => {
      return r1.cmp(r2) !== 0;
    });
  }

  componentDidAppear() {
    const { currentSymbol, selectedAccount, isValid } = this.props.speedOrderInput;
    const accountBank = this.props.speedOrderInput?.accountBank;

    if (currentSymbol && selectedAccount) {
      this.props.setCurrentSymbol(currentSymbol);
      this.disabled = getSystemType(currentSymbol.t) !== selectedAccount.type || global.viewMode === true;
      this.orderQuantity = getSuggestedQuantity(currentSymbol.m, currentSymbol.t, currentSymbol.bs);

      if (isValid === true) {
        if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
          this.queryOrderHistory(currentSymbol);
          this.isUsingNewKisCore
            ? this.queryStopOrderHistory(currentSymbol)
            : this.queryStopOrderHistory(currentSymbol, accountBank!);
          this.querySellableInfo();
        } else {
          this.queryDerivativesOrderHistory(currentSymbol);
          this.queryDerivativesUnmatch(currentSymbol);
          this.queryDerivativesStopOrderHistory(currentSymbol);
          this.queryDerivativesOpenPosition();
        }

        if (global.symbolData[currentSymbol.s]) {
          this.quote = global.symbolData[currentSymbol!.s];
        }
      }
    }

    if (this.props.quote && currentSymbol && this.props.quote.s === currentSymbol.s) {
      this.quote = { ...this.quote, ...this.props.quote };
      this.priceList = this.getPriceList(currentSymbol, this.quote);
      this.dataProvider = this.dataProvider.cloneWithRows(this.priceList.slice(1, this.priceList.length - 1));
    }

    this.setState(
      {
        visible: true,
      },
      async () => {
        this.searchIcon = await MaterialIcons.getImageSource('search', 25, Colors.WHITE);
        this.updateTopBar(currentSymbol);
      }
    );
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  shouldComponentUpdate(nextProps: ISpeedOrderProps, nextState: ISpeedOrderState) {
    const { currentSymbol, selectedAccount, isValid } = nextProps.speedOrderInput;
    const accountBank = this.props.speedOrderInput?.accountBank;

    if (
      (nextProps.speedOrderInput !== this.props.speedOrderInput &&
        (this.props.speedOrderInput.currentSymbol == null ||
          currentSymbol == null ||
          currentSymbol.s !== this.props.speedOrderInput.currentSymbol.s)) ||
      (nextState.visible !== this.state.visible && nextState.visible === true)
    ) {
      if (selectedAccount && currentSymbol) {
        this.disabled = getSystemType(currentSymbol.t) !== selectedAccount.type || global.viewMode === true;
      }

      if (
        this.props.speedOrderInput.currentSymbol == null ||
        currentSymbol == null ||
        currentSymbol.s !== this.props.speedOrderInput.currentSymbol.s
      ) {
        this.reset = true;
        delete this.quote;
      }

      if (nextProps.quote && currentSymbol && nextProps.quote.s === currentSymbol.s) {
        this.quote = { ...this.quote, ...nextProps.quote };
        this.priceList = this.getPriceList(currentSymbol, this.quote);
        this.dataProvider = this.dataProvider.cloneWithRows(this.priceList.slice(1, this.priceList.length - 1));
        this.reload = false;
        this.orderQuantity = getSuggestedQuantity(currentSymbol.m, currentSymbol.t, currentSymbol.bs);
      } else {
        this.priceList = [];
        this.reload = true;
      }

      if (nextState.visible === true) {
        this.updateTopBar(currentSymbol);
      }

      return true;
    }

    if (nextProps.speedOrderInput !== this.props.speedOrderInput && isValid === true && nextState.visible === true) {
      if (global.symbolData[currentSymbol!.s]) {
        this.quote = global.symbolData[currentSymbol!.s];
      }

      this.disabled = getSystemType(currentSymbol!.t) !== selectedAccount!.type || global.viewMode === true;
      if (
        this.props.speedOrderInput.currentSymbol == null ||
        currentSymbol!.s !== this.props.speedOrderInput.currentSymbol.s
      ) {
        this.orderQuantity = getSuggestedQuantity(currentSymbol!.m, currentSymbol!.t, currentSymbol!.bs);
      }
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        this.queryOrderHistory(currentSymbol!);
        this.isUsingNewKisCore
          ? this.queryStopOrderHistory(currentSymbol!)
          : this.queryStopOrderHistory(currentSymbol!, accountBank!);
        this.querySellableInfo();
      } else {
        if (
          this.props.speedOrderInput.selectedAccount == null ||
          this.props.speedOrderInput.currentSymbol == null ||
          selectedAccount!.accountDisplay !== this.props.speedOrderInput.selectedAccount.accountDisplay ||
          currentSymbol!.s !== this.props.speedOrderInput.currentSymbol.s
        ) {
          this.queryDerivativesOrderHistory(currentSymbol!);
          this.queryDerivativesUnmatch(currentSymbol!);
          this.queryDerivativesStopOrderHistory(currentSymbol!);
          this.queryDerivativesOpenPosition();
        }
      }

      return true;
    }

    if (this.props.orderTrigger !== nextProps.orderTrigger && nextProps.orderTrigger) {
      if (nextProps.orderTrigger.orderKind === ORDER_KIND.NORMAL_ORDER) {
        if (selectedAccount && currentSymbol && isValid === true) {
          if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
            this.queryOrderHistory(currentSymbol);
            if (nextProps.orderTrigger.sellBuyType === SELL_BUY_TYPE.SELL) {
              this.querySellableInfo();
            }
          } else {
            this.queryDerivativesOrderHistory(currentSymbol);
            this.queryDerivativesUnmatch(currentSymbol);
            this.queryDerivativesOpenPosition();
          }

          if (nextProps.orderTrigger.isStopActivation === true) {
            if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
              this.isUsingNewKisCore
                ? this.queryStopOrderHistory(currentSymbol!)
                : this.queryStopOrderHistory(currentSymbol!, accountBank!);
            } else {
              this.queryDerivativesStopOrderHistory(currentSymbol!);
            }
          }
        }
      } else if (
        nextProps.orderTrigger.orderKind === ORDER_KIND.STOP_ORDER ||
        nextProps.orderTrigger.orderKind === ORDER_KIND.STOP_LIMIT_ORDER
      ) {
        if (isValid === true) {
          if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
            this.isUsingNewKisCore
              ? this.queryStopOrderHistory(currentSymbol!)
              : this.queryStopOrderHistory(currentSymbol!, accountBank!);
          } else {
            this.queryDerivativesStopOrderHistory(currentSymbol!);
          }
        }
      }
    }

    if (
      nextProps.quote != null &&
      nextProps.quote !== this.props.quote &&
      currentSymbol &&
      nextProps.quote.s === currentSymbol.s &&
      nextState.visible === true
    ) {
      this.quote = { ...this.quote, ...nextProps.quote };

      if (this.reload === true) {
        return true;
      }
    }

    if (
      nextState.visible !== this.state.visible ||
      nextState.redraw !== this.state.redraw ||
      nextProps.currentRow !== this.props.currentRow ||
      nextProps.equitySellable !== this.props.equitySellable ||
      nextProps.derivativesOpenPosition !== this.props.derivativesOpenPosition
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const { currentSymbol, isValid } = this.props.speedOrderInput;

    if (
      this.reset === true &&
      (isValid === true || global.viewMode === true) &&
      this.quote &&
      this.quote.s === currentSymbol!.s
    ) {
      this.priceList = this.getPriceList(currentSymbol!, this.quote);
      this.dataProvider = this.dataProvider.cloneWithRows(this.priceList.slice(1, this.priceList.length - 1));
      this.reload = false;
      this.orderQuantity = getSuggestedQuantity(currentSymbol!.m, currentSymbol!.t, currentSymbol!.bs);

      this.reset = false;
      this.setState({
        redraw: !this.state.redraw,
      });
    }
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'SpeedOrderSearchButton') {
      goToSymbolSearch(this.props.componentId);
    }
  }

  private queryOrderHistory = (currentSymbol: ISymbolInfo) => {
    if (this.isUsingNewKisCore) {
      const params: IObject = {
        status: 'ALL',
        fetchCount: 100,
        sellBuyType: 'SELL/BUY',
        stockCode: currentSymbol.s,
      };

      this.props.queryOrderUnMatchToday(params);
    } else {
      this.props.queryOrderHistory({
        stockCode: currentSymbol.s,
        fromDate: formatDateToString(new Date())!,
        fetchCount: 100,
      });
    }
  };

  private queryStopOrderHistory = (currentSymbol: ISymbolInfo, accountBank?: IAccountBank) => {
    let params: IObject;
    if (accountBank && !this.isUsingNewKisCore) {
      params = {
        stockCode: currentSymbol.s,
        fromDate: formatDateToString(new Date())!,
        status: STOP_ORDER_STATUS.PENDING,
        orderType: STOP_ORDER_TYPE.STOP,
        bankCode: accountBank.bankCode,
        bankAccount: accountBank.bankAccount,
        bankName: accountBank.bankName,
        fetchCount: 100,
      };
    } else {
      params = {
        stockCode: currentSymbol.s,
        fromDate: formatDateToString(new Date())!,
        status: STOP_ORDER_STATUS.PENDING,
        orderType: STOP_ORDER_TYPE.STOP,
      };
    }

    this.props.queryStopOrderHistory(params);
  };

  private queryDerivativesOrderHistory = (currentSymbol: ISymbolInfo) => {
    let params = {};
    if (this.isUsingNewKisCore) {
      // params = {
      //   fromDate: formatDateToString(new Date())!,
      //   toDate: formatDateToString(new Date())!,
      //   fetchCount: 100,
      //   code: currentSymbol.s,
      //   status: ['READYTOSEND', 'QUEUE', 'SENDING'],
      //   sellBuyType: 'ALL',
      // };
      return;
    } else {
      params = {
        date: formatDateToString(new Date())!,
        fetchCount: 100,
        code: currentSymbol.s,
      };
    }

    this.props.queryDerivativesOrderHistory(params);
  };

  private queryDerivativesUnmatch = (currentSymbol: ISymbolInfo) => {
    if (this.isUsingNewKisCore) {
      this.props.queryOrderUnMatchDerivativesToday({
        stockSymbol: currentSymbol!.s,
        sellBuyType: 'ALL',
        status: 'READYTOSEND',
        validity: 'ALL',
        fetchCount: 100,
      });
    }
  };

  private queryDerivativesStopOrderHistory = (currentSymbol: ISymbolInfo) => {
    if (!this.isUsingNewKisCore) {
      this.props.queryDerivativesStopOrderHistory({
        fromDate: formatDateToString(new Date())!,
        toDate: formatDateToString(new Date())!,
        isSent: false,
        isRegistered: true,
        code: currentSymbol.s,
        fetchCount: 100,
      });
    } else {
      this.props.queryDerivativesStopOrderHistory({
        fromDate: formatDateToString(new Date())!,
        toDate: formatDateToString(new Date())!,
        isSent: false,
        isRegistered: true,
        code: currentSymbol.s,
        fetchCount: 100,
      });
    }
  };

  private querySellableInfo = () => {
    if (this.isUsingNewKisCore) {
      this.props.queryEquitySellableInfo(this.props.currentSymbol?.s);
    } else {
      this.props.queryEquitySellableInfo();
    }
  };

  private queryDerivativesOpenPosition = () => {
    this.props.queryDerivativesOpenPosition({
      fetchCount: 100,
    });
  };

  private updateTopBar = (currentSymbol: ISymbolInfo | null) => {
    const rightButtons = [
      {
        id: 'SpeedOrderSearchButton',
        icon: this.searchIcon,
      },
    ];

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: `${this.props.t('Speed Order')} ${currentSymbol ? `(${currentSymbol.s})` : ''}`,
        },
        rightButtons,
      },
    });
  };

  private getPriceList = (currentSymbol: ISymbolInfo, quote: ISymbolData) => {
    const priceList: Big[] = [];
    this.initialRenderIndex = 0;
    const systemType = getSystemType(currentSymbol.t);

    if (quote.ce != null && quote.fl != null) {
      let price = Big(quote.ce);

      if (systemType === SYSTEM_TYPE.EQUITY) {
        while (price.cmp(Big(quote.fl)) >= 0) {
          priceList.push(price);
          price = price.minus(getPriceStep(price, currentSymbol.m, currentSymbol.t));
          if (quote.c != null && price.cmp(Big(quote.c)) === 0) {
            this.initialRenderIndex = priceList.length - 2;
          }
        }
      } else if (systemType === SYSTEM_TYPE.DERIVATIVES) {
        while (price.cmp(Big(quote.fl)) >= 0) {
          priceList.push(price);
          price = price.minus(getFuturesPriceStep(currentSymbol.bs));

          if (quote.c != null && price.cmp(Big(quote.c)) === 0) {
            this.initialRenderIndex = priceList.length - 2;
          }
        }
      }
    }

    return priceList;
  };

  private renderRow = (type: React.ReactText, data: Big, index: number, rowStyle?: StyleProp<ViewStyle>) => {
    return (
      <PriceRow
        price={data}
        callPlaceOrder={this.callPlaceOrder}
        callCancelOrder={this.callCancelOrder}
        callMoveOrder={this.callMoveOrder}
      />
    );
  };

  private callPlaceOrder = (currentRow: ICurrentRow) => {
    const { currentSymbol, accountBank, selectedAccount, isValid } = this.props.speedOrderInput;
    if (currentRow && isValid) {
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        // Check whether modify stop order or place new order
        if (
          currentRow.orderKind === ORDER_KIND.NORMAL_ORDER ||
          (currentRow.orderKind === ORDER_KIND.STOP_ORDER &&
            (config.usingNewKisCore
              ? true
              : currentRow.stopPriceData == null || currentRow.stopPriceData?.[currentRow?.sellBuyType] == null))
        ) {
          let params: IObject;

          if (this.isUsingNewKisCore) {
            params = {
              orderQuantity: this.orderQuantity,
              sellBuyType: currentRow.sellBuyType,
              accountNumber: selectedAccount!.accountNumber,
              code: currentSymbol!.s,
              marketType: currentSymbol!.m,
              stopPrice: Number(currentRow.price),
            };
          } else {
            params = {
              orderQuantity: this.orderQuantity,
              stopPrice: Number(currentRow.price),
              sellBuyType: currentRow.sellBuyType,
              accountNumber: selectedAccount!.accountNumber,
              subNumber: selectedAccount!.subNumber,
              bankCode: accountBank!.bankCode,
              bankAccount: accountBank!.bankAccount,
              bankName: accountBank!.bankName,
              stockCode: currentSymbol!.s,
              securitiesType: currentSymbol!.t,
            };
          }

          if (currentRow.orderKind === ORDER_KIND.NORMAL_ORDER) {
            params.orderPrice = Number(currentRow.price);
            params.orderType = ORDER_TYPE.LO;
          }

          this.props.placeSpeedOrder(params, currentRow.orderKind);
        } else {
          const { quantity } = this.props.currentRow;
          //Already placed stop order, just add quantity
          let params: IObject;
          if (this.isUsingNewKisCore) {
            params = {
              accountNo: selectedAccount!.accountNumber,
              orderNo: currentRow.orderNo!,
              orderGroupNo: currentRow.orderGroupNo!,
              newPrice: currentRow.newPrice!,
              newQuantity: this.orderQuantity,
              stockSymbol: currentSymbol!.s,
              market: currentSymbol!.m,
              originalQuantity: quantity!,
              stockCode: currentSymbol!.s,
            };
          } else {
            params = {
              orderQuantity: this.orderQuantity + currentRow.stopPriceData![currentRow.sellBuyType]!.orderQuantity,
              stopPrice: Number(currentRow.price),
              sellBuyType: currentRow.sellBuyType,
              accountNumber: selectedAccount!.accountNumber,
              subNumber: selectedAccount!.subNumber,
              stockCode: currentSymbol!.s,
              securitiesType: currentSymbol!.t,
              bankCode: accountBank!.bankCode,
              bankAccount: accountBank!.bankAccount,
              bankName: accountBank!.bankName,
            };
          }
          this.props.modifySpeedOrder(params, currentRow.orderKind);
        }
      } else {
        let params: IObject = {};
        if (this.isUsingNewKisCore) {
          params = {
            accountNumber: selectedAccount!.accountNumber,
            code: currentSymbol!.s,
            sellBuyType: currentRow.sellBuyType,
            orderQuantity: this.orderQuantity,
          };

          if (currentRow.orderKind === ORDER_KIND.NORMAL_ORDER) {
            params.orderType = ORDER_TYPE.LO;
            params.orderPrice = Number(currentRow.price);
          } else {
            params.stopPrice = Number(currentRow.price);
          }
        } else {
          params = {
            orderQuantity: this.orderQuantity,
            sellBuyType: currentRow.sellBuyType,
            accountNumber: selectedAccount!.accountNumber,
            code: currentSymbol!.s,
            orderPrice: Number(currentRow.price),
          };

          if (currentRow.orderKind === ORDER_KIND.NORMAL_ORDER) {
            params.orderType = ORDER_TYPE.LO;
          } else {
            params.stopPrice = Number(currentRow.price);
          }
        }

        this.props.placeDerivativesSpeedOrder(params, currentRow.orderKind);
      }
    }
  };

  private callCancelOrder = (currentRow: ICurrentRow) => {
    const { currentSymbol, accountBank, selectedAccount, isValid } = this.props.speedOrderInput;

    if (currentRow && isValid) {
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        if (currentRow.orderKind === ORDER_KIND.NORMAL_ORDER) {
          let params = {};

          if (this.isUsingNewKisCore) {
            params = {
              accountNo: selectedAccount!.accountNumber,
              orders: [
                {
                  orderNo: _.get(this.props.currentRow.orderInfo, 'orderNo'),
                  orderGroupNo: _.get(this.props.currentRow.orderInfo, 'orderGroupNo'),
                },
              ],
            };
          } else {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              subNumber: selectedAccount!.subNumber,
              stockCode: currentSymbol!.s,
              sellBuyType: currentRow.sellBuyType,
              orderPrice: Number(currentRow.price),
            };
          }

          this.props.cancelSpeedOrder(params, ORDER_KIND.NORMAL_ORDER);
        } else {
          let params: IObject;
          if (this.isUsingNewKisCore) {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              subNumber: selectedAccount!.subNumber,
              code: currentSymbol!.s,
              sellBuyType: currentRow.sellBuyType,
              stopPrice: Number(currentRow.price),
            };
          } else {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              subNumber: selectedAccount!.subNumber,
              stockCode: currentSymbol!.s,
              sellBuyType: currentRow.sellBuyType,
              stopPrice: Number(currentRow.price),
              bankCode: accountBank!.bankCode,
              bankAccount: accountBank!.bankAccount,
              bankName: accountBank!.bankName,
            };
          }
          this.props.cancelSpeedOrder(params, ORDER_KIND.STOP_ORDER);
        }
      } else {
        if (currentRow.orderKind === ORDER_KIND.NORMAL_ORDER) {
          let params: IObject = {};

          if (this.isUsingNewKisCore) {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              orderInfo: [
                {
                  marketID: _.get(this.props.currentRow.orderInfo, 'marketID'),
                  symbolCode: _.get(this.props.currentRow.orderInfo, 'symbol'),
                  commodityName: _.get(this.props.currentRow.orderInfo, 'commodityName'),
                  contractMonth: _.get(this.props.currentRow.orderInfo, 'contractMonth'),
                  orderNumber: _.get(this.props.currentRow.orderInfo, 'orderNumber'),
                  validity: _.get(this.props.currentRow.orderInfo, 'validity'),
                  orderType: _.get(this.props.currentRow.orderInfo, 'orderType'),
                  orderGroupID: _.get(this.props.currentRow.orderInfo, 'orderGroupID'),
                  sellBuyType: _.get(this.props.currentRow.orderInfo, 'sellBuyType'),
                },
              ],
            };
          } else {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              futuresCode: currentSymbol!.s,
              orderPrice: Number(currentRow.price),
              sellBuyType: currentRow.sellBuyType,
            };
          }
          this.props.cancelDerivativesSpeedOrder(params, ORDER_KIND.NORMAL_ORDER);
        } else {
          let params: IObject = {};
          if (this.isUsingNewKisCore) {
            let idList: string[] = [`${this.props.currentRow.stopOrderId}`];

            params = {
              idList,
            };
          } else {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              futuresCode: currentSymbol!.s,
              sellBuyType: currentRow.sellBuyType,
            };
          }

          this.props.cancelDerivativesSpeedOrder(params, ORDER_KIND.STOP_ORDER);
        }
      }
    }
  };

  private callMoveOrder = (currentRow: ICurrentRow) => {
    const { currentSymbol, accountBank, selectedAccount, isValid } = this.props.speedOrderInput;

    if (currentRow && isValid) {
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        if (currentRow.orderKind === ORDER_KIND.NORMAL_ORDER) {
          let params: IObject;

          if (this.isUsingNewKisCore) {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              stockCode: currentSymbol!.s,
              market: currentSymbol!.m,
              newPrice: Number(currentRow.newPrice),
              orderPrice: Number(currentRow.price),
              newOrderPrice: Number(currentRow.newPrice),
              sellBuyType: currentRow?.sellBuyType,
              accountType: selectedAccount?.type!,
            };
          } else {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              subNumber: selectedAccount!.subNumber,
              stockCode: currentSymbol!.s,
              orderPrice: Number(currentRow.price),
              newOrderPrice: Number(currentRow.newPrice),
              sellBuyType: currentRow.sellBuyType,
              securitiesType: currentSymbol!.t,
              marketType: currentSymbol!.m,
              bankAccount: accountBank!.bankAccount,
            };
          }

          this.props.moveSpeedOrder(params, ORDER_KIND.NORMAL_ORDER);
        } else {
          let params: IObject;

          if (this.isUsingNewKisCore) {
            params = {
              newStopPrice: Number(currentRow.newPrice)!,
              stopPrice: Number(currentRow.price),
              sellBuyType: currentRow.sellBuyType,
              accountNumber: selectedAccount!.accountNumber,
              code: currentSymbol!.s,
            };
          } else {
            params = {
              orderQuantity: currentRow.quantity!,
              stopPrice: Number(currentRow.price),
              sellBuyType: currentRow.sellBuyType,
              accountNumber: selectedAccount!.accountNumber,
              subNumber: selectedAccount!.subNumber,
              stockCode: currentSymbol!.s,
              securitiesType: currentSymbol!.t,
              bankCode: accountBank!.bankCode,
              bankAccount: accountBank!.bankAccount,
              bankName: accountBank!.bankName,
              newStopPrice: Number(currentRow.newPrice),
            };
          }

          this.props.moveSpeedOrder(params, ORDER_KIND.STOP_ORDER);
        }
      } else {
        if (currentRow.orderKind === ORDER_KIND.NORMAL_ORDER) {
          let params: IObject = {};

          if (this.isUsingNewKisCore) {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              stockCode: currentSymbol!.s,
              market: currentSymbol!.m,
              newPrice: Number(currentRow.newPrice),
              orderPrice: Number(currentRow.price),
              newOrderPrice: Number(currentRow.newPrice),
              sellBuyType: currentRow?.sellBuyType,
              accountType: selectedAccount?.type!,
            };
          } else {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              futuresCode: currentSymbol!.s,
              orderPrice: Number(currentRow.price),
              newOrderPrice: Number(currentRow.newPrice),
              orderType: ORDER_TYPE.LO,
              sellBuyType: currentRow.sellBuyType,
            };
          }
          this.props.moveDerivativesSpeedOrder(params, ORDER_KIND.NORMAL_ORDER);
        } else if (currentRow.orderKind === ORDER_KIND.STOP_ORDER) {
          let params: IObject = {};
          if (this.isUsingNewKisCore) {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              code: currentSymbol!.s,
              stopPrice: Number(currentRow.price),
              newStopPrice: Number(currentRow.newPrice),
              newOrderPrice: Number(currentRow.newPrice),
              sellBuyType: currentRow?.sellBuyType,
            };
          } else {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              futuresCode: currentSymbol!.s,
              stopPrice: Number(currentRow.price),
              newStopPrice: Number(currentRow.newPrice),
              sellBuyType: currentRow.sellBuyType,
            };
          }
          this.props.moveDerivativesSpeedOrder(params, ORDER_KIND.STOP_ORDER);
        }
      }
    }
  };

  private callCancelAllOrders = (currentRow: ICurrentRow) => {
    const { currentSymbol, selectedAccount, isValid } = this.props.speedOrderInput;

    if (currentRow && isValid) {
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        let params = {};
        if (this.isUsingNewKisCore) {
          const orders = [];

          for (const key in this.props.speedOrderHistory) {
            const orderInfo = this.props.speedOrderHistory[key]?.[currentRow.sellBuyType]?.['orderInfo'];
            if (orderInfo?.orderNo && orderInfo?.orderGroupNo) {
              orders.push({
                orderGroupNo: orderInfo?.orderGroupNo,
                orderNo: orderInfo?.orderNo,
              });
            }
          }

          params = {
            accountNo: selectedAccount!.accountNumber,
            orders,
          };
        } else {
          params = {
            accountNumber: selectedAccount!.accountNumber,
            subNumber: selectedAccount!.subNumber,
            stockCode: currentSymbol!.s,
            sellBuyType: currentRow.sellBuyType,
          };
        }
        this.props.cancelSpeedOrder(params, currentRow.orderKind);
      } else {
        let params: IObject = {};
        if (this.isUsingNewKisCore) {
          let idList: string[] = [];

          for (const key in this.props.stopSpeedOrderHistory) {
            // eslint-disable-next-line dot-notation
            const stopId = this.props.stopSpeedOrderHistory[key]['stopOrderId'] as number;
            if (stopId) {
              idList.push(`${stopId}`);
            }
          }

          params = {
            idList,
          };
        } else {
          params = {
            accountNumber: selectedAccount!.accountNumber,
            futuresCode: currentSymbol!.s,
            sellBuyType: currentRow.sellBuyType,
          };
        }
        this.props.cancelDerivativesSpeedOrder(params, currentRow.orderKind);
      }
    }
  };

  private validateQuantity = (value: number) => {
    let errorQuantityContent = '';
    let errorQuantity = false;

    if (!isNaN(value)) {
      if (value <= 0) {
        errorQuantityContent = 'Quantity must be greater than 0';
        errorQuantity = true;
      }
    } else {
      errorQuantityContent = 'Quantity must be number';
      errorQuantity = true;
    }

    return { errorQuantity, errorQuantityContent };
  };

  private onChangeQuantity = (data: number) => {
    this.orderQuantity = data;

    const { errorQuantity, errorQuantityContent } = this.validateQuantity(data);

    this.setState({
      redraw: !this.state.redraw,
      errorQuantity,
      errorQuantityContent,
    });
  };

  private closeModal = () => {
    this.props.setCurrentRow(null);
  };

  private confirm = () => {
    const { currentRow } = this.props;

    if (currentRow) {
      switch (currentRow.promptMode) {
        case PROMPT_MODE.PLACE:
          this.callPlaceOrder(currentRow);
          break;
        case PROMPT_MODE.CANCEL:
          this.callCancelOrder(currentRow);
          break;
        case PROMPT_MODE.MOVE:
          this.callMoveOrder(currentRow);
          break;
        case PROMPT_MODE.CANCEL_ALL:
          this.callCancelAllOrders(currentRow);
          break;
        default:
          break;
      }
    }
    this.props.setCurrentRow(null);
  };

  private setQuantity = (value: number) => {
    Keyboard.dismiss();
    if (this.quantityInput) {
      this.quantityInput.setQuantity(value);
    }
  };

  render() {
    const { t, currentRow, equitySellable, derivativesOpenPosition } = this.props;
    const { selectedAccount, currentSymbol } = this.props.speedOrderInput;
    let openPosition;

    if (currentSymbol && currentSymbol.t === SYMBOL_TYPE.FUTURES) {
      if (derivativesOpenPosition && derivativesOpenPosition.data) {
        openPosition = (derivativesOpenPosition.data as IObject[]).find((item) => item.code === currentSymbol.s);

        if (openPosition == null && !this.isUsingNewKisCore) {
          openPosition = {
            code: currentSymbol.s,
            quantity: 0,
            sellBuyType: t('S'),
          };
        }
      }

      if (openPosition == null && this.isUsingNewKisCore) {
        openPosition = {
          code: currentSymbol.s,
          quantity: 0,
          sellBuyType: t('S'),
        };
      }
    }

    return (
      this.state.visible && (
        <UserInactivity>
          <View style={styles.container}>
            <View style={styles.infoSection}>
              <SymbolHeader componentId={this.props.componentId} parentId={this.props.parentId} />
            </View>
            <View style={styles.inputSection}>
              <View style={styles.accountSection}>
                <View style={styles.accountLabel}>
                  <UIText allowFontScaling={false} style={styles.accountLabelText}>
                    {t('Account')}
                  </UIText>
                </View>
                <View
                  style={
                    selectedAccount && selectedAccount.type === SYSTEM_TYPE.EQUITY
                      ? styles.accountPicker
                      : styles.accountPickerWithoutBank
                  }
                >
                  <AccountPicker type="ALL" />
                </View>
                {!this.isUsingNewKisCore && selectedAccount && selectedAccount.type === SYSTEM_TYPE.EQUITY && (
                  <View style={styles.accountBankPicker}>
                    <AccountBankPicker />
                  </View>
                )}
              </View>
              <View style={styles.quantitySection}>
                <View style={styles.quantityInputLeft}>
                  <View style={styles.quantityLabel}>
                    <UIText allowFontScaling={false} style={styles.quantityLabelText}>
                      {t('Qty')}
                    </UIText>
                  </View>
                  <View style={styles.quantityInput}>
                    <View style={styles.quantityInputContainer}>
                      <QuantityInput
                        ref={(ref: QuantityInputComp) => (this.quantityInput = ref)}
                        error={this.state.errorQuantity}
                        errorContent={this.state.errorQuantityContent}
                        placeholder="Quantity"
                        defaultValue={this.orderQuantity}
                        onEndEditing={this.onChangeQuantity}
                        disabled={global.viewMode}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.quantityInputRight}>
                  {currentSymbol && (
                    <View style={styles.quantityLabel}>
                      <UIText allowFontScaling={false} style={styles.quantityLabelText}>
                        {isStockType(currentSymbol.t)
                          ? t('Sellable')
                          : `${t('Open Position')}${
                              openPosition && openPosition.quantity !== 0
                                ? `(${openPosition.sellBuyType === 'Sell' ? t('S') : t('B')})`
                                : ''
                            }`}
                      </UIText>
                    </View>
                  )}
                  {!this.isUsingNewKisCore && currentSymbol && selectedAccount && (
                    <View style={styles.quantityValue}>
                      {isStockType(currentSymbol.t) ? (
                        equitySellable &&
                        equitySellable[`${selectedAccount.accountNumber}${selectedAccount.subNumber}`] ? (
                          <UIText allowFontScaling={false} style={styles.quantityValueText}>
                            {equitySellable[`${selectedAccount.accountNumber}${selectedAccount.subNumber}`][
                              currentSymbol!.s
                            ] && this.props.currentSymbol != null
                              ? roundLot(
                                  equitySellable[`${selectedAccount.accountNumber}${selectedAccount.subNumber}`][
                                    currentSymbol!.s
                                  ].sellableQuantity,
                                  this.props.currentSymbol.m,
                                  this.props.currentSymbol.t,
                                  undefined,
                                  undefined,
                                  true
                                )
                              : 0}
                          </UIText>
                        ) : (
                          <ActivityIndicator />
                        )
                      ) : openPosition ? (
                        <UIText allowFontScaling={false} style={styles.quantityValueText}>
                          {openPosition.quantity}
                        </UIText>
                      ) : (
                        <ActivityIndicator />
                      )}
                    </View>
                  )}
                  {this.isUsingNewKisCore && currentSymbol && (
                    <View style={styles.quantityValue}>
                      {isStockType(currentSymbol.t) ? (
                        equitySellable ? (
                          <UIText allowFontScaling={false} style={styles.quantityValueText}>
                            {roundLot(
                              equitySellable.sellable as number,
                              currentSymbol.m,
                              currentSymbol.t,
                              undefined,
                              undefined,
                              true
                            )}
                          </UIText>
                        ) : (
                          <ActivityIndicator />
                        )
                      ) : openPosition ? (
                        <UIText allowFontScaling={false} style={styles.quantityValueText}>
                          {openPosition.quantity}
                        </UIText>
                      ) : (
                        <ActivityIndicator />
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.dataSection}>
              <View style={styles.header}>
                <View style={[styles.column]}>
                  <UIText allowFontScaling={false} style={styles.headerText}>
                    {t('Stop sell')}
                  </UIText>
                </View>
                <View style={[styles.column]}>
                  <UIText allowFontScaling={false} style={styles.headerText}>
                    {t('Sell')}
                  </UIText>
                </View>
                <View style={[styles.column]}>
                  <UIText allowFontScaling={false} style={styles.headerText}>
                    {t('Ask qty')}
                  </UIText>
                </View>
                <View style={[styles.columnBig]}>
                  <UIText allowFontScaling={false} style={styles.headerText}>
                    {t('Price')}
                  </UIText>
                </View>
                <View style={[styles.column]}>
                  <UIText allowFontScaling={false} style={styles.headerText}>
                    {t('Bid qty')}
                  </UIText>
                </View>
                <View style={[styles.column]}>
                  <UIText allowFontScaling={false} style={styles.headerText}>
                    {t('Buy')}
                  </UIText>
                </View>
                <View style={[styles.column]}>
                  <UIText allowFontScaling={false} style={styles.headerText}>
                    {t('Stop buy')}
                  </UIText>
                </View>
              </View>
              {this.quote && this.quote.s === currentSymbol!.s ? (
                <View
                  style={[styles.content, { ...(this.disabled && styles.opacityBackground) }]}
                  {...(this.disabled && { pointerEvents: 'none' })}
                >
                  {this.quote.ce != null && this.reset !== true && (
                    <PriceRow
                      price={Big(this.quote.ce)}
                      rowStyle={styles.rowTop}
                      callPlaceOrder={this.callPlaceOrder}
                      callCancelOrder={this.callCancelOrder}
                      callMoveOrder={this.callMoveOrder}
                    />
                  )}
                  {this.dataProvider &&
                    this.dataProvider.getSize() > 0 &&
                    (this.reset !== true ? (
                      <RecyclerListView
                        style={styles.listView}
                        layoutProvider={this.layoutProvider}
                        dataProvider={this.dataProvider}
                        rowRenderer={this.renderRow}
                        initialRenderIndex={this.initialRenderIndex}
                        extendedState={this.state}
                      />
                    ) : (
                      <ActivityIndicator />
                    ))}
                  {this.quote.fl != null && this.reset !== true && (
                    <PriceRow
                      price={Big(this.quote.fl!)}
                      rowStyle={styles.rowBottom}
                      callPlaceOrder={this.callPlaceOrder}
                      callCancelOrder={this.callCancelOrder}
                      callMoveOrder={this.callMoveOrder}
                    />
                  )}
                  <SummaryRow callCancelAllOrders={this.callCancelAllOrders} />
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </View>
            {this.isUsingNewKisCore && (
              <OrderModal
                closeModal={this.closeModal}
                confirm={this.confirm}
                currentRow={currentRow}
                inputQuantity={this.orderQuantity}
              />
            )}
            {!this.isUsingNewKisCore && currentRow && currentRow.showModal === true && (
              <OrderModal
                closeModal={this.closeModal}
                confirm={this.confirm}
                currentRow={currentRow}
                inputQuantity={this.orderQuantity}
              />
            )}
            {currentSymbol && Platform.OS === 'android' && (
              <KeyboardAccessoryView androidAdjustResize>
                <View style={styles.keyboardAccessoryContainer}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                  >
                    {QUANTITY_LIST[currentSymbol.t][currentSymbol.m].map((value: number, index: number) => (
                      <TouchableOpacity
                        style={styles.keyboardAccessoryItem}
                        key={index}
                        onPress={() => this.setQuantity(value)}
                      >
                        <UIText allowFontScaling={false} style={styles.keyboardAccessoryText}>
                          {value}
                        </UIText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </KeyboardAccessoryView>
            )}
            {currentSymbol && Platform.OS === 'ios' && (
              <InputAccessoryView nativeID={INPUT_QUANTIY_ID_KEY} style={{ backgroundColor: 'red' }}>
                <View style={styles.keyboardAccessoryContainer}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                  >
                    {QUANTITY_LIST[currentSymbol.t][currentSymbol.m].map((value: number, index: number) => (
                      <TouchableOpacity
                        style={styles.keyboardAccessoryItem}
                        key={index}
                        onPress={() => this.setQuantity(value)}
                      >
                        <UIText allowFontScaling={false} style={styles.keyboardAccessoryText}>
                          {value}
                        </UIText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </InputAccessoryView>
            )}
          </View>
        </UserInactivity>
      )
    );
  }
}

const mapStateToProps = (state: IState) => ({
  speedOrderInput: getSpeedOrderInput(state),
  quote: state.currentSymbolQuote,
  orderTrigger: state.orderTrigger,
  currentRow: state.currentRow,
  equitySellable: state.equitySellable,
  derivativesOpenPosition: state.derivativesOpenPosition,
  currentSymbol: state.currentSymbol,
  speedOrderHistory: state.speedOrderHistory,
  stopSpeedOrderHistory: state.stopSpeedOrderHistory,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setCurrentSymbol,
      placeSpeedOrder,
      placeDerivativesSpeedOrder,
      modifySpeedOrder,
      cancelSpeedOrder,
      cancelDerivativesSpeedOrder,
      moveSpeedOrder,
      moveDerivativesSpeedOrder,
      queryOrderHistory,
      queryOrderUnMatchToday,
      queryOrderUnMatchDerivativesToday,
      queryStopOrderHistory,
      queryDerivativesOrderHistory,
      queryDerivativesStopOrderHistory,
      setCurrentRow,
      queryDerivativesOpenPosition,
      queryEquitySellableInfo,
    })(SpeedOrder)
  ),
  Fallback,
  handleError
);
