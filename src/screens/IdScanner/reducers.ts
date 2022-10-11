import { IAction, IObject } from 'interfaces/common';

export const SEND_ID_IMAGE_SUCCESS = 'SEND_ID_IMAGE_SUCCESS';
export const SEND_ID_IMAGE_FAILED = 'SEND_ID_IMAGE_FAILED';

export function IdImageInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case SEND_ID_IMAGE_SUCCESS:
      return { ...action.payload };
    case SEND_ID_IMAGE_FAILED:
      return null;
    default:
      return state;
  }
}

export function SendIdImageSuccessTrigger(state = false, action: IAction<null>) {
  switch (action.type) {
    case SEND_ID_IMAGE_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function SendIdImageFailedTrigger(state = false, action: IAction<null>) {
  switch (action.type) {
    case SEND_ID_IMAGE_FAILED:
      return !state;
    default:
      return state;
  }
}
