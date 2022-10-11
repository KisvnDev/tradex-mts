import { QUERY_CLIENT_CASH_BALANCE, QUERY_PORTFOLIO_LIST } from 'redux-sagas/actions';
import {
  QUERY_PORTFOLIO_LIST_SUCCESS,
  QUERY_PORTFOLIO_LIST_FAILED,
  QUERY_CLIENT_CASH_BALANCE_SUCCESS,
  QUERY_CLIENT_CASH_BALANCE_FAILED,
} from './reducers';

export const queryClientCashBalance = () => ({
  type: QUERY_CLIENT_CASH_BALANCE,
  response: {
    success: QUERY_CLIENT_CASH_BALANCE_SUCCESS,
    failure: QUERY_CLIENT_CASH_BALANCE_FAILED,
  },
});

export const queryPortfolio = () => ({
  type: QUERY_PORTFOLIO_LIST,
  response: {
    success: QUERY_PORTFOLIO_LIST_SUCCESS,
    failure: QUERY_PORTFOLIO_LIST_FAILED,
  },
});
