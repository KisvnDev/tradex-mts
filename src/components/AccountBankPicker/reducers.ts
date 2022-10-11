import { IAccountBanks, IAction, IAccountBank } from 'interfaces/common';

export const DROPDOWN_ACCOUNT_BANK_LIST = 'DROPDOWN_ACCOUNT_BANK_LIST';
export const DROPDOWN_ACCOUNT_BANK = 'DROPDOWN_ACCOUNT_BANK';

export function AccountBanks(
  state: IAccountBanks = {
    banks: [],
  },
  action: IAction<IAccountBanks>
) {
  switch (action.type) {
    case DROPDOWN_ACCOUNT_BANK_LIST:
      return {
        banks: action.payload.banks,
        account: action.payload.account,
      };
    default:
      return state;
  }
}

export function AccountBank(state: IAccountBank | null = null, action: IAction<IAccountBank>) {
  switch (action.type) {
    case DROPDOWN_ACCOUNT_BANK:
      return { ...action.payload };
    default:
      return state;
  }
}
