import { IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_STOCK_BALANCE } from 'redux-sagas/actions';
import { STOCK_BALANCE_QUERY_BALANCE_SUCCESS } from './reducers';

export const queryStockBalance = (payload: IObject) => ({
  type: ACCOUNT_QUERY_STOCK_BALANCE,
  response: {
    success: STOCK_BALANCE_QUERY_BALANCE_SUCCESS,
  },
  payload,
});
