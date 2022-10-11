import { IObject } from 'interfaces/common';
import { DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY } from 'redux-sagas/actions';
import { DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY_SUCCESS } from './reducers';

export const querySettlementHistory = (payload: IObject) => ({
  type: DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY,
  response: {
    success: DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY_SUCCESS,
  },
  payload,
});
