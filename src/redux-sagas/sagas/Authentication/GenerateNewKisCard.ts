import { takeLatest, put, call } from 'redux-saga/effects';
import { METHOD, query } from 'utils/socketApi';
import { IRequest } from 'interfaces/common';
import { GENERATE_NEW_KIS_CARD, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const generateNewKisCard = () => {
  const uri = 'auth/matrix/genNewKisCard';
  return query(global.domainSocket, uri, METHOD.POST);
};

function* doGenerateNewKisCard(request: IRequest<null>) {
  try {
    const response = yield call(generateNewKisCard);

    yield put({
      type: request.response.success,
      payload: {
        ...response.data,
      },
      hideLoading: true,
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Generate Kis Card',
        content: error.code ?? error.message,
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchGenerateNewKisCard() {
  yield takeLatest(GENERATE_NEW_KIS_CARD, doGenerateNewKisCard);
}
