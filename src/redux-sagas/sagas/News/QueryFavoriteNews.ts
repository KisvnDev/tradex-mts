import { put, takeLatest, call } from 'redux-saga/effects';
import { IRequest, IObject } from 'interfaces/common';
import { query, METHOD } from 'utils/socketApi';
import store from 'redux-sagas/store';
import { COMMON_SHOW_NOTIFICATION, NEWS_QUERY_FAVORITE_NEWS } from 'redux-sagas/actions';
import { NOTIFICATION_TYPE } from 'global';

const getFavoriteNews = (params: IObject) => {
  const uri = 'news/filter';
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryFavoriteNews(request: IRequest<IObject>) {
  try {
    if (request.payload.loadMore === true) {
      request.payload.lastSequence = store.getState().favoriteNewsData!.lastSequence!;
      request.payload.publishTime = store.getState().favoriteNewsData!.publishTime!;
    }

    const response = yield call(getFavoriteNews, request.payload);

    let lastSequence = null;
    let publishTime = null;
    let hasMore = true;

    if (response.data && response.data.length > 0) {
      lastSequence = response.data[response.data.length - 1].id;
      publishTime = response.data[response.data.length - 1].publishTime;
      if (response.data.length < request.payload.fetchCount!) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }

    yield put({
      type: request.response.success,
      payload: {
        data: response.data,
        lastSequence,
        publishTime,
        next: request.payload.loadMore,
        hasMore,
      },
    });
  } catch (error) {
    yield put({
      type: request.response.failure,
    });

    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Query Favorite News',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchQueryFavoriteNews() {
  yield takeLatest(NEWS_QUERY_FAVORITE_NEWS, doQueryFavoriteNews);
}
