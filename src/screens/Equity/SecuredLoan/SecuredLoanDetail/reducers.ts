import { IObject, IAction } from 'interfaces/common';

export const QUERY_DETAIL_SECURED_LOAN_SUCCESS = 'QUERY_DETAIL_SECURED_LOAN_SUCCESS';
export const QUERY_DETAIL_SECURED_LOAN_FAILED = 'QUERY_DETAIL_SECURED_LOAN_FAILED';

export const SECURED_LOAN_REGISTER_SUCCESS = 'SECURED_LOAN_REGISTER_SUCCESS';
export const SECURED_LOAN_REGISTER_FAILED = 'SECURED_LOAN_REGISTER_FAILED';

export function SecuredLoanDetail(state: IObject[] = [], action: IAction<IObject[]>) {
  switch (action.type) {
    case QUERY_DETAIL_SECURED_LOAN_SUCCESS:
      return action.payload ? action.payload.slice(0) : [];
    default:
      return state;
  }
}

export function SecuredLoanRegisterResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case SECURED_LOAN_REGISTER_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}
