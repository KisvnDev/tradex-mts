import { call, put, takeLatest } from 'redux-saga/effects';
import { IRequest, IObject } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { ORDER_QUERY_ADVANCE_ORDER_HISTORY } from 'redux-sagas/actions';
import { QUERY_DERIVATIVES_ADVANCE_ORDER_HISTORY_SUCCESS } from 'components/DerivativesAdvanceOrderHistory/reducers';

const queryAdvanceOrderHistory = (params: IObject) => {
  const uri = 'equity/order/advance/history';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAdvanceOrderHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      if (request.response.success === QUERY_DERIVATIVES_ADVANCE_ORDER_HISTORY_SUCCESS) {
        request.payload.lastOrderDate = store.getState().equityAdvanceOrderHistory!.lastOrderDate;
        request.payload.lastOrderNumber = store.getState().equityAdvanceOrderHistory!.lastOrderNumber;
      }
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;
    request.payload.subNumber = store.getState().selectedAccount!.subNumber;

    const response = yield call(queryAdvanceOrderHistory, request.payload);

    let lastOrderDate = null;
    let lastOrderNumber = null;

    if (response.data && response.data.length > 0) {
      lastOrderDate = response.data[response.data.length - 1].orderDate;
      lastOrderNumber = response.data[response.data.length - 1].orderNumber;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastOrderDate,
          lastOrderNumber,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastOrderDate,
          lastOrderNumber,
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

export default function* watchQueryAdvanceOrderHistory() {
  yield takeLatest(ORDER_QUERY_ADVANCE_ORDER_HISTORY, doQueryAdvanceOrderHistory);
}
