import { IAction, IObject } from 'interfaces/common';

export const CASH_TRANSFER_QUERY_TRANSFER_ACCOUNT_SUCCESS = 'CASH_TRANSFER_QUERY_TRANSFER_ACCOUNT_SUCCESS';
export const CASH_TRANSFER_QUERY_TRANSFER_ACCOUNT_FAILED = 'CASH_TRANSFER_QUERY_TRANSFER_ACCOUNT_FAILED';
export const CASH_TRANSFER_REQUEST_SUCCESS = 'CASH_TRANSFER_REQUEST_SUCCESS';
export const CASH_TRANSFER_REQUEST_FAILED = 'CASH_TRANSFER_REQUEST_FAILED';
export const CASH_TRANSFER_QUERY_DERIVATIVES_TRANSFER_INFO_SUCCESS =
  'CASH_TRANSFER_QUERY_DERIVATIVES_TRANSFER_INFO_SUCCESS';
export const CASH_TRANSFER_QUERY_DERIVATIVES_TRANSFER_INFO_FAILED =
  'CASH_TRANSFER_QUERY_DERIVATIVES_TRANSFER_INFO_FAILED';
export const CASH_TRANSFER_QUERY_ACCOUNT_BALANCE_SUCCESS = 'CASH_TRANSFER_QUERY_ACCOUNT_BALANCE_SUCCESS';
export const CASH_TRANSFER_QUERY_ACCOUNT_BALANCE_FAILED = 'CASH_TRANSFER_QUERY_ACCOUNT_BALANCE_FAILED';

export interface ICashTransferAccount {
  accountNumber: string;
  subNumber: string;
  accountName: string;
}

export interface ICashTransferAccountItem {
  label: string;
  value: ICashTransferAccount;
}

export interface ICashTransferAccountItems {
  accounts: ICashTransferAccountItem[];
  accountNumber?: string;
  subNumber?: string;
}

export interface ICashTransferAccounts {
  accounts: ICashTransferAccount[];
  accountNumber: string;
  subNumber: string;
}

export function CashTransferResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case CASH_TRANSFER_REQUEST_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}

export function CashTransferAccounts(
  state: ICashTransferAccountItems | null = null,
  action: IAction<ICashTransferAccounts>
) {
  switch (action.type) {
    case CASH_TRANSFER_QUERY_TRANSFER_ACCOUNT_SUCCESS:
      const accounts = action.payload.accounts;
      let accountList: ICashTransferAccountItem[] = [];
      if (accounts != null && accounts.length > 0) {
        accountList = accounts.map((item: ICashTransferAccount) => ({
          label: `${item.accountNumber} - ${item.subNumber} - ${item.accountName}`,
          value: item,
        }));
      }
      return {
        accountNumber: action.payload.accountNumber,
        subNumber: action.payload.subNumber,
        accounts: accountList,
      };
    case CASH_TRANSFER_QUERY_TRANSFER_ACCOUNT_FAILED:
      return {
        accounts: [],
      };
    default:
      return state;
  }
}

export function EquityCashTransferInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case CASH_TRANSFER_QUERY_ACCOUNT_BALANCE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function DerivativesCashTransferInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case CASH_TRANSFER_QUERY_DERIVATIVES_TRANSFER_INFO_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
