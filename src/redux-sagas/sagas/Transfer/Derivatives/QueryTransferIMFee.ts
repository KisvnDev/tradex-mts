import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_FEE } from 'redux-sagas/actions';

const queryTransferIMFee = (data: IObject) => {
  const uri = 'derivatives/transfer/im/fee';
  const params = {
    accountNumber: store.getState().selectedAccount!.accountNumber,
    ...data,
  };

  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryTransferIMFee(request: IRequest<IObject>) {
  try {
    const response = yield call(queryTransferIMFee, request.payload);

    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    if (request.response.failure) {
      yield put({
        type: request.response.failure,
      });
    }
  }
}

export default function* watchQueryTransferIMFee() {
  yield takeLatest(DERIVATIVES_TRANSFER_QUERY_TRANSFER_IM_FEE, doQueryTransferIMFee);
}
