import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { TRANSFER_STOCK_QUERY_AVAILABLE } from 'redux-sagas/actions';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import config from 'config';

const queryStockTransferBalance = (data: IObject) => {
  const isKisConfig = config.usingNewKisCore;
  const uri = isKisConfig ? 'services/eqt/listInstrumenPortfolio' : 'equity/transfer/stock/balance';
  const params = {
    subNumber: store.getState().selectedAccount!.subNumber,
    lastStockCode: data.lastStockCode,
    fetchCount: data.fetchCount,
  };
  params[isKisConfig ? 'accountNo' : 'accountNumber'] = store.getState().selectedAccount!.accountNumber;
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryStockTransferBalance(request: IRequest<IObject>) {
  try {
    const isKisCore = config.usingNewKisCore;
    if (request.payload.loadMore === true) {
      request.payload.lastStockCode = store.getState().stockTransferAvailable!.lastStockCode;
    }

    const response: Res<Stock[]> = yield call(queryStockTransferBalance, request.payload);

    let lastStockCode = null;
    let data = response.data;

    if (data && data.length > 0) {
      lastStockCode = data[data.length - 1].stockCode;
    }

    const map = getSymbolMap(store.getState());

    if (map) {
      data = data.filter((item) => {
        isKisCore && (item.stockCode = item.stockSymbol);
        return map[item.stockCode as string] != null;
      });
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: data,
          lastStockCode,
          next: true,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data,
          lastStockCode,
          next: false,
        },
      });
    }
  } catch (err) {
    yield put({ type: request.response.failure });
  }
}

export default function* watchQueryStockTransferBalance() {
  yield takeLatest(TRANSFER_STOCK_QUERY_AVAILABLE, doQueryStockTransferBalance);
}
