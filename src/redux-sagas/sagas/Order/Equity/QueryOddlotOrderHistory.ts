import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { ORDER_QUERY_ODDLOT_ORDER_HISTORY } from 'redux-sagas/actions';

const queryOddlotOrderHistory = (params: IObject) => {
  const uri = 'equity/order/oddlot/history';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryOddlotOrderHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastBranchCode = store.getState().equityOddlotOrderHistory!.lastBranchCode;
      request.payload.lastOrderNumber = store.getState().equityOddlotOrderHistory!.lastOrderNumber;
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;
    request.payload.subNumber = store.getState().selectedAccount!.subNumber;

    const response = yield call(queryOddlotOrderHistory, request.payload);

    let lastBranchCode = null;
    let lastOrderNumber = null;

    if (response.data && response.data.length > 0) {
      lastBranchCode = response.data[response.data.length - 1].branchCode;
      lastOrderNumber = response.data[response.data.length - 1].orderNumber;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastBranchCode,
          lastOrderNumber,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastBranchCode,
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

export default function* watchQueryOddlotOrderHistory() {
  yield takeLatest(ORDER_QUERY_ODDLOT_ORDER_HISTORY, doQueryOddlotOrderHistory);
}
