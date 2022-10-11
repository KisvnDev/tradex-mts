import { IObject } from 'interfaces/common';
import { DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY } from 'redux-sagas/actions';
import { DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY_SUCCESS } from './reducers';

export const queryPositionHistory = (payload: IObject) => ({
  type: DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY,
  response: {
    success: DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY_SUCCESS,
  },
  payload,
});
