import { IEkycParams, IObject } from 'interfaces/common';
import { CHECK_ID, SHOW_LOADING, HIDE_LOADING } from 'redux-sagas/actions';
import { CHECK_ID_FAILED, CHECK_ID_SUCCESS, CHANGE_EKYC_PARAMS } from './reducer';
import { NOTIFICATION_TYPE } from 'global';
import { COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';

export const showNoti = (title: string, content: string, type: NOTIFICATION_TYPE) => ({
  type: COMMON_SHOW_NOTIFICATION,
  payload: {
    type: type,
    title,
    content,
    time: new Date(),
  },
});

export const showLoading = () => ({
  type: SHOW_LOADING,
  showLoading: true,
});
export const hideLoading = () => ({
  type: HIDE_LOADING,
  hideLoading: true,
});

export const checkEkycID = (payload: IObject) => ({
  type: CHECK_ID,
  response: {
    success: CHECK_ID_SUCCESS,
    failure: CHECK_ID_FAILED,
  },
  payload,
  showLoading: true,
});

export const changeEkycParams = (payload: IEkycParams) => ({
  type: CHANGE_EKYC_PARAMS,
  payload,
});
