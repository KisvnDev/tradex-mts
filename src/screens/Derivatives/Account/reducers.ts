import { IAction } from 'interfaces/common';

export const DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE_SUCCESS = 'DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE_SUCCESS';
export const DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE_FAILED = 'DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE_FAILED';

export interface ICashBalanceState {
  accountSummary: IAccountSummaryDetail;
  portfolioAssessment: IPortfolioAssessment;
  cashInformation: ICashInformation;
}

export interface IAccountSummaryDetail {
  totalEquity: number;
  accountBalance: number;
  commission_tax: string;
  interest: number;
  extLoan: number;
  deliveryAmount: number;
  floatingPL_tradingPL: string;
  totalPL: number;
  minReserve: number;
  marginable: number;
  rcCall: number;
  cash_nonCash: string;
}

export interface IPortfolioAssessment {
  internal: IPortfolioAssessmentInternal;
  exchange: IPortfolioAssessmentExchange;
}

interface IPortfolioAssessmentInternal {
  initialMargin: number;
  spreadMargin: number;
  deliveryMargin: number;
  marginReq: number;
  accountRatio: number;
  warning123: string;
  marginCall: number;
}

interface IPortfolioAssessmentExchange {
  initialMargin: number;
  spreadMargin: number;
  deliveryMargin: number;
  marginReq: number;
  accountRatio: number;
  warning123: string;
  marginCall: number;
}

export interface ICashInformation {
  internal: ICashInformationInternal;
  exchange: ICashInformationInternal;
}

interface ICashInformationInternal {
  cash: number;
  totalValue: number;
  cashWithdrawable: number;
  EE: number;
}

export function DerivativesAccountCashBalance(
  state: ICashBalanceState | null = null,
  action: IAction<ICashBalanceState>
) {
  switch (action.type) {
    case DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE_SUCCESS:
      return action.payload ? { ...action.payload } : null;
    case DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE_FAILED:
      return null;
    default:
      return state;
  }
}
