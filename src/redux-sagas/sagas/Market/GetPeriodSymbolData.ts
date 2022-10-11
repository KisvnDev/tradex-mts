import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { isStockType } from 'utils/market';
import { IResponse, IObject, IRequest } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { SYMBOL_TYPE } from 'global';
import { MARKET_GET_PERIOD_SYMBOL_DATA } from 'redux-sagas/actions';
import { CHART_PERIOD_SYMBOL_DATA_SUCCESS } from 'components/SymbolTabs/ChartTab/reducers';
import { HISTORY_TAB_PERIOD_SYMBOL_DATA_SUCCESS } from 'components/SymbolTabs/HistoryTab/reducers';
import config from 'config';

const isUsingNewKisCore = config.usingNewKisCore;

const getPeriodData = (params: IObject, uri: string) => {
  if (isUsingNewKisCore) {
    return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined, undefined, '/api/v2/');
  }

  return query<IObject[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined);
};

function* doGetPeriodSymbolData(request: IRequest<IObject>) {
  try {
    const params: IObject = {};

    params.fetchCount = request.payload.fetchCount;
    params.periodType = request.payload.periodType;

    if (request.payload.loadMore) {
      if (request.response.success === CHART_PERIOD_SYMBOL_DATA_SUCCESS) {
        params.baseDate = store.getState().symbolChartPeriodData!.baseDate;
      } else if (request.response.success === HISTORY_TAB_PERIOD_SYMBOL_DATA_SUCCESS) {
        params.baseDate = store.getState().symbolPeriodData!.baseDate;
      }
    }

    let response: IResponse<IObject[]> = {
      data: [],
    };

    const symbol = request.payload.symbol! as ISymbolInfo;

    isUsingNewKisCore && (params.symbol = symbol.s);

    if (isStockType(symbol.t)) {
      params.stockCode = symbol.s;
      const uri = isUsingNewKisCore
        ? 'market/symbol/{symbol}/period/{periodType}'
        : 'market/stock/{stockCode}/period/{periodType}';
      response = yield call(getPeriodData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.INDEX) {
      !isUsingNewKisCore && (params.indexCode = symbol.s);

      const uri = isUsingNewKisCore
        ? 'market/symbol/{symbol}/period/{periodType}'
        : 'market/index/{indexCode}/period/{periodType}';
      response = yield call(getPeriodData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.FUTURES) {
      !isUsingNewKisCore && (params.futuresCode = symbol.s);

      const uri = isUsingNewKisCore
        ? 'market/symbol/{symbol}/period/{periodType}'
        : 'market/futures/{futuresCode}/period/{periodType}';
      response = yield call(getPeriodData, params, uri);
    } else if (symbol.t === SYMBOL_TYPE.CW) {
      !isUsingNewKisCore && (params.cwCode = symbol.s);

      const uri = isUsingNewKisCore
        ? 'market/symbol/{symbol}/period/{periodType}'
        : 'market/cw/{cwCode}/period/{periodType}';
      response = yield call(getPeriodData, params, uri);
    }

    let lastBaseDate = null;

    if (response.data && response.data.length > 0) {
      lastBaseDate = response.data[response.data.length - 1].date;
    }
    if (request.response.success === CHART_PERIOD_SYMBOL_DATA_SUCCESS) {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          code: symbol.s,
          baseDate: lastBaseDate,
          next: request.payload.loadMore,
        },
      });
    } else {
      if (request.payload.loadMore === true) {
        yield put({
          type: request.response.success,
          payload: {
            nextData: response.data,
            code: symbol.s,
            baseDate: lastBaseDate,
            next: request.payload.loadMore,
          },
        });
      } else {
        yield put({
          type: request.response.success,
          payload: {
            data: response.data,
            baseDate: lastBaseDate,
            code: symbol.s,
            next: request.payload.loadMore,
          },
        });
      }
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

export default function* watchGetPeriodSymbolData() {
  yield takeLatest(MARKET_GET_PERIOD_SYMBOL_DATA, doGetPeriodSymbolData);
}
