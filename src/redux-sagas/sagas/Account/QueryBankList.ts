import { call, put, takeLatest } from 'redux-saga/effects';
import { IObject, IRequest } from 'interfaces/common';
import { METHOD } from 'utils/socketApi';
import config from 'config';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, QUERY_BANK_LIST } from 'redux-sagas/actions';

const queryBankList = () => {
  const uri = `${((config as unknown) as IObject).baseUrlRegisterAccount}v1/banks`;
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

function* doQueryBankList(request: IRequest<IObject>) {
  try {
    const response = yield call(queryBankList);
    yield put({
      type: request.response.success,
      payload: response,
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
        title: 'Query Bank List',
        content: error,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryBankList() {
  yield takeLatest(QUERY_BANK_LIST, doQueryBankList);
}
