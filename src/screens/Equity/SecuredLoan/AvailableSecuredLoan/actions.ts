import { IObject } from 'interfaces/common';
import { SECURED_LOAN_QUERY_AVAILABLE_LOANS } from 'redux-sagas/actions';
import { QUERY_AVAILABLE_SECURED_LOAN_FAILED, QUERY_AVAILABLE_SECURED_LOAN_SUCCESS } from './reducers';

export const queryAvailableSecuredLoan = (payload: IObject) => ({
  type: SECURED_LOAN_QUERY_AVAILABLE_LOANS,
  response: {
    success: QUERY_AVAILABLE_SECURED_LOAN_SUCCESS,
    failure: QUERY_AVAILABLE_SECURED_LOAN_FAILED,
  },
  payload,
});
