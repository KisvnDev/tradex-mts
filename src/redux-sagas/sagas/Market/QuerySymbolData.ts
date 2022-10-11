import { takeEvery, call, put } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { ISymbolData } from 'interfaces/market';
import { IObject, IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { COMMON_SHOW_NOTIFICATION, MARKET_QUERY_SYMBOL_DATA } from 'redux-sagas/actions';
import { GLOBAL_SYMBOL_DATA } from 'redux-sagas/global-reducers/SymbolData-reducers';
import {
  GLOBAL_CURRENT_SYMBOL_QUOTE,
  GLOBAL_CURRENT_SYMBOL_BID_OFFER,
  GLOBAL_CURRENT_INDEX_QUOTE,
} from 'redux-sagas/global-reducers/CurrentSymbol-reducers';
import { NOTIFICATION_TYPE } from 'global';
import config from 'config';
import { getMap } from 'utils/common';

const querySymbolData = (params: IObject) => {
  const uri = config.usingNewKisCore === false ? 'market/data' : 'market/symbol/latest';
  if (config.usingNewKisCore === false) {
    return query<ISymbolData[]>(global.domainSocket, uri, METHOD.GET, params);
  } else {
    return query<ISymbolData[]>(global.domainSocket, uri, METHOD.GET, params, undefined, undefined, undefined, '/api/v2/');
  }
};

function* doQuerySymbolData(request: IRequest<IObject>) {
  try {
    const response = yield call(querySymbolData, request.payload);

    const symbolData: ISymbolData[] = response.data;
    let symbolMap: { [s: string]: ISymbolData } = {};
    if (config.usingNewKisCore === true) {
      symbolMap = getMap(store.getState().symbolList, 's');
    }

    const currentSymbol = store.getState().currentSymbol;
    const currentIndex = store.getState().currentIndex;

    symbolData.forEach((data: ISymbolData) => {
      let current = global.symbolData[data.s];
      if (current == null) {
        current = data;
      } else {
        if (current.quoteSubs === true && current.bidOfferSubs === true) {
          current = {
            ...current,
            ...data,
            ...global.symbolRealtimeQuoteData[current.s],
            ...global.symbolRealtimeBidOfferData[current.s],
          };
        } else if (current.quoteSubs !== true && current.bidOfferSubs !== true) {
          current = { ...current, ...data };
        } else if (current.quoteSubs === true) {
          current = {
            ...current,
            ...data,
            ...global.symbolRealtimeQuoteData[current.s],
          };
        } else {
          current = {
            ...current,
            ...data,
            ...global.symbolRealtimeBidOfferData[current.s],
          };
        }
      }

      if (config.usingNewKisCore === false) {
        global.symbolData[data.s] = current;
      } else {
        if (symbolMap[data.s] != null) {
          global.symbolData[data.s] = {
            ...symbolMap[data.s],
            ...current,
          };
        } else {
          global.symbolData[data.s] = current;
        }
      }

      store.dispatch({
        type: GLOBAL_SYMBOL_DATA,
        payload: current,
      });

      if (currentSymbol && current.s === currentSymbol.s) {
        store.dispatch({
          type: GLOBAL_CURRENT_SYMBOL_QUOTE,
          payload: current,
        });

        store.dispatch({
          type: GLOBAL_CURRENT_SYMBOL_BID_OFFER,
          payload: current,
        });
      } else if (currentIndex && current.s === currentIndex.s) {
        store.dispatch({
          type: GLOBAL_CURRENT_INDEX_QUOTE,
          payload: current,
        });
      }
    });
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Symbol Data',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQuerySymbolData() {
  yield takeEvery(MARKET_QUERY_SYMBOL_DATA, doQuerySymbolData);
}
