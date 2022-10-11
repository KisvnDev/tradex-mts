import { call, put, takeEvery } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_ORDER_QUERY_STOP_ORDER_HISTORY } from 'redux-sagas/actions';
import { QUERY_DERIVATIVES_STOP_ORDER_HISTORY_SUCCESS } from 'components/DerivativesStopOrderHistory/reducers';
import { NOTIFICATION_TYPE } from 'global';
import config from 'config';

const queryStopOrderHistory = (params: IObject) => {
  const uri = config.usingNewKisCore ? 'stopOrder/history' : 'derivatives/order/stop/history';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryStopOrderHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      if (request.response.success === QUERY_DERIVATIVES_STOP_ORDER_HISTORY_SUCCESS) {
        request.payload.lastNextKey = store.getState().derivativesStopOrderHistory!.lastNextKey;
      }
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(queryStopOrderHistory, request.payload);
    let lastNextKey = null;

    if (response.data && response.data.length > 0) {
      lastNextKey = response.data[response.data.length - 1].nextKey;
    }
    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          lastNextKey,
          next: true,
          code: request.payload.code,
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
        },
      });
    }
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Stop Order History',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryStopOrderHistory() {
  yield takeEvery(DERIVATIVES_ORDER_QUERY_STOP_ORDER_HISTORY, doQueryStopOrderHistory);
}
