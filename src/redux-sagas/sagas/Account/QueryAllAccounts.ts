import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { getAccounts } from 'utils/domain';
import { ACCOUNT_FETCH_COUNT } from 'global';
import { ACCOUNT_QUERY_ALL_ACCOUNTS } from 'redux-sagas/actions';
import { GLOBAL_ACCOUNT_LIST } from 'redux-sagas/global-reducers/AccountList-reducers';

const queryAllAccounts = (params: any) => {
  const uri = 'equity/account/list';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAllAccounts(request: IRequest<null>) {
  try {
    let accounts = store.getState().accountList;
    if (accounts.length > 0) {
      let count = ACCOUNT_FETCH_COUNT;

      while (count >= ACCOUNT_FETCH_COUNT) {
        const data = {
          lastAccountNumber: accounts[accounts.length - 1].accountNumber,
          lastSubNumber: accounts[accounts.length - 1].subNumber,
          fetchCount: 100,
        };
        const response = yield call(queryAllAccounts, data);
        if (response && response.data) {
          const responseAccount = getAccounts(response.data as IObject[]);
          count = responseAccount.length;
          accounts = accounts.concat(responseAccount);
        }
        yield put({
          type: GLOBAL_ACCOUNT_LIST,
          payload: accounts,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export default function* watchQueryAllAccounts() {
  yield takeLatest(ACCOUNT_QUERY_ALL_ACCOUNTS, doQueryAllAccounts);
}
