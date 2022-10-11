import { IObject } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_DAILY_PROFIT_LOSS } from 'redux-sagas/actions';
import { DERIVATIVES_ACCOUNT_QUERY_DAILY_PROFIT_LOSS_SUCCESS } from './reducers';

export const queryDailyProfitLoss = (payload: IObject) => ({
  type: DERIVATIVES_ACCOUNT_QUERY_DAILY_PROFIT_LOSS,
  response: {
    success: DERIVATIVES_ACCOUNT_QUERY_DAILY_PROFIT_LOSS_SUCCESS,
  },
  payload,
});
