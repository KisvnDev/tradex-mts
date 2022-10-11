import { call, put, takeLatest } from 'redux-saga/effects';

import { IRequest, IObject } from 'interfaces/common';
import { QUERY_CALCULATE_INTEREST } from 'redux-sagas/actions';
import { METHOD, query } from 'utils/socketApi';
import store from 'redux-sagas/store';

const calculateInterestIica = (params: any) => {
  const uri = 'services/eqt/calculateInterestAmt';

  return query(global.domainSocket, uri, METHOD.POST, params, undefined, undefined, undefined, 'restttl');
};

function* queryCalculateInterest(request: IRequest<IObject>) {
  try {
    const params = {
      subAccountID: store.getState().selectedAccount?.accountNumber,
      mvAmount: request.payload?.mvAmount,
      mvSettlement: request.payload?.mvSettlement,
    };
    const response = yield call(calculateInterestIica, params);

    yield put({ type: request.response.success, payload: response });
  } catch (error) {
    yield put({
      type: request.response.failure,
      error,
    });
  }
}

export default function* watchQueryCalculateInterest() {
  yield takeLatest(QUERY_CALCULATE_INTEREST, queryCalculateInterest);
}
