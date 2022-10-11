import { takeLatest } from 'redux-saga/effects';
import store from 'redux-sagas/store';
import { formatTimeToDisplay } from 'utils/datetime';
import { parseMarketData, isStockType } from 'utils/market';
import { IRequest } from 'interfaces/common';
import { ISubscribeSymbol, IRealTimeSymbolData, ISymbolData } from 'interfaces/market';
import { SYMBOL_TYPE, REALTIME_CHANNEL_DATA_TYPE } from 'global';
import { MARKET_SUBSCRIBE_SYMBOL, MARKET_SUBSCRIBE_CURRENT_SYMBOL } from 'redux-sagas/actions';
import { GLOBAL_SYMBOL_DATA } from 'redux-sagas/global-reducers/SymbolData-reducers';
import {
  GLOBAL_CURRENT_SYMBOL_QUOTE,
  GLOBAL_CURRENT_SYMBOL_BID_OFFER,
  GLOBAL_CURRENT_INDEX_QUOTE,
} from 'redux-sagas/global-reducers/CurrentSymbol-reducers';
import config from 'config';

const subscribeSymbol = (data: ISubscribeSymbol) => {
  if (!global.subscribeChannels.hasOwnProperty(data.code) && global.domainSocket != null) {
    let channelName = '';
    if (data.symbolType === SYMBOL_TYPE.INDEX) {
      channelName = `market.index.quote.${data.code}`;
    } else if (isStockType(data.symbolType!)) {
      channelName = `market.stock.quote.${data.code}`;
    } else if (data.symbolType === SYMBOL_TYPE.FUTURES) {
      channelName = `market.futures.quote.${data.code}`;
    } else if (data.symbolType === SYMBOL_TYPE.CW) {
      channelName = `market.cw.quote.${data.code}`;
    }

    if (config.usingNewKisCore) {
      channelName = `market.quote.${data.code}`;
    }

    global.subscribeChannels[data.code] = {
      channel: global.domainSocket!.subscribe(channelName),
      count: 1,
      code: data.code,
      symbolType: data.symbolType,
      channelType: REALTIME_CHANNEL_DATA_TYPE.QUOTE,
    };
    global.subscribeChannels[data.code].channel!.watch((res: IRealTimeSymbolData) => {
      receiveData(REALTIME_CHANNEL_DATA_TYPE.QUOTE, res);
    });
  } else {
    global.subscribeChannels[data.code].count = global.subscribeChannels[data.code].count! + 1;
  }
};

const subscribeQuote = (data: ISubscribeSymbol) => {
  if (global.quoteChannel.code === data.code) {
    return;
  } else if (global.quoteChannel.channel) {
    global.quoteChannel.channel.unwatch();
    global.quoteChannel.channel.unsubscribe();
  }

  if (data.symbolType !== SYMBOL_TYPE.INDEX && global.domainSocket != null) {
    let channelName = '';
    if (isStockType(data.symbolType!)) {
      channelName = `market.stock.quote.${data.code}`;
    } else if (data.symbolType === SYMBOL_TYPE.FUTURES) {
      channelName = `market.futures.quote.${data.code}`;
    } else if (data.symbolType === SYMBOL_TYPE.CW) {
      channelName = `market.cw.quote.${data.code}`;
    }

    if (config.usingNewKisCore) {
      channelName = `market.quote.${data.code}`;
    }

    global.quoteChannel.code = data.code;
    global.quoteChannel.symbolType = data.symbolType;
    global.quoteChannel.channel = global.domainSocket.subscribe(channelName);

    global.quoteChannel.channel.watch((res: IRealTimeSymbolData) => {
      receiveData(REALTIME_CHANNEL_DATA_TYPE.QUOTE, res);
    });
  }
};

const subscribeBidOffer = (data: ISubscribeSymbol) => {
  if (global.bidOfferChannel.code === data.code) {
    return;
  } else if (global.bidOfferChannel.channel) {
    global.bidOfferChannel.channel.unwatch();
    global.bidOfferChannel.channel.unsubscribe();
  }

  if (data.symbolType !== SYMBOL_TYPE.INDEX && global.domainSocket != null) {
    let channelName = '';
    if (data.symbolType === SYMBOL_TYPE.STOCK) {
      channelName = `market.stock.bidoffer.${data.code}`;
    } else if (data.symbolType === SYMBOL_TYPE.FUTURES) {
      channelName = `market.futures.bidoffer.${data.code}`;
    } else if (data.symbolType === SYMBOL_TYPE.CW) {
      channelName = `market.cw.bidoffer.${data.code}`;
    }

    if (config.usingNewKisCore) {
      channelName = `market.bidoffer.${data.code}`;
    }

    global.bidOfferChannel.code = data.code;
    global.bidOfferChannel.symbolType = data.symbolType;
    global.bidOfferChannel.channel = global.domainSocket.subscribe(channelName);

    global.bidOfferChannel.channel.watch((res: IRealTimeSymbolData) => {
      receiveData(REALTIME_CHANNEL_DATA_TYPE.BID_OFFER, res);
    });
  }
};

const receiveData = (channelType: REALTIME_CHANNEL_DATA_TYPE, data: IRealTimeSymbolData) => {
  if (channelType === REALTIME_CHANNEL_DATA_TYPE.BID_OFFER) {
    if (data.time) {
      const time = formatTimeToDisplay(data.time, 'HHmmss', 'yyyyMMddHHmmss', true);
      if (time) {
        data.time = time;
      }
    }
  } else if (channelType === REALTIME_CHANNEL_DATA_TYPE.QUOTE) {
    if (data.time) {
      const time = formatTimeToDisplay(data.time, 'HHmmss', 'yyyyMMddHHmmss', true);
      if (time) {
        data.time = time;
      }
    }
  }

  const symbolData = config.usingNewKisCore ? ((data as unknown) as ISymbolData) : parseMarketData(data);
  let current = global.symbolData[symbolData.s];
  if (current == null) {
    current = symbolData;
  } else {
    current = { ...current, ...symbolData };
  }

  if (channelType === REALTIME_CHANNEL_DATA_TYPE.QUOTE) {
    global.symbolData[symbolData.s] = { ...current, quoteSubs: true };
    global.symbolRealtimeQuoteData[symbolData.s] = symbolData;
  } else if (channelType === REALTIME_CHANNEL_DATA_TYPE.BID_OFFER) {
    global.symbolData[symbolData.s] = { ...current, bidOfferSubs: true };
    global.symbolRealtimeBidOfferData[symbolData.s] = symbolData;
  }

  store.dispatch({
    type: GLOBAL_SYMBOL_DATA,
    payload: symbolData,
  });

  if (store.getState().currentSymbol && store.getState().currentSymbol!.s === symbolData.s) {
    if (channelType === REALTIME_CHANNEL_DATA_TYPE.QUOTE) {
      store.dispatch({
        type: GLOBAL_CURRENT_SYMBOL_QUOTE,
        payload: symbolData,
      });
    } else {
      store.dispatch({
        type: GLOBAL_CURRENT_SYMBOL_BID_OFFER,
        payload: symbolData,
      });
    }
  } else if (store.getState().currentIndex && store.getState().currentIndex!.s === symbolData.s) {
    store.dispatch({
      type: GLOBAL_CURRENT_INDEX_QUOTE,
      payload: symbolData,
    });
  }
};

function* doSubscribeSymbol(request: IRequest<ISubscribeSymbol>) {
  yield subscribeSymbol(request.payload);
}

function* doSubscribeCurrentSymbol(request: IRequest<ISubscribeSymbol>) {
  yield subscribeQuote(request.payload);
  yield subscribeBidOffer(request.payload);
}

export function* watchSubscribeSymbol() {
  yield takeLatest(MARKET_SUBSCRIBE_SYMBOL, doSubscribeSymbol);
}

export function* watchSubscribeCurrentSymbol() {
  yield takeLatest(MARKET_SUBSCRIBE_CURRENT_SYMBOL, doSubscribeCurrentSymbol);
}
