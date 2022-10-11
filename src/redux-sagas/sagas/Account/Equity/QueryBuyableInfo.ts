import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { ACCOUNT_QUERY_EQUITY_BUYABLE_INFO } from 'redux-sagas/actions';
import config from 'config';

const queryBuyableInfo = (params: IObject) => {
  const uri = config.usingNewKisCore === false ? 'equity/account/buyable' : 'services/eqt/genbuyall';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryBuyableInfo(request: IRequest<IObject>) {
  try {
    let params;
    if (config.usingNewKisCore === false) {
      params = {
        accountNumber: store.getState().selectedAccount!.accountNumber,
        subNumber: store.getState().selectedAccount!.subNumber,
        bankCode: store.getState().accountBank!.bankCode,
        bankName: store.getState().accountBank!.bankName,
        stockCode: store.getState().currentSymbol!.s,
        securitiesType: store.getState().currentSymbol!.t,
        marketType: store.getState().currentSymbol!.m,
        ...request.payload,
      };
    } else {
      params = {
        ...request.payload,
      };
    }
    const response = yield call(queryBuyableInfo, params);
    if (config.usingNewKisCore === false) {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          account: store.getState().selectedAccount,
          accountBank: store.getState().accountBank,
          orderPrice: request.payload.orderPrice,
          symbol: store.getState().currentSymbol,
        },
      });
    } else {
      yield put({
        type: request.response.success,
        payload: {
          data: response.data,
          account: store.getState().selectedAccount,
          orderPrice: request.payload.orderPrice,
          symbol: store.getState().currentSymbol,
        },
      });
    }
  } catch (err) {
    yield put({ type: request.response.failure });
  }
}

export default function* watchQueryBuyableInfo() {
  yield takeLatest(ACCOUNT_QUERY_EQUITY_BUYABLE_INFO, doQueryBuyableInfo);
}
