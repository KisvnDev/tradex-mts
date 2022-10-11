import { IObject } from 'interfaces/common';
import { ORDER_KIND } from 'global';
import {
  ORDER_QUERY_ORDER_HISTORY,
  ORDER_QUERY_ORDER_TODAY_UNMATCH,
  ORDER_QUERY_STOP_ORDER_HISTORY,
  DERIVATIVES_ORDER_QUERY_ORDER_HISTORY,
  DERIVATIVES_ORDER_QUERY_STOP_ORDER_HISTORY,
  SPEED_ORDER_PLACE_ORDER,
  SPEED_ORDER_PLACE_DERIVATIVES_ORDER,
  SPEED_ORDER_MODIFY_ORDER,
  SPEED_ORDER_CANCEL_ORDER,
  SPEED_ORDER_CANCEL_DERIVATIVES_ORDER,
  SPEED_ORDER_MOVE_ORDER,
  SPEED_ORDER_MOVE_DERIVATIVES_ORDER,
  ACCOUNT_QUERY_EQUITY_SELLABLE_INFO,
  DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION,
  DERIVATIVES_ORDER_QUERY_ORDER_TODAY_UNMATCH,
} from 'redux-sagas/actions';
import {
  SPEED_ORDER_ACTION_SUCCESS,
  SPEED_ORDER_ACTION_FAILED,
  SPEED_ORDER_ORDER_HISTORY_SUCCESS,
  SPEED_ORDER_ORDER_HISTORY_FAILED,
  SPEED_ORDER_STOP_ORDER_HISTORY_SUCCESS,
  SPEED_ORDER_STOP_ORDER_HISTORY_FAILED,
  SPEED_ORDER_CURRENT_ROW,
  ICurrentRow,
  SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS,
  SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED,
  DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_SUCCESS,
  DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_FAILED,
} from './reducers';

export const setCurrentRow = (payload: ICurrentRow | null) => ({
  type: SPEED_ORDER_CURRENT_ROW,
  payload,
});

export const queryOrderHistory = (payload: IObject) => ({
  type: ORDER_QUERY_ORDER_HISTORY,
  response: {
    success: SPEED_ORDER_ORDER_HISTORY_SUCCESS,
    failure: SPEED_ORDER_ORDER_HISTORY_FAILED,
  },
  payload,
});

export const queryOrderUnMatchToday = (payload: IObject) => ({
  type: ORDER_QUERY_ORDER_TODAY_UNMATCH,
  response: {
    success: SPEED_ORDER_ORDER_HISTORY_SUCCESS,
    failure: SPEED_ORDER_ORDER_HISTORY_FAILED,
  },
  payload,
  isSpeedOrder: true,
});

export const queryOrderUnMatchDerivativesToday = (payload: IObject) => ({
  type: DERIVATIVES_ORDER_QUERY_ORDER_TODAY_UNMATCH,
  response: {
    success: SPEED_ORDER_ORDER_HISTORY_SUCCESS,
  },
  payload,
});

export const queryDerivativesOrderHistory = (payload: IObject) => ({
  type: DERIVATIVES_ORDER_QUERY_ORDER_HISTORY,
  response: {
    success: SPEED_ORDER_ORDER_HISTORY_SUCCESS,
    failure: SPEED_ORDER_ORDER_HISTORY_FAILED,
  },
  payload,
});

export const queryStopOrderHistory = (payload: IObject) => ({
  type: ORDER_QUERY_STOP_ORDER_HISTORY,
  response: {
    success: SPEED_ORDER_STOP_ORDER_HISTORY_SUCCESS,
    failure: SPEED_ORDER_STOP_ORDER_HISTORY_FAILED,
  },
  payload,
});

export const queryDerivativesStopOrderHistory = (payload: IObject) => ({
  type: DERIVATIVES_ORDER_QUERY_STOP_ORDER_HISTORY,
  response: {
    success: SPEED_ORDER_STOP_ORDER_HISTORY_SUCCESS,
    failure: SPEED_ORDER_STOP_ORDER_HISTORY_FAILED,
  },
  payload,
});

export const placeSpeedOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: SPEED_ORDER_PLACE_ORDER,
  response: {
    success: SPEED_ORDER_ACTION_SUCCESS,
    failure: SPEED_ORDER_ACTION_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const placeDerivativesSpeedOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: SPEED_ORDER_PLACE_DERIVATIVES_ORDER,
  response: {
    success: SPEED_ORDER_ACTION_SUCCESS,
    failure: SPEED_ORDER_ACTION_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const modifySpeedOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: SPEED_ORDER_MODIFY_ORDER,
  response: {
    success: SPEED_ORDER_ACTION_SUCCESS,
    failure: SPEED_ORDER_ACTION_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const cancelSpeedOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: SPEED_ORDER_CANCEL_ORDER,
  response: {
    success: SPEED_ORDER_ACTION_SUCCESS,
    failure: SPEED_ORDER_ACTION_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const cancelDerivativesSpeedOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: SPEED_ORDER_CANCEL_DERIVATIVES_ORDER,
  response: {
    success: SPEED_ORDER_ACTION_SUCCESS,
    failure: SPEED_ORDER_ACTION_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const moveSpeedOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: SPEED_ORDER_MOVE_ORDER,
  response: {
    success: SPEED_ORDER_ACTION_SUCCESS,
    failure: SPEED_ORDER_ACTION_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const moveDerivativesSpeedOrder = (payload: IObject, orderKind: ORDER_KIND) => ({
  type: SPEED_ORDER_MOVE_DERIVATIVES_ORDER,
  response: {
    success: SPEED_ORDER_ACTION_SUCCESS,
    failure: SPEED_ORDER_ACTION_FAILED,
  },
  payload,
  orderKind,
  showLoading: true,
});

export const queryEquitySellableInfo = (symbolCode?: string) => ({
  type: ACCOUNT_QUERY_EQUITY_SELLABLE_INFO,
  response: {
    success: SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_SUCCESS,
    failure: SPEED_ORDER_QUERY_EQUITY_SELLABLE_INFO_FAILED,
  },
  payload: {
    symbolCode,
  },
});

export const queryDerivativesOpenPosition = (payload: IObject) => ({
  type: DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION,
  response: {
    success: DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_SUCCESS,
    failure: DERIVATIVES_SPEED_ORDER_QUERY_OPEN_POSITION_FAILED,
  },
  payload,
});
