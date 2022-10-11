import { IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_LOAN_HISTORY } from 'redux-sagas/actions';
import { ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_SUCCESS, ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_FAILED } from './reducers';

export const queryLoanHistory = (data: IObject) => ({
  type: ACCOUNT_QUERY_EQUITY_LOAN_HISTORY,
  response: {
    success: ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_SUCCESS,
    failed: ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_FAILED,
  },
  data,
});
