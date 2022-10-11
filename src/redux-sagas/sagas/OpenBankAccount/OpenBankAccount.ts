import { call, put, takeLatest } from 'redux-saga/effects';
import { METHOD } from 'utils/socketApi';
import { IOpenBankAccount } from 'config';
import { IRequest } from 'interfaces/common';
import { COMMON_SHOW_NOTIFICATION, OPEN_BANK_ACCOUNT } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';
import { Linking } from 'react-native';

const openBankAccount = (param: IOpenBankAccount) => {
  const uri = param.bankUrlBefore != null ? param.bankUrlBefore : '';
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.GET,
    }).then(async (result) => {
      resolve(JSON.parse(await result.text()));
    }).catch((error) => {
      reject(error);
    });
  });
};

function* doOpenBankAccount(request: IRequest<IOpenBankAccount>) {
  try {
    if (request.payload.name === 'VPBank') {
      const response = yield call(openBankAccount, request.payload);
      Linking.canOpenURL(`${request.payload.bankUrl}?partner=${request.payload.partnerCode}&session_id=${response.data}`).then(supported => {
          if (supported) {
            Linking.openURL(`${request.payload.bankUrl}?partner=${request.payload.partnerCode}&session_id=${response.data}`);
          } else {
            console.log("Don't know how to open URI: " + `${request.payload.bankUrl}?partner=${request.payload.partnerCode}&session_id=${response.data}`);
          }
        });
    } else {
      throw new Error('No Bank Found');
    }

    yield put({
      type: request.response.success,
      hideLoading: true,
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
        title: 'Open Bank Account',
        content: error,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchOpenBankAccount() {
  yield takeLatest(OPEN_BANK_ACCOUNT, doOpenBankAccount);
}
