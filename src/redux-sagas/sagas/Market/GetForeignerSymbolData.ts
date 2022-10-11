import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { isStockType } from 'utils/market';
import { IRequest, IResponse, IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { SYMBOL_TYPE } from 'global';
import { MARKET_GET_FOREIGNER_SYMBOL_DATA } from 'redux-sagas/actions';
import config from 'config';

const isUsingNewKisCore = config.usingNewKisCore;

const getForeignerData = (params: IObject, uri: string) => {
  if (isUsingNewKisCore) {
    return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined, undefined, '/api/v2/');
  }

  return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined);
};

function* doGetForeignerSymbolData(request: IRequest<IObject>) {
  try {
    const params: IObject = {};

    params.fetchCount = request.payload.fetchCount;

    if (request.payload.loadMore === true) {
      if (store.getState().symbolForeignerData != null) {
        params.baseDate = store.getState().symbolForeignerData!.baseDate;
      }
    }

    let response: IResponse<IObject[]> = {
      data: [],
    };

    const symbol = request.payload.symbol! as ISymbolInfo;

    if (isStockType(symbol.t)) {
      params.stockCode = symbol.s;
      if (isUsingNewKisCore) {
        params.symbol = symbol.s;
      }
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/foreigner' : 'market/stock/{stockCode}/foreigner';
      response = yield call(getForeignerData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.FUTURES) {
      params.futuresCode = symbol.s;
      response = yield call(getForeignerData, params, 'market/futures/{futuresCode}/foreigner');
    }

    let baseDate = null;
    console.log('response123', response.data);

    if (response.data && response.data.length > 0) {
      baseDate = response.data[response.data.length - 1].date;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: response.data,
          baseDate,
          code: symbol.s,
          next: request.payload.loadMore,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          baseDate,
          code: symbol.s,
          next: request.payload.loadMore,
        },
      });
    }
  } catch (err) {
    yield put({
      type: request.response.failure,
      payload: {
        data: null,
        code: request.payload.symbol && (request.payload.symbol as ISymbolInfo).s,
      },
    });
  }
}

export default function* watchGetForeignerSymbolData() {
  yield takeLatest(MARKET_GET_FOREIGNER_SYMBOL_DATA, doGetForeignerSymbolData);
}
