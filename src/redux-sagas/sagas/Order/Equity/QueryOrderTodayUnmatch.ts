import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { ORDER_QUERY_ORDER_TODAY_UNMATCH } from 'redux-sagas/actions';
import config from 'config';

const queryOrderTodayUnmatch = (params: IObject) => {
  const uri = config.usingNewKisCore === true ? 'services/eqt/enquiryorder' : 'equity/order/history';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryOrderTodayUnmatch(request: IRequest<IObject>) {
  try {
    const isKisNewCore = config.usingNewKisCore === true;
    let result: IObject[] = [];

    if (request.payload.loadMore === true) {
      request.payload.lastOrderDate = store.getState().equityOrderTodayUnmatch!.lastOrderDate;
      request.payload.lastBranchCode = store.getState().equityOrderTodayUnmatch!.lastBranchCode;
      request.payload.lastOrderNumber = store.getState().equityOrderTodayUnmatch!.lastOrderNumber;
      request.payload.lastMatchPrice = store.getState().equityOrderTodayUnmatch!.lastMatchPrice;
    }

    if (isKisNewCore) {
      request.payload.accountNo = store.getState().selectedAccount!.accountNumber;
      request.payload.stockSymbol = request.payload.stockSymbol ?? '';
    } else {
      request.payload.accountNumber = store.getState().selectedAccount!.accountNumber;
    }
    request.payload.subNumber = store.getState().selectedAccount!.subNumber;

    if (isKisNewCore) {
      const response = yield call(queryOrderTodayUnmatch, request.payload);

      if (request.isSpeedOrder) {
        yield put({
          type: request.response.success,
          payload: {
            data: response.data.beanList,
            code: request.payload.stockCode,
          },
        });
      }
      if (request.payload.loadMore === true) {
        yield put({
          type: request.response.success,
          payload: {
            nextData: response.data.beanList,
            next: true,
            lastOrderDate: request.payload.lastOrderDate,
            lastBranchCode: request.payload.lastBranchCode,
            lastOrderNumber: request.payload.lastOrderNumber,
            lastMatchPrice: request.payload.lastMatchPrice,
            offset: (request.payload.offset as number) + response.data.beanList.length,
            code: request.payload.stockCode,
          },
        });
      } else {
        yield put({
          type: request.response.success,
          payload: {
            data: response.data.beanList,
            next: false,
            lastOrderDate: request.payload.lastOrderDate,
            lastBranchCode: request.payload.lastBranchCode,
            lastOrderNumber: request.payload.lastOrderNumber,
            lastMatchPrice: request.payload.lastMatchPrice,
            offset: (request.payload.offset as number) + response.data.beanList.length,
            code: request.payload.stockCode,
          },
        });
      }
    } else {
      while (result.length < request.payload.fetchCount) {
        const response = yield call(queryOrderTodayUnmatch, request.payload);

        const realCount = response.data.length;

        if (response.data && response.data.length > 0) {
          request.payload.lastOrderDate = response.data[response.data.length - 1].orderDate;
          request.payload.lastBranchCode = response.data[response.data.length - 1].branchCode;
          request.payload.lastOrderNumber = response.data[response.data.length - 1].orderNumber;
          request.payload.lastMatchPrice = response.data[response.data.length - 1].matchedPrice;
        }

        const data = response.data.filter(
          (item: IObject) =>
            item.orderQuantity! > 0 &&
            item.unmatchedQuantity! > 0 &&
            (item.orderStatus === 'RECEIPT' ||
              item.orderStatus === 'RECEIPT_CONFIRM' ||
              item.orderStatus === 'PARTIAL_FILLED')
        );
        result = result.concat(data);
        if (realCount < request.payload.fetchCount) {
          break;
        }
      }

      if (request.payload.loadMore === true) {
        yield put({
          type: request.response.success,
          payload: {
            nextData: result,
            next: true,
            lastOrderDate: request.payload.lastOrderDate,
            lastBranchCode: request.payload.lastBranchCode,
            lastOrderNumber: request.payload.lastOrderNumber,
            lastMatchPrice: request.payload.lastMatchPrice,
          },
        });
      } else {
        yield put({
          type: request.response.success,
          payload: {
            data: result,
            next: false,
            lastOrderDate: request.payload.lastOrderDate,
            lastBranchCode: request.payload.lastBranchCode,
            lastOrderNumber: request.payload.lastOrderNumber,
            lastMatchPrice: request.payload.lastMatchPrice,
          },
        });
      }
    }
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryOrderTodayUnmatch() {
  yield takeLatest(ORDER_QUERY_ORDER_TODAY_UNMATCH, doQueryOrderTodayUnmatch);
}
