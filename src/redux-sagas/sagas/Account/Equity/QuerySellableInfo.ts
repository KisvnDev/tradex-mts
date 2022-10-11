import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IRequest, IObject } from 'interfaces/common';
import { SYSTEM_TYPE } from 'global';
import { ACCOUNT_QUERY_EQUITY_SELLABLE_INFO } from 'redux-sagas/actions';
import config from 'config';

const querySellableInfo = (params: IObject) => {
  const uri = config.usingNewKisCore === false ? 'equity/account/sellable' : 'services/eqt/enquiryportfolio';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doGetQuerySellableInfo(request: IRequest<IObject>) {
  try {
    if (config.usingNewKisCore === false) {
      let params: IObject = {};
      let sellableList = {};

      if (store.getState().selectedAccount) {
        let dataTemp = {};
        if (store.getState().selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
          params = {
            accountNumber: store.getState().selectedAccount!.accountNumber,
            subNumber: store.getState().selectedAccount!.subNumber,
            fetchCount: 100,
          };
          let response: IObject = {};
          let sellableListData: IObject[] = [];

          let firstQuery = true;
          while (
            firstQuery ||
            (response.data != null &&
              (response.data as IObject[]).length > 0 &&
              (response.data as IObject[]).length === params.fetchCount)
          ) {
            if (firstQuery !== true) {
              params.lastStockCode = (response.data as IObject[])[(response.data as IObject[]).length - 1].stockCode;
            }

            firstQuery = false;

            response = yield call(querySellableInfo, params);
            sellableListData = sellableListData.concat(response.data as IObject[]);
          }
          dataTemp = sellableListData.reduce((map: IObject, obj: IObject) => {
            map[obj.stockCode as string] = obj;
            return map;
          }, {});

          sellableList[
            `${store.getState().selectedAccount!.accountNumber}${store.getState().selectedAccount!.subNumber}`
          ] = dataTemp;
        }
      }

      yield put({
        type: request.response.success,
        payload: sellableList,
      });
    } else {
      const response = yield call(querySellableInfo, {
        accountNumber: store.getState().selectedAccount!.accountNumber,
      });

      yield put({
        type: request.response.success,
        payload: {
          sellable:
            (response.data[0].portfolioList as IObject[]).find((item) => item.symbol === request.payload.symbolCode) !=
            null
              ? (response.data[0].portfolioList as IObject[]).find(
                  (item) => item.symbol === request.payload.symbolCode
                )!.sellable
              : 0,
        },
      });
    }
  } catch (err) {
    yield put({
      type: request.response.failure,
    });
  }
}

export default function* watchQuerySellableInfo() {
  yield takeLatest(ACCOUNT_QUERY_EQUITY_SELLABLE_INFO, doGetQuerySellableInfo);
}
