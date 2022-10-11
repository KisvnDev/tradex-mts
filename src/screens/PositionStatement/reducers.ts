import { IAction } from 'interfaces/common';

export const QUERY_POSITION_STATEMENT_LIST_SUCCESS = 'QUERY_PORTFOLIO_LIST_SUCCESS';
export const QUERY_POSITION_STATEMENT_LIST_FAILED = 'QUERY_PORTFOLIO_LIST_FAILED';

const initState: StockStatementEnquiry = [];
export type PositionStatementType = typeof initState;

export function PositionStatementReducer(
  state: PositionStatementType = initState,
  action: IAction<StockStatementEnquiry>
): PositionStatementType {
  switch (action.type) {
    case QUERY_POSITION_STATEMENT_LIST_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
