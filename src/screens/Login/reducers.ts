import config from 'config';
import { IAction, IObject } from 'interfaces/common';
import { BIOMETRIC_VERIFICATION_FAILED_TRIGGER, BIOMETRIC_VERIFICATION_FAILED_TYPE } from 'redux-sagas/actions';

export const LOGIN_DOMAIN_SUCCESS = 'LOGIN_DOMAIN_SUCCESS';
export const LOGIN_DOMAIN_FAILED = 'LOGIN_DOMAIN_FAILED';
export const GENERATE_NEW_KIS_CARD_SUCCESS = 'GENERATE_NEW_KIS_CARD_SUCCESS';
export const GENERATE_NEW_KIS_CARD_FAILED = 'GENERATE_NEW_KIS_CARD_FAILED';
export const RESET_GENERATE_NEW_KIS_CARD = 'RESET_GENERATE_NEW_KIS_CARD';
export const VERIFY_OTP_SUCCESS = 'VERIFY_OTP_SUCCESS';
export const VERIFY_OTP_RESET = 'VERIFY_OTP_RESET';
export const VERIFY_OTP_FAILED = 'VERIFY_OTP_FAILED';
export const LOGIN_VIEW_MODE_SUCCESS = 'LOGIN_VIEW_MODE_SUCCESS';
export const LOGIN_VIEW_MODE_FAILED = 'LOGIN_VIEW_MODE_FAILED';
export const LOGIN_BIOMETRIC_SUCCESS = 'LOGIN_BIOMETRIC_SUCCESS';
export const LOGIN_BIOMETRIC_FAILED = 'LOGIN_BIOMETRIC_FAILED';
export const RESEND_LOGIN_OTP_SUCCESS = 'RESEND_LOGIN_OTP_SUCCESS';
export const RESEND_LOGIN_OTP_FAILED = 'RESEND_LOGIN_OTP_FAILED';

export interface ILoginResult {
  showOTP: boolean;
  otpIndex?: number;
  registerMobileOtp?: boolean;
  isVerifySuccess?: boolean;
  error?: any;
}
const initialState: ILoginResult = {
  showOTP: false,
  isVerifySuccess: false,
  error: null,
};

export function ResendLoginOTPSuccessTrigger(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case RESEND_LOGIN_OTP_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function LoginResult(state: ILoginResult = initialState, action: IAction<ILoginResult>) {
  switch (action.type) {
    case LOGIN_DOMAIN_SUCCESS:
      return config.usingNewKisCore === false
        ? {
            showOTP: true,
            otpIndex: action.payload.otpIndex,
            registerMobileOtp: action.payload.registerMobileOtp,
            error: null,
          }
        : {
            showOTP: false,
            error: null,
          };
    case VERIFY_OTP_SUCCESS:
      return {
        showOTP: false,
        isVerifySuccess: true,
        error: null,
      };
    case VERIFY_OTP_FAILED:
      return {
        showOTP: false,
        isVerifySuccess: false,
        error: action.payload.error,
      };
    case VERIFY_OTP_RESET:
      return {
        showOTP: false,
        isVerifySuccess: false,
        error: null,
      };
    default:
      return state;
  }
}

export function BiometricVerificationFailedTrigger(state = false, action: IAction<boolean>) {
  switch (action.type) {
    case BIOMETRIC_VERIFICATION_FAILED_TRIGGER:
      return !state;
    default:
      return state;
  }
}

export function BiometricVerificationFailedType(state = '', action: IAction<string>) {
  switch (action.type) {
    case BIOMETRIC_VERIFICATION_FAILED_TYPE:
      return action.payload;
    default:
      return state;
  }
}

export function GenerateKisCardResult(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case GENERATE_NEW_KIS_CARD_SUCCESS:
      return action.payload;
    case RESET_GENERATE_NEW_KIS_CARD:
    case GENERATE_NEW_KIS_CARD_FAILED:
      return null;
    default:
      return state;
  }
}

export function VerifyOTPSuccessTrigger(state = false, action: IAction<boolean>) {
  switch (action.type) {
    case VERIFY_OTP_SUCCESS:
      return !state;
    default:
      return state;
  }
}
