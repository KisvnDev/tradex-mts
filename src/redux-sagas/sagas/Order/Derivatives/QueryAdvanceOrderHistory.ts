import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_ORDER_QUERY_ADVANCE_ORDER_HISTORY } from 'redux-sagas/actions';
import { QUERY_DERIVATIVES_ADVANCE_ORDER_HISTORY_SUCCESS } from 'components/DerivativesAdvanceOrderHistory/reducers';
import { NOTIFICATION_TYPE } from 'global';

const queryAdvanceOrderHistory = (params: IObject) => {
  const uri = 'derivatives/order/advance/history';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAdvanceOrderHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      if (request.response.success === QUERY_DERIVATIVES_ADVANCE_ORDER_HISTORY_SUCCESS) {
        request.payload.lastNextKey = store.getState().derivativesAdvanceOrderHistory!.lastNextKey;
      }
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(queryAdvanceOrderHistory, request.payload);
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
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Advance Order History',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryAdvanceOrderHistory() {
  yield takeLatest(DERIVATIVES_ORDER_QUERY_ADVANCE_ORDER_HISTORY, doQueryAdvanceOrderHistory);
}
