import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_HISTORY_QUERY_MARGIN_CALL } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const queryMarginCall = (params: IObject) => {
  const uri = 'derivatives/history/marginCall';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryMarginCall(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastNextKey = store.getState().derivativesMarginCall!.lastNextKey;
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(queryMarginCall, request.payload);
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
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastNextKey,
        },
      });
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Margin Call',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryMarginCall() {
  yield takeLatest(DERIVATIVES_HISTORY_QUERY_MARGIN_CALL, doQueryMarginCall);
}
