import { IObject } from 'interfaces/common';
import {
  ACCOUNT_QUERY_EQUITY_BUYABLE_INFO,
  DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE,
  ACCOUNT_QUERY_EQUITY_SELLABLE_INFO,
  ACCOUNT_QUERY_ACCOUNT_MOBILE,
  ORDER_PLACE_ORDER,
  ORDER_MODIFY_ORDER,
  ORDER_CANCEL_ORDER,
  DERIVATIVES_ORDER_PLACE_ORDER,
  DERIVATIVES_ORDER_CANCEL_ORDER,
  DERIVATIVES_ORDER_MODIFY_ORDER,
  QUERY_ACCOUNT_MARGIN,
} from 'redux-sagas/actions';
import {
  ORDER_QUERY_EQUITY_BUYABLE_INFO_SUCCESS,
  ORDER_QUERY_EQUITY_BUYABLE_INFO_FAILED,
  DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_SUCCESS,
  DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_FAILED,
  ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS,
  ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED,
  ORDER_FORM_QUERY_ACCOUNT_MOBILE_SUCCESS,
  ORDER_PLACE_ORDER_SUCCESS,
  ORDER_PLACE_ORDER_FAILED,
  ORDER_CANCEL_ORDER_SUCCESS,
  ORDER_CANCEL_ORDER_FAILED,
  ORDER_MODIFY_ORDER_SUCCESS,
  ORDER_MODIFY_ORDER_FAILED,
  QUERY_ACCOUNT_MARGIN_SUCCESS,
  QUERY_ACCOUNT_MARGIN_FAILED,
} from './reducers';
import { ORDER_KIND } from 'global';

export const queryEquityBuyableInfo = (payload: IObject) => ({
  type: ACCOUNT_QUERY_EQUITY_BUYABLE_INFO,
  response: {
    success: ORDER_QUERY_EQUITY_BUYABLE_INFO_SUCCESS,
    failure: ORDER_QUERY_EQUITY_BUYABLE_INFO_FAILED,
  },
  payload,
});

export const queryEquitySellableInfo = (payload?: IObject) => ({
  type: ACCOUNT_QUERY_EQUITY_SELLABLE_INFO,
  response: {
    success: ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS,
    failure: ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED,
  },
  payload,
});

export const queryAccountMobile = (payload: IObject) => ({
  type: ACCOUNT_QUERY_ACCOUNT_MOBILE,
  response: {
    success: ORDER_FORM_QUERY_ACCOUNT_MOBILE_SUCCESS,
  },
  payload,
});

export const queryAccountMargin = (payload: IObject) => ({
  type: QUERY_ACCOUNT_MARGIN,
  response: {
    success: QUERY_ACCOUNT_MARGIN_SUCCESS,
    failure: QUERY_ACCOUNT_MARGIN_FAILED,
  },
  payload,
});

export const queryDerivativesOrderAvailable = (payload: IObject) => ({
  type: DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE,
  response: {
    success: DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_SUCCESS,
    failure: DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE_FAILED,
  },
  payload,
});

export const placeOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: ORDER_PLACE_ORDER,
  response: {
    success: ORDER_PLACE_ORDER_SUCCESS,
    failure: ORDER_PLACE_ORDER_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const placeDerivativesOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: DERIVATIVES_ORDER_PLACE_ORDER,
  response: {
    success: ORDER_PLACE_ORDER_SUCCESS,
    failure: ORDER_PLACE_ORDER_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const cancelOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: ORDER_CANCEL_ORDER,
  response: {
    success: ORDER_CANCEL_ORDER_SUCCESS,
    failure: ORDER_CANCEL_ORDER_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const cancelDerivativesOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: DERIVATIVES_ORDER_CANCEL_ORDER,
  response: {
    success: ORDER_CANCEL_ORDER_SUCCESS,
    failure: ORDER_CANCEL_ORDER_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const modifyOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: ORDER_MODIFY_ORDER,
  response: {
    success: ORDER_MODIFY_ORDER_SUCCESS,
    failure: ORDER_MODIFY_ORDER_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const modifyDerivativesOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: DERIVATIVES_ORDER_MODIFY_ORDER,
  response: {
    success: ORDER_MODIFY_ORDER_SUCCESS,
    failure: ORDER_MODIFY_ORDER_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});
