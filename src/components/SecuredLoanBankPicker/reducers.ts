import { IAction } from 'interfaces/common';

export const SECURED_LOAN_BANK_QUERY_SUCCESS = 'SECURED_LOAN_BANK_QUERY_SUCCESS';
export const SECURED_LOAN_BANK_QUERY_FAILED = 'SECURED_LOAN_BANK_QUERY_FAILED';
export const SECURED_LOAN_BANK = 'SECURED_LOAN_BANK';

export interface ISecuredLoanBank {
  bankCode: string;
  bankName: string;
}

export function SecuredLoanBanks(state: ISecuredLoanBank[] = [], action: IAction<ISecuredLoanBank[]>) {
  switch (action.type) {
    case SECURED_LOAN_BANK_QUERY_SUCCESS:
      return action.payload.slice(0);
    default:
      return state;
  }
}

export function SecuredLoanBank(state: ISecuredLoanBank | null = null, action: IAction<ISecuredLoanBank>) {
  switch (action.type) {
    case SECURED_LOAN_BANK:
      return { ...action.payload };
    default:
      return state;
  }
}
