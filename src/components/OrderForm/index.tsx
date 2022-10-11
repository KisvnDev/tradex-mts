import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Platform,
  InputAccessoryView,
  EmitterSubscription,
  RefreshControl,
} from 'react-native';
import _ from 'lodash';
import { Navigation } from 'react-native-navigation';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { Big } from 'big.js';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter, isEqual, isBefore, startOfDay } from 'date-fns';
import config from 'config';
import {
  ORDER_KIND,
  ORDER_FORM_ACTION_MODE,
  SELL_BUY_TYPE,
  ORDER_TYPE,
  ORDER_TYPES,
  SYSTEM_TYPE,
  DERIVATIVES_ADVANCE_ORDER_TYPES,
  DERIVATIVES_MARKET_SESSION_OPTION,
  DERIVATIVES_ADVANCE_ORDER_TYPE,
  DERIVATIVES_MARKET_SESSION,
  SYMBOL_TYPE,
  QUANTITY_LIST,
  INPUT_QUANTIY_ID_KEY,
  MARKET,
} from 'global';
import { roundLot, getSuggestedQuantity } from 'utils/market';
import { formatNumber, isBlank, handleError, upperFirstLetter } from 'utils/common';
import { formatDateToString, formatStringToDate, addDays } from 'utils/datetime';
import BidOfferInfo from './BidOfferInfo';
import Picker from 'components/Picker';
import CheckBox from 'components/CheckBox';
import QuantityInput, { QuantityInput as QuantityInputComp } from 'components/QuantityInput';
import PriceInput from 'components/PriceInput';
import Button from 'components/Button';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import OrderModal from './OrderModal';
import CancelModifyModal from './CancelModifyModal';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import { IQuerySymbolData, ISymbolInfo } from 'interfaces/market';
import { reloadMarketData, querySymbolData } from 'redux-sagas/global-actions';
import { IOrderInput, getOrderInput, IEquityBuyableInfo, IAccountMargin } from './reducers';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import {
  queryEquityBuyableInfo,
  queryDerivativesOrderAvailable,
  queryEquitySellableInfo,
  queryAccountMobile,
  placeOrder,
  cancelOrder,
  modifyOrder,
  placeDerivativesOrder,
  cancelDerivativesOrder,
  modifyDerivativesOrder,
  queryAccountMargin,
} from './actions';
import styles from './styles';
import UIText from 'components/UiText';

export interface IOrderForm {
  position?: string;
  conditionOrderGroupID?: string;
  validityDate?: string;
  marketID?: string;
  commodityName?: string;
  contractMonth?: string;
  validity?: string;
  orderGroupID?: string;
  symbol?: string;
  orderID?: string;
  sellBuyType?: SELL_BUY_TYPE;
  orderType?: ORDER_TYPE;
  orderQuantity?: number;
  orderPrice?: number;
  stopPrice?: number;
  availableQuantity?: number;
  unmatchedQuantity?: number;
  phoneNumber?: string;
  advanceOrderType?: DERIVATIVES_ADVANCE_ORDER_TYPE;
  marketSession?: DERIVATIVES_MARKET_SESSION;
  fromDate?: string;
  toDate?: string;
  branchCode?: string;
  orderNumber?: string;
  sequenceNumber?: string;
  date?: string;
  createdDate?: string;
  orderDate?: string;
  sequence?: number;
  code?: string;
  stockCode?: string;
  stopOrderId?: string;
  orderNo?: string;
  orderGroupNo?: string;
  orderQty?: number;
}

interface IOrderFormProps extends React.ClassAttributes<OrderForm>, WithTranslation {
  componentId: string;
  orderKind: ORDER_KIND;
  sellBuyType?: SELL_BUY_TYPE;
  actionMode?: ORDER_FORM_ACTION_MODE;
  formData?: IOrderForm;
  orderInput: IOrderInput;
  buyableInfo: IEquityBuyableInfo;
  sellableInfo: IObject | null;
  derivativesOrderAvailable: IObject | null;
  accountMobile: string;
  orderTrigger: IOrderTrigger | null;
  accountMargin: IAccountMargin | null;
  equityAccountMarginQuerySuccess: boolean;
  additionalPPForModify?: number;
  comeBackTrigger: boolean;

  queryEquityBuyableInfo(params: IObject): void;

  queryDerivativesOrderAvailable(params: IObject): void;

  queryEquitySellableInfo(params?: IObject): void;

  queryAccountMobile(params: IObject): void;

  placeOrder(params: IObject, orderKind: ORDER_KIND): void;

  modifyOrder(params: IObject, orderKind: ORDER_KIND): void;

  cancelOrder(params: IObject, orderKind: ORDER_KIND): void;

  placeDerivativesOrder(params: IObject, orderKind: ORDER_KIND): void;

  modifyDerivativesOrder(params: IObject, orderKind: ORDER_KIND): void;

  cancelDerivativesOrder(params: IObject, orderKind: ORDER_KIND): void;

  queryAccountMargin(params: IObject): void;

  querySymbolData(payload: IQuerySymbolData): void;

  reloadMarketData(): void;
}

interface IOrderFormState {
  errorPrice?: boolean;
  errorPriceContent?: string;
  errorStopPrice?: boolean;
  errorStopPriceContent?: string;
  errorPhoneNumber?: boolean;
  errorPhoneNumberContent?: string;
  modalVisible: boolean;
  showQuantityPicker?: boolean;
  modalCancelModifyVisible?: boolean;
  isShowDate?: boolean;
  refreshing: boolean;
  expiryDateChecked: boolean;
}

class OrderForm extends React.Component<IOrderFormProps, IOrderFormState> {
  private formData: IOrderForm;
  private oldFormData: IOrderForm;
  private orderTypes: Array<{ label: string; value: ORDER_TYPE }> = [];
  private quantityInput: QuantityInputComp;
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;
  private disabledPriceTextBox?: boolean;
  private errorQuantity: boolean;
  private errorQuantityContent: string;
  private firstQuery = false;
  private type: ORDER_FORM_ACTION_MODE = ORDER_FORM_ACTION_MODE.MODIFY;
  private triggerActionMode: boolean = false;
  private loadingOrderType: boolean = true;
  private orderKind: ORDER_KIND = ORDER_KIND.NORMAL_ORDER;
  private limitPriceLO: boolean =
    this.props.actionMode != null && this.props.orderKind === ORDER_KIND.STOP_ORDER ? false : true;
  keyboardDidHideListener!: EmitterSubscription;
  private readonly isUsingNewKisCore = config.usingNewKisCore;
  private today = new Date();
  private timmerQuery: ReturnType<typeof setTimeout>;

  constructor(props: IOrderFormProps) {
    super(props);

    this.formData = {
      marketSession:
        this.props.formData && this.props.formData.marketSession
          ? this.props.formData.marketSession
          : DERIVATIVES_MARKET_SESSION_OPTION[0].value,
      advanceOrderType:
        this.props.formData && this.props.formData.advanceOrderType
          ? this.props.formData.advanceOrderType
          : DERIVATIVES_ADVANCE_ORDER_TYPES[0].value,
      fromDate: formatDateToString(new Date())!,
      toDate: formatDateToString(
        this.props.orderKind === ORDER_KIND.ADVANCE_ORDER ? addDays(new Date(), 1) : new Date()
      )!,
    };

    if (this.props.actionMode == null) {
      if (this.props.orderKind !== ORDER_KIND.ODDLOT_ORDER) {
        this.formData.sellBuyType = this.props.sellBuyType ? this.props.sellBuyType : SELL_BUY_TYPE.BUY;

        if (this.props.orderInput && this.props.orderInput.isValid) {
          this.getOrderTypes(this.props.orderInput.currentSymbol!, this.props.orderKind!);

          if (this.orderTypes != null && this.orderTypes.length > 0) {
            this.formData.orderType = this.orderTypes[0].value;
          }

          this.formData.orderQuantity = getSuggestedQuantity(
            this.props.orderInput.currentSymbol!.m,
            this.props.orderInput.currentSymbol!.t,
            this.props.orderInput.currentSymbol!.bs
          );
        }
      } else {
        this.formData.sellBuyType = SELL_BUY_TYPE.SELL;
        if (this.props.formData) {
          this.formData = { ...this.props.formData };
        }
      }
    } else {
      if (this.props.formData) {
        if (this.props.orderInput && this.props.orderInput.isValid) {
          this.getOrderTypes(this.props.orderInput.currentSymbol!, this.props.orderKind!);
        }
        this.formData = { ...this.props.formData };
      }
    }

    if (this.props.orderInput.isValid) {
      this.getAvailableQuantity(
        this.props.orderInput,
        this.props.sellBuyType ? this.props.sellBuyType : SELL_BUY_TYPE.BUY,
        this.props.buyableInfo,
        this.props.sellableInfo,
        this.props.derivativesOrderAvailable
      );
    }

    this.oldFormData = { ...this.formData };
    this.state = {
      modalVisible: false,
      isShowDate: false,
      refreshing: false,
      expiryDateChecked: false,
    };
    this.isUsingNewKisCore = config.usingNewKisCore;
  }

  componentDidMount() {
    if (this.isUsingNewKisCore && this.props.orderKind === ORDER_KIND.NORMAL_ORDER) {
      this.formData.fromDate = undefined;
    }

    if (this.props.orderInput && this.isUsingNewKisCore === true) {
      const { selectedAccount, currentSymbol } = this.props.orderInput;

      if (selectedAccount) {
        if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
          this.props.queryAccountMargin({
            symbolCode: currentSymbol!.s,
            accountNumber: selectedAccount.accountNumber,
            market: currentSymbol!.m,
            sellBuyType: this.formData.sellBuyType === SELL_BUY_TYPE.BUY ? 'BUY' : 'SELL',
          });
        } else {
          this.queryDerivativesOrderAvailable(this.props.orderInput);
        }
      }
    }
    if (this.props.orderInput.isValid) {
      if (this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        if (this.isUsingNewKisCore === false) {
          if (this.formData.sellBuyType === SELL_BUY_TYPE.SELL) {
            this.queryEquitySellable(this.props.orderInput);
            this.firstQuery = true;
          } else {
            this.queryEquityBuyable(this.props.orderInput, this.props.actionMode);
            this.firstQuery = true;
          }
        }

        if (this.props.orderKind === ORDER_KIND.ADVANCE_ORDER && config.domain !== 'kis') {
          this.props.queryAccountMobile({
            accountNumber: this.props.orderInput.selectedAccount!.accountNumber,
          });
        }
      } else {
        this.queryDerivativesOrderAvailable(this.props.orderInput);
        this.firstQuery = true;
      }
    }

    this.handleKeyboardDown();
  }

  componentWillUnmount() {
    this.keyboardDidHideListener?.remove();
  }

  shouldComponentUpdate(nextProps: IOrderFormProps, _nextState: IOrderFormState) {
    if (this.props.comeBackTrigger !== nextProps.comeBackTrigger) {
      if (nextProps.orderInput != null && nextProps.orderKind === ORDER_KIND.NORMAL_ORDER) {
        const { selectedAccount, currentSymbol } = nextProps.orderInput;

        if (selectedAccount) {
          if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
            nextProps.queryAccountMargin({
              symbolCode: currentSymbol!.s,
              accountNumber: selectedAccount.accountNumber,
              market: currentSymbol!.m,
              sellBuyType: this.formData.sellBuyType === SELL_BUY_TYPE.BUY ? 'BUY' : 'SELL',
            });
          } else {
            this.queryDerivativesOrderAvailable(nextProps.orderInput);
          }
        }
      }
    }

    if (this.props.orderInput !== nextProps.orderInput) {
      if (
        this.props.orderInput.currentSymbol == null ||
        (nextProps.orderInput.currentSymbol &&
          this.props.orderInput.currentSymbol?.s !== nextProps.orderInput.currentSymbol?.s) ||
        (this.props.orderInput.isValid !== nextProps.orderInput.isValid && nextProps.orderInput.isValid === true)
      ) {
        this.resetInputForm();
        this.getOrderTypes(nextProps.orderInput.currentSymbol!, nextProps.orderKind);
        if (this.orderTypes != null && this.orderTypes.length > 0 && this.props.actionMode == null) {
          this.formData.orderType = this.orderTypes[0].value;
          if (
            this.formData.orderType === ORDER_TYPE.LO ||
            (this.isUsingNewKisCore && this.formData.orderType === ORDER_TYPE.ODDLOT)
          ) {
            this.disabledPriceTextBox = false;
          } else {
            this.disabledPriceTextBox = true;
          }
        }
      }

      if (
        this.props.orderInput.currentSymbol == null ||
        (nextProps.orderInput.currentSymbol &&
          this.props.orderInput.currentSymbol?.s !== nextProps.orderInput.currentSymbol?.s) ||
        this.props.orderInput.selectedAccount !== nextProps.orderInput.selectedAccount
      ) {
        this.firstQuery = false;
        if (this.isUsingNewKisCore === true) {
          this.limitPriceLO = true;
          const { selectedAccount, currentSymbol } = nextProps.orderInput;

          if (selectedAccount) {
            if (nextProps.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
              nextProps.queryAccountMargin({
                symbolCode: currentSymbol!.s,
                accountNumber: selectedAccount.accountNumber,
                market: currentSymbol!.m,
                sellBuyType: this.formData.sellBuyType === SELL_BUY_TYPE.BUY ? 'BUY' : 'SELL',
              });
            } else {
              this.queryDerivativesOrderAvailable(nextProps.orderInput);
            }
          }
        }
      }

      if (this.firstQuery !== true && this.props.actionMode == null) {
        const { currentSymbol } = nextProps.orderInput;
        const orderQuantity = getSuggestedQuantity(currentSymbol!.m, currentSymbol!.t, currentSymbol!.bs);
        this.formData.orderQuantity = orderQuantity;

        this.firstQuery = true;
      }

      if (this.firstQuery !== true && this.isUsingNewKisCore === false) {
        if (nextProps.orderInput.isValid) {
          const { currentSymbol, selectedAccount } = nextProps.orderInput;

          const orderQuantity = getSuggestedQuantity(currentSymbol!.m, currentSymbol!.t, currentSymbol!.bs);
          if (this.formData.orderQuantity == null || orderQuantity > this.formData.orderQuantity) {
            if (nextProps.orderKind !== ORDER_KIND.ODDLOT_ORDER) {
              this.formData.orderQuantity = orderQuantity;
            }
          }

          if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
            if (nextProps.orderKind !== ORDER_KIND.ODDLOT_ORDER) {
              if (this.formData.sellBuyType === SELL_BUY_TYPE.SELL) {
                this.queryEquitySellable(nextProps.orderInput);
                this.firstQuery = true;
              } else {
                this.queryEquityBuyable(nextProps.orderInput, nextProps.actionMode);
                this.firstQuery = true;
              }
            }
          } else {
            this.queryDerivativesOrderAvailable(nextProps.orderInput);
            this.firstQuery = true;
          }
        }
      }
    }

    if (
      this.props.sellableInfo !== nextProps.sellableInfo ||
      this.props.buyableInfo !== nextProps.buyableInfo ||
      this.props.derivativesOrderAvailable !== nextProps.derivativesOrderAvailable
    ) {
      this.getAvailableQuantity(
        nextProps.orderInput,
        this.formData.sellBuyType!,
        nextProps.buyableInfo,
        nextProps.sellableInfo,
        nextProps.derivativesOrderAvailable
      );

      if (this.formData.orderQuantity != null && this.formData.orderQuantity !== 0) {
        const { errorQuantity, errorQuantityContent } = this.validateQuantity(this.formData.orderQuantity);
        this.errorQuantity = errorQuantity;
        this.errorQuantityContent = errorQuantityContent;
      }
    }

    if (this.props.orderTrigger !== nextProps.orderTrigger && nextProps.orderTrigger) {
      if (nextProps.orderTrigger.isCancelAction === true || nextProps.orderTrigger.isModifyAction) {
        if (this.triggerActionMode === false) {
          if (nextProps.componentId === 'OrderStack2') {
            Navigation.pop('OrderStack2');
          }

          this.triggerActionMode = false;
        }
      }
      const { selectedAccount, currentSymbol } = nextProps.orderInput;
      if (selectedAccount) {
        if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
          this.props.queryAccountMargin({
            symbolCode: currentSymbol!.s,
            accountNumber: selectedAccount.accountNumber,
            market: currentSymbol!.m,
            sellBuyType: this.formData.sellBuyType === SELL_BUY_TYPE.BUY ? 'BUY' : 'SELL',
          });
        } else {
          this.queryDerivativesOrderAvailable(this.props.orderInput);
        }
      }
      // else if (nextProps.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
      //   if (
      //     this.formData.sellBuyType === SELL_BUY_TYPE.BUY &&
      //     nextProps.orderTrigger.sellBuyType === SELL_BUY_TYPE.BUY
      //   ) {
      //     this.queryEquityBuyable(nextProps.orderInput);
      //   } else if (
      //     this.formData.sellBuyType === SELL_BUY_TYPE.SELL &&
      //     nextProps.orderTrigger.sellBuyType === SELL_BUY_TYPE.BUY &&
      //     nextProps.orderKind !== ORDER_KIND.ODDLOT_ORDER
      //   ) {
      //     this.queryEquitySellable(nextProps.orderInput);
      //   }
      // } else {
      //   this.queryDerivativesOrderAvailable(nextProps.orderInput);
      // }
    }
    if (this.props.accountMobile !== nextProps.accountMobile && isBlank(this.formData.phoneNumber)) {
      this.formData.phoneNumber = nextProps.accountMobile;
    }
    if (
      this.isUsingNewKisCore === true &&
      this.props.equityAccountMarginQuerySuccess !== nextProps.equityAccountMarginQuerySuccess
    ) {
      this.loadingOrderType = false;
      if (this.formData.sellBuyType === SELL_BUY_TYPE.SELL) {
        this.queryEquitySellable(nextProps.orderInput);
        this.firstQuery = true;
      } else {
        this.queryEquityBuyable(
          nextProps.orderInput,
          nextProps.actionMode,
          undefined,
          ((nextProps.accountMargin as unknown) as IObject).PP as number
        );
        this.firstQuery = true;
      }
    }

    if (nextProps.orderInput.currentSymbol?.t === SYMBOL_TYPE.FUTURES && this.isUsingNewKisCore === true) {
      this.loadingOrderType = false;
    }
    return true;
  }

  private handleRefreshData = () => {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });

    this.props.reloadMarketData();
    if (this.props.orderInput.currentSymbol != null) {
      this.props.querySymbolData({
        symbolList: [this.props.orderInput.currentSymbol.s],
      });
    }

    if (this.props.orderInput != null && this.props.orderKind === ORDER_KIND.NORMAL_ORDER) {
      const { selectedAccount, currentSymbol } = this.props.orderInput;

      if (selectedAccount) {
        if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
          this.props.queryAccountMargin({
            symbolCode: currentSymbol!.s,
            accountNumber: selectedAccount.accountNumber,
            market: currentSymbol!.m,
            sellBuyType: this.formData.sellBuyType === SELL_BUY_TYPE.BUY ? 'BUY' : 'SELL',
          });
        } else {
          this.queryDerivativesOrderAvailable(this.props.orderInput);
        }
      }
    }

    // this.props.getUpDownStockRanking({
    //   marketType: 'ALL',
    //   upDownType: this.state.upDownType,
    //   fetchCount: 5,
    // });
  };

  private handleKeyboardDown = () => {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({ showQuantityPicker: false });
    });
  };

  private getOrderTypes = (currentSymbol: ISymbolInfo, orderKind: ORDER_KIND) => {
    if (currentSymbol.t !== SYMBOL_TYPE.FUTURES) {
      this.orderTypes = ORDER_TYPES[currentSymbol.t][currentSymbol.m][orderKind];
      if (
        this.isUsingNewKisCore &&
        this.orderTypes?.length > 0 &&
        (currentSymbol.m === MARKET.HNX || currentSymbol.m === MARKET.UPCOM)
      ) {
        this.orderTypes = [
          ...this.orderTypes,
          {
            label: ORDER_TYPE.ODDLOT,
            value: ORDER_TYPE.ODDLOT,
          },
        ];
      }
    } else if (orderKind !== ORDER_KIND.ADVANCE_ORDER) {
      this.orderTypes = ORDER_TYPES[currentSymbol.t][currentSymbol.m][orderKind];
    } else {
      this.orderTypes = ORDER_TYPES[currentSymbol.t][currentSymbol.m][orderKind][this.formData.marketSession];
    }
  };

  private onChangeSellBuyType = (sellBuyType: SELL_BUY_TYPE) => {
    this.formData.sellBuyType = sellBuyType;

    if (this.isUsingNewKisCore === false) {
      if (this.props.orderInput.isValid) {
        if (this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
          if (sellBuyType === SELL_BUY_TYPE.SELL) {
            if (this.props.orderKind !== ORDER_KIND.ODDLOT_ORDER) {
              this.queryEquitySellable(this.props.orderInput);
            }
          } else {
            this.queryEquityBuyable(this.props.orderInput, this.props.actionMode);
          }
        } else {
          this.queryDerivativesOrderAvailable(this.props.orderInput);
        }
      }
    } else {
      const { selectedAccount, currentSymbol } = this.props.orderInput;

      if (selectedAccount) {
        if (this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
          this.props.queryAccountMargin({
            symbolCode: currentSymbol!.s,
            accountNumber: selectedAccount.accountNumber,
            market: currentSymbol!.m,
            sellBuyType,
          });
        } else {
          this.queryDerivativesOrderAvailable(this.props.orderInput);
        }
      }
    }

    this.errorQuantity = false;
    this.errorQuantityContent = '';

    this.setState({
      errorPrice: false,
      errorPriceContent: '',
      errorStopPrice: false,
      errorStopPriceContent: '',
    });
  };

  private onChangeOrderType = (_index: number, value: ORDER_TYPE) => {
    if (value) {
      if (this.formData.orderType !== value) {
        this.formData.orderType = value;
        if (this.props.orderInput.isValid) {
          if (this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
            if (this.formData.sellBuyType === SELL_BUY_TYPE.BUY) {
              this.queryEquityBuyable(this.props.orderInput, this.props.actionMode);
            }
          }
        }
      }

      this.formData.orderType = value;
      if (value !== ORDER_TYPE.LO) {
        if (value === ORDER_TYPE.ODDLOT && this.isUsingNewKisCore) {
          this.disabledPriceTextBox = false;
        } else {
          this.disabledPriceTextBox = true;
        }
      } else {
        this.disabledPriceTextBox = false;
      }

      this.setState({});
    }
  };

  private validateQuantity = (value: number) => {
    let errorQuantityContent = '';
    let errorQuantity = false;

    if (this.formData.availableQuantity && value > this.formData.availableQuantity!) {
      errorQuantityContent =
        this.formData?.sellBuyType === SELL_BUY_TYPE.SELL && this.isUsingNewKisCore
          ? 'Insufficient available stock quantity'
          : 'Insufficient buying power';
      errorQuantity = true;
    }

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

  private validatePrice = (value: number) => {
    let errorPriceContent = '';
    let errorPrice = false;

    if (
      this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER &&
      this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY
    ) {
      this.formData.orderType = ORDER_TYPE.LO;
    }
    if (
      this.props.orderKind !== ORDER_KIND.STOP_ORDER &&
      this.props.orderKind !== ORDER_KIND.ODDLOT_ORDER &&
      (this.formData.orderType === ORDER_TYPE.LO || this.formData.orderType === ORDER_TYPE.ODDLOT) &&
      this.props.actionMode !== ORDER_FORM_ACTION_MODE.CANCEL
    ) {
      if (!isNaN(value)) {
        if (value <= 0) {
          errorPriceContent = 'Price must be greater than 0';
          errorPrice = true;
        } else {
          const marketData = global.symbolData[this.props.orderInput.currentSymbol!.s];
          if (marketData) {
            if (
              this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY &&
              this.props.orderKind === ORDER_KIND.ADVANCE_ORDER
            ) {
              if (marketData.es) {
                if (marketData.es.ce != null && Big(value).cmp(marketData.es.ce) > 0) {
                  errorPriceContent = 'Price must be less than estimated ceiling price';
                  errorPrice = true;
                } else if (marketData.es.fl != null && Big(value).cmp(marketData.es.fl) < 0) {
                  errorPriceContent = 'Price must be greater than estimated floor price';
                  errorPrice = true;
                }
              }
            } else {
              if (this.state.expiryDateChecked === false) {
                if (marketData.ce != null && Big(value).cmp(marketData.ce!) > 0) {
                  errorPriceContent = 'Price must be less than ceiling price';
                  errorPrice = true;
                } else if (marketData.fl != null && Big(value).cmp(marketData.fl!) < 0) {
                  errorPriceContent = 'Price must be greater than floor price';
                  errorPrice = true;
                }
              }
            }
          }
        }
      } else {
        errorPriceContent = 'Price must be number';
        errorPrice = true;
      }

      if (
        this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER &&
        this.formData.fromDate !== formatDateToString(new Date())
      ) {
        errorPriceContent = '';
        errorPrice = false;
      }
    }

    if (this.isUsingNewKisCore === true && this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      if (!isNaN(value)) {
        if (value <= 0) {
          errorPriceContent = 'Limit Price must be greater than 0';
          errorPrice = true;
        } else {
          const marketData = global.symbolData[this.props.orderInput.currentSymbol!.s];
          if (marketData) {
            if (marketData.ce != null && Big(value).cmp(marketData.ce) > 0) {
              errorPriceContent = 'Limit Price must be less than ceiling price';
              errorPrice = true;
            } else if (marketData.fl != null && Big(value).cmp(marketData.fl) < 0) {
              errorPriceContent = 'Limit Price must be greater than floor price';
              errorPrice = true;
            }
          }
        }
      } else {
        errorPriceContent = 'Limit Price must be number';
        errorPrice = true;
      }
    }

    return { errorPrice, errorPriceContent };
  };

  private onChangeQuantity = (data: number) => {
    const { errorQuantity, errorQuantityContent } = this.validateQuantity(data);
    this.formData.orderQuantity = data;
    this.errorQuantity = errorQuantity;
    this.errorQuantityContent = errorQuantityContent;

    this.setState({});
  };

  private onFocusQuantity = () => {
    this.setState({
      showQuantityPicker: true,
    });
  };

  private onBlurQuantity = () => {
    this.setState({
      showQuantityPicker: false,
    });
  };

  private setQuantity = (value: number) => {
    Keyboard.dismiss();
    if (this.quantityInput) {
      this.quantityInput.setQuantity(value);
    }
  };

  private resetInputForm = () => {
    this.formData.fromDate = undefined;
    this.setState({ isShowDate: false });
    if (this.quantityInput) {
      this.quantityInput.setQuantity(
        getSuggestedQuantity(
          this.props.orderInput.currentSymbol!.m,
          this.props.orderInput.currentSymbol!.t,
          this.props.orderInput.currentSymbol!.bs
        )
      );
    }
  };

  private onChangePrice = (data: number, init?: boolean, limitPriceLO?: boolean) => {
    this.formData.orderPrice = data;
    const { errorPrice, errorPriceContent } = this.validatePrice(data);
    const { currentSymbol } = this.props.orderInput;

    if (errorPrice !== true) {
      this.formData.orderPrice = data;
      if (limitPriceLO != null) {
        this.limitPriceLO = limitPriceLO;
        this.setState({
          errorPrice,
          errorPriceContent,
        });
      } else {
        this.setState({
          errorPrice,
          errorPriceContent,
        });
      }
      if (this.timmerQuery) {
        clearTimeout(this.timmerQuery);
      }

      this.timmerQuery = setTimeout(() => {
        if (this.isUsingNewKisCore === false) {
          if (init !== true) {
            if (this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
              if (this.formData.sellBuyType === SELL_BUY_TYPE.BUY) {
                if (this.props.buyableInfo != null) {
                  this.formData.availableQuantity =
                    Number((this.props.buyableInfo!.data as IObject).buyingPower) / data;
                }
                this.formData.availableQuantity = roundLot(
                  this.formData.availableQuantity!,
                  currentSymbol!.m,
                  currentSymbol!.t,
                  this.props.orderKind === ORDER_KIND.ODDLOT_ORDER,
                  undefined,
                  true
                );
              }
            } else {
              this.queryDerivativesOrderAvailable(this.props.orderInput);
            }
          }
        } else {
          if (this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
            this.queryEquityBuyable(this.props.orderInput, this.props.actionMode, this.formData.orderPrice);
          } else {
            this.queryDerivativesOrderAvailable(this.props.orderInput);
          }
        }
      }, 500);
    } else {
      if (limitPriceLO != null) {
        this.limitPriceLO = limitPriceLO;
        this.setState({
          errorPrice,
          errorPriceContent,
        });
      } else {
        this.setState({
          errorPrice,
          errorPriceContent,
        });
      }
    }
  };

  private validatePhoneNumber(_value?: string) {
    const errorPhoneNumberContent = '';
    const errorPhoneNumber = false;

    return { errorPhoneNumber, errorPhoneNumberContent };
  }

  private onChangePhoneNumber = (value: string) => {
    const { errorPhoneNumber, errorPhoneNumberContent } = this.validatePhoneNumber(value);
    this.formData.phoneNumber = value;

    this.setState({
      errorPhoneNumber,
      errorPhoneNumberContent,
    });
  };

  private onChangeStopPrice = (data: number) => {
    const { errorStopPrice, errorStopPriceContent } = this.validateStopPrice(data);

    if (!isNaN(data)) {
      this.formData.stopPrice = data;
    }

    this.setState({
      errorStopPrice,
      errorStopPriceContent,
    });
  };

  private validateStopPrice = (value: number) => {
    let errorStopPriceContent = '';
    let errorStopPrice = false;
    if (this.props.orderKind === ORDER_KIND.STOP_ORDER || this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
      if (!isNaN(value)) {
        if (value <= 0) {
          errorStopPriceContent = 'Price must be greater than 0';
          errorStopPrice = true;
        } else {
          const marketData = global.symbolData[this.props.orderInput.currentSymbol!.s];
          if (marketData) {
            if (marketData.ce != null && Big(value).cmp(marketData.ce) > 0) {
              errorStopPriceContent = 'Price must be less than ceiling price';
              errorStopPrice = true;
            } else if (marketData.fl != null && Big(value).cmp(marketData.fl) < 0) {
              errorStopPriceContent = 'Price must be greater than floor price';
              errorStopPrice = true;
            } else if (marketData.c != null && this.props.orderInput.selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
              if (Big(value).cmp(marketData.c) <= 0 && this.formData.sellBuyType === SELL_BUY_TYPE.BUY) {
                errorStopPriceContent = 'Price must be greater than current price';
                errorStopPrice = true;
              } else if (Big(value).cmp(marketData.c) >= 0 && this.formData.sellBuyType === SELL_BUY_TYPE.SELL) {
                errorStopPriceContent = 'Price must be less than current price';
                errorStopPrice = true;
              }
            }
          }
        }
      } else {
        errorStopPriceContent = 'Price must be number';
        errorStopPrice = true;
      }
    }

    return { errorStopPrice, errorStopPriceContent };
  };

  private queryEquityBuyable = (
    orderInput: IOrderInput,
    actionMode: ORDER_FORM_ACTION_MODE | undefined,
    price?: number,
    PP?: number
  ) => {
    if (actionMode === ORDER_FORM_ACTION_MODE.CANCEL) {
      return;
    }

    if (orderInput.isValid) {
      const marketData = global.symbolData[orderInput.currentSymbol!.s];

      let orderPrice = orderInput.quote != null && orderInput.quote.c != null ? orderInput.quote.c : 0;

      if (this.formData.orderType === ORDER_TYPE.LO || this.formData.orderType === ORDER_TYPE.ODDLOT) {
        if (price != null) {
          orderPrice = price;
        } else {
          if (
            this.props.orderKind === ORDER_KIND.NORMAL_ORDER ||
            this.props.orderKind === ORDER_KIND.ADVANCE_ORDER ||
            this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER
          ) {
            if (this.formData.orderPrice) {
              orderPrice = this.formData.orderPrice;
            }
          } else if (this.props.orderKind === ORDER_KIND.STOP_ORDER) {
            if (marketData && marketData.ce != null) {
              orderPrice = marketData.ce;
            }
          }
        }
      } else if (marketData && marketData.ce != null) {
        orderPrice = marketData.ce;
      }

      if (orderInput.isValid === true) {
        this.formData.availableQuantity = undefined;
        if (PP != null || this.props.accountMargin != null) {
          const tempPP = PP != null ? PP : ((this.props.accountMargin as unknown) as IObject).PP;
          this.props.queryEquityBuyableInfo({
            accountNo: orderInput.selectedAccount?.accountNumber as string,
            symbolCode: orderInput.currentSymbol?.s as string,
            market: orderInput.currentSymbol?.m as string,
            sellBuyType: 'BUY',
            price: orderPrice,
            PP:
              actionMode === ORDER_FORM_ACTION_MODE.MODIFY && this.props.additionalPPForModify != null
                ? (tempPP as number) + this.props.additionalPPForModify
                : tempPP,
          });
        }
      }
    }
  };

  private queryEquitySellable = (orderInput: IOrderInput) => {
    if (this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL) {
      return;
    }

    if (orderInput.isValid === true) {
      this.formData.availableQuantity = undefined;
      if (this.isUsingNewKisCore === false) {
        this.props.queryEquitySellableInfo();
      } else {
        this.props.queryEquitySellableInfo({
          symbolCode: orderInput.currentSymbol!.s,
        });
      }
    }
  };

  private queryDerivativesOrderAvailable = (orderInput: IOrderInput) => {
    if (orderInput.isValid) {
      if (this.isUsingNewKisCore === false) {
        this.props.queryDerivativesOrderAvailable({
          sellBuyType: this.formData.sellBuyType!,
          orderPrice: this.formData.orderPrice!,
          orderType: this.formData.orderType!,
        });
      } else {
        if (this.formData.orderPrice != null) {
          this.props.queryDerivativesOrderAvailable({
            accountNumber: orderInput.selectedAccount!.accountNumber,
            symbolCode: orderInput.currentSymbol!.s,
            sellBuyType: this.formData.sellBuyType!,
            price: this.formData.orderPrice!,
          });
        }
      }
    }
  };

  private getAvailableQuantity = (
    orderInput: IOrderInput,
    sellBuyType: SELL_BUY_TYPE,
    buyableInfo: IEquityBuyableInfo,
    sellableInfo: IObject | null,
    derivativesOrderAvailable: IObject | null
  ) => {
    if (orderInput.isValid) {
      const { orderKind } = this.props;
      const { selectedAccount, currentSymbol } = orderInput;

      if (selectedAccount && selectedAccount.type !== SYSTEM_TYPE.DERIVATIVES) {
        if (sellBuyType === SELL_BUY_TYPE.BUY) {
          if (this.isUsingNewKisCore === false) {
            if (
              buyableInfo != null &&
              buyableInfo.data != null &&
              buyableInfo.symbol.s === currentSymbol!.s &&
              (buyableInfo.data as IObject).buyingPower != null &&
              this.formData.orderPrice
            ) {
              this.formData.availableQuantity =
                Number((buyableInfo.data as IObject).buyingPower) / this.formData.orderPrice;
            } else {
              this.formData.availableQuantity = 0;
            }

            if (
              this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY &&
              this.props.orderKind === ORDER_KIND.NORMAL_ORDER &&
              this.props.formData &&
              this.props.formData.unmatchedQuantity != null
            ) {
              this.formData.availableQuantity += this.props.formData.unmatchedQuantity;
            }
          } else {
            if (
              buyableInfo != null &&
              buyableInfo.data != null &&
              buyableInfo.symbol.s === currentSymbol!.s &&
              (buyableInfo.data as IObject).maxQtty != null
            ) {
              this.formData.availableQuantity = Number((buyableInfo.data as IObject).maxQtty);
            } else {
              this.formData.availableQuantity = 0;
            }

            if (
              this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY &&
              this.props.orderKind === ORDER_KIND.NORMAL_ORDER &&
              this.props.formData &&
              this.props.formData.unmatchedQuantity != null
            ) {
              this.formData.availableQuantity += this.props.formData.unmatchedQuantity;
            }
          }
        } else {
          if (this.isUsingNewKisCore === false) {
            if (orderKind !== ORDER_KIND.ODDLOT_ORDER) {
              if (
                sellableInfo != null &&
                sellableInfo[`${selectedAccount.accountNumber}${selectedAccount.subNumber}`] != null &&
                sellableInfo[`${selectedAccount.accountNumber}${selectedAccount.subNumber}`][currentSymbol!.s] !=
                  null &&
                sellableInfo[`${selectedAccount.accountNumber}${selectedAccount.subNumber}`][currentSymbol!.s]
                  .sellableQuantity != null
              ) {
                this.formData.availableQuantity =
                  sellableInfo[`${selectedAccount.accountNumber}${selectedAccount.subNumber}`][
                    currentSymbol!.s
                  ].sellableQuantity;
              } else {
                this.formData.availableQuantity = 0;
              }

              if (this.formData.availableQuantity == null) {
                this.formData.availableQuantity = 0;
              }

              if (
                this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY &&
                this.props.orderKind === ORDER_KIND.NORMAL_ORDER &&
                this.props.formData &&
                this.props.formData.unmatchedQuantity
              ) {
                this.formData.availableQuantity += this.props.formData.unmatchedQuantity;
              }
            } else if (this.props.formData != null && this.props.formData.availableQuantity != null) {
              this.formData.availableQuantity = this.props.formData.availableQuantity;
            }
          } else {
            if (orderKind !== ORDER_KIND.ODDLOT_ORDER) {
              if (sellableInfo != null && sellableInfo.sellable != null) {
                this.formData.availableQuantity = sellableInfo.sellable as number;
              } else {
                this.formData.availableQuantity = 0;
              }

              if (this.formData.availableQuantity == null) {
                this.formData.availableQuantity = 0;
              }

              if (
                this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY &&
                this.props.orderKind === ORDER_KIND.NORMAL_ORDER &&
                this.props.formData &&
                this.props.formData.unmatchedQuantity
              ) {
                this.formData.availableQuantity += this.props.formData.unmatchedQuantity;
              }
            } else if (this.props.formData != null && this.props.formData.availableQuantity != null) {
              this.formData.availableQuantity = this.props.formData.availableQuantity;
            }
          }
        }
      } else {
        if (derivativesOrderAvailable) {
          this.formData.availableQuantity =
            this.formData.sellBuyType === SELL_BUY_TYPE.BUY
              ? (derivativesOrderAvailable.maxLong as number)
              : (derivativesOrderAvailable.maxShort as number);
        } else {
          this.formData.availableQuantity = 0;
        }

        if (
          this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY &&
          this.props.orderKind === ORDER_KIND.NORMAL_ORDER &&
          this.props.formData &&
          this.props.formData.unmatchedQuantity
        ) {
          this.formData.availableQuantity += this.props.formData.unmatchedQuantity;
        }
      }

      this.formData.availableQuantity = roundLot(
        this.formData.availableQuantity!,
        currentSymbol!.m,
        currentSymbol!.t,
        this.props.orderKind === ORDER_KIND.ODDLOT_ORDER,
        undefined,
        true
      );
    } else {
      this.formData.availableQuantity = undefined;
    }
  };

  private placeOrder = () => {
    const { errorQuantity, errorQuantityContent } = this.validateQuantity(this.formData.orderQuantity!);
    const { errorPrice, errorPriceContent } = this.validatePrice(this.formData.orderPrice!);
    const { errorStopPrice, errorStopPriceContent } = this.validateStopPrice(this.formData.stopPrice!);
    const { errorPhoneNumber, errorPhoneNumberContent } = this.validatePhoneNumber(this.formData.phoneNumber);

    if (!errorQuantity && !errorPrice && !errorStopPrice && !errorPhoneNumber) {
      this.setState({
        modalVisible: true,
      });
    } else {
      this.errorQuantity = errorQuantity;
      this.errorQuantityContent = errorQuantityContent;

      this.setState({
        errorPrice,
        errorPriceContent,
        errorStopPrice,
        errorStopPriceContent,
        errorPhoneNumber,
        errorPhoneNumberContent,
      });
    }
  };

  private modifyCancelOrder = () => {
    const { actionMode } = this.props;

    if (actionMode === ORDER_FORM_ACTION_MODE.MODIFY) {
      const { errorQuantity, errorQuantityContent } = this.validateQuantity(this.formData.orderQuantity!);
      const { errorPrice, errorPriceContent } = this.validatePrice(this.formData.orderPrice!);
      const { errorStopPrice, errorStopPriceContent } = this.validateStopPrice(this.formData.stopPrice!);
      const { errorPhoneNumber, errorPhoneNumberContent } = this.validatePhoneNumber(this.formData.phoneNumber);
      if (!errorQuantity && !errorPrice && !errorStopPrice && !errorPhoneNumber) {
        this.setState({
          modalVisible: true,
        });
      } else {
        this.errorQuantity = errorQuantity;
        this.errorQuantityContent = errorQuantityContent;

        this.setState({
          errorPrice,
          errorPriceContent,
          errorStopPrice,
          errorStopPriceContent,
          errorPhoneNumber,
          errorPhoneNumberContent,
        });
      }
    } else if (actionMode === ORDER_FORM_ACTION_MODE.CANCEL) {
      this.setState({
        modalVisible: true,
      });
    }
  };

  private confirm = () => {
    const { actionMode } = this.props;

    this.setState(
      {
        modalVisible: false,
      },
      () => {
        if (actionMode == null) {
          this.callPlaceOrder();
        } else {
          if (actionMode === ORDER_FORM_ACTION_MODE.CANCEL) {
            this.callCancelOrder();
          } else {
            this.callModifyOrder();
          }
        }
      }
    );
  };

  private onChangeAdvanceOrderType = (_index: number, value: DERIVATIVES_ADVANCE_ORDER_TYPE, _label: string) => {
    this.formData.advanceOrderType = value;
    this.setState({});
  };

  private onChangeMarketSessionOption = (_index: number, value: DERIVATIVES_MARKET_SESSION, _label: string) => {
    this.formData.marketSession = value;

    this.getOrderTypes(this.props.orderInput.currentSymbol!, this.props.orderKind);
    if (this.orderTypes != null && this.orderTypes.length > 0) {
      this.formData.orderType = this.orderTypes[0].value;
    }

    this.setState({});
  };

  private onChangeDateFrom = (value: Date) => {
    const date = formatDateToString(value);
    if (date != null) {
      if (this.isUsingNewKisCore && !this.state.isShowDate) {
        this.setState({ isShowDate: true });
      }

      if (isBefore(value, startOfDay(new Date()))) {
        if (this.fromDateRef) {
          this.fromDateRef.setValue(formatStringToDate(this.formData.fromDate!));
        }

        return;
      }
      this.formData.fromDate = date;
      if (
        isAfter(value, formatStringToDate(this.formData.toDate!)) ||
        isEqual(value, formatStringToDate(this.formData.toDate!))
      ) {
        if (this.props.orderKind === ORDER_KIND.ADVANCE_ORDER) {
          const toDate = formatDateToString(addDays(value, 1));
          if (toDate != null) {
            this.formData.toDate = toDate;
          }
        } else {
          this.formData.toDate = date;
        }

        if (this.toDateRef) {
          this.toDateRef.setValue(formatStringToDate(this.formData.toDate!));
        }
      }
    }
  };

  private onChangeDateTo = (value: Date) => {
    const date = formatDateToString(value);
    if (date != null) {
      this.formData.toDate = date;
      if (
        isBefore(value, formatStringToDate(this.formData.fromDate!)) ||
        isEqual(value, formatStringToDate(this.formData.fromDate!))
      ) {
        if (this.props.orderKind === ORDER_KIND.ADVANCE_ORDER) {
          const fromDate = formatDateToString(addDays(value, -1));
          if (fromDate != null) {
            this.formData.fromDate = fromDate;
          }
        } else {
          this.formData.fromDate = date;
        }

        if (this.fromDateRef) {
          this.fromDateRef.setValue(formatStringToDate(this.formData.fromDate!));
        }
      }
    }
  };

  private callPlaceOrder = () => {
    const { orderKind, orderInput } = this.props;
    const { selectedAccount, currentSymbol, accountBank } = orderInput;

    if (orderInput.isValid) {
      let params: IObject = {
        accountNumber: selectedAccount!.accountNumber,
        orderQuantity: this.formData.orderQuantity!,
        orderPrice: this.formData.orderPrice!,
        sellBuyType: this.formData.sellBuyType!,
      };
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        if (this.props.orderKind === ORDER_KIND.NORMAL_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              stockCode: currentSymbol!.s,
              orderType: this.formData.orderType!,
              subNumber: selectedAccount!.subNumber,
              securitiesType: currentSymbol!.t,
              bankCode: accountBank!.bankCode,
              bankName: accountBank!.bankName,
              bankAccount: accountBank!.bankAccount,
            };
          } else {
            if (this.formData.orderType !== ORDER_TYPE.ODDLOT && this.state.expiryDateChecked === true) {
              this.formData.fromDate && (params.expiryDate = this.formData.fromDate!);
            }

            params = {
              ...params,
              code: currentSymbol!.s,
              marketType: currentSymbol!.m,
              orderType: this.formData.orderType!,
            };
          }
        } else if (orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              subNumber: selectedAccount!.subNumber,
              bankCode: accountBank!.bankCode,
              bankName: accountBank!.bankName,
              bankAccount: accountBank!.bankAccount,
              securitiesType: currentSymbol!.t,
              stockCode: currentSymbol!.s,
              stopPrice: this.formData.stopPrice!,
              fromDate: this.formData.fromDate!,
              toDate: this.formData.toDate!,
            };
          } else {
            params = {
              ...params,
              code: orderInput.currentSymbol!.s,
              orderType: this.limitPriceLO === true ? 'STOP_LIMIT' : 'STOP',
              orderPrice: this.limitPriceLO === true ? this.formData.orderPrice! : ((undefined as unknown) as IObject),
              stopPrice: this.formData.stopPrice!,
              fromDate: this.formData.fromDate!,
              toDate: this.formData.toDate!,
            };
          }
        } else if (orderKind === ORDER_KIND.ADVANCE_ORDER) {
          params = {
            ...params,
            subNumber: selectedAccount!.subNumber,
            bankCode: accountBank!.bankCode,
            bankName: accountBank!.bankName,
            bankAccount: accountBank!.bankAccount,
            orderType: this.formData.orderType!,
            stockCode: currentSymbol!.s,
            phoneNumber: this.formData.phoneNumber!,
          };
        } else if (orderKind === ORDER_KIND.ODDLOT_ORDER) {
          params = {
            ...params,
            subNumber: selectedAccount!.subNumber,
            stockCode: currentSymbol!.s,
            securitiesType: currentSymbol!.t,
            bankCode: accountBank!.bankCode,
            bankAccount: accountBank!.bankAccount,
          };
        }
        this.props.placeOrder(params, orderKind);
      } else {
        if (this.props.orderKind === ORDER_KIND.NORMAL_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              code: currentSymbol!.s,
              orderType: this.formData.orderType!,
            };
          } else {
            params = {
              ...params,
              code: currentSymbol!.s,
              orderType: this.formData.orderType!,
              validity: '',
            };
          }
        } else if (orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              code: currentSymbol!.s,
              stopPrice: this.formData.stopPrice!,
              fromDate: this.formData.fromDate!,
            };
          } else {
            params = {
              ...params,
              code: currentSymbol!.s,
              stopPrice: this.formData.stopPrice!,
              fromDate: this.formData.fromDate!,
              toDate: this.formData.toDate!,
              orderPrice: this.limitPriceLO === true ? this.formData.orderPrice! : ((undefined as unknown) as IObject),
            };
          }
        } else if (orderKind === ORDER_KIND.ADVANCE_ORDER) {
          params = {
            ...params,
            code: currentSymbol!.s,
            orderType: this.formData.orderType!,
            advanceOrderType: this.formData.advanceOrderType!,
            marketSession: this.formData.marketSession!,
            fromDate: this.formData.fromDate!,
            toDate: this.formData.toDate!,
          };
        }

        this.props.placeDerivativesOrder(params, orderKind);
      }
    }
  };

  private callCancelOrder = () => {
    const { orderKind, orderInput } = this.props;
    const { selectedAccount, currentSymbol, accountBank } = orderInput;

    if (orderInput.isValid) {
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        let params: IObject = {
          accountNumber: selectedAccount!.accountNumber,
          subNumber: selectedAccount!.subNumber,
          sellBuyType: this.formData.sellBuyType!,
        };
        if (orderKind === ORDER_KIND.NORMAL_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              orderNumber: this.formData!.orderNumber!,
              branchCode: this.formData!.branchCode!,
            };
          } else {
            params = {
              ...params,
              accountNo: selectedAccount!.accountNumber,
              orders: [
                {
                  orderNo: `${this.formData?.orderNo}`,
                  orderGroupNo: `${this.formData?.orderGroupNo}`,
                },
              ],
            };
          }
        } else if (orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              stockCode: this.triggerActionMode ? (this.formData.stockCode as string) : currentSymbol!.s,
              bankCode: accountBank!.bankCode,
              bankName: accountBank!.bankName,
              bankAccount: accountBank!.bankAccount,
              orderPrice: this.formData!.orderPrice!,
              stopPrice: this.formData!.stopPrice!,
              securitiesType: currentSymbol!.t,
              createdDate: this.formData!.createdDate!,
              sequence: this.formData!.sequence!,
            };
          } else {
            params = {
              ...params,
              stopOrderId: this.formData!.stopOrderId!,
            };
          }
        } else if (orderKind === ORDER_KIND.ADVANCE_ORDER) {
          params = {
            ...params,
            orderNumber: this.formData!.orderNumber!,
            advanceOrderDate: this.formData!.orderDate!,
          };
        } else if (orderKind === ORDER_KIND.ODDLOT_ORDER) {
          params = {
            ...params,
            orderNumber: this.formData!.orderNumber!,
          };
        }

        this.props.cancelOrder(params, this.triggerActionMode ? this.orderKind : orderKind);
        if (this.triggerActionMode) {
          this.formData = this.oldFormData;
        }
      } else {
        let params: IObject = {};
        if (orderKind === ORDER_KIND.NORMAL_ORDER) {
          if (this.isUsingNewKisCore) {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              orderInfo: [
                {
                  marketID: this.formData!.marketID!,
                  commodityName: this.formData.commodityName,
                  contractMonth: this.formData.contractMonth!,
                  orderNumber: this.formData.orderNumber!,
                  validity: this.formData.validity!,
                  orderType: this.formData.orderType!,
                  validityDate: this.formData.validityDate! || '',
                  orderGroupID: this.formData.orderGroupID!,
                  sellBuyType: this.formData.sellBuyType!,
                  symbolCode: this.formData.symbol,
                },
              ],
            };
          } else {
            params = {
              ...params,
              code: this.triggerActionMode ? (this.formData.code as string) : currentSymbol!.s,
              orderQuantity: this.formData.orderQuantity!,
              orderPrice: this.formData.orderPrice!,
              orderNumber: this.formData.orderNumber!,
              orderType: this.formData.orderType!,
              unmatchedQuantity: this.formData.unmatchedQuantity!,
            };
          }
        } else if (orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
          if (this.isUsingNewKisCore) {
            params = {
              idList: [_.get(this.formData, 'stopOrderId')],
            };
          } else {
            params = {
              ...params,
              sequenceNumber: this.formData.sequenceNumber!,
              createdDate: this.formData.date!,
              accountNumber: selectedAccount!.accountNumber,
            };
          }
        } else if (orderKind === ORDER_KIND.ADVANCE_ORDER) {
          params = {
            ...params,
            accountNumber: selectedAccount!.accountNumber,
            code: this.triggerActionMode ? (this.formData.code as string) : currentSymbol!.s,
            orderNumber: this.formData.sequenceNumber!,
            tradingDate: this.formData.date!,
            marketSession: this.formData!.marketSession!,
          };
        }

        this.props.cancelDerivativesOrder(params, this.triggerActionMode ? this.orderKind : orderKind);
        if (this.triggerActionMode) {
          this.formData = this.oldFormData;
        }
      }
    }
  };

  private callModifyOrder = () => {
    const { orderKind, orderInput } = this.props;
    const { selectedAccount, currentSymbol, accountBank } = orderInput;

    if (orderInput.isValid) {
      if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
        let params: IObject = {
          accountNumber: selectedAccount!.accountNumber,
          subNumber: selectedAccount!.subNumber,
          stockCode: currentSymbol!.s,
          orderQuantity: this.formData.orderQuantity!,
          orderPrice: this.formData.orderPrice!,
          sellBuyType: this.formData.sellBuyType!,
        };

        if (orderKind === ORDER_KIND.NORMAL_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              orderNumber: this.formData.orderNumber!,
              bankCode: accountBank!.bankCode,
              bankName: accountBank!.bankName,
              bankAccount: accountBank!.bankAccount,
              branchCode: this.formData.branchCode!,
              marketType: currentSymbol!.m,
              orderType: this.formData.orderType!,
              securitiesType: currentSymbol!.t,
            };
          } else {
            params = {
              ...params,
              accountNo: selectedAccount!.accountNumber,
              orderNo: `${this.props.formData?.orderNo}`,
              orderGroupNo: `${this.props.formData?.orderGroupNo}`,
              newPrice: this.formData.orderPrice!,
              newQuantity: this.formData.orderQuantity!,
              stockSymbol: currentSymbol!.s,
              market: currentSymbol!.m,
              originalQuantity: this.props.formData!.orderQuantity!,
            };
          }
        } else if (orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
          if (this.isUsingNewKisCore === false) {
            params = {
              ...params,
              bankCode: accountBank!.bankCode,
              bankName: accountBank!.bankName,
              bankAccount: accountBank!.bankAccount,
              stopPrice: this.props.formData!.stopPrice!,
              orderPrice: this.props.formData!.orderPrice!,
              newStopPrice: this.formData.stopPrice!,
              newOrderPrice: this.formData.orderPrice!,
              securitiesType: currentSymbol!.t,
              fromDate: this.props.formData!.fromDate!,
              newFromDate: this.formData.fromDate!,
              toDate: this.props.formData!.toDate!,
              newToDate: this.formData!.toDate!,
            };
          } else {
            params = {
              ...params,
              stopOrderId: this.props.formData!.stopOrderId!,
              stopPrice: this.formData.stopPrice!,
              orderPrice: this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER ? this.formData.orderPrice! : undefined!,
              fromDate: this.formData.fromDate!,
              toDate: this.formData!.toDate!,
            };
          }
        }

        this.props.modifyOrder(params, orderKind);
      } else {
        let params: IObject = {};
        if (config.usingNewKisCore) {
          if (orderKind === ORDER_KIND.NORMAL_ORDER) {
            params = {
              accountNumber: selectedAccount!.accountNumber,
              orderQty: this.formData.orderQuantity!,
              orderPrice: this.formData.orderPrice!,
              orderInfo: {
                marketID: _.get(this.formData, 'marketID'),
                symbol: _.get(this.formData, 'symbol'),
                commodityName: _.get(this.formData, 'commodityName'),
                contractMonth: _.get(this.formData, 'contractMonth'),
                orderNumber: _.get(this.formData, 'orderNumber'),
                validity: _.get(this.formData, 'validity'),
                orderType: _.get(this.formData, 'orderType'),
                orderGroupID: _.get(this.formData, 'orderGroupID'),
                sellBuyType: _.get(this.formData, 'sellBuyType'),
                conditionOrderGroupID: _.get(this.formData, 'conditionOrderGroupID') || '',
                validityDate: _.get(this.formData, 'validityDate') || '',
                matchedQuantity: _.get(this.formData, 'matchedQuantity'),
                position: _.get(this.formData, 'position'),
                minQty: _.get(this.formData, 'minQty'),
                stopType: _.get(this.formData, 'stopType'),
                stopPrice: _.get(this.formData, 'stopPrice'),
                tPlus1: _.get(this.formData, 'tPlus1'),
                userID: _.get(this.formData, 'userID'),
                stopOrder: _.get(this.formData, 'stopOrder'),
                auctionOrder: _.get(this.formData, 'auctionOrder'),
              },
            };
          }

          if (orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
            params = {
              stopOrderId: _.get(this.formData, 'stopOrderId')!,
              orderPrice: _.get(this.formData, 'orderPrice')!,
              orderQuantity: _.get(this.formData, 'orderQuantity')!,
              stopPrice: _.get(this.formData, 'stopPrice')!,
              fromDate: _.get(this.formData, 'fromDate')!,
              toDate: _.get(this.formData, 'toDate')!,
            };
          }
        } else {
          params = {
            accountNumber: selectedAccount!.accountNumber,
            orderQuantity: this.formData.orderQuantity!,
            orderPrice: this.formData.orderPrice!,
            sellBuyType: this.formData.sellBuyType!,
          };
          if (orderKind === ORDER_KIND.NORMAL_ORDER) {
            params = {
              ...params,
              code: currentSymbol!.s,
              orderNumber: this.formData.orderNumber!,
              orderType: this.formData.orderType!,
              unmatchedQuantity: this.formData!.unmatchedQuantity!,
            };
          } else if (orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
            params = {
              ...params,
              sequenceNumber: this.formData!.sequenceNumber!,
              stopPrice: this.formData.stopPrice!,
              createdDate: this.formData!.date!,
              fromDate: this.formData!.fromDate!,
              toDate: this.formData!.toDate!,
            };
          }
        }

        this.props.modifyDerivativesOrder(params, orderKind);
      }
    }
  };

  private closeModal = () => {
    this.triggerActionMode = false;
    this.setState({
      modalVisible: false,
    });
  };

  private changeExpiryDateChecked = (value: boolean) => {
    this.setState({
      expiryDateChecked: value,
    });
  };

  private openCancelModifyModal = (type: ORDER_FORM_ACTION_MODE) => {
    this.type = type;
    this.setState({
      modalCancelModifyVisible: true,
    });
  };

  private closeCancelModifyModal = (renderModal: boolean) => {
    this.setState({
      modalCancelModifyVisible: renderModal,
    });
  };

  private onPressItem = () => {
    this.setState({
      modalCancelModifyVisible: false,
    });
  };

  private onPressChangeLimitPriceType = (type: boolean) => {
    const marketData = global.symbolData[this.props.orderInput.currentSymbol!.s];
    if (type === true) {
      if (this.limitPriceLO === true) {
        return;
      } else {
        this.onChangePrice(marketData.c, undefined, true);
      }
    } else {
      if (this.limitPriceLO === false) {
        return;
      } else {
        this.onChangePrice(marketData.ce, undefined, false);
      }
    }
  };

  private confirmCancelOrder = (formData: IOrderForm, orderKind: ORDER_KIND) => {
    this.triggerActionMode = true;
    this.orderKind = orderKind;
    this.oldFormData = { ...this.formData };
    this.formData = { ...this.formData, ...formData };
    this.callCancelOrder();

    this.setState({ modalCancelModifyVisible: false });
  };

  private isOddlotOrder = () =>
    this.props.orderKind === ORDER_KIND.ODDLOT_ORDER || this.formData.orderType === ORDER_TYPE.ODDLOT;

  render() {
    const { t, orderKind, orderInput, accountMargin, actionMode } = this.props;
    const { selectedAccount, currentSymbol, isValid } = orderInput;

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.left}>
              <BidOfferInfo
                currentOrderType={this.formData.orderType}
                onOfferPricePress={(type) => this.onChangeOrderType(0, type || ORDER_TYPE.LO)}
              />
            </View>
            <View style={styles.right}>
              <ScrollView
                style={[styles.form, isValid !== true && styles.formDisabled]}
                {...(this.props.orderInput.isValid !== true && { pointerEvents: 'none' })}
                scrollEnabled={Platform.OS === 'android'}
              >
                {this.props.actionMode == null && (
                  <View style={styles.buttonSection}>
                    <TouchableOpacity
                      disabled={
                        isValid !== true || this.props.actionMode != null || orderKind === ORDER_KIND.ODDLOT_ORDER
                      }
                      style={[styles.button, styles.buttonBorder]}
                      onPress={() => this.onChangeSellBuyType(SELL_BUY_TYPE.BUY)}
                    >
                      <UIText
                        allowFontScaling={false}
                        style={[
                          styles.labelButton,
                          this.formData.sellBuyType === SELL_BUY_TYPE.BUY && styles.active,
                          styles.buy,
                        ]}
                      >
                        {t('Buy')}
                      </UIText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={
                        isValid !== true || this.props.actionMode != null || orderKind === ORDER_KIND.ODDLOT_ORDER
                      }
                      style={[styles.button, styles.buttonBorder]}
                      onPress={() => this.onChangeSellBuyType(SELL_BUY_TYPE.SELL)}
                    >
                      <UIText
                        allowFontScaling={false}
                        style={[
                          styles.labelButton,
                          this.formData.sellBuyType === SELL_BUY_TYPE.SELL && styles.active,
                          styles.sell,
                        ]}
                      >
                        {t('Sell')}
                      </UIText>
                    </TouchableOpacity>
                    {orderKind !== ORDER_KIND.ADVANCE_ORDER && (
                      <TouchableOpacity
                        style={[styles.button, styles.buttonBorder]}
                        onPress={() => this.openCancelModifyModal(ORDER_FORM_ACTION_MODE.MODIFY)}
                      >
                        <UIText allowFontScaling={false} style={[styles.labelButton, styles.modify]}>
                          {t('Modify 2')}
                        </UIText>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.openCancelModifyModal(ORDER_FORM_ACTION_MODE.CANCEL)}
                    >
                      <UIText allowFontScaling={false} style={styles.labelButton}>
                        {t('Cancel')}
                      </UIText>
                    </TouchableOpacity>
                  </View>
                )}
                {actionMode !== ORDER_FORM_ACTION_MODE.CANCEL &&
                  (orderKind === ORDER_KIND.NORMAL_ORDER ||
                    (this.isUsingNewKisCore === true && orderKind === ORDER_KIND.STOP_ORDER)) && (
                    <View style={styles.itemSection}>
                      <View style={styles.labelSection}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {t('Available Quantity')}
                        </UIText>
                      </View>
                      {this.formData.availableQuantity == null ? (
                        <ActivityIndicator />
                      ) : (
                        <TouchableOpacity
                          style={styles.valueSection}
                          {...(isValid === true && {
                            onPress: () => this.setQuantity(this.formData.availableQuantity!),
                          })}
                        >
                          <UIText allowFontScaling={false} style={styles.valueTextClickable}>
                            {formatNumber(this.formData.availableQuantity)}
                          </UIText>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                {this.isUsingNewKisCore === true &&
                  orderKind === ORDER_KIND.NORMAL_ORDER &&
                  this.formData.sellBuyType === SELL_BUY_TYPE.BUY &&
                  selectedAccount?.type === SYSTEM_TYPE.EQUITY && (
                    <View style={styles.itemSection}>
                      <View style={styles.labelSection}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {t('Purchasing Power')}
                        </UIText>
                      </View>
                      {(accountMargin as IObject | null)?.PP == null ? (
                        <ActivityIndicator />
                      ) : (
                        <View style={styles.valueSection}>
                          <UIText allowFontScaling={false} style={styles.valueRatio}>
                            {formatNumber((accountMargin as IObject | null)?.PP as number, 2)}
                          </UIText>
                        </View>
                      )}
                    </View>
                  )}
                {this.isUsingNewKisCore === true &&
                  orderKind === ORDER_KIND.NORMAL_ORDER &&
                  selectedAccount?.type === SYSTEM_TYPE.EQUITY && (
                    <View style={styles.itemSection}>
                      <View style={styles.labelSection}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {t('Margin Ratio')}
                        </UIText>
                      </View>
                      {(accountMargin as IObject | null)?.marginRatio == null ? (
                        <ActivityIndicator />
                      ) : (
                        <View style={styles.valueSection}>
                          <UIText allowFontScaling={false} style={styles.valueRatio}>
                            {formatNumber((accountMargin as IObject | null)?.marginRatio as number)}
                          </UIText>
                        </View>
                      )}
                    </View>
                  )}
                {this.isUsingNewKisCore === false
                  ? (orderKind === ORDER_KIND.NORMAL_ORDER || orderKind === ORDER_KIND.ADVANCE_ORDER) &&
                    this.orderTypes &&
                    this.orderTypes.length > 0 && (
                      <View style={styles.itemSection}>
                        <View style={[styles.labelSection, styles.orderTypeLabel]}>
                          <UIText allowFontScaling={false} style={styles.labelText}>
                            {t('Type')}
                          </UIText>
                        </View>
                        <View style={styles.valueSection}>
                          <Picker
                            list={this.orderTypes}
                            selectedValue={this.formData.orderType}
                            onChange={this.onChangeOrderType}
                            disabled={isValid !== true || this.props.actionMode != null}
                          />
                        </View>
                      </View>
                    )
                  : orderKind === ORDER_KIND.NORMAL_ORDER &&
                    this.orderTypes &&
                    this.orderTypes.length > 0 && (
                      <View style={styles.itemSection}>
                        <View style={[styles.labelSection, styles.orderTypeLabel]}>
                          <UIText allowFontScaling={false} style={styles.labelText}>
                            {t('Type')}
                          </UIText>
                        </View>
                        <View style={styles.valueSection}>
                          {this.loadingOrderType === false ? (
                            <Picker
                              list={this.orderTypes}
                              selectedValue={this.formData.orderType}
                              onChange={this.onChangeOrderType}
                              disabled={isValid !== true || this.props.actionMode != null}
                            />
                          ) : (
                            <ActivityIndicator />
                          )}
                        </View>
                      </View>
                    )}
                <View style={styles.itemSection}>
                  <View style={styles.labelSection}>
                    <UIText allowFontScaling={false} style={styles.labelText}>
                      {t('Quantity')}
                    </UIText>
                  </View>
                  <View style={styles.valueSection}>
                    <QuantityInput
                      ref={(ref: QuantityInputComp) => (this.quantityInput = ref)}
                      error={this.errorQuantity}
                      errorContent={this.errorQuantityContent}
                      placeholder="Quantity"
                      defaultValue={this.formData.orderQuantity}
                      onEndEditing={this.onChangeQuantity}
                      onBlur={this.onBlurQuantity}
                      onFocus={this.onFocusQuantity}
                      reverse={this.props.orderKind === ORDER_KIND.ODDLOT_ORDER}
                      disabled={isValid !== true || this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL}
                      isOddlotOrder={this.isOddlotOrder()}
                    />
                  </View>
                </View>
                {this.isUsingNewKisCore === false &&
                  (this.props.orderKind === ORDER_KIND.ODDLOT_ORDER ||
                    this.props.orderKind === ORDER_KIND.STOP_ORDER ||
                    this.props.orderKind === ORDER_KIND.STOP_LIMIT_ORDER) && (
                    <View style={styles.itemSection}>
                      <View style={styles.labelSection}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {t('Available Quantity')}
                        </UIText>
                      </View>
                      {this.formData.availableQuantity == null ? (
                        <ActivityIndicator />
                      ) : (
                        <TouchableOpacity
                          style={styles.valueSection}
                          {...(isValid === true && {
                            onPress: () => this.setQuantity(this.formData.availableQuantity!),
                          })}
                        >
                          <UIText allowFontScaling={false} style={styles.valueTextClickable}>
                            {formatNumber(this.formData.availableQuantity)}
                          </UIText>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                {(orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER) && (
                  <View style={styles.itemSection}>
                    <View style={styles.labelSection}>
                      <UIText allowFontScaling={false} style={styles.labelText}>
                        {t('Stop Price')}
                      </UIText>
                    </View>
                    <View style={styles.valueSection}>
                      <PriceInput
                        error={this.state.errorStopPrice}
                        errorContent={this.state.errorStopPriceContent}
                        placeholder="Stop Price"
                        defaultValue={this.formData.stopPrice}
                        onBlur={this.onChangeStopPrice}
                        disabled={isValid !== true || this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL}
                      />
                    </View>
                  </View>
                )}
                {this.isUsingNewKisCore === true &&
                  (orderKind === ORDER_KIND.STOP_LIMIT_ORDER || orderKind === ORDER_KIND.STOP_ORDER) &&
                  (orderInput?.currentSymbol?.m !== MARKET.UPCOM ? (
                    <View
                      style={[{ ...(actionMode == null ? styles.itemSectionContainer : styles.itemSectionContainer2) }]}
                    >
                      <View style={styles.itemSection}>
                        <View style={styles.labelSection}>
                          <UIText allowFontScaling={false} style={styles.labelText}>
                            {t('Limit Price')}
                          </UIText>
                        </View>
                        <View style={styles.valueSection}>
                          <PriceInput
                            error={this.state.errorPrice}
                            errorContent={this.state.errorPriceContent}
                            placeholder="Price"
                            defaultValue={this.formData.orderPrice}
                            onBlur={this.onChangePrice}
                            disabled={
                              isValid !== true ||
                              this.disabledPriceTextBox ||
                              this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL ||
                              this.limitPriceLO === false
                            }
                            inputText={
                              this.limitPriceLO === false
                                ? selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES
                                  ? 'MTL'
                                  : this.props.orderInput?.currentSymbol?.m !== MARKET.HOSE
                                  ? 'MTL'
                                  : 'MP'
                                : undefined
                            }
                          />
                        </View>
                      </View>
                      {actionMode == null && (
                        <View style={styles.itemSection2}>
                          <View style={styles.labelSection2} />
                          <View style={styles.valueSection2}>
                            <TouchableOpacity
                              onPress={() => {
                                this.onPressChangeLimitPriceType(false);
                              }}
                              style={[styles.limitPriceOption, { ...(this.limitPriceLO !== true && styles.selected) }]}
                            >
                              <UIText style={[{ ...(this.limitPriceLO !== true && styles.selectedText) }]}>
                                {selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES
                                  ? 'MTL'
                                  : this.props.orderInput?.currentSymbol?.m !== MARKET.HOSE
                                  ? 'MTL'
                                  : 'MP'}
                              </UIText>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                this.onPressChangeLimitPriceType(true);
                              }}
                              style={[styles.limitPriceOption2, { ...(this.limitPriceLO === true && styles.selected) }]}
                            >
                              <UIText style={[{ ...(this.limitPriceLO === true && styles.selectedText) }]}>LO</UIText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.itemSection}>
                      <View style={styles.labelSection}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {t('Limit Price')}
                        </UIText>
                      </View>
                      <View style={styles.valueSection}>
                        <PriceInput
                          error={this.state.errorPrice}
                          errorContent={this.state.errorPriceContent}
                          placeholder="Price"
                          defaultValue={this.formData.orderPrice}
                          onBlur={this.onChangePrice}
                          disabled={
                            isValid !== true ||
                            this.disabledPriceTextBox ||
                            this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL
                          }
                        />
                      </View>
                    </View>
                  ))}
                {this.isUsingNewKisCore === false
                  ? (orderKind === ORDER_KIND.NORMAL_ORDER ||
                      orderKind === ORDER_KIND.ADVANCE_ORDER ||
                      orderKind === ORDER_KIND.STOP_LIMIT_ORDER) && (
                      <View style={styles.itemSection}>
                        <View style={styles.labelSection}>
                          <UIText allowFontScaling={false} style={styles.labelText}>
                            {t(orderKind === ORDER_KIND.STOP_LIMIT_ORDER ? 'Limit Price' : 'Price')}
                          </UIText>
                        </View>
                        <View style={styles.valueSection}>
                          <PriceInput
                            error={this.state.errorPrice}
                            errorContent={this.state.errorPriceContent}
                            placeholder="Price"
                            defaultValue={this.formData.orderPrice}
                            onBlur={this.onChangePrice}
                            disabled={
                              isValid !== true ||
                              this.disabledPriceTextBox ||
                              this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL
                            }
                          />
                        </View>
                      </View>
                    )
                  : orderKind === ORDER_KIND.NORMAL_ORDER &&
                    (this.formData.orderType === ORDER_TYPE.LO || this.formData.orderType === ORDER_TYPE.ODDLOT) && (
                      <View style={styles.itemSection}>
                        <View style={styles.labelSection}>
                          <UIText allowFontScaling={false} style={styles.labelText}>
                            {t('Price')}
                          </UIText>
                        </View>
                        <View style={styles.valueSection}>
                          <PriceInput
                            error={this.state.errorPrice}
                            errorContent={this.state.errorPriceContent}
                            placeholder="Price"
                            defaultValue={this.formData.orderPrice}
                            onBlur={this.onChangePrice}
                            disabled={
                              isValid !== true ||
                              this.disabledPriceTextBox ||
                              this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL
                            }
                          />
                        </View>
                      </View>
                    )}
                {this.isUsingNewKisCore === true &&
                  orderKind === ORDER_KIND.NORMAL_ORDER &&
                  selectedAccount?.type === SYSTEM_TYPE.EQUITY &&
                  ORDER_TYPE.ODDLOT !== this.formData?.orderType && (
                    <View style={styles.itemSection}>
                      <View style={[styles.labelSection, styles.dateLabelSection]}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {t('Expiry Date')}
                        </UIText>
                      </View>
                      <View style={[styles.valueSection, styles.row, styles.alignItemCenter]}>
                        <View
                          style={styles.firstValue}
                          pointerEvents={this.state.expiryDateChecked === false ? 'none' : undefined}
                        >
                          <DatePicker
                            ref={(ref: DatePickerComp) => (this.fromDateRef = ref)}
                            defaultValue={this.today}
                            onChange={this.onChangeDateFrom}
                            disabled={
                              isValid !== true ||
                              this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL ||
                              this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY
                            }
                            minDate={this.today}
                          />
                        </View>
                        {/* {((this.formData.advanceOrderType !== DERIVATIVES_ADVANCE_ORDER_TYPE.AO &&
                        selectedAccount.type === SYSTEM_TYPE.DERIVATIVES &&
                        orderKind === ORDER_KIND.ADVANCE_ORDER) ||
                        (orderKind !== ORDER_KIND.ADVANCE_ORDER && selectedAccount.type === SYSTEM_TYPE.EQUITY)) && (
                          <View style={styles.secondValue}>
                            <DatePicker
                              ref={(ref: DatePickerComp) => (this.toDateRef = ref)}
                              defaultValue={
                                this.props.actionMode != null
                                  ? formatStringToDate(this.formData.toDate!)
                                  : orderKind === ORDER_KIND.ADVANCE_ORDER
                                    ? addDays(new Date(), 1)
                                    : new Date()
                              }
                              onChange={this.onChangeDateTo}
                              disabled={
                                isValid !== true ||
                                this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL ||
                                (orderKind === ORDER_KIND.ADVANCE_ORDER &&
                                  this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY)
                              }
                              minDate={
                                this.formData.fromDate != null ? formatStringToDate(this.formData.fromDate) : undefined
                              }
                            />
                          </View>
                        )} */}
                      </View>
                      <View style={[styles.labelSection3]}>
                        <CheckBox checked={this.state.expiryDateChecked} onChange={this.changeExpiryDateChecked} />
                      </View>
                    </View>
                  )}
                {config.domain !== 'kis' &&
                  selectedAccount &&
                  selectedAccount.type === SYSTEM_TYPE.EQUITY &&
                  orderKind === ORDER_KIND.ADVANCE_ORDER && (
                    <View style={styles.itemSection}>
                      <View style={styles.labelSection}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {t('Phone Number')}
                        </UIText>
                      </View>
                      <View style={styles.valueSection}>
                        <TextBox
                          type={TEXTBOX_TYPE.TEXT}
                          placeholder="Phone Number"
                          value={this.formData.phoneNumber}
                          onChange={this.onChangePhoneNumber}
                          error={this.state.errorPhoneNumber}
                          errorContent={this.state.errorPhoneNumberContent}
                          disabled={isValid !== true || this.props.actionMode != null}
                        />
                      </View>
                    </View>
                  )}
                {selectedAccount &&
                  selectedAccount.type === SYSTEM_TYPE.DERIVATIVES &&
                  orderKind === ORDER_KIND.ADVANCE_ORDER && (
                    <View style={styles.itemSection}>
                      <View style={styles.labelSection}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {config.domain !== 'kis' ? t('Adv Type') : t('Market Session')}
                        </UIText>
                      </View>
                      <View style={[styles.valueSection, styles.row, styles.alignItemCenter, styles.paddingTop]}>
                        {config.domain !== 'kis' && (
                          <View style={styles.firstValue}>
                            <Picker
                              list={DERIVATIVES_ADVANCE_ORDER_TYPES}
                              selectedValue={this.formData.advanceOrderType}
                              onChange={this.onChangeAdvanceOrderType}
                              disabled={isValid !== true || this.props.actionMode != null}
                            />
                          </View>
                        )}
                        <View style={styles.secondValue}>
                          <Picker
                            list={DERIVATIVES_MARKET_SESSION_OPTION}
                            selectedValue={this.formData.marketSession}
                            onChange={this.onChangeMarketSessionOption}
                            disabled={isValid !== true || this.props.actionMode != null}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                {selectedAccount &&
                  ((selectedAccount.type === SYSTEM_TYPE.DERIVATIVES &&
                    (orderKind === ORDER_KIND.ADVANCE_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER)) ||
                    (selectedAccount.type === SYSTEM_TYPE.EQUITY &&
                      (orderKind === ORDER_KIND.STOP_ORDER || orderKind === ORDER_KIND.STOP_LIMIT_ORDER))) && (
                    <View style={styles.itemSection}>
                      <View style={[styles.labelSection, styles.dateLabelSection]}>
                        <UIText allowFontScaling={false} style={styles.labelText}>
                          {orderKind === ORDER_KIND.ADVANCE_ORDER &&
                          selectedAccount.type === SYSTEM_TYPE.DERIVATIVES &&
                          this.formData.advanceOrderType === DERIVATIVES_ADVANCE_ORDER_TYPE.AO
                            ? t('Start Date')
                            : t('Date')}
                        </UIText>
                      </View>
                      <View style={[styles.valueSection, styles.row, styles.alignItemCenter]}>
                        <View style={styles.firstValue}>
                          <DatePicker
                            ref={(ref: DatePickerComp) => (this.fromDateRef = ref)}
                            defaultValue={
                              this.props.actionMode != null ? formatStringToDate(this.formData.fromDate!) : new Date()
                            }
                            onChange={this.onChangeDateFrom}
                            disabled={
                              isValid !== true ||
                              this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL ||
                              (orderKind === ORDER_KIND.ADVANCE_ORDER &&
                                this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY)
                            }
                            minDate={new Date()}
                          />
                        </View>
                        {((selectedAccount.type === SYSTEM_TYPE.DERIVATIVES && this.isUsingNewKisCore === true) ||
                          (this.formData.advanceOrderType !== DERIVATIVES_ADVANCE_ORDER_TYPE.AO &&
                            selectedAccount.type === SYSTEM_TYPE.DERIVATIVES &&
                            orderKind === ORDER_KIND.ADVANCE_ORDER) ||
                          (orderKind !== ORDER_KIND.ADVANCE_ORDER && selectedAccount.type === SYSTEM_TYPE.EQUITY)) && (
                          <View style={styles.secondValue}>
                            <DatePicker
                              ref={(ref: DatePickerComp) => (this.toDateRef = ref)}
                              defaultValue={
                                this.props.actionMode != null
                                  ? formatStringToDate(this.formData.toDate!)
                                  : orderKind === ORDER_KIND.ADVANCE_ORDER
                                  ? addDays(new Date(), 1)
                                  : new Date()
                              }
                              onChange={this.onChangeDateTo}
                              disabled={
                                isValid !== true ||
                                this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL ||
                                (orderKind === ORDER_KIND.ADVANCE_ORDER &&
                                  this.props.actionMode === ORDER_FORM_ACTION_MODE.MODIFY)
                              }
                              minDate={
                                this.formData.fromDate != null ? formatStringToDate(this.formData.fromDate) : undefined
                              }
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                <View style={styles.bottomButton}>
                  {this.props.actionMode == null ? (
                    <Button
                      buttonStyle={[
                        this.formData.sellBuyType === SELL_BUY_TYPE.BUY ? styles.buttonBuy : styles.buttonSell,
                        styles.buttonStyle,
                      ]}
                      title={
                        this.formData.sellBuyType === SELL_BUY_TYPE.BUY
                          ? t('Buy').toUpperCase()
                          : t('Sell').toUpperCase()
                      }
                      onPress={this.placeOrder}
                      disabled={isValid !== true}
                    />
                  ) : (
                    <Button
                      buttonStyle={[
                        this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL
                          ? styles.buttonCancel
                          : styles.buttonModify,
                        styles.buttonStyle,
                        this.formData.sellBuyType === SELL_BUY_TYPE.BUY ? styles.buttonBuy : styles.buttonSell,
                      ]}
                      title={`${
                        this.props.actionMode === ORDER_FORM_ACTION_MODE.CANCEL
                          ? t(this.props.actionMode).toUpperCase()
                          : t(this.props.actionMode.toUpperCase())
                      } ${t(upperFirstLetter(this.formData.sellBuyType!)).toUpperCase()}`}
                      onPress={this.modifyCancelOrder}
                      disabled={isValid !== true}
                    />
                  )}
                </View>
              </ScrollView>
            </View>
            {this.isUsingNewKisCore && this.state.modalVisible && (
              <OrderModal
                formData={this.formData}
                isVisibleModal={this.state.modalVisible}
                confirm={this.confirm}
                closeModal={this.closeModal}
                orderInput={this.props.orderInput}
                orderKind={this.triggerActionMode ? this.orderKind : orderKind}
                orderType={this.formData.orderType}
                actionMode={this.props.actionMode}
                limitPriceLO={this.limitPriceLO}
              />
            )}
            {this.state.modalCancelModifyVisible && (
              <CancelModifyModal
                componentId={this.props.componentId}
                closeModal={this.closeCancelModifyModal}
                onPressItem={this.onPressItem}
                type={this.type}
                orderKind={this.props.orderKind}
                systemType={this.props.orderInput.selectedAccount!.type}
                orderInput={this.props.orderInput}
                confirmCancelOrder={this.confirmCancelOrder}
                stockSymbol={currentSymbol?.s!}
              />
            )}
          </View>
        </KeyboardAwareScrollView>

        {currentSymbol && this.state.showQuantityPicker && Platform.OS === 'android' && (
          <KeyboardAccessoryView avoidKeyboard={true} androidAdjustResize alwaysVisible={true}>
            <View style={styles.keyboardAccessoryContainer}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                {this.isUsingNewKisCore && this.isOddlotOrder()
                  ? QUANTITY_LIST[SYMBOL_TYPE.ODDLOT][MARKET.HOSE].map((value: number, index: number) => (
                      <TouchableOpacity
                        style={styles.keyboardAccessoryItem}
                        key={index}
                        onPress={() => this.setQuantity(value)}
                      >
                        <UIText allowFontScaling={false} style={styles.keyboardAccessoryText}>
                          {value}
                        </UIText>
                      </TouchableOpacity>
                    ))
                  : QUANTITY_LIST[currentSymbol.t][currentSymbol.m].map((value: number, index: number) => (
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
                {}
              </ScrollView>
            </View>
          </KeyboardAccessoryView>
        )}

        {currentSymbol && Platform.OS === 'ios' && (
          <InputAccessoryView nativeID={INPUT_QUANTIY_ID_KEY} style={{ backgroundColor: 'red' }}>
            <View style={styles.keyboardAccessoryContainer}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                {(this.isOddlotOrder()
                  ? QUANTITY_LIST[SYMBOL_TYPE.ODDLOT][currentSymbol.m]
                  : QUANTITY_LIST[currentSymbol.t][currentSymbol.m]
                ).map((value: number, index: number) => (
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
    );
  }
}

const mapStateToProps = (state: IState) => ({
  orderInput: getOrderInput(state),
  buyableInfo: state.equityBuyableInfo,
  sellableInfo: state.equitySellableInfo,
  derivativesOrderAvailable: state.derivativesOrderAvailable,
  accountMobile: state.equityAccountMobile,
  orderTrigger: state.orderTrigger,
  accountMargin: state.equityAccountMargin,
  equityAccountMarginQuerySuccess: state.equityAccountMarginQuerySuccess,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryEquityBuyableInfo,
      queryDerivativesOrderAvailable,
      queryEquitySellableInfo,
      queryAccountMobile,
      placeOrder,
      cancelOrder,
      modifyOrder,
      placeDerivativesOrder,
      cancelDerivativesOrder,
      modifyDerivativesOrder,
      queryAccountMargin,
      reloadMarketData,
      querySymbolData,
    })(OrderForm)
  ),
  Fallback,
  handleError
);
