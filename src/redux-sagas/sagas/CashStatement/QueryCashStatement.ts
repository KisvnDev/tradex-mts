import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { QUERY_CASH_STATEMENT } from 'redux-sagas/actions';

const queryTransactionInfo = (params: IObject) => {
  const uri = 'services/fno/transactionhistory';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryCashStatement(request: IRequest<IObject>) {
  try {
    const response: Res<IObject> = yield call(queryTransactionInfo, request.payload);

    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
      payload: error,
    });
  }
}

export default function* watchQueryCashStatement() {
  yield takeLatest(QUERY_CASH_STATEMENT, doQueryCashStatement);
}
