import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import store from 'redux-sagas/store';
import { ORDER_QUERY_SELLABLE_ODDLOT_STOCKS } from 'redux-sagas/actions';

const queryOddlotSellableStocks = (params: IObject) => {
  const uri = 'equity/order/oddlot/sellable';

  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryOddlotSellableStocks(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastStockCode = store.getState().sellableOddlotStocks!.lastStockCode;
    }

    request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;
    request.payload.subNumber = store.getState().selectedAccount!.subNumber;

    const response = yield call(queryOddlotSellableStocks, request.payload);

    let lastStockCode = null;

    if (response.data && response.data.length > 0) {
      lastStockCode = response.data[response.data.length - 1].stockCode;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          next: true,
          lastStockCode,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          next: false,
          lastStockCode,
        },
      });
    }
  } catch (err) {
    yield put({
      type: request.response.success,
      payload: {
        data: [{ stockCode: 'AAA', sellableQuantity: 5 }],
        next: false,
      },
    });
  }
}

export default function* watchQueryOddlotSellableStocks() {
  yield takeLatest(ORDER_QUERY_SELLABLE_ODDLOT_STOCKS, doQueryOddlotSellableStocks);
}
