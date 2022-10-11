import { ACCOUNT_QUERY_ACCOUNT_BANKS } from 'redux-sagas/actions';
import { IAccountBank } from 'interfaces/common';
import { DROPDOWN_ACCOUNT_BANK } from './reducers';

export const queryAccountBanks = () => ({
  type: ACCOUNT_QUERY_ACCOUNT_BANKS,
});

export const setAccountBank = (payload: IAccountBank) => ({
  type: DROPDOWN_ACCOUNT_BANK,
  payload,
});
