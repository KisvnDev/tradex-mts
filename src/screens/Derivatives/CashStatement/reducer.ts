import { IAction } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';

export const QUERY_CASH_STATEMENT_SUCCESS = 'QUERY_CASH_STATEMENT_SUCCESS';
export const QUERY_CASH_STATEMENT_FAIL = 'QUERY_CASH_STATEMENT_SUCCESS';

const initState: any = [];

export function CashStatementResult(state: typeof initState = initState, action: IAction<typeof initState>) {
  switch (action.type) {
    case QUERY_CASH_STATEMENT_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export const getSelectedAccount = (state: IState) => state.selectedAccount;
export const getSheetCashStatement = (state: IState) =>
  state.selectedAccount?.type === 'DERIVATIVES' ? state.cashStatement?.listTransactionHistory : state.cashStatement;
export const getBalance = (state: IState) => ({
  endingBalance: state.cashStatement?.endingBalance,
  beginningBalance: state.cashStatement?.beginningBalance,
});
