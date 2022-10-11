import { IAccount } from 'interfaces/common';
import { ACCOUNT_CHANGE_ACCOUNT } from 'redux-sagas/actions';

export const changeAccount = (payload: IAccount) => ({
  type: ACCOUNT_CHANGE_ACCOUNT,
  payload,
});
