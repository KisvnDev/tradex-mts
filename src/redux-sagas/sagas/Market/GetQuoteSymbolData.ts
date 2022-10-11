import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { isStockType } from 'utils/market';
import store from 'redux-sagas/store';
import { IObject, IRequest, IResponse } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { SYMBOL_TYPE } from 'global';
import { MARKET_GET_QUOTE_SYMBOL_DATA } from 'redux-sagas/actions';
import { QUOTE_TAB_QUOTE_SYMBOL_DATA_SUCCESS } from 'components/SymbolTabs/QuoteTab/reducers';
import { MINI_QUOTE_SYMBOL_DATA_SUCCESS } from 'components/MiniQuote/reducers';
import config from 'config';
import { mapDataQuoteNewKis } from 'utils/newKisCore';

const isUsingNewKisCore = config.usingNewKisCore;

const getQuoteData = (params: IObject, uri: string) => {
  if (isUsingNewKisCore) {
    return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined, undefined, '/api/v2/');
  } else {
    return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined);
  }
};

function* doGetQuoteSymbolData(request: IRequest<IObject>) {
  try {
    const params: IObject = {};

    params.fetchCount = request.payload.fetchCount;

    if (request.payload.loadMore === true) {
      if (request.response.success === QUOTE_TAB_QUOTE_SYMBOL_DATA_SUCCESS) {
        if (store.getState().symbolQuoteData != null) {
          params.baseTime = store.getState().symbolQuoteData!.baseTime;
          params.sequence = store.getState().symbolQuoteData!.sequence;
        }
      } else if (request.response.success === MINI_QUOTE_SYMBOL_DATA_SUCCESS) {
        params.baseTime = store.getState().miniQuoteData!.baseTime;
        params.sequence = store.getState().miniQuoteData!.sequence;
      }
    }

    if (config.usingNewKisCore) {
      params.lastTradingVolume = request.payload.lastTradingVolume;
    }

    let response: IResponse<IObject[]> = {
      data: [],
    };

    const symbol = request.payload.symbol! as ISymbolInfo;

    if (isStockType(symbol.t)) {
      params.stockCode = symbol.s;
      const uri = isUsingNewKisCore ? 'market/symbol/{stockCode}/quote' : 'market/code/{stockCode}/quote';
      response = yield call(getQuoteData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.INDEX) {
      params.indexCode = symbol.s;
      response = yield call(getQuoteData, params, 'market/index/{indexCode}/quote');
    } else if (symbol.t === SYMBOL_TYPE.FUTURES) {
      params.futuresCode = symbol.s;
      response = yield call(getQuoteData, params, 'market/futures/{futuresCode}/quote');
    } else if (symbol.t === SYMBOL_TYPE.CW) {
      params.cwCode = symbol.s;
      response = yield call(getQuoteData, params, 'market/cw/{cwCode}/quote');
    }

    let lastBaseTime = null;
    let lastSequence = null;
    let hasMore = true;

    if (response.data && response.data.length > 0) {
      lastBaseTime = response.data[response.data.length - 1].time;
      lastSequence = response.data[response.data.length - 1].sequence;
      if (response.data.length < request.payload.fetchCount!) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          nextData: isUsingNewKisCore ? mapDataQuoteNewKis(response.data) : response.data,
          baseTime: lastBaseTime,
          sequence: lastSequence,
          code: symbol.s,
          next: request.payload.loadMore,
          hasMore,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: isUsingNewKisCore ? mapDataQuoteNewKis(response.data) : response.data,
          baseTime: lastBaseTime,
          sequence: lastSequence,
          code: symbol.s,
          next: request.payload.loadMore,
          hasMore,
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

export default function* watchGetQuoteSymbolData() {
  yield takeLatest(MARKET_GET_QUOTE_SYMBOL_DATA, doGetQuoteSymbolData);
}
