import { IObject, IAction } from 'interfaces/common';

export const DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_SUMMARY_SUCCESS = 'DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_SUMMARY_SUCCESS';
export const DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_EQUITY_SUCCESS = 'DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_EQUITY_SUCCESS';

export function DerivativesAccountSummary(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_SUMMARY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function DerivativesAccountEquity(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_ACCOUNT_EQUITY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
