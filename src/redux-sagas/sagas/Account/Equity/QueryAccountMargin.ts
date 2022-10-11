import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { QUERY_ACCOUNT_MARGIN } from 'redux-sagas/actions';
import config from 'config';

const queryAccountMargin = (params: IObject) => {
  const uri = config.usingNewKisCore === false ? 'equity/account/margin' : 'services/eqt/stockInfo';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountMargin(request: IRequest<IObject>) {
  try {
    const response = yield call(queryAccountMargin, request.payload);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    yield put({
      type: request.response.failure,
      payload: err,
    });
  }
}

export default function* watchQueryAccountMargin() {
  yield takeLatest(QUERY_ACCOUNT_MARGIN, doQueryAccountMargin);
}
