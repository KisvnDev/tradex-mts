import { IAction, IUserExtraInfo, IUserInfo } from 'interfaces/common';
export const GLOBAL_USERINFO = 'GLOBAL_USERINFO';
export const GLOBAL_USER_EXTRA_INFO = 'GLOBAL_USER_EXTRA_INFO';

export function UserInfo(state: IUserInfo | null = null, action: IAction<IUserInfo>) {
  switch (action.type) {
    case GLOBAL_USERINFO:
      return { ...action.payload };
    default:
      return state;
  }
}

export const defaultUserExtraInfo: IUserExtraInfo = {};

export function UserExtraInfo(
  state: IUserExtraInfo = defaultUserExtraInfo,
  action: IAction<IUserExtraInfo>
): IUserExtraInfo {
  switch (action.type) {
    case GLOBAL_USER_EXTRA_INFO:
      return { ...action.payload };
    default:
      return state;
  }
}
