import { IObject, IAction } from 'interfaces/common';

export const USER_UPDATE_PROFILE_SUCCESS = 'USER_UPDATE_PROFILE_SUCCESS';
export const USER_UPDATE_PROFILE_FAILED = 'USER_UPDATE_PROFILE_FAILED';
export const AWS_GET_SIGNED_DATA_SUCCESS = 'AWS_GET_SIGNED_DATA_SUCCESS';
export const AWS_GET_SIGNED_DATA_FAILED = 'AWS_GET_SIGNED_DATA_FAILED';
export const AWS_UPLOAD_IMAGE_SUCCESS = 'AWS_UPLOAD_IMAGE_SUCCESS';
export const AWS_UPLOAD_IMAGE_FAILED = 'AWS_UPLOAD_IMAGE_FAILED';

export function AWSSignedData(state: IObject | null = null, action: IAction<IObject>) {
  switch (action.type) {
    case AWS_GET_SIGNED_DATA_SUCCESS:
      return { ...action.payload };
    default:
      return state;
  }
}

export function AWSUploadImageInfo(state: string | null = null, action: IAction<string>) {
  switch (action.type) {
    case AWS_UPLOAD_IMAGE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
