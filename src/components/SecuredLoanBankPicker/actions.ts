import { SECURED_LOAN_QUERY_LOAN_BANKS } from 'redux-sagas/actions';
import {
  SECURED_LOAN_BANK_QUERY_FAILED,
  SECURED_LOAN_BANK_QUERY_SUCCESS,
  ISecuredLoanBank,
  SECURED_LOAN_BANK,
} from './reducers';

export const querySecuredLoanBanks = () => ({
  type: SECURED_LOAN_QUERY_LOAN_BANKS,
  response: {
    success: SECURED_LOAN_BANK_QUERY_SUCCESS,
    failure: SECURED_LOAN_BANK_QUERY_FAILED,
  },
});

export const setSecuredLoanBank = (payload: ISecuredLoanBank) => ({
  type: SECURED_LOAN_BANK,
  payload,
});
