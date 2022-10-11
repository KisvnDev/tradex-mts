import { IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_TRANSACTION_STATEMENT } from 'redux-sagas/actions';
import { ACCOUNT_QUERY_TRANSACTION_STATEMENT_SUCCESS, ACCOUNT_QUERY_TRANSACTION_STATEMENT_FAILED } from './reducers';

export const queryTransactionStatement = (payload: IObject) => ({
  type: ACCOUNT_QUERY_TRANSACTION_STATEMENT,
  response: {
    success: ACCOUNT_QUERY_TRANSACTION_STATEMENT_SUCCESS,
    failure: ACCOUNT_QUERY_TRANSACTION_STATEMENT_FAILED,
  },
  payload,
});
