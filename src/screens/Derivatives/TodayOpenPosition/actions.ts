import { IObject } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION } from 'redux-sagas/actions';
import { DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION_SUCCESS } from './reducers';

export const queryTodayOpenPosition = (payload: IObject) => ({
  type: DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION,
  response: {
    success: DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION_SUCCESS,
  },
  payload,
});
