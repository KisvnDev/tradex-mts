import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IObject, IRequest } from 'interfaces/common';
import { ACCOUNT_QUERY_ACCOUNT_MOBILE } from 'redux-sagas/actions';

const queryAccountMobile = (params: IObject) => {
  const uri = 'equity/account/mobile';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountMobile(request: IRequest<IObject>) {
  try {
    const response = yield call(queryAccountMobile, request.payload);
    yield put({
      type: request.response.success,
      payload: response.data.phoneNumber,
    });
  } catch (err) {}
}

export default function* watchQueryAccountMobile() {
  yield takeLatest(ACCOUNT_QUERY_ACCOUNT_MOBILE, doQueryAccountMobile);
}
