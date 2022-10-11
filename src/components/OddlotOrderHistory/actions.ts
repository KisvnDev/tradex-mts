import { IObject } from 'interfaces/common';
import { QUERY_ODDLOT_ORDER_HISTORY_SUCCESS } from './reducers';
import { ORDER_QUERY_ODDLOT_ORDER_HISTORY } from 'redux-sagas/actions';

export const queryOddlotOrderHistory = (payload: IObject) => ({
  type: ORDER_QUERY_ODDLOT_ORDER_HISTORY,
  response: {
    success: QUERY_ODDLOT_ORDER_HISTORY_SUCCESS,
  },
  payload,
});
