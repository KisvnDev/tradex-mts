import { IObject } from 'interfaces/common';
import { ACCOUNT_CHANGE_HTS_PASSWORD } from 'redux-sagas/actions';
import { ACCOUNT_CHANGE_HTS_PASSWORD_FAILED, ACCOUNT_CHANGE_HTS_PASSWORD_SUCCESS } from './reducers';

export const changeHTSPassword = (payload: IObject) => ({
  type: ACCOUNT_CHANGE_HTS_PASSWORD,
  response: {
    success: ACCOUNT_CHANGE_HTS_PASSWORD_SUCCESS,
    failure: ACCOUNT_CHANGE_HTS_PASSWORD_FAILED,
  },
  payload,
  showLoading: true,
});
