import { IObject } from 'interfaces/common';
import { SECURED_LOAN_QUERY_LOAN_DETAIL, SECURED_LOAN_REGISTER } from 'redux-sagas/actions';
import {
  QUERY_DETAIL_SECURED_LOAN_FAILED,
  QUERY_DETAIL_SECURED_LOAN_SUCCESS,
  SECURED_LOAN_REGISTER_FAILED,
  SECURED_LOAN_REGISTER_SUCCESS,
} from './reducers';

export const querySecuredLoanDetail = (payload: IObject) => ({
  type: SECURED_LOAN_QUERY_LOAN_DETAIL,
  response: {
    success: QUERY_DETAIL_SECURED_LOAN_SUCCESS,
    failure: QUERY_DETAIL_SECURED_LOAN_FAILED,
  },
  payload,
});

export const registerSecuredLoan = (payload: IObject) => ({
  type: SECURED_LOAN_REGISTER,
  response: {
    success: SECURED_LOAN_REGISTER_SUCCESS,
    failure: SECURED_LOAN_REGISTER_FAILED,
  },
  payload,
  showLoading: true,
});
