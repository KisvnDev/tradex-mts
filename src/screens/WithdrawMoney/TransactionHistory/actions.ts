import { IObject } from 'interfaces/common';
import { WITHDRAW_MONEY_QUERY_HISTORY, WITHDRAW_MONEY_CANCEL_REQUEST } from 'redux-sagas/actions';
import {
  WITHDRAW_MONEY_QUERY_HISTORY_SUCCESS,
  WITHDRAW_MONEY_QUERY_HISTORY_FAILED,
  WITHDRAW_MONEY_CANCEL_REQUEST_SUCCESS,
  WITHDRAW_MONEY_CANCEL_REQUEST_FAILED,
} from './reducers';

export const queryWithdrawTransactionHistory = (payload: IObject) => ({
  type: WITHDRAW_MONEY_QUERY_HISTORY,
  response: {
    success: WITHDRAW_MONEY_QUERY_HISTORY_SUCCESS,
    failure: WITHDRAW_MONEY_QUERY_HISTORY_FAILED,
  },
  payload,
});

export const cancelWithdrawMoney = (payload: IObject) => ({
  type: WITHDRAW_MONEY_CANCEL_REQUEST,
  response: {
    success: WITHDRAW_MONEY_CANCEL_REQUEST_SUCCESS,
    failure: WITHDRAW_MONEY_CANCEL_REQUEST_FAILED,
  },
  payload,
  showLoading: true,
});
