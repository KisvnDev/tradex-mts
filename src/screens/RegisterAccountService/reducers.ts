import { IAction, IObject } from 'interfaces/common';

export const QUERY_BANK_LIST_SUCCESS = 'QUERY_BANK_LIST_SUCCESS';
export const QUERY_BANK_LIST_FAILED = 'QUERY_BANK_LIST_FAILED';
export const QUERY_BANK_BRANCH_SUCCESS = 'QUERY_BANK_BRANCH_SUCCESS';
export const QUERY_BANK_BRANCH_FAILED = 'QUERY_BANK_BRANCH_FAILED';
export const FINISH_REGISTER_ACCOUNT_SUCCESS = 'FINISH_REGISTER_ACCOUNT_SUCCESS';
export const FINISH_REGISTER_ACCOUNT_FAILED = 'FINISH_REGISTER_ACCOUNT_FAILED';

export function BankList(state: IObject[] | null = null, action: IAction<IObject[]>) {
  switch (action.type) {
    case QUERY_BANK_LIST_SUCCESS:
      return action.payload;
    case QUERY_BANK_LIST_FAILED:
      return null;
    default:
      return state;
  }
}

export function BankBranchList(state: IObject[] | null = null, action: IAction<IObject[]>) {
  switch (action.type) {
    case QUERY_BANK_BRANCH_SUCCESS:
      return action.payload;
    case QUERY_BANK_BRANCH_FAILED:
      return null;
    default:
      return state;
  }
}

export function BankListSuccessTrigger(state = false, action: IAction<null>) {
  switch (action.type) {
    case QUERY_BANK_LIST_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function BankBranchListSuccessTrigger(state = false, action: IAction<null>) {
  switch (action.type) {
    case QUERY_BANK_BRANCH_SUCCESS:
      return !state;
    default:
      return state;
  }
}

export function FinishRegisterAccountSuccessTrigger(state = false, action: IAction<null>) {
  switch (action.type) {
    case FINISH_REGISTER_ACCOUNT_SUCCESS:
      return !state;
    default:
      return state;
  }
}
