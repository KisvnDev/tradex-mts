import { IObject } from 'interfaces/common';
import { QUERY_DERIVATIVES_ORDER_HISTORY_SUCCESS } from './reducers';
import { DERIVATIVES_ORDER_QUERY_ORDER_HISTORY } from 'redux-sagas/actions';

export const queryOrderHistory = (payload: IObject) => ({
  type: DERIVATIVES_ORDER_QUERY_ORDER_HISTORY,
  response: {
    success: QUERY_DERIVATIVES_ORDER_HISTORY_SUCCESS,
  },
  payload,
});
