import { IObject } from 'interfaces/common';
import { QUERY_DERIVATIVES_ORDER_TODAY_UNMATCH_SUCCESS } from './reducers';
import { DERIVATIVES_ORDER_QUERY_ORDER_TODAY_UNMATCH } from 'redux-sagas/actions';

export const queryOrderTodayUnmatch = (payload: IObject) => ({
  type: DERIVATIVES_ORDER_QUERY_ORDER_TODAY_UNMATCH,
  response: {
    success: QUERY_DERIVATIVES_ORDER_TODAY_UNMATCH_SUCCESS,
  },
  payload,
});
