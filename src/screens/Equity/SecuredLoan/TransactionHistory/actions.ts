import { IObject } from 'interfaces/common';
import { SECURED_LOAN_QUERY_LOAN_HISTORY } from 'redux-sagas/actions';
import { QUERY_SECURED_LOAN_HISTORY_FAILED, QUERY_SECURED_LOAN_HISTORY_SUCCESS } from './reducers';

export const querySecuredLoanHistory = (payload: IObject) => ({
  type: SECURED_LOAN_QUERY_LOAN_HISTORY,
  response: {
    success: QUERY_SECURED_LOAN_HISTORY_SUCCESS,
    failure: QUERY_SECURED_LOAN_HISTORY_FAILED,
  },
  payload,
});
