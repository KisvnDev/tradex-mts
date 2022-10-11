import { IObject } from 'interfaces/common';
import { QUERY_ORDER_TODAY_UNMATCH_SUCCESS } from './reducers';
import { ORDER_QUERY_ORDER_TODAY_UNMATCH } from 'redux-sagas/actions';

export const queryOrderTodayUnmatch = (payload: IObject) => ({
  type: ORDER_QUERY_ORDER_TODAY_UNMATCH,
  response: {
    success: QUERY_ORDER_TODAY_UNMATCH_SUCCESS,
  },
  payload,
});
