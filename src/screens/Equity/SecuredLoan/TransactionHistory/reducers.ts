import { IAction, IObject } from 'interfaces/common';

export const QUERY_SECURED_LOAN_HISTORY_SUCCESS = 'QUERY_SECURED_LOAN_HISTORY_SUCCESS';
export const QUERY_SECURED_LOAN_HISTORY_FAILED = 'QUERY_SECURED_LOAN_HISTORY_FAILED';

export function SecuredLoanHistory(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_SECURED_LOAN_HISTORY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
