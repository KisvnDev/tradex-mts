import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_QUERY_ORDER_HISTORY } from 'redux-sagas/actions';
import { QUERY_ORDER_HISTORY_SUCCESS } from 'components/OrderHistory/reducers';
import config from 'config';

const queryOrderHistory = (params: IObject) => {
  const uri = config.usingNewKisCore === false ? 'equity/order/history' : 'services/eqt/enquiryhistoryorder';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryOrderHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      if (request.response.success === QUERY_ORDER_HISTORY_SUCCESS) {
        request.payload.lastOrderDate = store.getState().equityOrderHistory!.lastOrderDate;
        request.payload.lastBranchCode = store.getState().equityOrderHistory!.lastBranchCode;
        request.payload.lastOrderNumber = store.getState().equityOrderHistory!.lastOrderNumber;
        request.payload.lastMatchPrice = store.getState().equityOrderHistory!.lastMatchPrice;
      }
    }

    if (config.usingNewKisCore === false) {
      request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;
    } else {
      request.payload.accountNo = store.getState().selectedAccount!.accountNumber;
    }
    request.payload.subNumber = store.getState().selectedAccount!.subNumber;

    const response = yield call(queryOrderHistory, request.payload);

    let lastOrderDate = null;
    let lastBranchCode = null;
    let lastOrderNumber = null;
    let lastMatchPrice = null;

    if (response.data && response.data.length > 0) {
      lastOrderDate = response.data[response.data.length - 1].orderDate;
      lastBranchCode = response.data[response.data.length - 1].branchCode;
      lastOrderNumber = response.data[response.data.length - 1].orderNumber;
      lastMatchPrice = response.data[response.data.length - 1].matchedPrice;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastOrderDate,
          lastBranchCode,
          lastOrderNumber,
          lastMatchPrice,
          code: request.payload.stockCode,
          offset: (request.payload.offset || 0) + response.data.length,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastOrderDate,
          lastBranchCode,
          lastOrderNumber,
          lastMatchPrice,
          code: request.payload.stockCode,
          offset: (request.payload.offset || 0) + response.data.length,
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
  yield takeLatest(ORDER_QUERY_ORDER_HISTORY, doQueryOrderHistory);
}
