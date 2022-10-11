import { createSelector } from 'reselect';
import { IState } from 'redux-sagas/reducers';
import { IAction, IAccount, IAccountBank, IObject } from 'interfaces/common';
import { IOrderPrice, ISymbolInfo, ISymbolData } from 'interfaces/market';
import { getSystemType } from 'utils/market';
import { SYSTEM_TYPE } from 'global';
import config from 'config';

export const ORDER_PRICE = 'ORDER_PRICE';
export const ORDER_PLACE_ORDER_SUCCESS = 'ORDER_PLACE_ORDER_SUCCESS';
export const ORDER_PLACE_ORDER_FAILED = 'ORDER_PLACE_ORDER_FAILED';
export const ORDER_CANCEL_ORDER_SUCCESS = 'ORDER_CANCEL_ORDER_SUCCESS';
export const ORDER_CANCEL_ORDER_FAILED = 'ORDER_CANCEL_ORDER_FAILED';
export const ORDER_MODIFY_ORDER_SUCCESS = 'ORDER_MODIFY_ORDER_SUCCESS';
export const ORDER_MODIFY_ORDER_FAILED = 'ORDER_MODIFY_ORDER_FAILED';
export const ORDER_QUERY_EQUITY_BUYABLE_INFO_SUCCESS = 'ORDER_QUERY_EQUITY_BUYABLE_INFO_SUCCESS';
export const ORDER_QUERY_EQUITY_BUYABLE_INFO_FAILED = 'ORDER_QUERY_EQUITY_BUYABLE_INFO_FAILED';
export const ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS = 'ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS';
export const ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED = 'ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED';
export const ORDER_FORM_QUERY_ACCOUNT_MOBILE_SUCCESS = 'ORDER_FORM_QUERY_ACCOUNT_MOBILE_SUCCESS';
export const DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_SUCCESS = 'DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_SUCCESS';
export const DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_FAILED = 'DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_FAILED';
export const QUERY_ACCOUNT_MARGIN_SUCCESS = 'QUERY_ACCOUNT_MARGIN_SUCCESS';
export const QUERY_ACCOUNT_MARGIN_FAILED = 'QUERY_ACCOUNT_MARGIN_FAILED';

export function OrderPrice(state: IOrderPrice | null = null, action: IAction<IOrderPrice>) {
  switch (action.type) {
    case ORDER_PRICE:
      if (action.payload) {
        return { ...action.payload };
      } else {
        return null;
      }
    default:
      return state;
  }
}

export interface IEquityBuyableInfo {
  data: {
    buyingPower: number;
    buyableQuantity: number;
    marginLimitation: number;
  };
  account: IAccount;
  accountBank: IAccountBank;
  orderPrice: number;
  symbol: ISymbolInfo;
}
export interface IAccountMargin {
  ratio: number;
}

export function EquityBuyableInfo(state: IEquityBuyableInfo | null = null, action: IAction<IEquityBuyableInfo>) {
  switch (action.type) {
    case ORDER_QUERY_EQUITY_BUYABLE_INFO_SUCCESS:
      if (action.payload) {
        return { ...action.payload };
      } else {
        return null;
      }
    default:
      return state;
  }
}

export function EquitySellableInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function EquityAccountMobile(state: string | null = null, action: IAction<string>) {
  switch (action.type) {
    case ORDER_FORM_QUERY_ACCOUNT_MOBILE_SUCCESS:
      return action.payload;

    default:
      return state;
  }
}

export function DerivativesOrderAvailable(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_SUCCESS:
      return { ...action.payload };
    case DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_FAILED:
      return {
        data: null,
      };
    default:
      return state;
  }
}

export function EquityAccountMargin(state: IAccountMargin | null = null, action: IAction<IAccountMargin>) {
  switch (action.type) {
    case QUERY_ACCOUNT_MARGIN_SUCCESS:
      return { ...action.payload };
    case QUERY_ACCOUNT_MARGIN_FAILED:
      return config.usingNewKisCore === false
        ? {
            ratio: null,
          }
        : {
            marginRatio: null,
            PP: null,
          };
    default:
      return state;
  }
}

export function EquityAccountMarginQuerySuccess(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case QUERY_ACCOUNT_MARGIN_SUCCESS:
      return !state;
    default:
      return state;
  }
}

const currentSymbol = (state: IState) => state.currentSymbol;

const selectedAccount = (state: IState) => state.selectedAccount;

const accountBank = (state: IState) => state.accountBank;

const quote = (state: IState) => state.currentSymbolQuote;

export interface IOrderInput {
  currentSymbol: ISymbolInfo | null;
  selectedAccount: IAccount | null;
  accountBank: IAccountBank | null;
  quote: ISymbolData | null;
  isValid: boolean;
}

export const getOrderInput = createSelector(
  [currentSymbol, selectedAccount, accountBank, quote],
  (currentSymbol, selectedAccount, accountBank, quote) => {
    let isValid = false;
    if (currentSymbol != null && selectedAccount != null && getSystemType(currentSymbol.t) === selectedAccount.type) {
      if (quote == null || (quote != null && quote.s === currentSymbol?.s)) {
        if (config.usingNewKisCore === false) {
          if (selectedAccount.type === SYSTEM_TYPE.EQUITY) {
            if (
              accountBank != null &&
              accountBank.account != null &&
              accountBank.account.accountDisplay === selectedAccount.accountDisplay
            ) {
              isValid = true;
            }
          } else {
            accountBank = null;
            isValid = true;
          }
        } else {
          isValid = true;
        }
      }
    }
    return {
      currentSymbol,
      selectedAccount,
      accountBank,
      quote,
      isValid,
    };
  }
);
