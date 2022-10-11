import { IObject } from 'interfaces/common';
import { RIGHTS_SUBSCRIPTION_QUERY_DETAIL, RIGHTS_SUBSCRIPTION_REGISTER } from 'redux-sagas/actions';
import {
  QUERY_RIGHTS_DETAIL_FAILED,
  QUERY_RIGHTS_DETAIL_SUCCESS,
  RIGHTS_SUBSCRIPTION_REGISTER_FAILED,
  RIGHTS_SUBSCRIPTION_REGISTER_SUCCESS,
} from './reducers';

export const queryRightsDetail = (payload: IObject) => ({
  type: RIGHTS_SUBSCRIPTION_QUERY_DETAIL,
  response: {
    success: QUERY_RIGHTS_DETAIL_SUCCESS,
    failure: QUERY_RIGHTS_DETAIL_FAILED,
  },
  payload,
});

export const requestRightsSubscription = (payload: IObject) => ({
  type: RIGHTS_SUBSCRIPTION_REGISTER,
  response: {
    success: RIGHTS_SUBSCRIPTION_REGISTER_SUCCESS,
    failure: RIGHTS_SUBSCRIPTION_REGISTER_FAILED,
  },
  payload,
  showLoading: true,
});
