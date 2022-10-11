import { takeLatest } from 'redux-saga/effects';
import { Unsubscribe } from 'redux-saga';
import { SCClientSocket, create } from 'socketcluster-client';
import config from 'config';
import store from 'redux-sagas/store';
import publicIp from 'public-ip';
import 'utils/authEngine';
import { getKey, setKey } from 'utils/asyncStorage';
import { getAccounts } from 'utils/domain';
import { IAuthToken, IUserExtraInfo, IDomainUserInfo, IAccount, IWSNotification, IUserInfo } from 'interfaces/common';
import { IOrderMatch, IStopOrderActivation } from 'interfaces/notification';
import {
  SOCKET_INIT_SOCKET,
  LOCALIZATION_INIT_I18N,
  NOTIFICATION_ORDER_MATCH,
  NOTIFICATION_STOP_ORDER_ACTIVATION,
  ACCOUNT_QUERY_ALL_ACCOUNTS,
} from 'redux-sagas/actions';
import {
  GLOBAL_USER_EXTRA_INFO,
  defaultUserExtraInfo,
  GLOBAL_USERINFO,
} from 'redux-sagas/global-reducers/UserInfo-reducers';
import { GLOBAL_SELECTED_ACCOUNT } from 'redux-sagas/global-reducers/SelectedAccount-reducers';
import { GLOBAL_DOMAIN_INIT, INIT_SOCKET_ERROR } from 'redux-sagas/global-reducers/AppInit-reducers';
import { GLOBAL_ACCOUNT_LIST } from 'redux-sagas/global-reducers/AccountList-reducers';
import { VIEW_MODE_KEY, SYSTEM_TYPE, VIEW_MODE_USERNAME, ACCOUNT_FETCH_COUNT } from 'global';
import { followRefreshMarket } from 'redux-sagas/global-actions';

let init = true;

let userExtraInfo = defaultUserExtraInfo;

let subscribeDomainNotification = false;

const connect = async () => {
  try {
    global.sourceIp = await publicIp.v4();
    global.domainSocket = create(config.apiUrl.domain.socketCluster);

    global.domainSocket.on('error', (err: Error) => {
      if (init) {
        init = false;
        store.dispatch({
          type: LOCALIZATION_INIT_I18N,
        });
        store.dispatch({
          type: GLOBAL_DOMAIN_INIT,
        });
        store.dispatch({
          type: INIT_SOCKET_ERROR,
          payload: {
            isError: true,
            error: 'Network Error: Please check your internet connection!',
          },
        });
      }
    });

    let domainInit = false;

    global.domainSocket.on('connect', async (status: SCClientSocket.ConnectStatus) => {
      try {
        store.dispatch({
          type: LOCALIZATION_INIT_I18N,
        });
        store.dispatch(followRefreshMarket());

        if (status.isAuthenticated && global.domainSocket.authToken.userInfo != null) {
          const authToken = global.domainSocket.authToken as IAuthToken;
          userExtraInfo = (await getKey(
            `user${
              (authToken.userInfo as IUserInfo).username != null
                ? (authToken.userInfo as IUserInfo).username
                : (authToken.userInfo as IUserInfo).id
            }`
          )) as IUserExtraInfo;

          if (store.getState().userInfo == null) {
            store.dispatch({
              type: GLOBAL_USERINFO,
              payload: authToken.userInfo,
            });
          }

          store.dispatch({
            type: GLOBAL_USER_EXTRA_INFO,
            payload: userExtraInfo,
          });
        }

        if (domainInit !== true) {
          domainInit = true;

          store.dispatch({
            type: GLOBAL_DOMAIN_INIT,
          });

          if (
            status.isAuthenticated &&
            global.domainSocket.authToken.userInfo != null &&
            store.getState().accountList.length === 0
          ) {
            const authToken = global.domainSocket.authToken as IAuthToken;
            const registerMobileOtp = authToken.token.registerMobileOtp;

            if (userExtraInfo.settings == null) {
              userExtraInfo.settings = {};
            }

            if (userExtraInfo.settings.usingMobileOTP == null) {
              userExtraInfo.settings.usingMobileOTP = registerMobileOtp;
            }

            const accountList =
              authToken && authToken.userInfo ? (authToken.userInfo as IDomainUserInfo).accounts : null;
            if (accountList && accountList.length > 0) {
              global.username = (authToken.userInfo as IDomainUserInfo).username;

              const accounts = getAccounts(accountList);

              store.dispatch({
                type: GLOBAL_ACCOUNT_LIST,
                payload: accounts,
              });

              if (userExtraInfo.selectedAccount == null) {
                for (let index = accounts.length - 1; index >= 0; index--) {
                  if (accounts[index].type === SYSTEM_TYPE.EQUITY) {
                    userExtraInfo.selectedAccount = accounts[index];
                    break;
                  }
                }

                if (userExtraInfo.selectedAccount == null) {
                  userExtraInfo.selectedAccount = accounts[0];
                }
              } else {
                if (userExtraInfo.selectedAccount) {
                  const selectedAccount = accounts.find(
                    (account: IAccount) => account.account === (userExtraInfo.selectedAccount as IAccount).account
                  );
                  if (selectedAccount == null) {
                    for (let index = accounts.length - 1; index >= 0; index--) {
                      if (accounts[index].type === SYSTEM_TYPE.EQUITY) {
                        userExtraInfo.selectedAccount = accounts[index];
                        break;
                      }
                    }

                    if (userExtraInfo.selectedAccount == null) {
                      userExtraInfo.selectedAccount = accounts[0];
                    }
                  }
                }
              }
            }

            // Get all accounts when listener a socket connect
            if (store.getState().accountList.length >= ACCOUNT_FETCH_COUNT) {
              store.dispatch({
                type: ACCOUNT_QUERY_ALL_ACCOUNTS,
              });
            }

            if (store.getState().userInfo) {
              setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
            }

            store.dispatch({
              type: GLOBAL_SELECTED_ACCOUNT,
              payload: userExtraInfo.selectedAccount,
            });

            store.dispatch({
              type: GLOBAL_USER_EXTRA_INFO,
              payload: userExtraInfo,
            });

            if (subscribeDomainNotification === false) {
              initDomainNotification();
            }

            if (status.isAuthenticated) {
              const viewModeKey = await getKey(VIEW_MODE_KEY);
              const viewModeUsername = await getKey<string>(VIEW_MODE_USERNAME);

              if (viewModeKey === global.domainSocket.authToken.accessToken) {
                global.viewMode = true;
                if (viewModeUsername != null) {
                  global.username = viewModeUsername;
                }
              } else {
                global.viewMode = false;
              }
            }
          }
        }
      } catch (error) {
        store.dispatch({
          type: LOCALIZATION_INIT_I18N,
        });
        store.dispatch({
          type: GLOBAL_DOMAIN_INIT,
        });
        store.dispatch({
          type: INIT_SOCKET_ERROR,
          payload: {
            isError: true,
            error: 'Error connect: ' + error.message,
          },
        });
      }
    });

    global.domainSocket.on('close', () => {
      global.domainSocket.connect();
    });

    global.domainSocket.on('connecting', () => {});

    global.domainSocket.on('authStateChange', () => {});

    global.domainSocket.on('loggedIn', (data: IAuthToken) => {
      store.dispatch({
        type: GLOBAL_USERINFO,
        payload: data.userInfo,
      });
      const registerMobileOtp = data.token.registerMobileOtp;

      if (userExtraInfo.settings == null) {
        userExtraInfo.settings = {};
      }

      userExtraInfo.settings.usingMobileOTP = registerMobileOtp;

      global.username = data && data.userInfo && (data.userInfo as IDomainUserInfo).username;

      const unsubscribe: Unsubscribe = store.subscribe(async () => {
        const userInfo = store.getState().userInfo;

        if (userInfo != null && userInfo.username != null) {
          if (userInfo.username != null || userInfo.id != null) {
            userExtraInfo = (await getKey(
              `user${userInfo.username != null ? userInfo.username : userInfo.id}`
            )) as IUserExtraInfo;
            if (userExtraInfo == null) {
              userExtraInfo = defaultUserExtraInfo;
            }

            const accountList = data && data.userInfo ? (data.userInfo as IDomainUserInfo).accounts : null;

            if (accountList && accountList.length > 0) {
              const accounts = getAccounts(accountList);

              store.dispatch({
                type: GLOBAL_ACCOUNT_LIST,
                payload: accounts,
              });

              // Get all accounts when login app success
              if (accounts.length >= ACCOUNT_FETCH_COUNT) {
                store.dispatch({
                  type: ACCOUNT_QUERY_ALL_ACCOUNTS,
                });
              }

              if (userExtraInfo.selectedAccount == null) {
                if (config.domain !== 'vcsc') {
                  userExtraInfo.selectedAccount = accounts[0];
                } else {
                  for (let index = accounts.length - 1; index >= 0; index--) {
                    if (accounts[index].type === SYSTEM_TYPE.EQUITY) {
                      userExtraInfo.selectedAccount = accounts[index];
                      break;
                    }
                  }

                  if (userExtraInfo.selectedAccount == null) {
                    userExtraInfo.selectedAccount = accounts[0];
                  }
                }
              } else {
                if (userExtraInfo.selectedAccount) {
                  const selectedAccount = accounts.find(
                    (account: IAccount) => account.account === (userExtraInfo.selectedAccount as IAccount).account
                  );
                  if (selectedAccount == null) {
                    if (config.domain !== 'vcsc') {
                      userExtraInfo.selectedAccount = accounts[0];
                    } else {
                      for (let index = accounts.length - 1; index >= 0; index--) {
                        if (accounts[index].type === SYSTEM_TYPE.EQUITY) {
                          userExtraInfo.selectedAccount = accounts[index];
                          break;
                        }
                      }

                      if (userExtraInfo.selectedAccount == null) {
                        userExtraInfo.selectedAccount = accounts[0];
                      }
                    }
                  }
                }
              }
            }

            if (store.getState().userInfo) {
              setKey(`user${store.getState().userInfo!.username}`, userExtraInfo);
            }

            unsubscribe();

            store.dispatch({
              type: GLOBAL_SELECTED_ACCOUNT,
              payload: userExtraInfo.selectedAccount,
            });

            store.dispatch({
              type: GLOBAL_USER_EXTRA_INFO,
              payload: userExtraInfo,
            });

            if (subscribeDomainNotification === false) {
              initDomainNotification();
            }
          }
        }
      });
    });
  } catch (error) {
    store.dispatch({
      type: LOCALIZATION_INIT_I18N,
    });
    store.dispatch({
      type: GLOBAL_DOMAIN_INIT,
    });
    store.dispatch({
      type: INIT_SOCKET_ERROR,
      payload: {
        isError: true,
        error: 'Error: ' + error.message,
      },
    });
  }
};

const initDomainNotification = () => {
  global.domainSocket.domainChannels = [];

  store.getState().accountList.forEach((account: IAccount) => {
    const domainChannel = global.domainSocket.subscribe(
      `domain.notify.account.${account.accountNumber}${account.subNumber}`,
      { batch: true }
    );
    domainChannel.watch((res: IWSNotification) => {
      handleAccountNotification(res);
    });
    global.domainSocket.domainChannels.push(domainChannel);
  });

  subscribeDomainNotification = true;
};

const handleAccountNotification = (res: IWSNotification) => {
  const currentSymbol = store.getState().currentSymbol;
  const selectedAccount = store.getState().selectedAccount;
  if (currentSymbol && selectedAccount) {
    if (res.method === 'MATCH_ORDER') {
      (res.payload as IOrderMatch).isCurrentSymbol = (res.payload as IOrderMatch).code === currentSymbol.s;
      (res.payload as IOrderMatch).isCurrentAccountSub =
        (res.payload as IOrderMatch).accountNumber === selectedAccount.accountNumber &&
        (res.payload as IOrderMatch).subNumber === selectedAccount.subNumber;
      store.dispatch({
        type: NOTIFICATION_ORDER_MATCH,
        payload: res.payload,
      });
    } else if (res.method === 'STOP_ORDER_ACTIVATION') {
      (res.payload as IStopOrderActivation).isCurrentSymbol =
        (res.payload as IStopOrderActivation).code === currentSymbol.s;
      (res.payload as IStopOrderActivation).isCurrentAccountSub =
        (res.payload as IStopOrderActivation).accountNumber === selectedAccount.accountNumber &&
        (res.payload as IStopOrderActivation).subNumber === selectedAccount.subNumber;
      store.dispatch({
        type: NOTIFICATION_STOP_ORDER_ACTIVATION,
        payload: res.payload,
      });
    }
  }
};

function* doInitSocket() {
  yield connect();
}

export default function* watchInitSocket() {
  yield takeLatest(SOCKET_INIT_SOCKET, doInitSocket);
}
