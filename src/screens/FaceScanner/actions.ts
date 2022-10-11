import { IObject } from 'interfaces/common';
import { SEND_FACE_IMAGES } from 'redux-sagas/actions';
import { SEND_FACE_IMAGES_FAILED, SEND_FACE_IMAGES_SUCCESS } from './reducers';

export const sendFaceImages = (payload: IObject) => ({
  type: SEND_FACE_IMAGES,
  response: {
    success: SEND_FACE_IMAGES_SUCCESS,
    failure: SEND_FACE_IMAGES_FAILED,
  },
  showLoading: true,
  payload,
});
