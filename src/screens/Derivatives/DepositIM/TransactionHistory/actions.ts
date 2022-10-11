import { IObject } from 'interfaces/common';

import { DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_HISTORY } from 'redux-sagas/actions';
import { DEPOSIT_IM_QUERY_HISTORY_SUCCESS, DEPOSIT_IM_QUERY_HISTORY_FAILED } from './reducers';

export const queryDepositIMTransactionHistory = (payload: IObject) => ({
  type: DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_HISTORY,
  response: {
    success: DEPOSIT_IM_QUERY_HISTORY_SUCCESS,
    failure: DEPOSIT_IM_QUERY_HISTORY_FAILED,
  },
  payload,
});
