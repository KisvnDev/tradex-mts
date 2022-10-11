import { put, call, takeLatest } from 'redux-saga/effects';
import KeepAwake from 'react-native-keep-awake';
import config from 'config';
import store from 'redux-sagas/store';
import i18next from 'i18next';
import { takeSingle } from 'utils/sagas';
import { getKey, setKey } from 'utils/asyncStorage';
import { getSystemType } from 'utils/market';
import { ISymbolInfo, IMarketStatus } from 'interfaces/market';
import {
  COMMON_SHOW_NOTIFICATION,
  MARKET_INIT,
  MARKET_INIT_EXTRA,
  MARKET_SET_CURRENT_SYMBOL,
  RELOAD_MARKET_DATA,
} from 'redux-sagas/actions';
import {
  SYMBOL_LIST_STORAGE_KEY,
  REALTIME_CHANNEL_DATA_TYPE,
  SYSTEM_TYPE,
  SYMBOL_TYPE,
  NOTIFICATION_TYPE,
} from 'global';
import { GLOBAL_MARKET_INIT } from 'redux-sagas/global-reducers/MarketInit-reducers';
import {
  GLOBAL_SYMBOL_LIST,
  getStockList,
  getFuturesList,
  getSymbolMap,
} from 'redux-sagas/global-reducers/SymbolList-reducers';
import { query, METHOD } from 'utils/socketApi';
import {
  GLOBAL_MARKET_STATUS,
  GLOBAL_MARKET_STATUS_CHANGE_DATA,
} from 'redux-sagas/global-reducers/MarketStatus-reducers';

const parseJSON = (response: Response) => {
  return response.json();
};

const loadSymbolList = (): Promise<Response> => {
  try {
    return fetch(config.urls.symbolUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }).then(parseJSON);
  } catch (error) {
    return loadSymbolList();
  }
};

const handlePayload = (payload: ISymbolInfo[]) => {
  if (payload) {
    setKey(SYMBOL_LIST_STORAGE_KEY, JSON.stringify(payload));
  }
};

const getMarketStatus = () => {
  const uri = 'market/sessionStatus';
  if (config.usingNewKisCore) {
    return query<IMarketStatus[]>(
      global.domainSocket,
      uri,
      METHOD.GET,
      undefined,
      undefined,
      undefined,
      undefined,
      '/api/v2/'
    );
  }
  return query<IMarketStatus[]>(global.domainSocket, uri, METHOD.GET, undefined, undefined, undefined);
};

const subscribeMarketStatus = () => {
  const channelName = 'market.status';
  const subscribeChannelStatus = global.domainSocket.subscribe(channelName, { batch: true });
  subscribeChannelStatus.watch((res: IMarketStatus) => {
    receiveMarketStatusData(res);
  });
};

const receiveMarketStatusData = (payload: IMarketStatus) => {
  store.dispatch({
    type: GLOBAL_MARKET_STATUS_CHANGE_DATA,
    payload,
  });
};
function* loadMarketData() {
  let payload: ISymbolInfo[] = [];
  try {
    payload = yield loadSymbolList();

    handlePayload(payload);

    yield put({
      type: GLOBAL_SYMBOL_LIST,
      payload: typeof payload === 'string' ? JSON.parse((payload as unknown) as string) : payload,
    });
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Symbol Data',
        content: i18next.t('FAILED_LOAD_MARKET_DATA') + i18next.t(error.code ?? error.message),
        time: new Date(),
      },
    });
    console.log(error);

    payload = yield getKey<ISymbolInfo[]>(SYMBOL_LIST_STORAGE_KEY);
    yield put({
      type: GLOBAL_SYMBOL_LIST,
      payload: typeof payload === 'string' ? JSON.parse((payload as unknown) as string) : payload,
    });
  } finally {
    yield doInitMarketExtra();
  }
}
function* doInitMarket() {
  global.symbolData = {};
  global.subscribeChannels = {};
  global.quoteChannel = {
    channelType: REALTIME_CHANNEL_DATA_TYPE.QUOTE,
  };
  global.bidOfferChannel = {
    channelType: REALTIME_CHANNEL_DATA_TYPE.BID_OFFER,
  };

  let payload: ISymbolInfo[] = [];
  try {
    payload = yield loadSymbolList();

    handlePayload(payload);

    yield put({
      type: GLOBAL_SYMBOL_LIST,
      payload: typeof payload === 'string' ? JSON.parse((payload as unknown) as string) : payload,
    });

    const marketStatuses = yield call(getMarketStatus);

    yield put({
      type: GLOBAL_MARKET_STATUS,
      payload: marketStatuses.data,
    });

    subscribeMarketStatus();
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Market Data',
        content: i18next.t('FAILED_LOAD_MARKET_DATA') + i18next.t(error.code ?? error.message),
        time: new Date(),
      },
    });
    console.log(error);

    payload = yield getKey<ISymbolInfo[]>(SYMBOL_LIST_STORAGE_KEY);
    yield put({
      type: GLOBAL_SYMBOL_LIST,
      payload: typeof payload === 'string' ? JSON.parse((payload as unknown) as string) : payload,
    });
  } finally {
    yield put({
      type: GLOBAL_MARKET_INIT,
    });
  }
  yield doInitMarketExtra();
}

export function* doInitMarketExtra() {
  try {
    const userExtraInfo = store.getState().userExtraInfo;
    const selectedAccount = store.getState().selectedAccount;

    const symbolMap = getSymbolMap(store.getState());
    const stockList = getStockList(store.getState());

    if (
      userExtraInfo == null ||
      userExtraInfo.currentSymbol == null ||
      (symbolMap && symbolMap[userExtraInfo.currentSymbol.s] == null) ||
      (selectedAccount && getSystemType(userExtraInfo.currentSymbol.t) !== selectedAccount.type)
    ) {
      if (selectedAccount == null || selectedAccount.type === SYSTEM_TYPE.EQUITY) {
        if (config.defaultSymbol && symbolMap[config.defaultSymbol] != null) {
          userExtraInfo.currentSymbol = symbolMap[config.defaultSymbol];
        } else {
          if (stockList) {
            userExtraInfo.currentSymbol = stockList[0];
          }
        }
      } else {
        const futureList = getFuturesList(store.getState());
        if (futureList && futureList.length > 0) {
          const indexFuture = futureList.find((item) => item.bs === SYMBOL_TYPE.INDEX);
          if (indexFuture) {
            userExtraInfo.currentSymbol = indexFuture;
          } else {
            userExtraInfo.currentSymbol = futureList[0];
          }
        } else {
          if (stockList) {
            if (config.defaultSymbol && symbolMap[config.defaultSymbol] != null) {
              userExtraInfo.currentSymbol = symbolMap[config.defaultSymbol];
            } else {
              userExtraInfo.currentSymbol = stockList[0];
            }
          }
        }
      }
    }

    if (userExtraInfo.currentSymbol) {
      yield put({
        type: MARKET_SET_CURRENT_SYMBOL,
        payload: userExtraInfo.currentSymbol,
      });
    } else {
      if (config.defaultSymbol && symbolMap[config.defaultSymbol] != null) {
        yield put({
          type: MARKET_SET_CURRENT_SYMBOL,
          payload: symbolMap[config.defaultSymbol],
        });
      } else {
        if (stockList) {
          yield put({
            type: MARKET_SET_CURRENT_SYMBOL,
            payload: stockList[0],
          });
        }
      }
    }

    if (userExtraInfo.settings) {
      if (userExtraInfo.settings.autoLockPrevention === true) {
        KeepAwake.activate();
      } else {
        KeepAwake.deactivate();
      }
    } else {
      KeepAwake.deactivate();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* watchInitMarket() {
  yield takeLatest(RELOAD_MARKET_DATA, loadMarketData);
  yield takeSingle(MARKET_INIT, doInitMarket);
}

export function* watchInitMarketExtra() {
  yield takeLatest(MARKET_INIT_EXTRA, doInitMarketExtra);
}
