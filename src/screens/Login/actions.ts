import { IObject } from 'interfaces/common';
import {
  AUTHENTICATION_LOGIN_DOMAIN,
  AUTHENTICATION_VERIFY_OTP,
  AUTHENTICATION_LOGIN_VIEW_MODE,
  COMMON_TOGGLE_LOADING,
  AUTHENTICATION_LOGIN_BIOMETRIC,
  RESEND_LOGIN_OTP,
} from 'redux-sagas/actions';
import {
  LOGIN_DOMAIN_SUCCESS,
  LOGIN_DOMAIN_FAILED,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILED,
  LOGIN_VIEW_MODE_SUCCESS,
  LOGIN_VIEW_MODE_FAILED,
  LOGIN_BIOMETRIC_SUCCESS,
  LOGIN_BIOMETRIC_FAILED,
  RESEND_LOGIN_OTP_SUCCESS,
  RESEND_LOGIN_OTP_FAILED,
} from './reducers';

export const loginDomain = (payload: IObject) => ({
  type: AUTHENTICATION_LOGIN_DOMAIN,
  response: {
    success: LOGIN_DOMAIN_SUCCESS,
    failure: LOGIN_DOMAIN_FAILED,
  },
  showLoading: true,
  payload,
});

export const resendLoginOtp = (payload: IObject) => ({
  type: RESEND_LOGIN_OTP,
  response: {
    success: RESEND_LOGIN_OTP_SUCCESS,
    failure: RESEND_LOGIN_OTP_FAILED,
  },
  showLoading: true,
  payload,
});

export const verifyOTP = (payload: IObject) => ({
  type: AUTHENTICATION_VERIFY_OTP,
  response: {
    success: VERIFY_OTP_SUCCESS,
    failure: VERIFY_OTP_FAILED,
  },
  showLoading: true,
  payload,
});

export const loginViewMode = (payload: IObject) => ({
  type: AUTHENTICATION_LOGIN_VIEW_MODE,
  response: {
    success: LOGIN_VIEW_MODE_SUCCESS,
    failure: LOGIN_VIEW_MODE_FAILED,
  },
  showLoading: true,
  payload,
});

export const hideLoader = () => ({
  type: COMMON_TOGGLE_LOADING,
  hideLoading: true,
});

export const loginBiometric = (payload: IObject) => ({
  type: AUTHENTICATION_LOGIN_BIOMETRIC,
  response: {
    success: LOGIN_BIOMETRIC_SUCCESS,
    failure: LOGIN_BIOMETRIC_FAILED,
  },
  showLoading: true,
  payload,
});
