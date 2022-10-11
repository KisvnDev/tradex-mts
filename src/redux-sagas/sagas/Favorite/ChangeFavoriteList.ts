import { put, takeLatest } from 'redux-saga/effects';
import { IRequest, IFavorite } from 'interfaces/common';
import { setKey } from 'utils/asyncStorage';
import store from 'redux-sagas/store';
import { GLOBAL_SELECTED_FAVORITE } from 'redux-sagas/global-reducers/SelectedFavorite-reducers';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import { FAVORITE_CHANGE_FAVORITE_LIST } from 'redux-sagas/actions';

function* doChangeFavoriteList(request: IRequest<IFavorite>) {
  try {
    const userExtraInfo = store.getState().userExtraInfo;

    userExtraInfo.selectedFavorite = request.payload;

    yield put({
      type: GLOBAL_SELECTED_FAVORITE,
      payload: userExtraInfo.selectedFavorite,
    });

    store.dispatch({
      type: GLOBAL_USER_EXTRA_INFO,
      payload: userExtraInfo,
    });

    if (store.getState().userInfo) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }
  } catch (err) {}
}

export default function* watchChangeFavoriteList() {
  yield takeLatest(FAVORITE_CHANGE_FAVORITE_LIST, doChangeFavoriteList);
}
