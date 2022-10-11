import { takeLatest } from 'redux-saga/effects';
import { IRequest } from 'interfaces/common';
import { ISubscribeSymbol } from 'interfaces/market';
import { MARKET_UNSUBSCRIBE_SYMBOL } from 'redux-sagas/actions';

const unsubscribeSymbol = (data: ISubscribeSymbol) => {
  if (global.subscribeChannels.hasOwnProperty(data.code)) {
    global.subscribeChannels[data.code].count = global.subscribeChannels[data.code].count! - 1;
    if (global.subscribeChannels[data.code].count === 0 && global.subscribeChannels[data.code].channel) {
      // Need check this because the quoteChannel and subscribeChannels keep the same channel reference.
      if (global.quoteChannel.channel !== global.subscribeChannels[data.code].channel) {
        global.subscribeChannels[data.code].channel!.unwatch();
        global.subscribeChannels[data.code].channel!.unsubscribe();
      }
      delete global.subscribeChannels[data.code];
      if (global.symbolRealtimeQuoteData != null && global.symbolRealtimeQuoteData[data.code] != null) {
        delete global.symbolRealtimeQuoteData[data.code];
      }
      if (global.symbolRealtimeBidOfferData != null && global.symbolRealtimeBidOfferData[data.code] != null) {
        delete global.symbolRealtimeBidOfferData[data.code];
      }
      if (global.symbolData != null && global.symbolData[data.code] != null) {
        if (global.symbolData[data.code].bidOfferSubs != null) {
          delete global.symbolData[data.code].bidOfferSubs;
        } else if (global.symbolData[data.code].quoteSubs != null) {
          delete global.symbolData[data.code].quoteSubs;
        }
      }
    }
  }
};

function* doUnsubscribeSymbol(request: IRequest<ISubscribeSymbol>) {
  yield unsubscribeSymbol(request.payload);
}

export default function* watchSubscribeSymbol() {
  yield takeLatest(MARKET_UNSUBSCRIBE_SYMBOL, doUnsubscribeSymbol);
}
