import { IObject, IAction } from 'interfaces/common';

export const QUERY_AVAILABLE_SECURED_LOAN_SUCCESS = 'QUERY_AVAILABLE_SECURED_LOAN_SUCCESS';
export const QUERY_AVAILABLE_SECURED_LOAN_FAILED = 'QUERY_AVAILABLE_SECURED_LOAN_FAILED';

export function SecuredLoanAvailable(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case QUERY_AVAILABLE_SECURED_LOAN_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}
