import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { QUERY_TRANSACTION_INFO } from 'redux-sagas/actions';
import store from 'redux-sagas/store';
import { transactionInfoDto } from './TransactionInfoDto';

const queryTransactionInfo = (params: IObject) => {
  const uri = 'services/eqt/querySoldOrders';

  return query(global.domainSocket, uri, METHOD.GET, params);
};

const queryTransactionInfoIICA = (params: { subAccountID?: string; mvBankID?: string; mvSettlement?: string }) => {
  const uri = 'services/eqt/queryAdvancePaymentInfo';

  return query(global.domainSocket, uri, METHOD.POST, params, undefined, undefined, undefined, 'restttl');
};

function* doQueryTransactionInfo(request: IRequest<IObject>) {
  try {
    const bankId = store.getState().bankInfoIica?.data?.find((item) => item.isDefault)?.bankID;
    if (global.isIicaAccount) {
      const params = {
        subAccountID: store.getState().selectedAccount!.accountNumber,
        mvBankID: bankId,
        mvSettlement: '3T',
      };

      const response = yield call(queryTransactionInfoIICA, params);

      const data = transactionInfoDto(response, bankId);

      yield put({
        type: request.response.success,
        payload: data,
      });

      return;
    }

    const response = yield call(queryTransactionInfo, request.payload);

    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
      payload: error,
    });
  }
}

export default function* watchQueryTransactionInfo() {
  yield takeLatest(QUERY_TRANSACTION_INFO, doQueryTransactionInfo);
}
