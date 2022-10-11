import { IObject, IAction } from 'interfaces/common';

export const QUERY_TRANSACTION_INFO_SUCCESS = 'QUERY_TRANSACTION_INFO_SUCCESS';
export const QUERY_TRANSACTION_INFO_FAILED = 'QUERY_TRANSACTION_INFO_FAILED';

export function TransactionInfo(state: IObject[] | null = null, action: IAction<IObject[]>) {
  switch (action.type) {
    case QUERY_TRANSACTION_INFO_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
