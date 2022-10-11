import {
  QUERY_CASH_IN_ADVANCE,
  SUBMIT_ADVANCE_PAYMENT_CREATION,
  CHECK_TIME_SUBMIT_ADVANCE_PAYMENT,
  QUERY_CALCULATE_INTEREST,
} from 'redux-sagas/actions';
import {
  CASH_IN_ADVANCE_QUERY_FAILED,
  CASH_IN_ADVANCE_QUERY_SUCCESS,
  SUBMIT_ADVANCE_PAYMENT_CREATION_SUCCESS,
  SUBMIT_ADVANCE_PAYMENT_CREATION_FAILED,
  CHECK_TIME_SUCCESS,
  CHECK_TIME_FAILED,
  CHECK_TIME_SUBMIT_ADVANCE_PAYMENT_RESET,
  CALCULATE_INTEREST_QUERY_SUCCESS,
  CALCULATE_INTEREST_QUERY_FAILED,
  IICACashChildT,
} from './reducers';

export interface IParamsSubmits {
  availableAmount: number;
  submitAmount: number;
  accountNo: String;
  item?: IICACashChildT;
}

export const queryCashInAdvances = () => ({
  type: QUERY_CASH_IN_ADVANCE,
  response: {
    success: CASH_IN_ADVANCE_QUERY_SUCCESS,
    failure: CASH_IN_ADVANCE_QUERY_FAILED,
  },
});

export const queryCalculateInterest = (mvAmount?: string, mvSettlement?: string) => ({
  type: QUERY_CALCULATE_INTEREST,
  response: {
    success: CALCULATE_INTEREST_QUERY_SUCCESS,
    failure: CALCULATE_INTEREST_QUERY_FAILED,
  },
  payload: {
    mvAmount,
    mvSettlement,
  },
});

export const submitAdvancePaymentCreation = (payload: IParamsSubmits) => ({
  type: SUBMIT_ADVANCE_PAYMENT_CREATION,
  response: {
    success: SUBMIT_ADVANCE_PAYMENT_CREATION_SUCCESS,
    failure: SUBMIT_ADVANCE_PAYMENT_CREATION_FAILED,
  },
  payload,
});

export const checkTime = () => ({
  type: CHECK_TIME_SUBMIT_ADVANCE_PAYMENT,
  response: {
    success: CHECK_TIME_SUCCESS,
    failure: CHECK_TIME_FAILED,
  },
});

export const resetTimeSubmited = () => ({
  type: CHECK_TIME_SUBMIT_ADVANCE_PAYMENT_RESET,
});
