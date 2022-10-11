import * as dateFns from 'date-fns';
import { vi, enUS, ko, zhCN } from 'date-fns/locale';
import { LANG } from 'global';
import i18next from 'i18next';

const choosedLocale = () => {
  switch (global.lang) {
    case LANG.VI:
      return vi;
    case LANG.KO:
      return ko;
    case LANG.ZH:
      return zhCN;
    default:
      return enUS;
  }
};

export function formatDateToString(date: Date | null, formatOutput = 'yyyyMMdd') {
  if (date == null) {
    return null;
  }
  return dateFns.format(date, formatOutput);
}

export function substractMonth(date: Date) {
  return dateFns.subMonths(date, 1);
}

export function addDays(date: Date, day: number) {
  return dateFns.addDays(date, day);
}

export function formatNotificationTimeToDisplay(notificationTime: Date) {
  const now = new Date();
  const delta = (now.getTime() - notificationTime.getTime()) / 1000;
  if (delta < 60) {
    return i18next.t('SECOND_AGO', { count: Math.round(delta) });
  }
  if (delta < 3600) {
    return i18next.t('MINUTE_AGO', { count: Math.round(delta / 60) });
  }
  if (delta <= 86400) {
    return i18next.t('HOUR_AGO', { count: Math.round(delta / 3600) });
  }
  return formatDateToString(notificationTime, 'dd/MM/yyyy');
}

export function formatTimeToDisplay(
  stringInput?: string,
  formatOutput = 'HH:mm:ss',
  formatInput = 'yyyyMMddHHmmss',
  ignoreTimeZone?: boolean
) {
  try {
    if (!stringInput) {
      return null;
    }
    let time = dateFns.parse(stringInput, formatInput, new Date());
    if (ignoreTimeZone !== true) {
      time = dateFns.addHours(time, 7);
    }
    return dateFns.format(time, formatOutput, { locale: choosedLocale() });
  } catch (error) {
    return null;
  }
}

export function formatDateToDisplay(stringInput?: string, formatOutput = 'dd/MM/yyyy', formatInput = 'yyyyMMdd') {
  try {
    if (!stringInput) {
      return null;
    }
    let time = dateFns.parse(stringInput, formatInput, new Date());
    time = dateFns.addHours(time, 7);
    return dateFns.format(time, formatOutput, { locale: choosedLocale() });
  } catch (error) {
    return null;
  }
}

export function formatStringToDate(stringInput: string, formatInput = 'yyyyMMdd') {
  if (stringInput == null) {
    return new Date();
  }

  return dateFns.parse(stringInput, formatInput, new Date());
}
export const formatDateTimeDisplay = (datetime: string) => {
  const time = formatTimeToDisplay(datetime, undefined, undefined, true);
  const date = formatDateToDisplay(datetime.substring(0, 8));
  return `${date} - ${time}`;
};
