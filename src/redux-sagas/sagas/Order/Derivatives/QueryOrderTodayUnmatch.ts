import { call, put, takeEvery } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_ORDER_QUERY_ORDER_TODAY_UNMATCH } from 'redux-sagas/actions';
import { QUERY_DERIVATIVES_ORDER_TODAY_UNMATCH_SUCCESS } from 'components/DerivativesOrderTodayUnmatch/reducers';
import config from 'config';

const queryOrderTodayUnmatch = (params: IObject) => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/fno/orderenquiry' : 'derivatives/order/todayUnmatch';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryOrderTodayUnmatch(request: IRequest<IObject>) {
  const isKisCore = config.usingNewKisCore;
  const { loadMore } = request.payload;
  try {
    if (isKisCore) {
      request.payload.offset = loadMore ? store.getState().derivativesOrderHistory!.offset : 0;
    } else {
      if (request.payload.loadMore === true) {
        if (request.response.success === QUERY_DERIVATIVES_ORDER_TODAY_UNMATCH_SUCCESS) {
          request.payload.lastNextKey = store.getState().derivativesOrderTodayUnmatch!.lastNextKey;
        }
      }
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(queryOrderTodayUnmatch, request.payload);
    const data = response.data;

    let payload: any = {};
    if (!isKisCore) {
      if (response.data && response.data.length > 0) {
        payload.lastNextKey = response.data[response.data.length - 1].nextKey;
      }
    } else {
      let offset =
        ((request.payload.loadMore && store.getState()?.withdrawTransactionHistory?.offset) || 0) + data.length;
      payload = { offset };
    }
    payload[loadMore ? 'nextData' : 'data'] = data;
    payload.next = loadMore;

    //TODO: dispatch success get list transfer history
    yield put({
      type: request.response.success,
      payload: { ...payload, code: request.payload.stockSymbol },
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryOrderTodayUnmatch() {
  yield takeEvery(DERIVATIVES_ORDER_QUERY_ORDER_TODAY_UNMATCH, doQueryOrderTodayUnmatch);
}
