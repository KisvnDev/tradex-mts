import { put, takeLatest, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IObject } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { AWS_GET_SIGNED_DATA, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';

const getSignedData = (params: IObject) => {
  const uri = 'aws';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doGetAWSSignedData(request: IRequest<IObject>) {
  try {
    const response = yield call(getSignedData, request.payload);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Update Avatar',
        content: 'Failed to update your avatar!',
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchGetAWSSignedData() {
  yield takeLatest(AWS_GET_SIGNED_DATA, doGetAWSSignedData);
}
