import { IObject } from 'interfaces/common';
import { BUSINESS_INFO_QUERY_BUSINESS_INFO } from 'redux-sagas/actions';
import { BUSINESS_INFO_QUERY_BUSINESS_INFO_FAILED, BUSINESS_INFO_QUERY_BUSINESS_INFO_SUCCESS } from './reducers';

export const queryBusinessInfo = (payload: IObject) => ({
  type: BUSINESS_INFO_QUERY_BUSINESS_INFO,
  response: {
    success: BUSINESS_INFO_QUERY_BUSINESS_INFO_SUCCESS,
    failure: BUSINESS_INFO_QUERY_BUSINESS_INFO_FAILED,
  },
  payload,
});
