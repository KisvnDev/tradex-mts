import { ACCOUNT_QUERY_EQUITY_CASH_BALANCE_DETAIL } from 'redux-sagas/actions';
import { BALANCE_DETAIL_QUERY_CASH_BALANCE_SUCCESS } from './reducers';

export const queryCashBalanceDetail = () => ({
  type: ACCOUNT_QUERY_EQUITY_CASH_BALANCE_DETAIL,
  response: {
    success: BALANCE_DETAIL_QUERY_CASH_BALANCE_SUCCESS,
  },
});
