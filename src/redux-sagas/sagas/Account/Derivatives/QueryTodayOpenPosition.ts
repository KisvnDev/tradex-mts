import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION } from 'redux-sagas/actions';

const queryTodayOpenPosition = (params: IObject) => {
  const uri = 'derivatives/account/openPosition';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryTodayOpenPosition(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastNextKey = store.getState().derivativesTodayOpenPosition!.lastNextKey;
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(queryTodayOpenPosition, request.payload);
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
  }
}

export default function* watchQueryTodayOpenPosition() {
  yield takeLatest(DERIVATIVES_ACCOUNT_QUERY_TODAY_OPEN_POSITION, doQueryTodayOpenPosition);
}
