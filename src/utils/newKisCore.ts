import { IObject } from 'interfaces/common';

export const mapDataChartToOldKis = (data: IObject[]) => {
  return data.map((item) => {
    return {
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      date: item.t,
      tradingVolume: item.pv,
      time: item.t,
      lastValue: item.c,
      last: item.l,
    };
  });
};

export const mapDataQuoteNewKis = (data: IObject[]) => {
  if (!data) {
    return [];
  }

  return data.map((item) => {
    return {
      time: item.t,
      last: item.c,
      low: item.l,
      change: item.ch,
      rate: item.ra,
      tradingVolume: item.vo,
      tradingValue: item.va,
      matchingVolume: item.mv,
      open: item.o,
      high: item.h,
    };
  });
};

type MapDataUpDownT = {
  code: string;
  rate: number;
  low: number;
  change: number;
  tradingVolume: number;
  last: number;
  tradingValue: number;
  open: number;
  high: number;
};

export function mapDataUpDown<T>(item: T | any): T | MapDataUpDownT {
  return {
    code: item.cd,
    rate: item.r,
    low: item.c,
    change: item.ch,
    tradingVolume: item.vo,
    tradingValue: item.va,
    open: item.o,
    last: item.c,
    high: item.h,
  };
}
