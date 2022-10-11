import config from 'config';
import { IObject } from 'interfaces/common';
import {
  SETTINGS_CHANGE_SETTINGS,
  REGISTER_BIOMETRIC,
  AUTHENTICATION_VERIFY_OTP_BIOMETRIC,
  QUERY_USING_BIOMETRIC_STATUS,
} from 'redux-sagas/actions';
import {
  QUERY_USING_BIOMETRIC_STATUS_FAILED,
  QUERY_USING_BIOMETRIC_STATUS_SUCCESS,
  REGISTER_BIOMETRIC_FAILED,
  REGISTER_BIOMETRIC_SUCCESS,
  VERIFY_OTP_BIOMETRIC_FAILED,
  VERIFY_OTP_BIOMETRIC_SUCCESS,
} from './reducers';

export const changeAccountSettings = (payload: IObject) => ({
  type: SETTINGS_CHANGE_SETTINGS,
  payload,
});

export const registerBiometric = (payload: IObject) => ({
  type: REGISTER_BIOMETRIC,
  response: {
    success: REGISTER_BIOMETRIC_SUCCESS,
    failure: REGISTER_BIOMETRIC_FAILED,
  },
  showLoading: !!config.usingNewKisCore,
  payload,
});

export const verifyOTPBiometric = (payload: IObject) => ({
  type: AUTHENTICATION_VERIFY_OTP_BIOMETRIC,
  response: {
    success: VERIFY_OTP_BIOMETRIC_SUCCESS,
    failure: VERIFY_OTP_BIOMETRIC_FAILED,
  },
  showLoading: true,
  payload,
});

export const getUsingTouchFaceIdStatus = (payload: IObject) => ({
  type: QUERY_USING_BIOMETRIC_STATUS,
  response: {
    success: QUERY_USING_BIOMETRIC_STATUS_SUCCESS,
    failure: QUERY_USING_BIOMETRIC_STATUS_FAILED,
  },
  payload,
});
