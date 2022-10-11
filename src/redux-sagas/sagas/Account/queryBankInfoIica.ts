import { call, put, takeEvery } from 'redux-saga/effects';
import { SYSTEM_TYPE } from 'global';
import { QUERY_BANK_INFO_IICA } from 'redux-sagas/actions';
import { METHOD, query } from 'utils/socketApi';
import { IAccount, IObject, IRequest, IResponse } from '../../../interfaces/common';

const isDerivativesAccount = (account: IAccount) => account.type === SYSTEM_TYPE.DERIVATIVES;

const queryBankInfoIica = (account: IAccount) => {
  const uri = isDerivativesAccount(account) ? 'services/fno/queryBankInfo' : 'services/eqt/queryBankInfo';

  return query(global.domainSocket, uri, METHOD.GET, { accountNo: account?.accountNumber });
};

function* doQueryBankInfoIica(request: IRequest<any>) {
  try {
    const response: IResponse<any> = yield call(queryBankInfoIica, request.payload.account);

    if (response.data?.[0]) {
      const data = response.data.find((item: IObject) => item.isDefault);
      const isDefault = data?.isDefault;
      global.isIicaAccount = isDefault;

      yield put({
        type: request.response.success,
        payload: response,
      });
    } else {
      global.isIicaAccount = false;
    }
  } catch (error) {
    global.isIicaAccount = false;
    yield put({
      type: request.response.failure,
      payload: error,
    });
  }
}

export default function* watchQueryBankInfoIica() {
  yield takeEvery(QUERY_BANK_INFO_IICA, doQueryBankInfoIica);
}
