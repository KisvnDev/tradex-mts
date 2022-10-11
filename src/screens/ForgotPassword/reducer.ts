import { IAction } from 'interfaces/common';
import {
  RESET_PASSWORD_FAIlED,
  RESET_PASSWORD_SUCCESS,
  COMFIRM_ACCOUNT_NO_FAIlED,
  COMFIRM_ACCOUNT_NO_SUCCESS,
  COMFIRM_ACCOUNT_NO_RESET,
  RESET_PASSWORD_RESET,
} from './actions';

export interface IStateForgotPassword {
  data?: any;
  error?: any;
}

export function ConfirmAccountReducer(state: IStateForgotPassword = { data: null, error: null }, action: IAction<any>) {
  switch (action.type) {
    case COMFIRM_ACCOUNT_NO_SUCCESS:
      return {
        data: { ...action.payload },
        error: null,
      };

    case COMFIRM_ACCOUNT_NO_RESET:
      return {
        data: null,
        error: null,
      };

    case COMFIRM_ACCOUNT_NO_FAIlED:
      return {
        error: { ...action.payload },
        data: null,
      };

    default:
      return state;
  }
}
//024269025
export function ResetPasswordReducer(state: IStateForgotPassword = { data: null, error: null }, action: IAction<any>) {
  switch (action.type) {
    case RESET_PASSWORD_SUCCESS:
      return {
        data: { ...action.payload },
        error: null,
      };
    case RESET_PASSWORD_RESET:
      return {
        data: null,
        error: null,
      };

    case RESET_PASSWORD_FAIlED:
      return {
        error: { ...action.payload },
        data: null,
      };

    default:
      return state;
  }
}
