import config from 'config';
import { IAction, IObject } from 'interfaces/common';

export const WITHDRAW_MONEY_QUERY_BANK_ACCOUNT_SUCCESS = 'WITHDRAW_MONEY_QUERY_BANK_ACCOUNT_SUCCESS';
export const WITHDRAW_MONEY_QUERY_BANK_ACCOUNT_FAILED = 'WITHDRAW_MONEY_QUERY_BANK_ACCOUNT_FAILED';

export const WITHDRAW_MONEY_QUERY_BANK_INFO_SUCCESS = 'WITHDRAW_MONEY_QUERY_BANK_INFO_SUCCESS';
export const WITHDRAW_MONEY_QUERY_BANK_INFO_FAILED = 'WITHDRAW_MONEY_QUERY_BANK_INFO_FAILED';

export const WITHDRAW_MONEY_REQUEST_SUCCESS = 'WITHDRAW_MONEY_REQUEST_SUCCESS';
export const WITHDRAW_MONEY_REQUEST_FAILED = 'WITHDRAW_MONEY_REQUEST_FAILED';

export const WITHDRAW_MONEY_QUERY_DERIVATIVES_WITHDRAW_INFO_SUCCESS =
  'WITHDRAW_MONEY_QUERY_DERIVATIVES_WITHDRAW_INFO_SUCCESS';
export const WITHDRAW_MONEY_QUERY_DERIVATIVES_WITHDRAW_INFO_FAILED =
  'WITHDRAW_MONEY_QUERY_DERIVATIVES_WITHDRAW_INFO_FAILED';

export const WITHDRAW_MONEY_QUERY_ACCOUNT_BALANCE_SUCCESS = 'WITHDRAW_MONEY_QUERY_ACCOUNT_BALANCE_SUCCESS';
export const WITHDRAW_MONEY_QUERY_ACCOUNT_BALANCE_FAILED = 'WITHDRAW_MONEY_QUERY_ACCOUNT_BALANCE_FAILED';

export function WithdrawResult(state: { success: boolean } | null = null, action: IAction<null>) {
  switch (action.type) {
    case WITHDRAW_MONEY_REQUEST_SUCCESS:
      return {
        success: true,
      };
    default:
      return state;
  }
}

export function WithdrawBankAccountsInfo(state: IObject[] | null = null, action: IAction<IObject[]>) {
  switch (action.type) {
    case WITHDRAW_MONEY_QUERY_BANK_INFO_SUCCESS:
      return action.payload;
    case WITHDRAW_MONEY_QUERY_BANK_INFO_FAILED:
      return null;
    default:
      return state;
  }
}

export interface IWithdrawBankAccountItem {
  label: string;
  value: IWithdrawBankAccount;
}

export interface IWithdrawBankAccountItems {
  bankAccounts: IWithdrawBankAccountItem[];
  accountNumber?: string;
  subNumber?: string;
}

export interface IWithdrawBankAccount {
  bankCode: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface IWithdrawBankAccounts {
  bankAccounts: IWithdrawBankAccount[];
  accountNumber: string;
  subNumber: string;
}
export interface BankJson {
  jsonBank?: JsonBankItem[];
}
const isKisAccount = (
  account: IWithdrawBankAccount | WithdrawReceivedAccount | KisBankAccount
): account is WithdrawReceivedAccount => !!(account as WithdrawReceivedAccount).subAccountID;

const isKisBank = (banks: IWithdrawBankAccount | WithdrawReceivedAccount | KisBankAccount): banks is KisBankAccount =>
  !!(banks as KisBankAccount).bankID;

export function WithdrawBankAccounts(
  state: IWithdrawBankAccountItems | null = null,
  action: IAction<IWithdrawBankAccounts & TransferWithdraw & BankJson>
) {
  switch (action.type) {
    case WITHDRAW_MONEY_QUERY_BANK_ACCOUNT_SUCCESS:
      const bankAccounts = action.payload.bankAccounts;
      let bankAccountList: ItemDropdown[] = [];
      if (bankAccounts != null && bankAccounts.length > 0) {
        bankAccountList = bankAccounts.map((item: IWithdrawBankAccount) => ({
          label: `${item.bankCode} - ${item.bankName} - ${item.bankAccountNumber} - ${item.bankAccountName}`,
          value: item,
        }));

        bankAccountList = bankAccounts.map((item: IWithdrawBankAccount | WithdrawReceivedAccount | KisBankAccount) => {
          if (isKisAccount(item) || isKisBank(item)) {
            return {
              label: isKisBank(item) ? item.bankID : item.subAccountID,
              value: item,
            };
          } else {
            let label = `${item.bankCode} - ${item.bankName} - ${item.bankAccountNumber}`;
            if (config.domain !== 'kis') {
              label += ` - ${item.bankAccountName}`;
            }
            return {
              label,
              value: item,
            };
          }
        });
      }
      const otherState = config.usingNewKisCore
        ? {
            senderFullName: action.payload.senderFullName,
            transferableAmount: action.payload.transferableAmount,
            beneficiaryAccountList: action.payload.beneficiaryAccountList,
            jsonBank: action.payload.jsonBank,
          }
        : {};
      return {
        accountNumber: action.payload.accountNumber,
        subNumber: action.payload.subNumber,
        bankAccounts: bankAccountList,
        ...otherState,
      };
    case WITHDRAW_MONEY_QUERY_BANK_ACCOUNT_FAILED:
      return {
        bankAccounts: [],
      };
    default:
      return state;
  }
}

export function DerivativesWithdrawInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_MONEY_QUERY_DERIVATIVES_WITHDRAW_INFO_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function EquityWithdrawInfo(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case WITHDRAW_MONEY_QUERY_ACCOUNT_BALANCE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
