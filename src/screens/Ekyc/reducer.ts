import { IAction, IEkycParams } from 'interfaces/common';
import { CHECK_ID } from 'redux-sagas/actions';

export const EKYC_REGISTER_SUCCESS = 'EKYC_REGISTER_SUCCESS';
export const EKYC_REGISTER_FAILED = 'EKYC_REGISTER_FAILED';
export const CHECK_ID_SUCCESS = 'CHECK_ID_SUCCESS';
export const CHECK_ID_FAILED = 'CHECK_ID_FAILED';
export const CHANGE_EKYC_PARAMS = 'CHANGE_EKYC_PARAMS';

export function EkycRegisterReducer(state: { eKycId: number } | null = null, action: IAction<null>) {
  switch (action.type) {
    case EKYC_REGISTER_SUCCESS:
      return {
        eKycId: action.payload,
      };
    default:
      return state;
  }
}

export function EkycCheckID(state: { loading: boolean; result?: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case CHECK_ID:
      return { loading: true };
    case CHECK_ID_SUCCESS:
      return { loading: false, result: true };
    case CHECK_ID_FAILED:
      return { loading: false, result: false };
    default:
      return state;
  }
}

export function EkycRegisterParams(state: IEkycParams = {}, action: IAction<IEkycParams>) {
  switch (action.type) {
    case CHANGE_EKYC_PARAMS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
