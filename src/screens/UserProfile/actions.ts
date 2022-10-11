import { IObject } from 'interfaces/common';
import { USER_UPDATE_PROFILE, AWS_GET_SIGNED_DATA, AWS_UPLOAD_IMAGE } from 'redux-sagas/actions';
import {
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAILED,
  AWS_GET_SIGNED_DATA_SUCCESS,
  AWS_GET_SIGNED_DATA_FAILED,
  AWS_UPLOAD_IMAGE_SUCCESS,
  AWS_UPLOAD_IMAGE_FAILED,
} from './reducers';

export const updateProfile = (payload: IObject) => ({
  type: USER_UPDATE_PROFILE,
  response: {
    success: USER_UPDATE_PROFILE_SUCCESS,
    failure: USER_UPDATE_PROFILE_FAILED,
  },
  payload,
});

export const getSignedData = (payload: IObject) => ({
  type: AWS_GET_SIGNED_DATA,
  response: {
    success: AWS_GET_SIGNED_DATA_SUCCESS,
    failure: AWS_GET_SIGNED_DATA_FAILED,
  },
  showLoading: true,
  payload,
});

export const uploadImage = (payload: IObject) => ({
  type: AWS_UPLOAD_IMAGE,
  response: {
    success: AWS_UPLOAD_IMAGE_SUCCESS,
    failure: AWS_UPLOAD_IMAGE_FAILED,
  },
  payload,
});
