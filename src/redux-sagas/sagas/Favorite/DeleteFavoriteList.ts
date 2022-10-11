import { put, takeLatest, call } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { query, METHOD } from 'utils/socketApi';
import { setKey } from 'utils/asyncStorage';
import { IObject, IRequest } from 'interfaces/common';
import { GLOBAL_SELECTED_FAVORITE } from 'redux-sagas/global-reducers/SelectedFavorite-reducers';
import { GLOBAL_FAVORITE_LISTS } from 'redux-sagas/global-reducers/FavoriteLists-reducers';
import { GLOBAL_USER_EXTRA_INFO } from 'redux-sagas/global-reducers/UserInfo-reducers';
import { FAVORITE_DELETE_FAVORITE_LIST, COMMON_TOGGLE_LOADING, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const deleteFavoriteList = (params: IObject) => {
  const uri = 'favorite';
  return query(global.domainSocket, uri, METHOD.DELETE, params);
};

function* doDeleteFavoriteList(request: IRequest<IObject>) {
  try {
    const data = request.payload;
    const items: Object[] = data.items as Object[];

    yield call(deleteFavoriteList, data);

    const favoriteLists = store.getState().favoriteLists;

    if (favoriteLists && favoriteLists.length > 0 && items && items.length > 0) {
      for (let j = 0; j < favoriteLists.length; j++) {
        for (let i = 0; i < items.length; i++) {
          if (favoriteLists[j].id.toString() === items[i].toString()) {
            favoriteLists.splice(j, 1);
            j = 0;
          }
        }
      }
    }

    yield put({
      type: GLOBAL_FAVORITE_LISTS,
      payload: favoriteLists,
    });

    const selectedFavorite = store.getState().selectedFavorite;

    let stillExist = false;

    for (let j = 0; j < favoriteLists.length; j++) {
      if (selectedFavorite!.id.toString() === favoriteLists[j].id.toString()) {
        stillExist = true;
        selectedFavorite!.index = j;
        break;
      }
    }

    if (stillExist !== true) {
      selectedFavorite!.index = 0;
      selectedFavorite!.id = favoriteLists[0].id;
      selectedFavorite!.name = favoriteLists[0].name;
      selectedFavorite!.itemList = favoriteLists[0].itemList;
      selectedFavorite!.count = favoriteLists[0].count;
    }

    yield put({
      type: GLOBAL_SELECTED_FAVORITE,
      payload: selectedFavorite,
    });

    const userExtraInfo = store.getState().userExtraInfo;

    userExtraInfo.favoriteLists = favoriteLists;
    if (selectedFavorite) {
      userExtraInfo.selectedFavorite = selectedFavorite;
    }

    store.dispatch({
      type: GLOBAL_USER_EXTRA_INFO,
      userExtraInfo,
    });

    if (store.getState().userInfo) {
      setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
    }

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.SUCCESS,
        title: 'Delete favorite list',
        content: 'DELETE_FAVORITE_LISTS_SUCCESS',
        time: new Date(),
      },
    });
  } catch (err) {
  } finally {
    yield put({ type: COMMON_TOGGLE_LOADING, hideLoading: true });
  }
}

export default function* watchDeleteFavoriteList() {
  yield takeLatest(FAVORITE_DELETE_FAVORITE_LIST, doDeleteFavoriteList);
}
