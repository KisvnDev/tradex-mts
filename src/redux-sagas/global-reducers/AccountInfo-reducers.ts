import { IAction, IAccountInfo } from 'interfaces/common';

export const GLOBAL_ACCOUNT_INFO = 'GLOBAL_ACCOUNT_INFO';

export function AccountInfo(state: IAccountInfo | null = null, action: IAction<IAccountInfo>) {
  switch (action.type) {
    case GLOBAL_ACCOUNT_INFO:
      return action.payload;
    default:
      return state;
  }
}
