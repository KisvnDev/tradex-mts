import { IObject } from 'interfaces/common';
import {
  REGISTER_ACCOUNT_CONFIRM_OTP,
  REGISTER_ACCOUNT_FORM,
  RESEND_REGISTER_ACCOUNT_OTP,
  CHECK_REFERRAL_CODE,
} from 'redux-sagas/actions';
import {
  REGISTER_ACCOUNT_FORM_FAILED,
  REGISTER_ACCOUNT_FORM_SUCCESS,
  REGISTER_ACCOUNT_FORM_SUCCESS_TRIGGER,
  RESEND_REGISTER_ACCOUNT_OTP_SUCCESS,
  RESEND_REGISTER_ACCOUNT_OTP_FAILED,
  REGISTER_ACCOUNT_CONFIRM_OTP_SUCCESS,
  REGISTER_ACCOUNT_CONFIRM_OTP_FAILED,
  CHECK_REFERRAL_CODE_SUCCESS,
  CHECK_REFERRAL_CODE_FAILED,
} from './reducers';

export const registerAccount = (payload: IObject) => ({
  type: REGISTER_ACCOUNT_FORM,
  response: {
    success: REGISTER_ACCOUNT_FORM_SUCCESS,
    failure: REGISTER_ACCOUNT_FORM_FAILED,
    successTrigger: REGISTER_ACCOUNT_FORM_SUCCESS_TRIGGER,
  },
  payload,
  showLoading: true,
});

export const resendRegisterAccountOtp = (payload: IObject) => ({
  type: RESEND_REGISTER_ACCOUNT_OTP,
  response: {
    success: RESEND_REGISTER_ACCOUNT_OTP_SUCCESS,
    failure: RESEND_REGISTER_ACCOUNT_OTP_FAILED,
  },
  payload,
  showLoading: true,
});

export const registerAccountConfirmOTP = (payload: IObject) => ({
  type: REGISTER_ACCOUNT_CONFIRM_OTP,
  response: {
    success: REGISTER_ACCOUNT_CONFIRM_OTP_SUCCESS,
    failure: REGISTER_ACCOUNT_CONFIRM_OTP_FAILED,
  },
  payload,
  showLoading: true,
});

export const checkReferralCode = (payload: IObject) => ({
  type: CHECK_REFERRAL_CODE,
  response: {
    success: CHECK_REFERRAL_CODE_SUCCESS,
    failure: CHECK_REFERRAL_CODE_FAILED,
  },
  payload,
  showLoading: true,
});
