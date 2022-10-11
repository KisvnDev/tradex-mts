import { IAction, IObject } from 'interfaces/common';

export const CASH_IN_ADVANCE_QUERY_FAILED = 'CASH_IN_ADVANCE_QUERY_FAILED';
export const CASH_IN_ADVANCE_QUERY_SUCCESS = 'CASH_IN_ADVANCE_QUERY_SUCCESS';

export const CALCULATE_INTEREST_QUERY_SUCCESS = 'CALCULATE_INTEREST_QUERY_SUCCESS';
export const CALCULATE_INTEREST_QUERY_FAILED = 'CALCULATE_INTEREST_QUERY_FAILED';

export const SUBMIT_ADVANCE_PAYMENT_CREATION_FAILED = 'SUBMIT_ADVANCE_PAYMENT_CREATION_FAILED';
export const SUBMIT_ADVANCE_PAYMENT_CREATION_SUCCESS = 'SUBMIT_ADVANCE_PAYMENT_CREATION_SUCCESS';

export const CHECK_TIME_SUCCESS = 'CHECK_TIME_SUCCESS';
export const CHECK_TIME_FAILED = 'CHECK_TIME_FAILED';
export const CHECK_TIME_SUBMIT_ADVANCE_PAYMENT_RESET = 'CHECK_TIME_SUBMIT_ADVANCE_PAYMENT_RESET';

export interface IICACashChildT {
  feeTax?: number;
  id: string;
  mvAvailableAmount: number;
  mvOrderID: string;
  mvSettleDay: string;
  netSoldAmount: number;
  paymentDate: string;
  soldDate: string;
  stock: string;
  value: number;
  volume: number;
  mvContractID: string;
  mvBankID: string;
}

export interface ICashInAdvance {
  availableCashAdvance: number;
  interestRate: number;
  maxFee: number;
  t0AdvAvailable: number;
  t0Days: number;
  t1AdvAvailable: number;
  t1Days: number;
  t2AdvAvailable: number;
  t2Days: number;
  item?: IICACashChildT;
}

export interface CalculateInterest {
  errorCode: string;
  errorMessage: string;
  mvInterestAmt: string;
  mvResult: string;
  returnCode: number;
  totalCount: number;
}

export function CashInAdvance(state: ICashInAdvance | null = null, action: IAction<ICashInAdvance>) {
  switch (action.type) {
    case CASH_IN_ADVANCE_QUERY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CalculateInterest(state: CalculateInterest | null = null, action: IAction<ICashInAdvance>) {
  switch (action.type) {
    case CALCULATE_INTEREST_QUERY_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function CheckTimeSubmitAdvancePayment(
  state: { result: boolean } | null = null,
  action: IAction<{ result: boolean }>
) {
  switch (action.type) {
    case CHECK_TIME_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function SubmitCashInAdvance(state: { isSuccess: boolean } | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case SUBMIT_ADVANCE_PAYMENT_CREATION_SUCCESS:
    case SUBMIT_ADVANCE_PAYMENT_CREATION_FAILED:
      return { ...action.payload };
    default:
      return state;
  }
}
