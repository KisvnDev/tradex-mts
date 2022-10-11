import { call, put, takeEvery } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { ORDER_QUERY_ALL_STOP_ORDER_HISTORY } from 'redux-sagas/actions';
import { QUERY_ORDER_STOP_HISTORY_SUCCESS } from 'components/StopOrderHistory/reducers';
import config from 'config';

const queryStopOrderHistory = (params: IObject) => {
  const uri = config.usingNewKisCore === false ? 'equity/order/stop/history' : 'stopOrder/history';
  let newParams: IObject = {};

  if (config.usingNewKisCore) {
    newParams = {
      accountNumber: params.accountNumber,
      fromDate: params.fromDate,
      toDate: params.toDate,
      fetchCount: params.fetchCount,
    };

    params?.code && (newParams.code = params.code);

    if (params.lastStopOrderId) {
      newParams.lastStopOrderId = params.lastStopOrderId;
    }

    if (params.sellBuyType) {
      newParams.sellBuyType = params.sellBuyType;
    }

    if (params.status && params.status !== 'ALL') {
      newParams.status = params.status;
    }
  } else {
    newParams = { ...params };
  }
  return query(global.domainSocket, uri, METHOD.GET, newParams);
};

function* doQueryStopOrderHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      if (request.response.success === QUERY_ORDER_STOP_HISTORY_SUCCESS) {
        request.payload.sequence = store.getState().equityStopOrderHistory!.sequence;
      }
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    if (!config.usingNewKisCore) {
      request.payload.subNumber = store.getState().selectedAccount!.subNumber;
    }

    const response = yield call(queryStopOrderHistory, request.payload);
    let sequence = null;

    if (response.data && response.data.length > 0) {
      sequence = response.data[response.data.length - 1].sequence;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          sequence,
          code: request.payload.stockCode,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          sequence,
          code: request.payload.stockCode,
        },
      });
    }
  } catch (err) {
    console.log(err);
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryStopOrderHistory() {
  yield takeEvery(ORDER_QUERY_ALL_STOP_ORDER_HISTORY, doQueryStopOrderHistory);
}
