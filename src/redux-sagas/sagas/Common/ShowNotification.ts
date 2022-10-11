import { takeLatest } from 'redux-saga/effects';
import i18n from 'i18next';
import { INotification, IRequest } from 'interfaces/common';
import { DropdownAlertController } from 'components/DropdownAlert';
import { COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';

function* doShowNotification(request: IRequest<INotification>) {
  try {
    if (request.payload) {
      DropdownAlertController.alert(
        request.payload.type,
        i18n.t(request.payload.title),
        i18n.t(request.payload.content, request.payload.contentParams),
        request.payload
      );
    }

    yield;
  } catch (err) {}
}

export default function* watchShowNotification() {
  yield takeLatest(COMMON_SHOW_NOTIFICATION, doShowNotification);
}
