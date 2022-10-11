import { IObject } from 'interfaces/common';
import { ACCOUNT_CHANGE_ORDER_PASSWORD } from 'redux-sagas/actions';
import { ACCOUNT_CHANGE_ORDER_PASSWORD_FAILED, ACCOUNT_CHANGE_ORDER_PASSWORD_SUCCESS } from './reducers';

export const changeOrderPassword = (payload: IObject) => ({
  type: ACCOUNT_CHANGE_ORDER_PASSWORD,
  response: {
    success: ACCOUNT_CHANGE_ORDER_PASSWORD_SUCCESS,
    failure: ACCOUNT_CHANGE_ORDER_PASSWORD_FAILED,
  },
  payload,
  showLoading: true,
});
