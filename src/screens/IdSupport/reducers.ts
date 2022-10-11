import { IAction } from 'interfaces/common';

export const SEND_NEED_SUPPORT_SUCCESS = 'SEND_NEED_SUPPORT_SUCCESS';
export const SEND_NEED_SUPPORT_FAILED = 'SEND_NEED_SUPPORT_FAILED';

export function SendIdSupportSuccess(state = false, action: IAction<null>) {
  switch (action.type) {
    case SEND_NEED_SUPPORT_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function SendIdSupportFailed(state = false, action: IAction<null>) {
  switch (action.type) {
    case SEND_NEED_SUPPORT_FAILED:
      return !state;
    default:
      return state;
  }
}
