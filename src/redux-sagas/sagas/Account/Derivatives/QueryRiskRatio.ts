import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO } from 'redux-sagas/actions';

const queryRiskRatio = () => {
  const uri = 'derivatives/account/riskRatio';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryRiskRatio(request: IRequest<null>) {
  try {
    const response = yield call(queryRiskRatio);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryRiskRatio() {
  yield takeLatest(DERIVATIVES_ACCOUNT_QUERY_RISK_RATIO, doQueryRiskRatio);
}
