import { IAction } from 'interfaces/common';

export const QUERY_BANK_INFO_IICA_SUCCESS = 'QUERY_BANK_INFO_IICA_SUCCESS';
export const QUERY_BANK_INFO_IICA_FAILURE = 'QUERY_BANK_INFO_IICA_FAILURE';

export interface TBankInfoIica {
  data: Datum[];
}

export interface Datum {
  balance: null;
  bankAccNo: string;
  bankID: string;
  isDefault: boolean;
}

export function bankInfoIica(state: TBankInfoIica | null = null, action: IAction<TBankInfoIica | null>) {
  switch (action.type) {
    case QUERY_BANK_INFO_IICA_SUCCESS:
      return { ...state, ...action.payload };
    case QUERY_BANK_INFO_IICA_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
