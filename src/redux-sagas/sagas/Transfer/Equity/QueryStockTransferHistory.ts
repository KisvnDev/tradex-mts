import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { TRANSFER_STOCK_QUERY_TRANSACTION_HISTORY } from 'redux-sagas/actions';
import config from 'config';

const queryStockTransferHistory = (data: IObject) => {
  const isKisCore = config.usingNewKisCore;
  const uri = isKisCore ? 'services/eqt/enquiryInstrumentDW' : 'equity/transfer/stock/history';
  const params: any = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    subNumber: store.getState().selectedAccount!.subNumber,
    ...data,
  };
  isKisCore && (params.symbol = 'ALL');
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryStockTransferHistory(request: IRequest<IObject>) {
  try {
    const isKisCore = config.usingNewKisCore;
    const { loadMore } = request.payload;

    if (isKisCore) {
      request.payload.offset = loadMore ? store.getState().stockTransferHistory!.offset : 0;
    } else {
      const { lastTransactionDate, lastSequenceNumber } = store.getState().stockTransferHistory!;
      loadMore && (request.payload = { ...request.payload, lastTransactionDate, lastSequenceNumber });
    }

    const response = yield call(queryStockTransferHistory, request.payload);
    const data = response.data;

    //TODO: Set payload action
    let payload: any = {};
    if (!isKisCore) {
      const { transactionDate = null, sequenceNumber = null } = data.length ? data[data.length - 1] : {};
      payload = { transactionDate, sequenceNumber };
    } else {
      let offset = ((request.payload.loadMore && store.getState()?.stockTransferHistory?.offset) || 0) + data.length;
      payload = { offset };
    }
    payload[loadMore ? 'nextData' : 'data'] = data;
    payload.next = loadMore;

    //TODO: dispatch success get list transfer history
    yield put({
      type: request.response.success,
      payload,
    });
  } catch (err) {
    yield put({ type: request.response.failure });
  }
}

export default function* watchQueryStockTransferHistory() {
  yield takeLatest(TRANSFER_STOCK_QUERY_TRANSACTION_HISTORY, doQueryStockTransferHistory);
}
