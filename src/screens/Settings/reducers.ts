import { IObject, IAction } from 'interfaces/common';
import { ILoginResult } from 'screens/Login/reducers';

export const REGISTER_BIOMETRIC_SUCCESS = 'REGISTER_BIOMETRIC_SUCCESS';
export const REGISTER_BIOMETRIC_FAILED = 'REGISTER_BIOMETRIC_FAILED';
export const VERIFY_OTP_BIOMETRIC_SUCCESS = 'VERIFY_OTP_BIOMETRIC_SUCCESS';
export const VERIFY_OTP_BIOMETRIC_FAILED = 'VERIFY_OTP_BIOMETRIC_FAILED';
export const QUERY_USING_BIOMETRIC_STATUS_SUCCESS = 'QUERY_USING_BIOMETRIC_STATUS_SUCCESS';
export const QUERY_USING_BIOMETRIC_STATUS_FAILED = 'QUERY_USING_BIOMETRIC_STATUS_FAILED';

export function RegisterBiometric(
  state: ILoginResult = { showOTP: false },
  action: IAction<IObject>
) {
  switch (action.type) {
    case REGISTER_BIOMETRIC_SUCCESS:
      return {
        showOTP: true,
        otpIndex: action.payload.index,
        biometricId: action.payload.biometricId,
      };
    case REGISTER_BIOMETRIC_FAILED:
    case VERIFY_OTP_BIOMETRIC_SUCCESS:
      return {
        showOTP: false,
      };
    default:
      return state;
  }
}

export function RegisterBiometricSuccess(
  state: boolean = false,
  action: IAction<null>
) {
  switch (action.type) {
    case VERIFY_OTP_BIOMETRIC_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function RegisterBiometricTrigger(
  state: boolean = false,
  action: IAction<null>
) {
  switch (action.type) {
    case REGISTER_BIOMETRIC_SUCCESS:
    case REGISTER_BIOMETRIC_FAILED:
      return !state;
    default:
      return state;
  }
}

export function VerifyOTPBiometricTrigger(
  state: boolean = false,
  action: IAction<null>
) {
  switch (action.type) {
    case VERIFY_OTP_BIOMETRIC_SUCCESS:
    case VERIFY_OTP_BIOMETRIC_FAILED:
      return !state;
    default:
      return state;
  }
}

export function UsingTouchFaceId(
  state: boolean = false,
  action: IAction<boolean>
) {
  switch (action.type) {
    case QUERY_USING_BIOMETRIC_STATUS_SUCCESS:
      return action.payload;
    case QUERY_USING_BIOMETRIC_STATUS_FAILED:
      return false;
    default:
      return state;
  }
}