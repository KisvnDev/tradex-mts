import { call, put, takeLatest } from 'redux-saga/effects';
import 'whatwg-fetch';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import AsyncStorageBackend from 'i18next-async-storage-backend'; // primary use cache
import { query, METHOD } from 'utils/socketApi';
import { setKey, getKey } from 'utils/asyncStorage';
import { IResponse, IObject } from 'interfaces/common';
import { LANG, NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION, LOCALIZATION_INIT_I18N } from 'redux-sagas/actions';
import { GLOBAL_I18N } from 'redux-sagas/global-reducers/I18n-reducers';

const getLocaleData = () => {
  const uri = 'locale';
  return query(global.domainSocket, uri, METHOD.GET, {
    msNames: ['mts', 'common'],
  });
};

const handleVersion = async (data: IObject[], lang: LANG) => {
  return new Promise((resolve: Function, reject: Function) => {
    const versions = {};
    const defaultResources = {};

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      versions[element.lang as LANG] = element.latestVersion;
    }

    const langs = [LANG.EN, LANG.KO, LANG.VI, LANG.ZH];
    for (let i = 0; i < langs.length; i++) {
      if (versions[langs[i]] == null) {
        versions[langs[i]] = '1.0';
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].lang === LANG.EN) {
        if (data[i].files) {
          for (let j = 0; j < (data[i].files as IObject[]).length; j++) {
            const file = (data[i].files as IObject[])[j];
            defaultResources[file.namespace as string] = file.url;
          }
        }
      }
    }

    i18n.use(Backend).use(initReactI18next);
    i18n.init(
      {
        lng: lang,
        fallbackLng: LANG.EN,
        preload: langs,
        backend: {
          backends: [
            AsyncStorageBackend, // primary
            Fetch, // fallback
          ],
          backendOptions: [
            {
              // prefix for stored languages
              prefix: 'i18next_res_',

              // expiration
              expirationTime: 1, //365 * 24 * 60 * 60 * 1000, //365 days

              // language versions
              versions,
            },
            {
              loadPath: (lngs: string, namespaces: string) => {
                for (let i = 0; i < data.length; i++) {
                  const element = data[i];
                  if (element.lang === lngs) {
                    for (let j = 0; j < (element.files as IObject[]).length; j++) {
                      const file = (element.files as IObject[])[j];
                      if (file.namespace === namespaces) {
                        return file.url;
                      }
                    }
                  }
                }
                return defaultResources[namespaces];
              },
              requestOptions: {
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'default',
              },
            },
          ],
        },
        react: {
          wait: true,
          useSuspense: false,
        },

        // have a common namespace used around the full app
        ns: ['common', 'message', 'tuxedo'],
        defaultNS: 'common',
        fallbackNS: ['message', 'tuxedo'],

        debug: false,
        nsSeparator: false,
        keySeparator: false,

        interpolation: {
          escapeValue: false, // not needed for react as it does escape per default to prevent xss!
        },
      },
      (err: Error, t: Function) => {
        resolve(i18n);
      }
    );
  });
};

function* doInitI18n() {
  try {
    const localeVersion: IObject[] = yield getKey<IObject[]>('i18n');

    let lang: LANG = yield getKey<LANG>('lang');

    if (localeVersion != null) {
      if (lang == null) {
        lang = LANG.EN;
      }

      global.lang = lang;

      yield handleVersion(localeVersion, lang);

      getLocaleData()
        .then((response: IResponse<IObject>) => {
          setKey('i18n', response.data);
        })
        .catch((err: Error) => {
          //Swallow err
        });
    } else {
      const localeData = yield call(getLocaleData);

      setKey('i18n', localeData.data);

      if (lang == null) {
        lang = LANG.EN;
      }

      global.lang = lang;
      yield handleVersion(localeData.data, lang);
    }

    yield put({ type: GLOBAL_I18N });
  } catch (err) {
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Locale',
        content: 'Locale time out please try again later',
        time: new Date(),
      },
    });
  }
}

export default function* watchInitI18n() {
  yield takeLatest(LOCALIZATION_INIT_I18N, doInitI18n);
}
