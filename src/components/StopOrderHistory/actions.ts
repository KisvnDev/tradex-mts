import { IObject } from 'interfaces/common';
import { QUERY_ORDER_STOP_HISTORY_SUCCESS } from './reducers';
import { ORDER_QUERY_ALL_STOP_ORDER_HISTORY, ORDER_QUERY_STOP_ORDER_HISTORY } from 'redux-sagas/actions';

export const queryStopOrderHistory = (payload: IObject) => ({
  type: ORDER_QUERY_STOP_ORDER_HISTORY,
  response: {
    success: QUERY_ORDER_STOP_HISTORY_SUCCESS,
  },
  payload,
});

export const queryAllStopOrderHistory = (payload: IObject) => ({
  type: ORDER_QUERY_ALL_STOP_ORDER_HISTORY,
  response: {
    success: QUERY_ORDER_STOP_HISTORY_SUCCESS,
  },
  payload,
});
