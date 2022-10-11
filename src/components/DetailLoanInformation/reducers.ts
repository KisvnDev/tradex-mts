import { IObject, IAction } from 'interfaces/common';

export const ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_SUCCESS = 'ACCOUNT_QUERY_EQUITY_DETAIL_LOAN_INFO_SUCCESS';
export const ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_FAILED = 'ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_FAILED';

export function EquityLoanHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case ACCOUNT_QUERY_EQUITY_LOAN_HISTORY_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
