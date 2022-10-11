import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE } from 'redux-sagas/actions';
import config from 'config';

const queryOrderAvailable = (params: IObject) => {
  const uri = config.usingNewKisCore === false ? 'derivatives/order/available' : 'services/fno/maxlongshortenquiry';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryOrderAvailable(request: IRequest<IObject>) {
  try {
    let params;
    if (config.usingNewKisCore === false) {
      params = {
        accountNumber: store.getState().selectedAccount!.accountNumber,
        code: store.getState().currentSymbol!.s,
        ...request.payload,
      };
    } else {
      params = {
        ...request.payload,
      };
    }
    const response = yield call(queryOrderAvailable, params);

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

export default function* watchQueryOrderAvailable() {
  yield takeLatest(DERIVATIVES_ORDER_QUERY_ORDER_AVAILABLE, doQueryOrderAvailable);
}
