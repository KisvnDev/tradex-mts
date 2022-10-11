import { Big } from 'big.js';
import { MARKET, SYMBOL_TYPE, SYSTEM_TYPE } from 'global';
import { ISymbolData, IRealTimeSymbolData, IBidOffer } from 'interfaces/market';

export function getSystemType(symbolType: SYMBOL_TYPE) {
  if (
    symbolType === SYMBOL_TYPE.STOCK ||
    symbolType === SYMBOL_TYPE.CW ||
    symbolType === SYMBOL_TYPE.ETF ||
    symbolType === SYMBOL_TYPE.FUND
  ) {
    return SYSTEM_TYPE.EQUITY;
  } else if (symbolType === SYMBOL_TYPE.FUTURES) {
    return SYSTEM_TYPE.DERIVATIVES;
  } else {
    return null;
  }
}

export function isStockType(symbolType: SYMBOL_TYPE) {
  return symbolType === SYMBOL_TYPE.STOCK || symbolType === SYMBOL_TYPE.FUND || symbolType === SYMBOL_TYPE.ETF;
}

export function getPriceStep(price: Big, market: MARKET, symbolType?: SYMBOL_TYPE) {
  if (symbolType === SYMBOL_TYPE.CW) {
    return 10;
  } else if (symbolType === SYMBOL_TYPE.ETF) {
    if (market === MARKET.HOSE) {
      return 10;
    } else if (market === MARKET.HNX) {
      return 1;
    } else {
      return 1;
    }
  } else {
    if (market === MARKET.HOSE) {
      if (price.cmp(10000) < 0) {
        return 10;
      } else if (price.cmp(10000) >= 0 && price.cmp(50000) < 0) {
        return 50;
      } else {
        return 100;
      }
    } else if (market === MARKET.HNX || market === MARKET.UPCOM) {
      return 100;
    } else {
      return 100;
    }
  }
}

export function getFuturesPriceStep(baseSecuritiesType?: SYMBOL_TYPE) {
  if (baseSecuritiesType === SYMBOL_TYPE.INDEX) {
    return 0.1;
  } else if (baseSecuritiesType === SYMBOL_TYPE.BOND) {
    return 1;
  } else {
    return 0.1;
  }
}

export function roundStep(value: number, step: number, isUseNewRound = false) {
  if (!isNaN(value) && !isNaN(step) && step > 0) {
    if (isUseNewRound) {
      return Number(Big(value).toFixed(2));
    }
    return Number(Big(Math.ceil((value - step) / step) * step + step).toFixed(2));
  } else {
    return 0;
  }
}

export function parseMarketData(data: IRealTimeSymbolData): ISymbolData {
  const symbolData: ISymbolData = {
    s: data.code,
  };

  if (data.open) {
    symbolData.o = data.open;
  }
  if (data.tradingVolume) {
    symbolData.vo = data.tradingVolume;
  }
  if (data.tradingValue) {
    symbolData.va = data.tradingValue;
  }
  if (data.high) {
    symbolData.h = data.high;
  }
  if (data.low) {
    symbolData.l = data.low;
  }
  if (data.last) {
    symbolData.c = data.last;
  }
  if (data.change) {
    symbolData.ch = data.change;
  }
  if (data.open) {
    symbolData.ra = data.rate;
  }
  if (data.time) {
    symbolData.ti = data.time;
  }
  if (data.expectedPrice) {
    symbolData.exp = data.expectedPrice;
  }
  if (data.session) {
    symbolData.ss = data.session;
  }
  if (data.matchedBy) {
    symbolData.mb = data.matchedBy;
  }
  if (data.matchingVolume) {
    symbolData.mv = data.matchingVolume;
  }

  if (data.totalBidVolume) {
    symbolData.tb = data.totalBidVolume;
  }

  if (data.totalOfferVolume) {
    symbolData.to = data.totalOfferVolume;
  }

  if (data.bidOfferList && data.bidOfferList.length > 0) {
    symbolData.bb = [];
    symbolData.bo = [];

    data.bidOfferList.forEach((item) => {
      const bid: IBidOffer = {
        p: item.bidPrice,
        v: item.bidVolume,
        c: item.bidVolumeChange,
      };

      const offer: IBidOffer = {
        p: item.offerPrice,
        v: item.offerVolume,
        c: item.offerVolumeChange,
      };

      symbolData.bb!.push(bid);
      symbolData.bo!.push(offer);
    });
  }

  return symbolData;
}

export function reverseMarketData(data: ISymbolData): IRealTimeSymbolData {
  const symbolData: IRealTimeSymbolData = {
    time: data.ti,
    code: data.s,
    last: data.c,
    change: data.ch,
    rate: data.ra,
    tradingVolume: data.vo,
    tradingValue: data.va,
    matchedBy: data.mb,
    matchingVolume: data.mv,
  };

  return symbolData;
}

export function roundLot(
  value: number,
  market: MARKET,
  symbolType: SYMBOL_TYPE,
  reverse?: boolean,
  useMinLot?: boolean,
  isAvailableQuantity?: boolean
) {
  if (value < 0) {
    return 0;
  }
  if (symbolType === SYMBOL_TYPE.FUTURES) {
    if (value > 500) {
      if (reverse === true) {
        return value - 500;
      }
      return 500;
    }
    return value;
  } else {
    if (value < 100) {
      if (isAvailableQuantity === true) {
        return 0;
      } else {
        return 100;
      }
    }
    let step = 100;

    let result = Math.floor(value / step) * step;

    if (reverse === true) {
      return value - result;
    }

    if (value > 0 && result === 0 && useMinLot === true) {
      result = 100;
    }

    return result;
  }
}

export function getSuggestedQuantity(market: MARKET, symbolType: SYMBOL_TYPE, baseSymbolType?: SYMBOL_TYPE) {
  let suggestedQuantity = 0;
  if (market === MARKET.HOSE) {
    suggestedQuantity = 100;
  } else if (market === MARKET.HNX) {
    if (symbolType !== SYMBOL_TYPE.FUTURES) {
      suggestedQuantity = 100;
    } else {
      suggestedQuantity = 1;
    }
  } else if (market === MARKET.UPCOM) {
    suggestedQuantity = 100;
  }
  return suggestedQuantity;
}

export function getOrderLot(market: MARKET, symbolType: SYMBOL_TYPE) {
  if (symbolType === SYMBOL_TYPE.FUTURES) {
    return 1;
  } else {
    return 100;
  }
}
