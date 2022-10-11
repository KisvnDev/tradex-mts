import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { IRequest, IResponse, IObject } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { SECURED_LOAN_QUERY_LOAN_DETAIL } from 'redux-sagas/actions';

const querySecuredLoanDetail = (params: IObject) => {
  const uri = 'equity/loan/detail';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQuerySecuredLoanDetail(request: IRequest<IObject>) {
  try {
    let firstQuery = true;
    let response: IResponse<IObject[]> = {
      data: [],
    };
    const params: IObject = {
      ...request.payload,
      fetchCount: 100,
      accountNumber: store.getState().selectedAccount!.accountNumber,
      subNumber: store.getState().selectedAccount!.subNumber,
    };
    let data: IObject[] = [];

    while (
      firstQuery ||
      (response.data != null && response.data.length > 0 && response.data.length === params.fetchCount)
    ) {
      if (firstQuery !== true) {
        params.lastSettleBankCode = response.data[response.data.length - 1].settleBankCode;
        params.lastStockCode = response.data[response.data.length - 1].stockCode;
        params.lastLoanOrderType = response.data[response.data.length - 1].loanOrderType;
      }

      firstQuery = false;
      response = yield call(querySecuredLoanDetail, params);
      data = data.concat(response.data);
    }

    yield put({
      type: request.response.success,
      payload: data,
    });
  } catch (err) {
    yield put({
      type: request.response.failure,
    });
  }
}

export default function* watchQuerySecuredLoanDetail() {
  yield takeLatest(SECURED_LOAN_QUERY_LOAN_DETAIL, doQuerySecuredLoanDetail);
}
