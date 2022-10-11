import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { DROPDOWN_ACCOUNT_BANK_LIST, DROPDOWN_ACCOUNT_BANK } from 'components/AccountBankPicker/reducers';
import { ACCOUNT_QUERY_ACCOUNT_BANKS } from 'redux-sagas/actions';
import config from 'config';

const queryAccountBanks = () => {
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
  };
  const uri = 'equity/account/banks';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountBanks() {
  try {
    const selectedAccount = store.getState().selectedAccount;
    if (selectedAccount) {
      const response = yield call(queryAccountBanks);
      yield put({
        type: DROPDOWN_ACCOUNT_BANK_LIST,
        payload: {
          banks: response.data,
          account: selectedAccount,
        },
      });

      const accountBank = store.getState().accountBank;

      if (
        accountBank == null ||
        (accountBank.account &&
          selectedAccount &&
          accountBank.account.accountDisplay !== selectedAccount.accountDisplay)
      ) {
        if (response.data && response.data.length > 0) {
          const bank = { ...response.data[0] };
          bank.account = selectedAccount;
          yield put({
            type: DROPDOWN_ACCOUNT_BANK,
            payload: bank,
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export default function* watchQueryAccountBanks() {
  if (config.usingNewKisCore !== true) {
    yield takeLatest(ACCOUNT_QUERY_ACCOUNT_BANKS, doQueryAccountBanks);
  }
}
