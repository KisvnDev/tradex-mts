import { QUERY_CASH_STATEMENT } from 'redux-sagas/actions';
import { QUERY_CASH_STATEMENT_FAIL, QUERY_CASH_STATEMENT_SUCCESS } from './reducer';

export const queryCashStatement = (payload: any) => ({
  type: QUERY_CASH_STATEMENT,
  response: {
    success: QUERY_CASH_STATEMENT_SUCCESS,
    failure: QUERY_CASH_STATEMENT_FAIL,
  },
  payload,
});
