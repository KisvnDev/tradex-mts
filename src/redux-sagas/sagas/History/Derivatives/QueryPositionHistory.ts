import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const queryPositionHistory = (params: IObject) => {
  const uri = 'derivatives/history/position';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryPositionHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastNextKey = store.getState().derivativesPositionHistory!.lastNextKey;
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(queryPositionHistory, request.payload);
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
        title: 'Query Position History',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryPositionHistory() {
  yield takeLatest(DERIVATIVES_HISTORY_QUERY_POSITION_HISTORY, doQueryPositionHistory);
}
