import { IObject } from 'interfaces/common';
import { QUERY_ORDER_HISTORY_SUCCESS, QUERY_ORDER_HISTORY_FAILED } from './reducers';
import { ORDER_QUERY_ORDER_HISTORY } from 'redux-sagas/actions';
// FAILED
export const queryOrderHistory = (payload: IObject) => ({
  type: ORDER_QUERY_ORDER_HISTORY,
  response: {
    success: QUERY_ORDER_HISTORY_SUCCESS,
    failure: QUERY_ORDER_HISTORY_FAILED,
  },
  payload,
});
