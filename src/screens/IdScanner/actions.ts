import { IObject } from 'interfaces/common';
import { SEND_ID_IMAGE } from 'redux-sagas/actions';
import { SEND_ID_IMAGE_FAILED, SEND_ID_IMAGE_SUCCESS } from './reducers';

export const sendIdImage = (payload: IObject) => ({
  type: SEND_ID_IMAGE,
  response: {
    success: SEND_ID_IMAGE_SUCCESS,
    failure: SEND_ID_IMAGE_FAILED,
  },
  showLoading: true,
  payload,
});
