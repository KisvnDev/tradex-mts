import { getKey } from 'utils/asyncStorage';
import i18n from 'i18next';
import { SCClientSocket } from 'socketcluster-client';
import jwt_decode from 'jwt-decode';
import config from 'config';

import { IResponse, IClientData, IObject, IAuthToken, IMASCommonResponse } from 'interfaces/common';
import store from 'redux-sagas/store';
import { AUTHENTICATION_SIGNOUT, REFRESH_TOKEN } from 'redux-sagas/actions';
// import fetchToCurl from 'fetch-to-curl';

export enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export async function loadClientData(socket: SCClientSocket | null) {
  if (socket == null) {
    throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
  }

  return new Promise<IResponse<IClientData>>((resolve: Function, reject: Function) => {
    const data = {
      headers: {
        'accept-language': global.lang,
      },
      body: {
        serviceName: config.usingNewKisCore === true ? 'abcxyz' : 'wts',
        sourceIp: global.sourceIp,
      },
    };

    socket.emit('loadServiceConfig', data, (err: Error, responseData: IResponse<IClientData>) => {
      if (err) {
        console.log(socket);
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
}

async function refreshToken(socket: SCClientSocket | null) {
  const clientData: IResponse<IClientData> = await loadClientData(socket);

  let refreshToken: string | null | boolean =
    socket != null && socket.authToken != null && (socket.authToken as IAuthToken).refreshToken;

  if (config.usingNewKisCore) {
    refreshToken = await getKey(REFRESH_TOKEN);
  }

  console.log('refreshToken', refreshToken);

  const params = {
    grant_type: 'refresh_token',
    client_id: clientData.data.clientId,
    client_secret: clientData.data.clientSecret,
    refresh_token: refreshToken,
  };

  return emitSocket(socket, 'login', params);
}

function emitSocket<T>(
  socket: SCClientSocket | null,
  service: string,
  data: any // tslint:disable-line
): Promise<IResponse<T>> {
  if (socket == null) {
    throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
  }
  return new Promise<IResponse<T>>((resolve: Function, reject: Function) => {
    socket.emit(service, { ...data }, (err: Error, responseData: IResponse<T>) => {
      if (err) {
        console.error(socket.id, service, data.uri, err);
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
}

export async function logout(socket: SCClientSocket | null, params: object) {
  if (socket == null) {
    throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
  }

  return new Promise<IResponse<object>>((resolve: Function, reject: Function) => {
    const data = {
      headers: {
        'accept-language': global.lang,
      },
      body: params != null ? { ...params, sourceIp: global.sourceIp } : { sourceIp: global.sourceIp },
    };

    socket.emit('logout', data, (err: Error, responseData: IResponse<object>) => {
      if (err) {
        console.log(socket);
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
}

export async function login(socket: SCClientSocket | null, params: object) {
  if (socket == null) {
    throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
  }

  return new Promise<IResponse<object>>((resolve: Function, reject: Function) => {
    const data = {
      headers: {
        'accept-language': global.lang,
      },
      body: params != null ? { ...params, sourceIp: global.sourceIp } : { sourceIp: global.sourceIp },
    };

    socket.emit('login', data, (err: Error, responseData: IResponse<object>) => {
      if (err) {
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
}

export async function loginBiometrics(socket: SCClientSocket | null, params: object) {
  if (socket == null) {
    throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
  }

  return new Promise<IResponse<object>>((resolve: Function, reject: Function) => {
    const data = {
      headers: {
        'accept-language': global.lang,
      },
      body: params != null ? { ...params, sourceIp: global.sourceIp } : { sourceIp: global.sourceIp },
    };

    socket.emit('login/biometric', data, (err: Error, responseData: IResponse<object>) => {
      if (err) {
        console.log(socket);
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
}

export async function verifyOTP(socket: SCClientSocket | null, params: object = {}) {
  if (socket == null) {
    throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
  }

  return new Promise<IResponse<object>>((resolve: Function, reject: Function) => {
    const data = {
      headers: {
        'accept-language': global.lang,
      },
      body: params != null ? { ...params, sourceIp: global.sourceIp } : { sourceIp: global.sourceIp },
    };

    socket.emit('login/sec/verifyOTP', data, (err: Error, responseData: IResponse<object>) => {
      if (err) {
        console.log(socket);
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
}

// export async function verifyOTPBiometric(socket: SCClientSocket | null, params: object = {}) {
//   if (socket == null) {
//     throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
//   }

//   return new Promise<IResponse<object>>((resolve: Function, reject: Function) => {
//     const data = {
//       headers: {
//         'accept-language': global.lang,
//       },
//       body: params,
//     };

//     socket.emit('verifyBiometricOtp', data, (err: Error, responseData: IResponse<object>) => {
//       if (err) {
//         console.log(socket);
//         reject(err);
//       } else {
//         resolve(responseData);
//       }
//     });
//   });
// }

export async function query<T>(
  socket: SCClientSocket | null,
  uri: string,
  method: string,
  params: object = {},
  secToken?: string,
  secDomain?: string,
  failoverSocket?: SCClientSocket | null,
  baseURI?: string
) {
  if (config.rest.enable) {
    if (baseURI?.includes('restttl')) {
      return queryRestTTL(socket, uri, params, method);
    }
    return queryRest(socket, uri, method, params, secToken, secDomain, baseURI);
  }
  const parsedUri = `${method}:${baseURI != null ? baseURI : config.apiUrl.baseURI}${uri}`;
  if (socket == null) {
    console.log(parsedUri);
    throw new Error(i18n.t('INTERNAL_SERVER_ERROR'));
  }

  return new Promise<IResponse<T>>((resolve: Function, reject: Function) => {
    const data = {
      uri: parsedUri,
      headers: {
        'accept-language': global.lang,
        secToken,
        secDomain,
      },
      body: params != null ? { ...params, sourceIp: global.sourceIp } : { sourceIp: global.sourceIp },
    };

    socket.emit('doQuery', data, (err: Error, responseData: IResponse<T>) => {
      if (err) {
        console.log(socket);
        console.log('doQuery: ', uri, err);

        if (failoverSocket != null) {
          query(failoverSocket, uri, method, params, secToken, secDomain)
            .then((data: IResponse<T>) => {
              resolve(data);
            })
            .catch(() => {
              reject(err);
            });
        }
        reject(err);
      } else {
        resolve(responseData);
      }
    });
  });
}

export async function queryRestTTL<T, P = IObject>(
  socket: SCClientSocket | null,
  uri: string,
  params: P | IObject = {},
  method: string
): Promise<IMASCommonResponse> {
  try {
    let parsedUri = `${config.rest.baseUriIICA}${uri}`;
    const localHeaders: HeadersInit_ = {};
    const localBody = {};
    const localSearchParams: Array<{
      key: string;
      value: string | string[];
    }> = [];
    const url = new URL(parsedUri);
    let hasBody = false;

    if (params != null) {
      Object.keys(params).forEach((requestKey: string) => {
        const requestValue = params[requestKey];
        const pathParm = `{${requestKey}}`;
        if (parsedUri != null && parsedUri.indexOf(pathParm) > -1) {
          parsedUri = parsedUri.replace(pathParm, requestValue);
        } else {
          if (method == null || method === METHOD.GET || method === METHOD.DELETE) {
            if (requestValue == null) {
              return;
            }
            localSearchParams.push({
              key: requestKey,
              value: requestValue,
            });
          } else {
            localBody[requestKey] = requestValue;
            hasBody = true;
          }
        }
      });
    }

    localSearchParams.forEach((item) => {
      if (Array.isArray(item.value)) {
        url.searchParams.set(item.key, (item.value as string[]).join(','));
      } else {
        url.searchParams.set(item.key, item.value);
      }
    });

    const localRequestOptions: RequestInit = {
      method: method ?? METHOD.GET,
      headers: localHeaders,
      credentials: 'include',
      redirect: 'follow',
    };

    localHeaders.Authorization = `jwt ${global.domainSocket.authToken.accessToken}`;

    const decodeToken = jwt_decode<{ ud: { masDrTokenId: string } }>(global.domainSocket.authToken.accessToken);

    if (hasBody) {
      localHeaders['Content-Type'] = 'application/json';
      localRequestOptions.credentials = 'omit';
      localHeaders.Cookie = decodeToken.ud.masDrTokenId;
      localRequestOptions.body = JSON.stringify(localBody);
    }
    console.log(uri, params, url, localRequestOptions);
    const res: Response = await fetch(url.toString(), localRequestOptions);
    const result: IMASCommonResponse = await res.json();

    if (result.errorCode === 'OLS0012' || result.errorCode === 'OLS0027') {
      store.dispatch({
        type: AUTHENTICATION_SIGNOUT,
      });
    }

    if (result.errorCode != null && result.errorCode !== 'OLS0000' && result.errorCode !== '0') {
      throw Error(result.errorMessage);
    }

    return result;
  } catch (error) {
    return error;
  }
}

async function queryRest<T, P = IObject>(
  socket: SCClientSocket | null,
  uri: string,
  method: string,
  params: P | IObject = {},
  secToken?: string,
  secDomain?: string,
  baseURI?: string
): Promise<IResponse<T>> {
  let parsedUri = `${config.rest.baseUri}${baseURI != null ? baseURI : config.apiUrl.baseURI}${uri}`;
  const localBody = {};
  const localSearchParams: Array<{ key: string; value: string | string[] }> = [];
  let hasBody = false;
  if (params != null) {
    Object.keys(params).forEach((requestKey: string) => {
      const requestValue = params[requestKey];
      const pathParm = `{${requestKey}}`;
      if (parsedUri.indexOf(pathParm) > -1) {
        if (requestValue == null) {
          console.error('value is null of key', requestKey, uri, method);
          return;
        }
        parsedUri = parsedUri.replace(pathParm, requestValue);
      } else {
        if (method === METHOD.GET || method === METHOD.DELETE) {
          if (requestValue == null) {
            return;
          }
          localSearchParams.push({
            key: requestKey,
            value: requestValue,
          });
        } else {
          localBody[requestKey] = requestValue;
          hasBody = true;
        }
      }
    });
  }

  const url = new URL(parsedUri);
  localSearchParams.forEach((item) => {
    if (Array.isArray(item.value)) {
      url.searchParams.set(item.key, (item.value as string[]).join(','));
    } else {
      url.searchParams.set(item.key, item.value);
    }
  });

  const localeHeaders: Record<string, string> = {
    'accept-language': global.lang,
  };
  if (secToken != null) {
    localeHeaders.secToken = secToken;
  }
  if (secDomain != null) {
    localeHeaders.secDomain = secDomain;
  }
  if (global.domainSocket.authToken != null && global.domainSocket.authToken.accessToken != null) {
    localeHeaders.Authorization = `jwt ${global.domainSocket.authToken.accessToken}`;
  }

  const localRequestOptions: RequestInit = {
    method: method.toUpperCase(),
    headers: localeHeaders,
  };

  if (method === METHOD.POST || method === METHOD.PUT) {
    localeHeaders['Content-Type'] = 'application/json';
    if (hasBody) {
      localRequestOptions.body = JSON.stringify(localBody);
    }
  }

  if (config.usingNewKisCore && global.OTPTokenMatrix) {
    localeHeaders.otpToken = global.OTPTokenMatrix;
  }

  const finalUrl = url.toString();
  console.log(uri, params, finalUrl, localRequestOptions);
  // if (uri === 'verifyAndSaveOTP') {
  //   console.log(fetchToCurl(finalUrl, localRequestOptions as any));
  // }
  return fetch(finalUrl, localRequestOptions).then(async (response: Response) => {
    if (response.status >= 200 && response.status < 300) {
      // success
      return response.json().then((data) => ({ data }));
    } else if (response.status >= 500) {
      // internal server error
      return Promise.reject(new Error('INTERNAL_SERVER_ERROR'));
    } else if (response.status === 401 || response.status === 403) {
      if (config.usingNewKisCore === false) {
        // authorization. will try to refresh token
        await refreshToken(socket);
        return queryRest(socket, uri, method, params, secToken, secDomain);
      } else {
        return response.json().then(async (data) => {
          if (data.code === 'OTP_TOKEN_IS_REQUIRED' || data.code === 'OTP_TOKEN_IS_EXPIRED') {
            global.OTPTokenMatrix = null;
          }

          if (data.code !== 'OTP_TOKEN_IS_EXPIRED') {
            await refreshToken(global.domainSocket);
          }

          return Promise.reject(data);
        });
      }
    } else {
      if (
        config.usingNewKisCore === true &&
        uri === 'services/eqt/getAdditionIssueShareInfo' &&
        response.status === 400
      ) {
        return response.json().then((data) => ({ data: [] }));
      } else {
        // validation error
        return response.json().then((data) => Promise.reject(data));
      }
    }
  });
}
export const readJson = <T>(url: string): Promise<T> =>
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      return response.json();
    })
    .catch(function () {
      return undefined;
    });
