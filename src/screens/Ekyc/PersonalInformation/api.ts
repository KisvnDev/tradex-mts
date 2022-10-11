import config from 'config';
import ImageResizer from 'react-native-image-resizer';
import { width } from 'styles';
import { METHOD } from 'utils/socketApi';

const realWidth = Math.max(width, 1024);

export const getPresignedUrl = async (key: string) => {
  const baseUri = `${config.rest.baseUri}${config.apiUrl.baseURI}`;
  const uri = `${baseUri}aws?serviceName=ekyc&key=${key}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: METHOD.GET,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (result) => {
        resolve(await result.text());
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const uploadImage = async (url: string, imageUri: string) => {
  const resizedImage = await ImageResizer.createResizedImage(
    imageUri,
    realWidth,
    realWidth,
    'JPEG',
    80,
    0,
    undefined,
    true,
    {
      onlyScaleDown: true,
      mode: 'cover',
    }
  );

  const response = await fetch(resizedImage.uri);
  const blob = await response.blob();
  return fetch(url, {
    method: 'PUT',
    body: blob,
  });
};
