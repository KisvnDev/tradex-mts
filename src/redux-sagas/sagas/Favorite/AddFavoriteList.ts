import { put, takeLatest, call } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { setKey } from 'utils/asyncStorage';
import { IRequest, IObject } from 'interfaces/common';
import { GLOBAL_FAVORITE_LISTS } from 'redux-sagas/global-reducers/FavoriteLists-reducers';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import { COMMON_TOGGLE_LOADING, FAVORITE_ADD_FAVORITE_LIST, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const addFavoriteList = (params: IObject) => {
  const uri = 'favorite';
  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doAddFavoriteList(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    const response = yield call(addFavoriteList, data);

    const favoriteLists = store.getState().favoriteLists;

    if (favoriteLists && favoriteLists.length > 0) {
      const order = favoriteLists[favoriteLists.length - 1].order;
      favoriteLists.push({
        id: response.data.id,
        name: request.payload.name as string,
        order: order != null ? order + 1 : 1,
        count: 0,
        maxCount: favoriteLists[favoriteLists.length - 1].maxCount,
        itemList: [],
      });
    }

    yield put({
      type: GLOBAL_FAVORITE_LISTS,
      payload: favoriteLists,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Create new favorite list',
        content: 'CREATE_NEW_FAVORITE_SUCCESS',
        contentParams: { favoriteName: response.data.name },
        time: new Date(),
      },
    });

    const userExtraInfo = store.getState().userExtraInfo;

    userExtraInfo.favoriteLists = favoriteLists;

    put({
      type: GLOBAL_USER_EXTRA_INFO,
      userExtraInfo,
    });

    if (store.getState().userInfo != null) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.WARN,
        title: 'Create new favorite list',
        content: err.code ?? err.message,
        time: new Date(),
      },
    });
  } finally {
    yield put({ type: COMMON_TOGGLE_LOADING, hideLoading: true });
  }
}

export default function* watchAddFavoriteList() {
  yield takeLatest(FAVORITE_ADD_FAVORITE_LIST, doAddFavoriteList);
}
