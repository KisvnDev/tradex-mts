import { call, put, takeLatest } from 'redux-saga/effects';
import i18n from 'i18next';
import { query, METHOD } from 'utils/socketApi';
import { setKey } from 'utils/asyncStorage';
import store from 'redux-sagas/store';
import { IObject, IRequest, IUserExtraInfo } from 'interfaces/common';
import { GLOBAL_SELECTED_FAVORITE } from 'redux-sagas/global-reducers/SelectedFavorite-reducers';
import { GLOBAL_FAVORITE_LISTS } from 'redux-sagas/global-reducers/FavoriteLists-reducers';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import {
  FAVORITE_GET_FAVORITE_LISTS,
  FAVORITE_GET_FAVORITE_LISTS_LOADING,
  FAVORITE_GET_FAVORITE_LISTS_RESET,
} from 'redux-sagas/actions';

const getAllFavoriteLists = () => {
  const uri = 'favorite';
  return query(global.domainSocket, uri, METHOD.GET);
};

const addDefaultFavoriteList = () => {
  const uri = 'favorite';
  return query(global.domainSocket, uri, METHOD.POST, {
    name: i18n.t('Default') as string,
  });
};

function* handleSelectedFavorite(userExtraInfo: IUserExtraInfo) {
  let existed = false;
  if (userExtraInfo.favoriteLists && userExtraInfo.favoriteLists.length > 0) {
    for (let index = 0; index < userExtraInfo.favoriteLists.length; index++) {
      const element = userExtraInfo.favoriteLists[index];
      if (userExtraInfo.selectedFavorite != null) {
        if (element.id.toString() === userExtraInfo.selectedFavorite.id.toString()) {
          existed = true;
          userExtraInfo.selectedFavorite.index = index;
          userExtraInfo.selectedFavorite.name = userExtraInfo.favoriteLists[index].name;
          userExtraInfo.selectedFavorite.itemList = userExtraInfo.favoriteLists[index].itemList;
          userExtraInfo.selectedFavorite.count = userExtraInfo.favoriteLists[index].count;
          break;
        }
      }
    }

    if (existed === false) {
      userExtraInfo.selectedFavorite = {
        id: userExtraInfo.favoriteLists[0].id,
        name: userExtraInfo.favoriteLists[0].name,
        itemList: userExtraInfo.favoriteLists[0].itemList,
        count: userExtraInfo.favoriteLists[0].count,
        index: 0,
      };
    }
  }

  yield put({
    type: GLOBAL_SELECTED_FAVORITE,
    payload: userExtraInfo.selectedFavorite,
  });
}

function* doGetFavoriteLists(request: IRequest<IObject>) {
  try {
    yield put({
      type: FAVORITE_GET_FAVORITE_LISTS_RESET,
    });
    yield put({
      type: FAVORITE_GET_FAVORITE_LISTS_LOADING,
      payload: true,
    });

    const userExtraInfo = store.getState().userExtraInfo;

    if (userExtraInfo.favoriteLists != null) {
      yield call(handleSelectedFavorite, userExtraInfo);
    }

    const response = yield call(getAllFavoriteLists);

    if (response.data && response.data.length > 0) {
      userExtraInfo.favoriteLists = response.data;
      yield put({
        type: GLOBAL_FAVORITE_LISTS,
        payload: userExtraInfo.favoriteLists,
      });

      yield call(handleSelectedFavorite, userExtraInfo);
    } else {
      yield call(addDefaultFavoriteList);
      const newResponse = yield call(getAllFavoriteLists);
      userExtraInfo.favoriteLists = newResponse.data;
      yield put({
        type: GLOBAL_FAVORITE_LISTS,
        payload: userExtraInfo.favoriteLists,
      });

      yield call(handleSelectedFavorite, userExtraInfo);
    }

    store.dispatch({
      type: FAVORITE_GET_FAVORITE_LISTS_LOADING,
      payload: false,
    });

    store.dispatch({
      type: GLOBAL_USER_EXTRA_INFO,
      payload: userExtraInfo,
    });

    if (store.getState().userInfo) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }
  } catch (err) {
    yield put({
      type: request.response.failure,
      payload: err,
    });
  }
}

export default function* watchGetFavoritLists() {
  yield takeLatest(FAVORITE_GET_FAVORITE_LISTS, doGetFavoriteLists);
}
