import { put, takeLatest, debounce, call } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { setKey } from 'utils/asyncStorage';
import store from 'redux-sagas/store';
import { IRequest, IFavorite, IObject, IFavoriteItem } from 'interfaces/common';
import { GLOBAL_FAVORITE_LISTS } from 'redux-sagas/global-reducers/FavoriteLists-reducers';
import { GLOBAL_SELECTED_FAVORITE } from 'redux-sagas/global-reducers/SelectedFavorite-reducers';
import {
  FAVORITE_UPDATE_FAVORITE_LIST,
  FAVORITE_UPDATE_FAVORITE_LIST_ORDER,
  COMMON_SHOW_NOTIFICATION,
  COMMON_TOGGLE_LOADING,
} from 'redux-sagas/actions';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import { NOTIFICATION_TYPE } from 'global';

const updateFavoriteList = (params: IObject) => {
  const uri = 'favorite';
  return query(global.domainSocket, uri, METHOD.PUT, params);
};

function* doUpdateFavoriteList(request: IRequest<IObject[]>) {
  try {
    const payload = request.payload;

    yield call(updateFavoriteList, { items: request.payload });

    let favoriteLists = store.getState().favoriteLists;

    if (favoriteLists && favoriteLists.length > 0) {
      for (let j = 0; j < favoriteLists.length; j++) {
        for (let i = 0; i < payload.length; i++) {
          if (favoriteLists[j].id.toString() === payload[i].id.toString()) {
            if (payload[i].name) {
              favoriteLists[j].name = payload[i].name as string;
            }

            if (payload[i].itemList) {
              favoriteLists[j].itemList = payload[i].itemList as IFavoriteItem[];
              favoriteLists[j].count = payload[i].itemList ? (payload[i].itemList as IFavoriteItem[]).length : 0;
            }

            if (payload[i].order != null) {
              favoriteLists[j].order = payload[i].order as number;
            }

            break;
          }
        }
      }
    }

    favoriteLists = favoriteLists.sort((a: IFavorite, b: IFavorite) =>
      a.order != null && b.order != null ? (a.order > b.order ? 1 : b.order > a.order ? -1 : 0) : 0
    );

    yield put({
      type: GLOBAL_FAVORITE_LISTS,
      payload: favoriteLists,
    });

    const selectedFavorite: IFavorite = { ...store.getState().selectedFavorite! };

    if (favoriteLists && favoriteLists.length > 0) {
      for (let index = 0; index < favoriteLists.length; index++) {
        const element = favoriteLists[index];

        if (selectedFavorite != null) {
          if (element.id.toString() === selectedFavorite.id.toString()) {
            selectedFavorite.index = index;
            selectedFavorite.count = element.count;
            selectedFavorite.name = element.name;
            selectedFavorite.itemList = element.itemList;
            selectedFavorite.order = element.order;
          }
        }
      }
    }

    yield put({
      type: GLOBAL_SELECTED_FAVORITE,
      payload: selectedFavorite,
    });

    for (let index = 0; index < request.payload.length; index++) {
      if (request.payload[index].showNotification === true) {
        yield put({
          type: COMMON_SHOW_NOTIFICATION,
          payload: {
            type: NOTIFICATION_TYPE.SUCCESS,
            title: 'Update favorite list',
            content: 'UPDATE_FAVORITE_LIST_SUCCESS',
            contentParams: request.payload[index].name,
            time: new Date(),
          },
        });
      }
    }

    const userExtraInfo = store.getState().userExtraInfo;

    userExtraInfo.favoriteLists = favoriteLists;

    if (selectedFavorite != null) {
      userExtraInfo.selectedFavorite = selectedFavorite;
    }

    store.dispatch({
      type: GLOBAL_USER_EXTRA_INFO,
      payload: userExtraInfo,
    });

    if (store.getState().userInfo != null) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }
  } catch (err) {
    for (let index = 0; index < request.payload.length; index++) {
      if (request.payload[index].showNotification === true) {
        yield put({
          type: COMMON_SHOW_NOTIFICATION,
          payload: {
            type: NOTIFICATION_TYPE.ERROR,
            title: 'Update favorite list',
            content: err.code ? err.code : 'UPDATE_FAVORITE_LIST_FAILED',
            contentParams: {
              contentParams: request.payload[index].name,
            },
            time: new Date(),
          },
        });
      }
    }
  } finally {
    yield put({
      type: COMMON_TOGGLE_LOADING,
      hideLoading: true,
    });
  }
}

export function* watchUpdateFavoriteList() {
  yield takeLatest(FAVORITE_UPDATE_FAVORITE_LIST, doUpdateFavoriteList);
}

export function* watchUpdateFavoriteListOrder() {
  yield debounce(1000, FAVORITE_UPDATE_FAVORITE_LIST_ORDER, doUpdateFavoriteList);
}
