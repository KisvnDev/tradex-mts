import { call, put, takeLatest } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { IObject, IRequest } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { USER_UPDATE_PROFILE, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { GLOBAL_USERINFO } from 'redux-sagas/global-reducers/UserInfo-reducers';

const updateProfile = (params: IObject) => {
  const uri = 'user/updateProfile';
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doUpdateProfile(request: IRequest<IObject>) {
  try {
    const data = request.payload;

    yield call(updateProfile, data);
    const userInfo = store.getState().userInfo;

    Object.assign(userInfo, data);

    yield put({
      type: GLOBAL_USERINFO,
      payload: userInfo,
    });
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Update Avatar',
        content: 'UPDATE_PROFILE_SUCCESS',
        time: new Date(),
      },
      hideLoading: true,
    });
  } catch (error) {
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
export default function* watchUpdateProfile() {
  yield takeLatest(USER_UPDATE_PROFILE, doUpdateProfile);
}
