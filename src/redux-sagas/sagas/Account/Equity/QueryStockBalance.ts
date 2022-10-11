import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { ACCOUNT_QUERY_STOCK_BALANCE } from 'redux-sagas/actions';
import config from 'config';

const queryStockBalance = (data: IObject) => {
  const uri = config.usingNewKisCore === false ? 'equity/account/profitLoss' : 'services/eqt/enquiryportfolio';

  const accountBank = store.getState().accountBank;

  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    lastStockCode: data.lastStockCode,
    fetchCount: data.fetchCount,
    bankCode: accountBank ? accountBank.bankCode : null,
    bankName: accountBank ? accountBank.bankName : null,
  };

  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryStockBalance(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastStockCode = store.getState().stockBalance!.lastStockCode;
    }
    const response = yield call(queryStockBalance, request.payload);

    if (config.usingNewKisCore === false) {
      let lastStockCode = null;
      const data = response.data.profitLossItems;

      if (data && data.length > 0) {
        lastStockCode = data[data.length - 1].stockCode;
      }

      if (request.payload.loadMore === true) {
        yield put({
          type: request.response.success,
          payload: {
            extraData: response.data,
            nextData: data,
            next: true,
            lastStockCode,
          },
        });
      } else {
        yield put({
          type: request.response.success,
          payload: {
            extraData: response.data,
            data,
            next: false,
            lastStockCode,
          },
        });
      }
    } else {
      yield put({
        type: request.response.success,
        payload: response.data != null && response.data[0] != null ? response.data[0] : null,
      });
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({ type: request.response.failure });
    }
  }
}

export default function* watchQueryStockBalance() {
  yield takeLatest(ACCOUNT_QUERY_STOCK_BALANCE, doQueryStockBalance);
}
