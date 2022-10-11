import { IObject } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_DAILY_BALANCE } from 'redux-sagas/actions';
import { DERIVATIVES_ACCOUNT_QUERY_DAILY_BALANCE_SUCCESS } from './reducers';

export const queryDailyBalance = (payload: IObject) => ({
  type: DERIVATIVES_ACCOUNT_QUERY_DAILY_BALANCE,
  response: {
    success: DERIVATIVES_ACCOUNT_QUERY_DAILY_BALANCE_SUCCESS,
  },
  payload,
});
