import { IAccount, IAction } from 'interfaces/common';

export const GLOBAL_ACCOUNT_LIST = 'GLOBAL_ACCOUNT_LIST';

export function AccountList(state: IAccount[] = [], action: IAction<IAccount[]>) {
  switch (action.type) {
    case GLOBAL_ACCOUNT_LIST:
      return action.payload ? action.payload.slice(0) : [];
    default:
      return state;
  }
}
