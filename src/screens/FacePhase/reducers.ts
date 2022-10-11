import { IAction, IObject } from 'interfaces/common';

export const GET_FACE_ACTION_SUCCESS = 'GET_FACE_ACTION_SUCCESS';
export const GET_FACE_ACTION_FAILED = 'GET_FACE_ACTION_FAILED';

export function GetFaceActionSuccessTrigger(state = false, action: IAction<null>) {
  switch (action.type) {
    case GET_FACE_ACTION_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function GetFaceActionInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case GET_FACE_ACTION_SUCCESS:
      return { ...action.payload };
    case GET_FACE_ACTION_FAILED:
      return null;
    default:
      return state;
  }
}
