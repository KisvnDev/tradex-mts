import { IObject } from 'interfaces/common';
import { QUERY_ODDLOT_ORDER_TODAY_UNMATCH_SUCCESS } from './reducers';
import { ORDER_QUERY_ODDLOT_TODAY_UNMATCH } from 'redux-sagas/actions';

export const queryOddlotTodayUnmatch = (payload: IObject) => ({
  type: ORDER_QUERY_ODDLOT_TODAY_UNMATCH,
  response: {
    success: QUERY_ODDLOT_ORDER_TODAY_UNMATCH_SUCCESS,
  },
  payload,
});
