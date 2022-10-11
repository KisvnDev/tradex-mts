import { IObject } from 'interfaces/common';
import { DERIVATIVES_HISTORY_QUERY_MARGIN_CALL } from 'redux-sagas/actions';
import { DERIVATIVES_HISTORY_QUERY_MARGIN_CALL_SUCCESS } from './reducers';

export const queryMarginCall = (payload: IObject) => ({
  type: DERIVATIVES_HISTORY_QUERY_MARGIN_CALL,
  response: {
    success: DERIVATIVES_HISTORY_QUERY_MARGIN_CALL_SUCCESS,
  },
  payload,
});
