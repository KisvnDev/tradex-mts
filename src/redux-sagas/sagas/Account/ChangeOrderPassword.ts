import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { NOTIFICATION_TYPE } from 'global';
import store from 'redux-sagas/store';
import config from 'config';
import { COMMON_SHOW_NOTIFICATION, ACCOUNT_CHANGE_ORDER_PASSWORD } from 'redux-sagas/actions';

const changeOrderPassword = (data: IObject) => {
  const isUsingNewKis = config.usingNewKisCore;

  const uri = isUsingNewKis ? 'services/eqt/changePin' : 'equity/account/changePassword';

  let paramsTemp = {};

  if (!isUsingNewKis) {
    paramsTemp = {
      accountNumber: store.getState().selectedAccount!.accountNumber,
      subNumber: store.getState().selectedAccount!.subNumber,
    };
  }
  const params = { ...paramsTemp, ...data };
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doChangeOrderPassword(request: IRequest<IObject>) {
  const isUsingNewKis = config.usingNewKisCore;

  try {
    const data = request.payload;

    yield call(changeOrderPassword, data);
    yield put({
      type: request.response.success,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: isUsingNewKis ? 'Change Pin' : 'Change order password',
        content: 'CHANGE_ORDER_PASSWORD_SUCCESS',
        time: new Date(),
      },
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: isUsingNewKis ? 'Change Pin' : 'Change order password',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchChangeOrderPassword() {
  yield takeLatest(ACCOUNT_CHANGE_ORDER_PASSWORD, doChangeOrderPassword);
}
