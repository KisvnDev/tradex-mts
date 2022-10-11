import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, AUTHENTICATION_SIGNOUT, ACCOUNT_CHANGE_HTS_PASSWORD } from 'redux-sagas/actions';
import config from 'config';

const changeHTSPassword = (data: IObject) => {
  const isUsingNewCoreKis = config.usingNewKisCore;

  const uri = isUsingNewCoreKis ? 'services/eqt/changepassword' : 'equity/account/changeHTSPassword';

  let tempParams = {};

  if (isUsingNewCoreKis) {
    tempParams = {
      clientID: global.username,
    };
  } else {
    tempParams = {
      username: global.username,
    };
  }

  const params = { ...tempParams, ...data };

  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doChangeHTSPassword(request: IRequest<IObject>) {
  try {
    yield call(changeHTSPassword, request.payload);

    yield put({
      type: request.response.success,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Change HTS password',
        content: 'CHANGE_HTS_PASSWORD_SUCCESS',
        time: new Date(),
      },
    });

    yield put({
      type: AUTHENTICATION_SIGNOUT,
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
        title: 'Change HTS password',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchChangeHTSPassword() {
  yield takeLatest(ACCOUNT_CHANGE_HTS_PASSWORD, doChangeHTSPassword);
}
