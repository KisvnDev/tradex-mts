import { IObject, IAction } from 'interfaces/common';

export const ACCOUNT_BALANCE_QUERY_ACCOUNT_BALANCE_SUCCESS = 'ACCOUNT_BALANCE_QUERY_ACCOUNT_BALANCE_SUCCESS';

export function EquityAccountBalance(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case ACCOUNT_BALANCE_QUERY_ACCOUNT_BALANCE_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
