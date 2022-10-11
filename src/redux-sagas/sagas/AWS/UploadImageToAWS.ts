import 'whatwg-fetch';
import { put, takeLatest, call } from 'redux-saga/effects';
import { IRequest, IObject } from 'interfaces/common';
import { NOTIFICATION_TYPE } from 'global';
import { AWS_UPLOAD_IMAGE, COMMON_SHOW_NOTIFICATION } from 'redux-sagas/actions';

const uploadImageToAWS = (params: IObject) => {
  const form = new FormData();

  Object.keys((params.signedData as IObject).fields as IObject).forEach((key: string) =>
    form.append(key, ((params.signedData as IObject).fields as IObject)[key] as string)
  );

  form.append('Content-Type', (params.image as IObject).type as string);

  const data = {
    uri: (params.image as IObject).avatarSource,
    name: ((params.signedData as IObject).fields as IObject).key,
    type: (params.image as IObject).type,
  };

  form.append('file', (data as unknown) as Blob);

  return fetch((params.signedData as IObject).url as string, {
    method: 'POST',
    body: form,
  });
};

function* doUploadImageToAWS(request: IRequest<IObject>) {
  try {
    const response = yield call(uploadImageToAWS, request.payload);

    if (response.status !== 200 && response.status !== 204) {
      yield put({
        type: COMMON_SHOW_NOTIFICATION,
        payload: {
          type: NOTIFICATION_TYPE.ERROR,
          title: 'Update Avatar',
          content: 'Failed to update your avatar!',
          time: new Date(),
        },
        hideLoading: true,
      });
    } else {
      yield put({
        type: request.response.success,
        payload: `${(request.payload.signedData as IObject).url}/${
          ((request.payload.signedData as IObject).fields as IObject).key
        }`,
      });
    }
  } catch (err) {
    console.log(err);
    yield put({
      type: COMMON_SHOW_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: 'Update Avatar',
        content: 'Failed to update your avatar!',
        time: new Date(),
      },
      hideLoading: true,
    });
  }
}

export default function* watchUploadImageToAWS() {
  yield takeLatest(AWS_UPLOAD_IMAGE, doUploadImageToAWS);
}
