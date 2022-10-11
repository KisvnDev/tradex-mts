import { IObject } from 'interfaces/common';
import { QUERY_POSITION_STATEMENT } from 'redux-sagas/actions';
import { QUERY_POSITION_STATEMENT_LIST_SUCCESS, QUERY_POSITION_STATEMENT_LIST_FAILED } from './reducers';

export const queryPositionStatement = (payload: IObject) => ({
  type: QUERY_POSITION_STATEMENT,
  response: {
    success: QUERY_POSITION_STATEMENT_LIST_SUCCESS,
    failure: QUERY_POSITION_STATEMENT_LIST_FAILED,
  },
  payload: payload,
});
