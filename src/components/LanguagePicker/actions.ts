import { LOCALIZATION_CHANGE_LANGUAGE } from 'redux-sagas/actions';
import { LANG } from 'global';

export const changeLanguage = (payload: { lang: LANG; callApi: boolean }) => ({
  type: LOCALIZATION_CHANGE_LANGUAGE,
  payload,
});
