import { put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { setKey } from 'utils/asyncStorage';
import { isStockType } from 'utils/market';
import { IRequest } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { SYMBOL_TYPE, SYSTEM_TYPE } from 'global';
import {
  GLOBAL_CURRENT_SYMBOL,
  GLOBAL_CURRENT_STOCK,
  GLOBAL_CURRENT_FUTURES,
  GLOBAL_CURRENT_CW,
} from 'redux-sagas/global-reducers/CurrentSymbol-reducers';
import {
  MARKET_SET_CURRENT_SYMBOL,
  MARKET_QUERY_SYMBOL_DATA,
  MARKET_SUBSCRIBE_CURRENT_SYMBOL,
} from 'redux-sagas/actions';
import { GLOBAL_SELECTED_ACCOUNT } from 'redux-sagas/global-reducers/SelectedAccount-reducers';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import { ORDER_PRICE } from 'components/OrderForm/reducers';
import config from 'config';

function* doSetCurrentSymbol(request: IRequest<ISymbolInfo>) {
  try {
    const userExtraInfo = store.getState().userExtraInfo;
    userExtraInfo.currentSymbol = request.payload;

    yield put({
      type: GLOBAL_CURRENT_SYMBOL,
      payload: request.payload,
    });

    store.dispatch({
      type: ORDER_PRICE,
      payload: null,
    });

    store.dispatch({
      type: MARKET_QUERY_SYMBOL_DATA,
      payload: {
        symbolList: [request.payload.s],
      },
    });

    store.dispatch({
      type: MARKET_SUBSCRIBE_CURRENT_SYMBOL,
      payload: {
        code: request.payload.s,
        symbolType: request.payload.t,
      },
    });

    if (isStockType(request.payload.t)) {
      store.dispatch({
        type: GLOBAL_CURRENT_STOCK,
        payload: request.payload,
      });
    } else if (request.payload.t === SYMBOL_TYPE.FUTURES) {
      store.dispatch({
        type: GLOBAL_CURRENT_FUTURES,
        payload: request.payload,
      });
    } else if (request.payload.t === SYMBOL_TYPE.CW) {
      store.dispatch({
        type: GLOBAL_CURRENT_CW,
        payload: request.payload,
      });
    }

    if (request.accountChanged !== true) {
      const selectedAccount = store.getState().selectedAccount;

      let switchedSub = null;
      if (selectedAccount) {
        if (
          (isStockType(request.payload.t) || request.payload.t === SYMBOL_TYPE.CW) &&
          selectedAccount.type === SYSTEM_TYPE.DERIVATIVES
        ) {
          switchedSub = SYSTEM_TYPE.EQUITY;
        } else if (request.payload.t === SYMBOL_TYPE.FUTURES && selectedAccount.type === SYSTEM_TYPE.EQUITY) {
          switchedSub = SYSTEM_TYPE.DERIVATIVES;
        }
      }

      if (switchedSub && selectedAccount) {
        const accountListInfo = store.getState().accountList;

        for (let index = accountListInfo.length - 1; index >= 0; index--) {
          if (config.usingNewKisCore === false) {
            if (
              accountListInfo[index].type === switchedSub &&
              accountListInfo[index].accountNumber === selectedAccount.accountNumber
            ) {
              yield put({
                type: GLOBAL_SELECTED_ACCOUNT,
                payload: accountListInfo[index],
              });

              userExtraInfo.selectedAccount = accountListInfo[index];
              break;
            }
          } else {
            if (accountListInfo[index].type === switchedSub) {
              yield put({
                type: GLOBAL_SELECTED_ACCOUNT,
                payload: accountListInfo[index],
              });

              userExtraInfo.selectedAccount = accountListInfo[index];
              break;
            }
          }
        }
      }
    }

    store.dispatch({
      type: GLOBAL_USER_EXTRA_INFO,
      payload: userExtraInfo,
    });

    if (store.getState().userInfo) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }
  } catch (err) {
    console.log(err);
  }
}

export default function* watchSetCurrentSymbol() {
  yield takeLatest(MARKET_SET_CURRENT_SYMBOL, doSetCurrentSymbol);
}
