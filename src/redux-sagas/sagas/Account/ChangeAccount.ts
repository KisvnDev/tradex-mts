import { put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import config from 'config';
import { setKey } from 'utils/asyncStorage';
import { isStockType } from 'utils/market';
import { SYMBOL_TYPE, SYSTEM_TYPE } from 'global';
import { GLOBAL_SELECTED_ACCOUNT } from 'redux-sagas/global-reducers/SelectedAccount-reducers';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import { MARKET_SET_CURRENT_SYMBOL, ACCOUNT_CHANGE_ACCOUNT } from 'redux-sagas/actions';
import { IRequest, IAccount } from 'interfaces/common';
import { getFuturesList, getStockList, getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';

function* doChangeAccount(request: IRequest<IAccount>) {
  try {
    yield put({
      type: GLOBAL_SELECTED_ACCOUNT,
      payload: request.payload,
    });

    const userExtraInfo = store.getState().userExtraInfo;

    userExtraInfo.selectedAccount = request.payload;

    const currentSymbol = store.getState().currentSymbol;

    yield put({
      type: GLOBAL_USER_EXTRA_INFO,
      payload: userExtraInfo,
    });

    if (store.getState().userInfo) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }

    if (userExtraInfo.selectedAccount && userExtraInfo.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
      if (currentSymbol == null || isStockType(currentSymbol.t)) {
        let currentFutures = store.getState().currentFutures;
        if (currentFutures == null) {
          const futureList = getFuturesList(store.getState());
          if (futureList && futureList.length > 0) {
            const indexFuture = futureList.find((item) => item.bs === SYMBOL_TYPE.INDEX);
            if (indexFuture) {
              currentFutures = indexFuture;
            } else {
              currentFutures = futureList[0];
            }
          }
        }

        if (currentFutures != null) {
          yield put({
            type: MARKET_SET_CURRENT_SYMBOL,
            payload: currentFutures,
            accountChanged: true,
          });
        }
      }
    } else {
      if (currentSymbol == null || currentSymbol.t === SYMBOL_TYPE.FUTURES) {
        let currentStock = store.getState().currentStock;
        if (currentStock == null) {
          const stockList = getStockList(store.getState());
          if (config.defaultSymbol && getSymbolMap[config.defaultSymbol] != null) {
            currentStock = getSymbolMap[config.defaultSymbol];
          } else if (stockList && stockList.length > 0) {
            currentStock = stockList[0];
          }
        }

        if (currentStock != null) {
          yield put({
            type: MARKET_SET_CURRENT_SYMBOL,
            payload: currentStock,
            accountChanged: true,
          });
        }
      }
    }
  } catch (err) {
    //todo
  }
}

export default function* watchChangeAccount() {
  yield takeLatest(ACCOUNT_CHANGE_ACCOUNT, doChangeAccount);
}
