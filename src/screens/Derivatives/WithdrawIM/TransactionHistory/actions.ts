import { IObject } from 'interfaces/common';

import { DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_HISTORY } from 'redux-sagas/actions';
import { WITHDRAW_IM_QUERY_HISTORY_SUCCESS, WITHDRAW_IM_QUERY_HISTORY_FAILED } from './reducers';

export const queryWithdrawIMTransactionHistory = (payload: IObject) => ({
  type: DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_HISTORY,
  response: {
    success: WITHDRAW_IM_QUERY_HISTORY_SUCCESS,
    failure: WITHDRAW_IM_QUERY_HISTORY_FAILED,
  },
  payload,
});
