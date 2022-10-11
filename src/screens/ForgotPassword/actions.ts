import { RESET_PASSWORD, COMFIRM_ACCOUNT_NO } from 'redux-sagas/actions';

export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAIlED = 'RESET_PASSWORD_FAIlED';
export const RESET_PASSWORD_RESET = 'RESET_PASSWORD_RESET';

export const COMFIRM_ACCOUNT_NO_SUCCESS = 'COMFIRM_ACCOUNT_NO_SUCCESS';
export const COMFIRM_ACCOUNT_NO_FAIlED = 'COMFIRM_ACCOUNT_NO_FAIlED';
export const COMFIRM_ACCOUNT_NO_RESET = 'COMFIRM_ACCOUNT_NO_RESET';

interface IResetPassword {
  clientID: string;
  otpValue: string;
  newPassword: string;
}

export const resetPassword = (payload: IResetPassword) => {
  return {
    type: RESET_PASSWORD,
    response: {
      success: RESET_PASSWORD_SUCCESS,
      failure: RESET_PASSWORD_FAIlED,
    },
    payload,
    showLoading: true,
  };
};

interface TConfirmAccountNo {
  clientID: string;
  idCardNo: string;
  email?: string;
  phoneNo?: string;
  locale?: string; //vi, en, ko (language used to send sms)
  birthDay?: string; //yyyyMMdd
}

export const confirmAccountNo = (payload: TConfirmAccountNo) => {
  return {
    type: COMFIRM_ACCOUNT_NO,
    response: {
      success: COMFIRM_ACCOUNT_NO_SUCCESS,
      failure: COMFIRM_ACCOUNT_NO_FAIlED,
    },
    payload,
    showLoading: true,
  };
};

export const resetConfirmAccount = () => {
  return {
    type: COMFIRM_ACCOUNT_NO_RESET,
  };
};

export const resetPassData = () => {
  return {
    type: RESET_PASSWORD_RESET,
  };
};
