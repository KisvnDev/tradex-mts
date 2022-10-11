import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import config from 'config';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_ORDER_QUERY_ORDER_HISTORY } from 'redux-sagas/actions';
import { QUERY_DERIVATIVES_ORDER_HISTORY_SUCCESS } from 'components/DerivativesOrderHistory/reducers';

const queryOrderHistory = (params: IObject) => {
  const uri = config.usingNewKisCore ? 'services/fno/orderenquiryhistory' : 'derivatives/order/history';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryOrderHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      if (request.response.success === QUERY_DERIVATIVES_ORDER_HISTORY_SUCCESS) {
        request.payload.lastNextKey = store.getState().derivativesOrderHistory!.lastNextKey;
      }
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(queryOrderHistory, request.payload);
    let lastNextKey = null;

    if (response.data && response.data.length > 0) {
      lastNextKey = response.data[response.data.length - 1].nextKey;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastNextKey,
          code: request.payload.code,
          offset: (request.payload.offset as number) + response.data.length,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastNextKey,
          code: request.payload.code,
          offset: (request.payload.offset as number) + response.data.length,
        },
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

export default function* watchQueryOrderHistory() {
  yield takeLatest(DERIVATIVES_ORDER_QUERY_ORDER_HISTORY, doQueryOrderHistory);
}
