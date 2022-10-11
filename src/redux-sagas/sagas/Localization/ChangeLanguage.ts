import { call, put, takeLatest } from 'redux-saga/effects';
import i18n from 'i18next';
import { IRequest } from 'interfaces/common';
import { setKey } from 'utils/asyncStorage';
import { LANG, NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, LOCALIZATION_CHANGE_LANGUAGE } from 'redux-sagas/actions';
import { METHOD, query } from 'utils/socketApi';
import config from 'config';

const changeLanguage = (params: { language: string }) => {
  const uri = 'changelanguage';

  return query(global.domainSocket, uri, METHOD.POST, params);
};

function* doChangeLanguage(request: IRequest<LANG | { lang: LANG; callApi: boolean }>) {
  const isUsingNewCoreKis = config.usingNewKisCore;

  try {
    if (isUsingNewCoreKis) {
      if ((request.payload as { lang: LANG; callApi: boolean }).callApi === true) {
        yield call(changeLanguage, { language: (request.payload as { lang: LANG; callApi: boolean }).lang });
      }

      // if (res.data?.success) {
      var requestLang = (request.payload as { lang: LANG; callApi: boolean }).lang;

      setKey('lang', requestLang);
      global.lang = requestLang;
      i18n.changeLanguage((request.payload as { lang: LANG; callApi: boolean }).lang);
      // }
    } else {
      setKey('lang', request.payload);
      global.lang = request.payload;
      i18n.changeLanguage(request.payload as LANG);
    }
  } catch (error) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Change Language',
        content: error.code ?? error.message,
        time: new Date(),
      },
    });
  }
}

export default function* watchChangeLanguage() {
  yield takeLatest(LOCALIZATION_CHANGE_LANGUAGE, doChangeLanguage);
}
