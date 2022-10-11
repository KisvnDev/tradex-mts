import { IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_STOCK_BALANCE_DETAIL } from 'redux-sagas/actions';
import { BALANCE_DETAIL_QUERY_STOCK_BALANCE_SUCCESS } from './reducers';

export const queryStockBalanceDetail = (payload: IObject) => ({
  type: ACCOUNT_QUERY_EQUITY_STOCK_BALANCE_DETAIL,
  response: {
    success: BALANCE_DETAIL_QUERY_STOCK_BALANCE_SUCCESS,
  },
  payload,
});
