import {
  MARKET_INIT,
  MARKET_SUBSCRIBE_SYMBOL,
  MARKET_UNSUBSCRIBE_SYMBOL,
  MARKET_QUERY_SYMBOL_DATA,
  FAVORITE_UPDATE_FAVORITE_LIST,
  COMMON_SHOW_NOTIFICATION,
  MARKET_SET_CURRENT_SYMBOL,
  MARKET_SET_CURRENT_INDEX,
  AUTHENTICATION_SIGNOUT,
  OPEN_BANK_ACCOUNT,
  RELOAD_MARKET_DATA,
  QUERY_BANK_INFO_IICA,
  MARKET_FOLLOW_SYMBOL_REFRESH,
} from './actions';
import { ISubscribeSymbol, IQuerySymbolData, ISymbolInfo, IOrderPrice } from 'interfaces/market';
import { INotification, IObject } from 'interfaces/common';
import { ORDER_PRICE } from 'components/OrderForm/reducers';
import { IOpenBankAccount } from 'config';
import { OPEN_BANK_ACCOUNT_FAILED, OPEN_BANK_ACCOUNT_SUCCESS } from './global-reducers/OpenBankAccount-reducers';
import { QUERY_BANK_INFO_IICA_SUCCESS, QUERY_BANK_INFO_IICA_FAILURE } from './global-reducers/bankAccountIica';

export const initMarket = () => ({
  type: MARKET_INIT,
});

export const reloadMarketData = () => ({
  type: RELOAD_MARKET_DATA,
});

export const followRefreshMarket = () => ({
  type: MARKET_FOLLOW_SYMBOL_REFRESH,
});

export const querySymbolData = (payload: IQuerySymbolData) => ({
  type: MARKET_QUERY_SYMBOL_DATA,
  payload,
});

export const subscribe = (payload: ISubscribeSymbol) => ({
  type: MARKET_SUBSCRIBE_SYMBOL,
  payload,
});

export const unsubscribe = (payload: ISubscribeSymbol) => ({
  type: MARKET_UNSUBSCRIBE_SYMBOL,
  payload,
});

export const updateFavoriteList = (payload: IObject[]) => ({
  type: FAVORITE_UPDATE_FAVORITE_LIST,
  showLoading: true,
  payload,
});

export const showNotification = (payload: INotification) => ({
  type: COMMON_SHOW_NOTIFICATION,
  payload,
});

export const setCurrentSymbol = (payload: ISymbolInfo) => ({
  type: MARKET_SET_CURRENT_SYMBOL,
  payload,
});

export const setCurrentIndex = (payload: ISymbolInfo) => ({
  type: MARKET_SET_CURRENT_INDEX,
  payload,
});

export const setOrderPrice = (payload: IOrderPrice) => ({
  type: ORDER_PRICE,
  payload,
});

export const signOut = (payload?: IObject) => ({
  type: AUTHENTICATION_SIGNOUT,
  payload,
});

export const onClickOpenBankAccountLink = (payload: IOpenBankAccount) => ({
  type: OPEN_BANK_ACCOUNT,
  response: {
    success: OPEN_BANK_ACCOUNT_SUCCESS,
    failure: OPEN_BANK_ACCOUNT_FAILED,
  },
  payload,
  showLoading: true,
});

export const backInfoIica = (payload: any) => ({
  type: QUERY_BANK_INFO_IICA,
  response: {
    success: QUERY_BANK_INFO_IICA_SUCCESS,
    failure: QUERY_BANK_INFO_IICA_FAILURE,
  },
  showLoading: false,
  payload,
});
