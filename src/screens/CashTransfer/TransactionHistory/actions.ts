import { IObject } from 'interfaces/common';
import { TRANSFER_CASH_QUERY_TRANSACTION_HISTORY, TRANSFER_CASH_TRANSFER_CANCEL_REQUEST } from 'redux-sagas/actions';
import {
  CASH_TRANSFER_QUERY_HISTORY_SUCCESS,
  CASH_TRANSFER_QUERY_HISTORY_FAILED,
  TRANSFER_CASH_CANCEL_REQUEST_SUCCESS,
  TRANSFER_CASH_CANCEL_REQUEST_FAILED,
} from './reducers';

export const queryCashTransferTransactionHistory = (payload: IObject) => ({
  type: TRANSFER_CASH_QUERY_TRANSACTION_HISTORY,
  response: {
    success: CASH_TRANSFER_QUERY_HISTORY_SUCCESS,
    failure: CASH_TRANSFER_QUERY_HISTORY_FAILED,
  },
  payload,
});

export const cancelCashTransfer = (payload: IObject) => ({
  type: TRANSFER_CASH_TRANSFER_CANCEL_REQUEST,
  response: {
    success: TRANSFER_CASH_CANCEL_REQUEST_SUCCESS,
    failure: TRANSFER_CASH_CANCEL_REQUEST_FAILED,
  },
  payload,
  showLoading: true,
});
