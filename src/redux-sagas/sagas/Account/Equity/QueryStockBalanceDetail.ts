import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { formatDateToString } from 'utils/datetime';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_STOCK_BALANCE_DETAIL } from 'redux-sagas/actions';

const queryStockBalanceDetail = (data: IObject) => {
  const uri = 'equity/account/balance/details';

  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    lastStockCode: data.lastStockCode,
    fetchCount: data.fetchCount,
    date: formatDateToString(new Date()),
  };

  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryStockBalanceDetail(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastStockCode = store.getState().stockBalanceDetail!.lastStockCode;
    }
    const response = yield call(queryStockBalanceDetail, request.payload);

    let lastStockCode = null;
    let data = response.data;

    if (data && data.length > 0) {
      lastStockCode = data[data.length - 1].stockCode;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: data,
          next: true,
          lastStockCode,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data,
          next: false,
          lastStockCode,
        },
      });
    }
  } catch (err) {
    console.log(err);
    if (request.response.failure) {
      yield put({ type: request.response.failure });
    }
  }
}

export default function* watchQueryStockBalanceDetail() {
  yield takeLatest(ACCOUNT_QUERY_EQUITY_STOCK_BALANCE_DETAIL, doQueryStockBalanceDetail);
}
