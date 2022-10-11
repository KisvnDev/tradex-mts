import { ACCOUNT_QUERY_EQUITY_ACCOUNT_BALANCE } from 'redux-sagas/actions';
import { ACCOUNT_BALANCE_QUERY_ACCOUNT_BALANCE_SUCCESS } from './reducers';

export const queryAccountBalance = () => ({
  type: ACCOUNT_QUERY_EQUITY_ACCOUNT_BALANCE,
  response: {
    success: ACCOUNT_BALANCE_QUERY_ACCOUNT_BALANCE_SUCCESS,
  },
});
