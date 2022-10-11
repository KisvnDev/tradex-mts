import { call, put, takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { IRequest } from 'interfaces/common';
import { ACCOUNT_QUERY_ACCOUNT_INFO, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { GLOBAL_ACCOUNT_INFO } from 'redux-sagas/global-reducers/AccountInfo-reducers';
import { NOTIFICATION_TYPE } from 'global';
import config from 'config';

const queryAccountInfo = () => {
  const isUseNewKisCore = config.usingNewKisCore;

  const uri = isUseNewKisCore ? 'services/eqt/getclientdetail' : 'equity/account/info';

  let params = {};

  if (isUseNewKisCore) {
    params = {
      clientID: global.username,
    };
  } else {
    params = {
      accountNumber: store.getState().selectedAccount!.accountNumber,
      subNumber: store.getState().selectedAccount!.subNumber,
    };
  }
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryAccountInfo(request: IRequest<null>) {
  try {
    const response = yield call(queryAccountInfo);

    yield put({
      type: GLOBAL_ACCOUNT_INFO,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Account Info',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryAccountInfo() {
  yield takeLatest(ACCOUNT_QUERY_ACCOUNT_INFO, doQueryAccountInfo);
}
