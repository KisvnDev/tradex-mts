import { LANG } from 'global';
import { IObject } from 'interfaces/common';
import { ISymbolData } from 'interfaces/market';
import globalStyles from 'styles';

export function handleError(error: Error, componentStack: string) {
  console.log(error);
}

export function isBlank(str?: string) {
  return str == null || /^\s*$/.test(str);
}

export function getMap<T>(list: T[], key: string) {
  if (!list) {
    return {};
  }

  return list.reduce<{ [s: string]: T }>((map: { [s: string]: T }, item: T) => {
    map[item[key]] = item;
    return map;
  }, {});
}

export function formatNumber(value?: number, digit?: number, offsetRate?: number, toFixed?: boolean) {
  if (value == null || isNaN(value) || value === 0) {
    return '0';
  }

  if (offsetRate != null) {
    value = value / offsetRate;
  }

  let tempValueString = value.toString();
  let prefix = '';

  if (tempValueString[0] === '-') {
    prefix = '-';
    tempValueString = tempValueString.substring(1, tempValueString.length);
  }

  try {
    const tempValue = Number(tempValueString);
    let fractionDigit = 0;
    if (digit != null) {
      fractionDigit = digit;
    }
    if (fractionDigit > 0) {
      const temp = +`${Math.round(Number(`${Number(tempValue.toString())}e+${fractionDigit}`))}e-${fractionDigit}`;
      let fractionString = '';
      let i = '';
      if (toFixed === true) {
        i = temp.toFixed(fractionDigit);
        fractionString = i.substring(i.indexOf('.'), i.length);
        i = i.substring(0, i.indexOf('.'));
      } else {
        i = temp.toString();
        if (temp.toString().indexOf('.') > 1) {
          fractionString = temp.toString().substring(temp.toString().indexOf('.'), temp.toString().length);
          i = temp.toString().substring(0, temp.toString().indexOf('.'));
        }
      }
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fractionString;
    } else {
      const temp = +`${Math.round(Number(`${Number(tempValue.toString())}e+${fractionDigit}`))}e-${fractionDigit}`;
      const i = temp.toString();
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  } catch {
    return '';
  }
}

export function flattenObject(obj: IObject | IObject[], str = '{') {
  Object.keys(obj).forEach((key) => {
    str += `${key}: ${flattenText(obj[key])}, `;
  });
  return `${str.slice(0, str.length - 2)}}`;
}

export function flattenText(item: IObject | IObject[]) {
  let str = '';
  if (item && typeof item === 'object' && item.length === undefined) {
    str += flattenObject(item);
  } else if (item && typeof item === 'object' && item.length !== undefined) {
    str += '[';
    (item as IObject[]).forEach((k2) => {
      str += `${flattenText(k2)}, `;
    });
    if (item.length! > 0) str = str.slice(0, str.length - 2);
    str += ']';
  } else if (typeof item === 'string' && (item as string).slice(0, 8) === 'function') {
    str += `${item}`;
  } else if (typeof item === 'string') {
    str += `\"${(item as string).replace(/"/g, '\\"')}\"`;
  } else {
    str += `${item}`;
  }
  return str;
}

export function maskingEmail(data: string) {
  if (typeof data == 'undefined' || !data) return '';

  return data.split('@')[0].replace(/.{4}$/, '****') + '@' + data.split('@')[1];
}

export function maskingNumber(data: string) {
  if (typeof data == 'undefined' || !data) return '';

  return data.replace(/\d{4}$/, '****');
}

export function upperFirstLetter(data: string) {
  if (typeof data == 'undefined' || !data) return '';

  if (/\S[ ]/.test(data) || /\S[_]/.test(data)) {
    return data;
  }
  data = data.toLowerCase();
  return data.charAt(0).toUpperCase() + data.slice(1);
}

export function getCurrentLocale() {
  switch (global.lang) {
    case LANG.VI:
      return 'vi_VN';
    case LANG.EN:
      return 'en_GB';
    case LANG.KO:
      return 'ko_KR';
    case LANG.ZH:
      return 'zh_CN';
    default:
      return 'en_GB';
  }
}

export function getColor(value: number, comparePrice: number, ceiling: number, floor: number, symbolData: ISymbolData) {
  let textStyle;
  let iconType;
  if (symbolData && ceiling && floor) {
    switch (value) {
      case ceiling:
        textStyle = globalStyles.ceiling;
        iconType = 'up';
        break;
      case floor:
        textStyle = globalStyles.floor;
        iconType = 'down';
        break;
      case comparePrice:
        textStyle = globalStyles.reference;
        iconType = '';
        break;
      default: {
        if (value > comparePrice) {
          textStyle = globalStyles.up;
          iconType = 'up';
        } else {
          textStyle = globalStyles.down;
          iconType = 'down';
        }
        break;
      }
    }
  } else {
    textStyle = globalStyles.noData;
    iconType = '';
  }
  return { textStyle, iconType };
}
