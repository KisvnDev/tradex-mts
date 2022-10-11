import { IAccount, IAction } from 'interfaces/common';

export const GLOBAL_SELECTED_ACCOUNT = 'GLOBAL_SELECTED_ACCOUNT';

export function SelectedAccount(state: IAccount | null = null, action: IAction<IAccount>) {
  switch (action.type) {
    case GLOBAL_SELECTED_ACCOUNT:
      return { ...action.payload };
    default:
      return state;
  }
}
