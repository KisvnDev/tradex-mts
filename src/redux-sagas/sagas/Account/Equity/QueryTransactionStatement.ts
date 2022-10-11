import { call, put, takeLatest } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_TRANSACTION_STATEMENT } from 'redux-sagas/actions';

const queryTransactionStatement = (params: IObject) => {
  const uri = 'equity/account/transactionHistory';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryTransactionStatement(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastTradingDate = store.getState().transactionStatement!.lastTradingDate;
      request.payload.lastTradingSequence = store.getState().transactionStatement!.lastTradingSequence;
    }

    const response = yield call(queryTransactionStatement, request.payload);
    let lastTradingDate = null;
    let lastTradingSequence = null;

    if (response.data && response.data.length > 0) {
      lastTradingDate = response.data[response.data.length - 1].tradingDate;
      lastTradingSequence = response.data[response.data.length - 1].tradingSequence;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastTradingDate,
          lastTradingSequence,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastTradingDate,
          lastTradingSequence,
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

export default function* watchQueryTransactionStatement() {
  yield takeLatest(ACCOUNT_QUERY_TRANSACTION_STATEMENT, doQueryTransactionStatement);
}
