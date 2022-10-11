import { IObject } from 'interfaces/common';
import {
  AUTHENTICATION_VERIFY_OTP,
  GENERATE_NEW_KIS_CARD,
  NOTIFICATION_MOBILE_OTP,
  RESEND_LOGIN_OTP,
  SETTINGS_CHANGE_SETTINGS,
} from 'redux-sagas/actions';
import {
  GENERATE_NEW_KIS_CARD_FAILED,
  GENERATE_NEW_KIS_CARD_SUCCESS,
  RESEND_LOGIN_OTP_FAILED,
  RESEND_LOGIN_OTP_SUCCESS,
  RESET_GENERATE_NEW_KIS_CARD,
  VERIFY_OTP_FAILED,
  VERIFY_OTP_SUCCESS,
} from 'screens/Login/reducers';
import { NOTIFICATION_MOBILE_OTP_FAILED, NOTIFICATION_MOBILE_OTP_SUCCESS } from './reducers';

export const resendLoginOtp = (payload: IObject) => ({
  type: RESEND_LOGIN_OTP,
  response: {
    success: RESEND_LOGIN_OTP_SUCCESS,
    failure: RESEND_LOGIN_OTP_FAILED,
  },
  showLoading: true,
  payload,
});

export const changeAccountSettings = (payload: IObject) => ({
  type: SETTINGS_CHANGE_SETTINGS,
  payload,
});

export const generateNewKisCard = () => ({
  type: GENERATE_NEW_KIS_CARD,
  response: {
    success: GENERATE_NEW_KIS_CARD_SUCCESS,
    failure: GENERATE_NEW_KIS_CARD_FAILED,
  },
});

export const resetGenerateNewKisCard = () => ({
  type: RESET_GENERATE_NEW_KIS_CARD,
});

export interface IMatrix {
  key: string;
  value: string;
}

export interface IPayloadVerifyOTP {
  wordMatrixValue?: string;
  verifyType?: string;
  wordMatrixId?: Object | undefined;
  expireTime?: number;
  issNo?: string;
  matrix?: IMatrix[];
  accountNumber?: string;
}

export const verifyOTP = (payload: IPayloadVerifyOTP) => ({
  type: AUTHENTICATION_VERIFY_OTP,
  response: {
    success: VERIFY_OTP_SUCCESS,
    failure: VERIFY_OTP_FAILED,
  },
  showLoading: true,
  payload,
});

export const notificationMobileOTP = (payload: IObject) => ({
  type: NOTIFICATION_MOBILE_OTP,
  response: {
    success: NOTIFICATION_MOBILE_OTP_SUCCESS,
    failure: NOTIFICATION_MOBILE_OTP_FAILED,
  },
  payload,
});
