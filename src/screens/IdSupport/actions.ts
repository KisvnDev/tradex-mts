import { IObject } from 'interfaces/common';
import { SEND_NEED_SUPPORT } from 'redux-sagas/actions';
import { SEND_NEED_SUPPORT_SUCCESS, SEND_NEED_SUPPORT_FAILED } from './reducers';

export const sendSupport = (payload: IObject) => ({
  type: SEND_NEED_SUPPORT,
  response: {
    success: SEND_NEED_SUPPORT_SUCCESS,
    failure: SEND_NEED_SUPPORT_FAILED,
  },
  payload,
  showLoading: true,
});
