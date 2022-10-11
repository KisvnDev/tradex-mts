import { IObject } from 'interfaces/common';
import { TRANSFER_STOCK_QUERY_TRANSACTION_HISTORY } from 'redux-sagas/actions';
import { QUERY_STOCK_TRANSFER_HISTORY_SUCCESS, QUERY_STOCK_TRANSFER_HISTORY_FAILED } from './reducers';

export const queryStockTransferHistory = (payload: IObject) => ({
  type: TRANSFER_STOCK_QUERY_TRANSACTION_HISTORY,
  response: {
    success: QUERY_STOCK_TRANSFER_HISTORY_SUCCESS,
    failure: QUERY_STOCK_TRANSFER_HISTORY_FAILED,
  },
  payload,
});
