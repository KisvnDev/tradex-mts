import { IObject } from 'interfaces/common';
import { QUERY_ORDER_ADVANCE_HISTORY_SUCCESS } from './reducers';
import { ORDER_QUERY_ADVANCE_ORDER_HISTORY } from 'redux-sagas/actions';

export const queryAdvanceOrderHistory = (payload: IObject) => ({
  type: ORDER_QUERY_ADVANCE_ORDER_HISTORY,
  response: {
    success: QUERY_ORDER_ADVANCE_HISTORY_SUCCESS,
  },
  payload,
});
