import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { MARKET_GET_UP_DOWN_STOCK_RANKING } from 'redux-sagas/actions';
import config from 'config';

const isUsingNewKisCore = config.usingNewKisCore;

const getUpDownStockRanking = (params: IObject) => {
  const uri = 'market/stock/ranking/upDown';
  if (isUsingNewKisCore) {
    return query(global.domainSocket, uri, METHOD.GET, params, undefined, undefined, undefined, '/api/v2/');
  }
  return query(global.domainSocket, uri, METHOD.GET, params, undefined, undefined);
};

function* doGetUpDownStockRanking(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.offset =
        (request.payload.fetchCount as number) + (store.getState().upDownRankingDetail!.offset as number);
    } else {
      request.payload.offset = 0;
    }

    const response = yield call(getUpDownStockRanking, request.payload);

    if (request.payload.loadMore === true) {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          offset: request.payload.offset,
          next: request.payload.loadMore,
          upDownType: request.payload.upDownType,
          marketType: request.payload.marketType,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          offset: request.payload.offset,
          next: request.payload.loadMore,
          upDownType: request.payload.upDownType,
          marketType: request.payload.marketType,
        },
      });
    }
  } catch (err) {
    yield put({ type: request.response.failure });
  }
}

export default function* watchGetUpDownStockRanking() {
  yield takeLatest(MARKET_GET_UP_DOWN_STOCK_RANKING, doGetUpDownStockRanking);
}
