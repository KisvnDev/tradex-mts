import { put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { IRequest } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { GLOBAL_CURRENT_INDEX } from 'redux-sagas/global-reducers/CurrentSymbol-reducers';
import { MARKET_SET_CURRENT_INDEX, MARKET_QUERY_SYMBOL_DATA, MARKET_SUBSCRIBE_SYMBOL } from 'redux-sagas/actions';
import { SYMBOL_TYPE } from 'global';

function* doSetCurrentIndex(request: IRequest<ISymbolInfo>) {
  try {
    yield put({
      type: GLOBAL_CURRENT_INDEX,
      payload: request.payload,
    });

    store.dispatch({
      type: MARKET_QUERY_SYMBOL_DATA,
      payload: {
        symbolList: [request.payload.s],
      },
    });

    store.dispatch({
      type: MARKET_SUBSCRIBE_SYMBOL,
      payload: {
        code: request.payload.s,
        symbolType: SYMBOL_TYPE.INDEX,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

export default function* watchSetCurrentIndex() {
  yield takeLatest(MARKET_SET_CURRENT_INDEX, doSetCurrentIndex);
}
