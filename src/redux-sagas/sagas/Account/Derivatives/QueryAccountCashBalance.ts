import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE } from 'redux-sagas/actions';
import { ICashBalanceState } from 'screens/Derivatives/Account/reducers';

const queryAccountCashBalance = (params: IObject) => {
  const uri = 'services/fno/queryclientcashbalance';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountCashBalance(request: IRequest<IObject>) {
  try {
    const params = {
      accountNo: store.getState().selectedAccount!.accountNumber,
    };

    const response: { data: ICashBalanceState } = yield call(queryAccountCashBalance, params);

    if (response.data != null) {
      yield put({
        type: request.response.success,
        payload: response.data,
      });
    } else {
      yield put({
        type: request.response.failure,
      });
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryAccountCashBalance() {
  yield takeLatest(DERIVATIVES_ACCOUNT_QUERY_CASH_BALANCE, doQueryAccountCashBalance);
}
