import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { isStockType } from 'utils/market';
import { IObject, IRequest, IResponse } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { SYMBOL_TYPE } from 'global';
import { MARKET_GET_TICK_SYMBOL_DATA } from 'redux-sagas/actions';
import config from 'config';

const isUsingNewKisCore = config.usingNewKisCore;

const getTickData = (params: IObject, uri: string) => {
  if (isUsingNewKisCore) {
    return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined, undefined, '/api/v2/');
  }

  return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined);
};

function* doGetTickSymbolData(request: IRequest<IObject>) {
  try {
    const params: IObject = {};

    params.fetchCount = request.payload.fetchCount;
    params.tickUnit = request.payload.tickUnit;

    if (request.payload.loadMore) {
      params.sequence = store.getState().symbolChartTickData!.sequence;
    }

    let response: IResponse<IObject[]> = {
      data: [],
    };

    const symbol = request.payload.symbol! as ISymbolInfo;
    isUsingNewKisCore && (params.symbol = symbol.s);

    if (isStockType(symbol.t)) {
      params.stockCode = symbol.s;
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/ticks' : 'market/stock/{stockCode}/ticks';
      response = yield call(getTickData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.INDEX) {
      !isUsingNewKisCore && (params.indexCode = symbol.s);
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/ticks' : 'market/index/{indexCode}/ticks';
      response = yield call(getTickData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.FUTURES) {
      !isUsingNewKisCore && (params.futuresCode = symbol.s);
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/ticks' : 'market/futures/{futuresCode}/ticks';
      response = yield call(getTickData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.CW) {
      !isUsingNewKisCore && (params.cwCode = symbol.s);
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/ticks' : 'market/cw/{cwCode}/ticks';
      response = yield call(getTickData, params, uri);
    }

    let lastSequence = null;
    if (response.data && response.data.length > 0) {
      lastSequence = response.data[response.data.length - 1].lastValue;
    }

    if (request.response.success) {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          code: symbol.s,
          sequence: lastSequence,
          next: request.payload.loadMore,
        },
      });
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
        payload: {
          data: null,
          code: request.payload.symbol && (request.payload.symbol as ISymbolInfo).s,
        },
      });
    }
  }
}

export default function* watchGetTickSymbolData() {
  yield takeLatest(MARKET_GET_TICK_SYMBOL_DATA, doGetTickSymbolData);
}
