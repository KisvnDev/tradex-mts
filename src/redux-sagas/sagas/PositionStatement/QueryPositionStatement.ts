import { call, put, takeLatest } from '@redux-saga/core/effects';
import { IObject, IRequest } from 'interfaces/common';
import { QUERY_POSITION_STATEMENT } from 'redux-sagas/actions';
import store from 'redux-sagas/store';
import { METHOD, query } from 'utils/socketApi';

const queryClientCashBalance = (data: IObject) => {
  const uri = 'services/fno/clientstockstatementenquiry';
  const params = {
    accountNo: store.getState().selectedAccount?.accountNumber,
    ...data,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryStockStatementEnquiryIo(request: IRequest<IObject>) {
  try {
    const response: Res<StockStatementEnquiry> = yield call(queryClientCashBalance, request.payload);

    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {}
}

export default function* watchPositionStatementQuery() {
  yield takeLatest(QUERY_POSITION_STATEMENT, doQueryStockStatementEnquiryIo);
}
