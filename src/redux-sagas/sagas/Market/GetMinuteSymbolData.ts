import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { isStockType } from 'utils/market';
import store from 'redux-sagas/store';
import { IRequest, IObject, IResponse } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { SYMBOL_TYPE } from 'global';
import { MARKET_GET_MINUTE_SYMBOL_DATA } from 'redux-sagas/actions';
import { CHART_MINUTE_SYMBOL_DATA_SUCCESS } from 'components/SymbolTabs/ChartTab/reducers';
import config from 'config';

const isUsingNewKisCore = config.usingNewKisCore;

const getMinuteData = (params: IObject, uri: string) => {
  if (isUsingNewKisCore) {
    return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined, undefined, '/api/v2/');
  }

  return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined);
};

function* doGetMinuteSymbolData(request: IRequest<IObject>) {
  try {
    const params: IObject = {};

    params.fetchCount = request.payload.fetchCount;
    params.minuteUnit = request.payload.minuteUnit;
    params.fromTime = request.payload.fromTime;
    params.toTime = request.payload.toTime;

    if (request.payload.loadMore === true) {
      if (request.response.success === CHART_MINUTE_SYMBOL_DATA_SUCCESS) {
        params.toTime = store.getState().symbolChartMinuteData!.baseTime;
      }
    }

    let response: IResponse<IObject[]> = {
      data: [],
    };

    const symbol = request.payload.symbol! as ISymbolInfo;
    isUsingNewKisCore && (params.symbol = symbol.s);
    if (isStockType(symbol.t)) {
      params.stockCode = symbol.s;
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/minutes' : 'market/stock/{stockCode}/minutes';
      response = yield call(getMinuteData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.INDEX) {
      !isUsingNewKisCore && (params.indexCode = symbol.s);
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/minutes' : 'market/index/{indexCode}/minutes';
      response = yield call(getMinuteData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.FUTURES) {
      !isUsingNewKisCore && (params.futuresCode = symbol.s);
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/minutes' : 'market/futures/{futuresCode}/minutes';
      response = yield call(getMinuteData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.CW) {
      !isUsingNewKisCore && (params.cwCode = symbol.s);
      const uri = isUsingNewKisCore ? 'market/symbol/{symbol}/minutes' : 'market/cw/{cwCode}/minutes';
      response = yield call(getMinuteData, params, uri);
    }

    let lastBaseTime = null;
    if (response.data && response.data.length > 0) {
      lastBaseTime = response.data[response.data.length - 1].time;
    }
    if (request.response.success) {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          code: symbol.s,
          baseTime: lastBaseTime,
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

export default function* watchGetMinuteSymbolData() {
  yield takeLatest(MARKET_GET_MINUTE_SYMBOL_DATA, doGetMinuteSymbolData);
}
