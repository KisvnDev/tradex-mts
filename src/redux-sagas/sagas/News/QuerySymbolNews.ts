import { put, takeLatest, call } from 'redux-saga/effects';
import { IRequest, IObject } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { COMMON_SHOW_NOTIFICATION, NEWS_QUERY_SYMBOL_NEWS } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE, SYMBOL_TYPE } from 'global';

const getSymbolNews = (params: IObject) => {
  const uri = 'news/filter';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

const getIndexStockList = (params: IObject) => {
  const uri = 'market/indexStockList/{indexCode}';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQuerySymbolNews(request: IRequest<IObject>) {
  try {
    const params: IObject = {};

    params.symbolList = [(request.payload.symbol as ISymbolInfo).s];
    params.fetchCount = request.payload.fetchCount;

    if ((request.payload.symbol as ISymbolInfo).b != null) {
      if ((request.payload.symbol as ISymbolInfo).bs === SYMBOL_TYPE.STOCK) {
        (params.symbolList as string[]).push((request.payload.symbol as ISymbolInfo).b as string);
      } else if ((request.payload.symbol as ISymbolInfo).bs === SYMBOL_TYPE.INDEX) {
        const stockListResp = yield getIndexStockList({
          indexCode: (request.payload.symbol as ISymbolInfo).b as string,
        });

        if (stockListResp && stockListResp.data && stockListResp.data.stockList) {
          (params.symbolList as string[]) = (params.symbolList as string[]).concat(
            stockListResp.data.stockList as string[]
          );
        }
      }
    }

    if (request.payload.loadMore === true) {
      params.lastSequence = store.getState().symbolNewsData!.lastSequence!;
      params.publishTime = store.getState().symbolNewsData!.publishTime!;
    }

    const response = yield call(getSymbolNews, params);

    let lastSequence = null;
    let publishTime = null;
    let hasMore = true;

    if (response.data && response.data.length > 0) {
      lastSequence = response.data[response.data.length - 1].id;
      publishTime = response.data[response.data.length - 1].publishTime;
      if (response.data.length < request.payload.fetchCount!) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }

    yield put({
      type: request.response.success,
      payload: {
        data: response.data,
        lastSequence,
        publishTime,
        next: request.payload.loadMore,
        symbolCode: (request.payload.symbol as ISymbolInfo).s,
        hasMore,
      },
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Symbol News',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQuerySymbolNews() {
  yield takeLatest(NEWS_QUERY_SYMBOL_NEWS, doQuerySymbolNews);
}
