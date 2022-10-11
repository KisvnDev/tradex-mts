import { IAction, IObject } from 'interfaces/common';

export const ACCOUNT_QUERY_TRANSACTION_STATEMENT_SUCCESS = 'ACCOUNT_QUERY_TRANSACTION_STATEMENT_SUCCESS';
export const ACCOUNT_QUERY_TRANSACTION_STATEMENT_FAILED = 'ACCOUNT_QUERY_TRANSACTION_STATEMENT_FAILED';

export function TransactionStatement(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case ACCOUNT_QUERY_TRANSACTION_STATEMENT_SUCCESS:
      return action.payload ? action.payload : { data: [] };
    case ACCOUNT_QUERY_TRANSACTION_STATEMENT_FAILED:
      return { data: [] };
    default:
      return state;
  }
}
