import { IAction, IObject } from 'interfaces/common';
import { REGISTER_ACCOUNT_FORM } from 'redux-sagas/actions';

export const REGISTER_ACCOUNT_FORM_SUCCESS = 'REGISTER_ACCOUNT_FORM_SUCCESS';
export const RESEND_REGISTER_ACCOUNT_OTP_SUCCESS = 'RESEND_REGISTER_ACCOUNT_OTP_SUCCESS';
export const REGISTER_ACCOUNT_FORM_FAILED = 'REGISTER_ACCOUNT_FORM_FAILED';
export const RESEND_REGISTER_ACCOUNT_OTP_FAILED = 'RESEND_REGISTER_ACCOUNT_OTP_FAILED';
export const REGISTER_ACCOUNT_FORM_SUCCESS_TRIGGER = 'REGISTER_ACCOUNT_FORM_SUCCESS_TRIGGER';
export const REGISTER_ACCOUNT_OTP_SUCCESS_TRIGGER = 'REGISTER_ACCOUNT_OTP_SUCCESS_TRIGGER';
export const REGISTER_ACCOUNT_OTP_FAILED_TRIGGER = 'REGISTER_ACCOUNT_OTP_FAILED_TRIGGER';
export const REGISTER_ACCOUNT_CONFIRM_OTP_FAILED = 'REGISTER_ACCOUNT_CONFIRM_OTP_FAILED';
export const REGISTER_ACCOUNT_CONFIRM_OTP_SUCCESS = 'REGISTER_ACCOUNT_CONFIRM_OTP_SUCCESS';
export const CHECK_REFERRAL_CODE_SUCCESS = 'CHECK_REFERRAL_CODE_SUCCESS';
export const CHECK_REFERRAL_CODE_FAILED = 'CHECK_REFERRAL_CODE_FAILED';

export function RegisterAccountForm(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case REGISTER_ACCOUNT_FORM_SUCCESS:
      return { ...action.payload };
    case REGISTER_ACCOUNT_FORM_FAILED:
      return null;
    default:
      return state;
  }
}

export function RegisterAccountFormRequestInfo(state: IObject = {}, action: IAction<IObject>) {
  switch (action.type) {
    case REGISTER_ACCOUNT_FORM:
      return { ...action.payload };
    default:
      return state;
  }
}

export function RegisterAccountFormSuccessTrigger(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case REGISTER_ACCOUNT_FORM_SUCCESS_TRIGGER:
      return !state;
    default:
      return state;
  }
}

export function RegisterAccountResendOTPSuccessTrigger(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case RESEND_REGISTER_ACCOUNT_OTP_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function RegisterAccountResendOTPData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case RESEND_REGISTER_ACCOUNT_OTP_SUCCESS:
      return { ...action.payload };
    case RESEND_REGISTER_ACCOUNT_OTP_FAILED:
      return null;
    default:
      return state;
  }
}

export function RegisterAccountConfirmOTPSuccessTrigger(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case REGISTER_ACCOUNT_CONFIRM_OTP_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function RegisterAccountConfirmOTPFailedTrigger(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case REGISTER_ACCOUNT_CONFIRM_OTP_FAILED:
      return !state;
    default:
      return state;
  }
}

export function ReferralCodeResponseTrigger(state: boolean = false, action: IAction<null>) {
  switch (action.type) {
    case CHECK_REFERRAL_CODE_SUCCESS:
    case CHECK_REFERRAL_CODE_FAILED:
      return !state;
    default:
      return state;
  }
}

export function ReferralCodeResponse(
  state: { displayName: string; status: boolean } = { displayName: '', status: false },
  action: IAction<IObject>
) {
  switch (action.type) {
    case CHECK_REFERRAL_CODE_SUCCESS:
      return {
        displayName: action.payload.display_name,
        status: true,
      };
    case CHECK_REFERRAL_CODE_FAILED:
      return {
        displayName: '',
        status: false,
      };
    default:
      return state;
  }
}
