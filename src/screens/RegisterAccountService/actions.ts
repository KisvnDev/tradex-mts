import { IObject } from 'interfaces/common';
import { QUERY_BANK_LIST, QUERY_BANK_BRANCH, FINISH_REGISTER_ACCOUNT } from 'redux-sagas/actions';
import {
  QUERY_BANK_LIST_SUCCESS,
  QUERY_BANK_LIST_FAILED,
  QUERY_BANK_BRANCH_SUCCESS,
  FINISH_REGISTER_ACCOUNT_SUCCESS,
  QUERY_BANK_BRANCH_FAILED,
  FINISH_REGISTER_ACCOUNT_FAILED,
} from './reducers';

export const queryBankList = () => ({
  type: QUERY_BANK_LIST,
  response: {
    success: QUERY_BANK_LIST_SUCCESS,
    failure: QUERY_BANK_LIST_FAILED,
  },
});

export const queryBankBranch = (payload: IObject) => ({
  type: QUERY_BANK_BRANCH,
  response: {
    success: QUERY_BANK_BRANCH_SUCCESS,
    failure: QUERY_BANK_BRANCH_FAILED,
  },
  payload,
});

export const finishRegister = (payload: IObject) => ({
  type: FINISH_REGISTER_ACCOUNT,
  response: {
    success: FINISH_REGISTER_ACCOUNT_SUCCESS,
    failure: FINISH_REGISTER_ACCOUNT_FAILED,
  },
  showLoading: true,
  payload,
});
