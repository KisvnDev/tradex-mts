import { call, put, takeEvery } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_BANK } from 'redux-sagas/actions';

const queryTransferIMBank = (data: IObject) => {
  const uri = 'derivatives/transfer/im/bank';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    ...data,
  };

  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryTransferIMBank(request: IRequest<IObject>) {
  try {
    const response = yield call(queryTransferIMBank, request.payload);
    yield put({
      type: request.response.success,
      payload: {
        ...response.data,
        accountNumber: store.getState().selectedAccount!.accountNumber,
      },
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryTransferIMBank() {
  yield takeEvery(DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_BANK, doQueryTransferIMBank);
}
