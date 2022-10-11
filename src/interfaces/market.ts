import { SYMBOL_TYPE, MARKET, SYSTEM_TYPE, MARKET_STATUS } from 'global';

export interface ISymbolInfo {
  fl?: number | undefined;
  ce?: number | undefined;
  s: string;
  m: MARKET;
  n1: string;
  n2: string;
  t: SYMBOL_TYPE;
  b?: string;
  bs?: SYMBOL_TYPE;
  i?: boolean;
  checked?: boolean;
  isSelectedFavorite?: boolean;
}

export interface IMarketRefreshResponse {
  readonly type: string;
}

export interface IBidOffer {
  p?: number; // price
  v?: number; // volume
  c?: number; // volume change
}

export interface ISymbolData {
  r?: number | undefined;
  tv?: number | undefined;
  s: string; // symbol code
  t?: SYMBOL_TYPE;
  o?: number; // open
  h?: number; // high
  l?: number; // low
  c?: number; // close
  exp?: number; // estimated price
  ch?: number; // change
  ra?: number; // rate
  re?: number; // reference price
  vo?: number; // tradingVolume
  va?: number; // tradingValue
  ce?: number; //ceilingPrice
  fl?: number; //floorPrice
  mv?: number;
  mb?: 'BID' | 'OFFER';
  bb?: IBidOffer[];
  bo?: IBidOffer[];
  ti?: string; //Time
  ss?: string; //Session
  tb?: number; //Total Bid Volume
  to?: number; //Total Offer Volume
  ep?: number; //Exercise Price
  er?: string; // Exercise Ratio
  iv?: number; // Implied Volatility
  de?: number; // Delta
  w52?: {
    h: number;
    l: number;
  };
  ftd?: string; //First Trade Date
  ltd?: string; //Last Trade Date
  md?: string; //Maturity Date
  ic?: {
    ce: number;
    fl: number;
    up: number;
    dw: number;
    uc: number;
  };
  es?: {
    ce?: number;
    fl?: number;
  };
  fr?: {
    bv: number;
    sv: number;
  };
}

export interface IRealTimeBidOfferData {
  bidPrice?: number;
  bidVolume?: number;
  bidVolumeChange?: number;
  offerPrice?: number;
  offerVolume?: number;
  offerVolumeChange?: number;
}

export interface IRealTimeSymbolData {
  code: string;
  last?: number;
  open?: number;
  high?: number;
  low?: number;
  change?: number;
  rate?: number;
  time?: string;
  expectedPrice?: number;
  session?: string;
  matchedBy?: 'BID' | 'OFFER';
  matchingVolume?: number;
  tradingVolume?: number;
  tradingValue?: number;
  totalBidVolume?: number;
  totalOfferVolume?: number;
  bidOfferList?: IRealTimeBidOfferData[];
}

export interface ISubscribeSymbol {
  code: string;
  symbolType?: SYMBOL_TYPE;
}

export interface IOrderPrice {
  price: number;
  symbol: ISymbolInfo;
}

export interface IQuerySymbolData {
  symbolList: string[];
}

export interface IMarketStatus {
  market: MARKET;
  type: SYSTEM_TYPE;
  time: string;
  status: MARKET_STATUS;
}
