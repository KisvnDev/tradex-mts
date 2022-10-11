import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { RIGHTS_SUBSCRIPTION_QUERY_AVAILABLE } from 'redux-sagas/actions';
import config from 'config';

const queryRightsAvailable = (data: IObject) => {
  const uri = config.usingNewKisCore === false ? 'equity/rights/available' : 'services/eqt/getAdditionIssueShareInfo';
  const params =
    config.usingNewKisCore === false
      ? {
          accountNumber: store.getState().selectedAccount!.accountNumber,
          subNumber: store.getState().selectedAccount!.subNumber,
          rightType: data.rightType,
          lastSequenceNumber: data.lastSequenceNumber ? data.lastSequenceNumber : null,
          lastBaseDate: data.lastBaseDate ? data.lastBaseDate : null,
          lastStockCode: data.lastLoanOrderType ? data.lastStockCode : null,
          fetchCount: data.fetchCount,
        }
      : {
          accountNumber: store.getState().selectedAccount!.accountNumber,
          fetchCount: data.fetchCount,
        };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

const queryRightsList = (data: IObject) => {
  const uri = data.rightType != null ? 'services/eqt/getAllRightList' : 'services/eqt/getEntitlementHistory';
  let params = {};
  if (data.rightType != null) {
    params = {
      symbol: data.symbol,
      rightType: data.rightType,
      fromDate: data.fromDate,
      toDate: data.toDate,
      offset: data.offset,
      fetchCount: data.fetchCount,
      accountNo: store.getState().selectedAccount!.accountNumber,
    };
  } else {
    params = {
      symbol: data.symbol,
      rightType: data.rightType,
      fromDate: data.fromDate,
      toDate: data.toDate,
      offset: data.offset,
      status: 'ALL',
      fetchCount: data.fetchCount,
      accountNumber: store.getState().selectedAccount!.accountNumber,
    };
  }
  return query(global.domainSocket, uri, METHOD.GET, params);
};

const queryAvailableExercise = () => {
  const uri = 'services/eqt/accountbalance';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryRightsAvailable(request: IRequest<IObject>) {
  try {
    if (request.payload.isRightList === true) {
      const response = yield call(queryRightsList, request.payload);
      const data = response.data;
      if (request.payload.loadMore === true) {
        yield put({
          type: request.response.success,
          payload: {
            nextData: data,
            offset: (request.payload.offset as number) + response.data.length,
            next: true,
          },
        });
      } else {
        yield put({
          type: request.response.success,
          payload: {
            data,
            offset: (request.payload.offset as number) + response.data.length,
            next: false,
          },
        });
      }
    } else {
      if (config.usingNewKisCore === false) {
        if (request.payload.loadMore === true) {
          request.payload.lastSequenceNumber = store.getState().rightsAvailable!.lastSequenceNumber;
          request.payload.lastStockCode = store.getState().rightsAvailable!.lastStockCode;
          request.payload.lastBaseDate = store.getState().rightsAvailable!.lastBaseDate;
        }

        const response = yield call(queryRightsAvailable, request.payload);
        const data = response.data;

        const lastSequenceNumber = data.length > 0 ? data[data.length - 1].lastSequenceNumber : null;
        const lastStockCode = data.length > 0 ? data[data.length - 1].stockCode : null;
        const lastBaseDate = data.length > 0 ? data[data.length - 1].lastBaseDate : null;

        if (request.payload.loadMore === true) {
          yield put({
            type: request.response.success,
            payload: {
              nextData: data,
              lastSequenceNumber,
              lastBaseDate,
              lastStockCode,
              next: true,
            },
          });
        } else {
          yield put({
            type: request.response.success,
            payload: {
              data,
              lastSequenceNumber,
              lastBaseDate,
              lastStockCode,
              next: false,
            },
          });
        }
      } else {
        const response = yield call(queryRightsAvailable, request.payload);
        const responseAvailableExercise = yield call(queryAvailableExercise);
        const data = response.data;
        if (request.payload.loadMore === true) {
          yield put({
            type: request.response.success,
            payload: {
              dataAvailableExercise: responseAvailableExercise.data,
              nextData: data,
              offset: (request.payload.offset as number) + response.data.length,
              next: true,
            },
          });
        } else {
          yield put({
            type: request.response.success,
            payload: {
              dataAvailableExercise: responseAvailableExercise.data,
              data,
              offset: (request.payload.offset as number) + response.data.length,
              next: false,
            },
          });
        }
      }
    }
  } catch (err) {
    yield put({ type: request.response.failure, data: null });
  }
}

export default function* watchQueryRightsAvailable() {
  yield takeLatest(RIGHTS_SUBSCRIPTION_QUERY_AVAILABLE, doQueryRightsAvailable);
}
