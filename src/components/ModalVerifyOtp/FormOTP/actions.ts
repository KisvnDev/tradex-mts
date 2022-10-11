import { IObject } from 'interfaces/common';
import {
  AUTHENTICATION_VERIFY_OTP,
  GENERATE_NEW_KIS_CARD,
  NOTIFICATION_MOBILE_OTP,
  SETTINGS_CHANGE_SETTINGS,
} from 'redux-sagas/actions';
import {
  GENERATE_NEW_KIS_CARD_FAILED,
  GENERATE_NEW_KIS_CARD_SUCCESS,
  RESET_GENERATE_NEW_KIS_CARD,
  VERIFY_OTP_FAILED,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_RESET,
} from 'screens/Login/reducers';
import { NOTIFICATION_MOBILE_OTP_FAILED, NOTIFICATION_MOBILE_OTP_SUCCESS } from '../reducers';

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

export const changeAccountSettings = (payload: IObject) => ({
  type: SETTINGS_CHANGE_SETTINGS,
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

export interface IPayloadVerifyOTP {
  wordMatrixValue: string;
  verifyType: string;
  wordMatrixId: Object | undefined;
  expireTime?: number;
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

export const resetErrorVerifyOtp = () => ({
  type: VERIFY_OTP_RESET,
});
