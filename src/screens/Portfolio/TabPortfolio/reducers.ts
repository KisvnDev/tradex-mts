import { IAction } from 'interfaces/common';

export const QUERY_CLIENT_CASH_BALANCE_SUCCESS = 'QUERY_CLIENT_CASH_BALANCE_SUCCESS';
export const QUERY_CLIENT_CASH_BALANCE_FAILED = 'QUERY_CLIENT_CASH_BALANCE_FAILED';

export const QUERY_PORTFOLIO_LIST_SUCCESS = 'QUERY_PORTFOLIO_LIST_SUCCESS';
export const QUERY_PORTFOLIO_LIST_FAILED = 'QUERY_PORTFOLIO_LIST_FAILED';

const initState: {
  info?: PortfolioInfo;
} & ClientPortfolio = {};
export type PortfolioType = typeof initState;

export function PortfolioReducer(
  state: PortfolioType = initState,
  action: IAction<PortfolioInfo | ClientPortfolio>
): PortfolioType {
  switch (action.type) {
    case QUERY_PORTFOLIO_LIST_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case QUERY_CLIENT_CASH_BALANCE_SUCCESS:
      return {
        ...state,
        info: action.payload as PortfolioInfo,
      };

    default:
      return state;
  }
}
