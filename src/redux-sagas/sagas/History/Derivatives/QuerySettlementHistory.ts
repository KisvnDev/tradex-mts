import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const querySettlementHistory = (params: IObject) => {
  const uri = 'derivatives/history/settlement';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQuerySettlementHistory(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastTradingDate = store.getState().derivativesSettlementHistory!.lastTradingDate;
      request.payload.lastSettleDate = store.getState().derivativesSettlementHistory!.lastSettleDate;
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;

    const response = yield call(querySettlementHistory, request.payload);
    let lastTradingDate = null;
    let lastSettleDate = null;

    if (response.data && response.data.length > 0) {
      lastTradingDate = response.data[response.data.length - 1].tradingDate;
      lastSettleDate = response.data[response.data.length - 1].settleDate;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastTradingDate,
          lastSettleDate,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastTradingDate,
          lastSettleDate,
        },
      });
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
        message: err.message,
      });
    }

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Settlement History',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQuerySettlementHistory() {
  yield takeLatest(DERIVATIVES_HISTORY_QUERY_SETTLEMENT_HISTORY, doQuerySettlementHistory);
}
