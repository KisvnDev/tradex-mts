import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { CHECK_REFERRAL_CODE } from 'redux-sagas/actions';

const checkReferralCode = (data: IObject) => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}v1/referral/${data.ref}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (result) => {
        resolve(JSON.parse(await result.text()));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function* doCheckReferralCode(request: IRequest<IObject>) {
  try {
    const response = yield call(checkReferralCode, request.payload);

    if (response.data != null) {
      yield put({
        type: request.response.success,
        payload: response.data,
        hideLoading: true,
      });
    } else {
      throw new Error('Referral Code is invalid');
    }
  } catch (error) {
    yield put({
      type: request.response.failure,
      hideLoading: true,
    });
  }
}

export default function* watchCheckReferralCode() {
  yield takeLatest(CHECK_REFERRAL_CODE, doCheckReferralCode);
}
