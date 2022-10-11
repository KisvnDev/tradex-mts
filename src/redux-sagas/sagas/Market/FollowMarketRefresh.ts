import { MARKET_FOLLOW_SYMBOL_REFRESH, MARKET_INIT } from 'redux-sagas/actions';
import { IMarketRefreshResponse } from 'interfaces/market';
import { takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';

function* doFollowMarketRefresh() {
  const channel = global.domainSocket?.subscribe('market.refreshData');
  channel?.watch((res: IMarketRefreshResponse) => {
    if (res) {
      store.dispatch({ type: MARKET_INIT });
    }
  });
}

export default function* watchGetIndexStockRankingUpDown() {
  yield takeLatest(MARKET_FOLLOW_SYMBOL_REFRESH, doFollowMarketRefresh);
}
