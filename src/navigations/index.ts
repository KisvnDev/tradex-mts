import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18next from 'i18next';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { INews } from 'interfaces/news';
import { IEkycParams, IObject } from 'interfaces/common';
import { Colors } from 'styles';
import { IOpenBankAccount } from 'config';

Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
  let componentId = 'Market';
  switch (unselectedTabIndex) {
    case 0:
      componentId = 'Market';
      break;
    case 1:
      componentId = 'Ranking';
      break;
    case 2:
      componentId = 'SpeedOrder';
      break;
    case 3:
      componentId = 'SymbolInfo';
      break;
    case 4:
      componentId = 'More';
      break;
    default:
      break;
  }
  Navigation.popTo(componentId);
});

Navigation.events().registerComponentDidAppearListener(({ componentName, passProps }) => {
  if (passProps == null || Object.keys(passProps).length < 1) {
    global.currentComponent = componentName;
  }
});

export const goToAuth = () =>
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              id: 'Login',
              name: 'Login',
              options: {
                statusBar: {
                  visible: true,
                  backgroundColor: Colors.WHITE,
                  style: 'dark',
                },
                topBar: {
                  visible: false,
                },
              },
            },
          },
        ],
      },
      // component: {
      //   name: 'Login',
      //   options: {
      //     statusBar: {
      //       visible: true,
      //       backgroundColor: Colors.WHITE,
      //       style: 'dark',
      //     },
      //   },
      // },
    },
  });

export const goToHome = () => {
  Promise.all([
    MaterialIcons.getImageSource('view-list', 16),
    MaterialIcons.getImageSource('trending-up', 16),
    Fontisto.getImageSource('bar-chart', 14),
    MaterialIcons.getImageSource('flash-on', 16),
    MaterialIcons.getImageSource('settings-applications', 16),
    MaterialIcons.getImageSource('search', 25),
    FontAwesome.getImageSource('bell-o', 22),
  ]).then(([favoriteIcon, rankingIcon, symbolIcon, speedOrderIcon, moreIcon, searchIcon, alarmIcon]) => {
    Navigation.setRoot({
      root: {
        bottomTabs: {
          id: 'BottomTabs',
          children: [
            {
              stack: {
                children: [
                  {
                    component: {
                      id: 'Market',
                      name: 'Market',
                      options: {
                        bottomTab: {
                          text: i18next.t('Market'),
                          icon: favoriteIcon,
                        },
                        topBar: {
                          title: {
                            text: i18next.t('Market'),
                          },
                          rightButtons:
                            Platform.OS === 'android'
                              ? [
                                  {
                                    id: 'AlarmButton',
                                    icon: alarmIcon,
                                    color: Colors.WHITE,
                                  },
                                  {
                                    id: 'SearchButton',
                                    icon: searchIcon,
                                    color: Colors.WHITE,
                                  },
                                ]
                              : undefined,
                          rightButtonColor: Platform.OS === 'android' ? Colors.WHITE : undefined,
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: 'Ranking',
                      name: 'Ranking',
                      options: {
                        topBar: {
                          title: {
                            text: i18next.t('Ranking'),
                          },
                        },
                        bottomTab: {
                          text: i18next.t('Ranking'),
                          icon: rankingIcon,
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: 'SpeedOrder',
                      name: 'SpeedOrder',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: i18next.t('Speed Order'),
                    icon: speedOrderIcon,
                  },
                },
              },
            },
            {
              stack: {
                id: 'SymbolInfoTab',
                children: [
                  {
                    component: {
                      id: 'SymbolInfo',
                      name: 'SymbolInfo',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: i18next.t('Symbol'),
                    icon: symbolIcon,
                  },
                },
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      id: 'More',
                      name: 'More',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: i18next.t('More'),
                    icon: moreIcon,
                  },
                },
              },
            },
          ],
        },
      },
    });
  });
};

export const goToFavoriteList = () => {
  Promise.all([FontAwesome.getImageSource('list', 22)]).then(([listIcon]) => {
    Navigation.push('Market', {
      component: {
        id: 'FavoriteList',
        name: 'FavoriteList',
        options: {
          topBar: {
            backButton: {
              color: Colors.WHITE,
            },
            title: {
              component: {
                name: 'FavoritePicker',
                alignment: 'center',
              },
            },
            rightButtons: [
              {
                id: 'ManageFavoriteButton',
                icon: listIcon,
                color: Colors.WHITE,
              },
            ],
          },
        },
      },
    });
  });
};

export const goToFavoriteNews = () => {
  Navigation.push('Market', {
    component: {
      id: 'FavoriteNews',
      name: 'FavoriteNews',
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          title: {
            component: {
              name: 'FavoritePicker',
              alignment: 'center',
            },
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToFavoriteLists = () => {
  Navigation.push('FavoriteList', {
    component: {
      id: 'FavoriteLists',
      name: 'FavoriteLists',
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
          },
          title: {
            text: i18next.t('Manage Favorite Lists'),
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToIndexList = () => {
  Navigation.push('Market', {
    component: {
      id: 'IndexList',
      name: 'IndexList',
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
          },
          title: {
            text: i18next.t('Index List'),
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToUpDownRankingDetail = (upDownType: 'UP' | 'DOWN') => {
  Navigation.push('Ranking', {
    component: {
      id: 'UpDownRankingDetail',
      name: 'UpDownRankingDetail',
      passProps: {
        upDownType,
      },
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
          },
          title: {
            text: i18next.t(upDownType),
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToSymbolSearch = (fromComponent: string, favoriteMode = false, componentId?: string) => {
  Navigation.push(fromComponent, {
    component: {
      id: componentId ? componentId : 'SymbolSearch',
      name: 'SymbolSearch',
      passProps: {
        parentId: fromComponent,
        favoriteMode,
      },
      options: {
        topBar: {
          backButton: {
            visible: false,
          },
          title: {
            component: {
              name: 'SymbolSearchInput',
              passProps: {
                parentId: componentId ? componentId : 'SymbolSearch',
              },
            },
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToNewsDetail = (fromComponent: string, news: INews) => {
  Navigation.push(fromComponent, {
    component: {
      id: 'NewsDetail',
      name: 'NewsDetail',
      passProps: {
        news,
      },
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
          },
          title: {
            text: news.title,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToSymbolInfo = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      id: 'SymbolInfoStack',
      name: 'SymbolInfo',
      passProps: {
        parentId: componentId,
      },
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToIndexInfo = (componentId: string) => {
  Promise.all([FontAwesome.getImageSource('bell-o', 22)]).then(([AlarmIcon]) => {
    Navigation.push(componentId, {
      component: {
        id: 'IndexInfo',
        name: 'IndexInfo',
        options: {
          topBar: {
            backButton: {
              color: Colors.WHITE,
            },
            rightButtons: [
              {
                id: 'AlarmButton',
                icon: AlarmIcon,
                color: Colors.WHITE,
              },
            ],
          },
        },
      },
    });
  });
};

export const goToUserProfile = () => {
  Navigation.push('More', {
    component: {
      id: 'UserProfile',
      name: 'UserProfile',
      options: {
        topBar: {
          title: {
            text: i18next.t('User Profile'),
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToSettings = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      id: 'Settings',
      name: 'Settings',
      options: {
        topBar: {
          title: {
            text: i18next.t('Settings'),
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToAlarmList = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      id: 'AlarmList',
      name: 'AlarmList',
      options: {
        topBar: {
          title: {
            text: i18next.t('AlarmList'),
          },
          backButton: {
            color: Colors.WHITE,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToSymbolAlarmDetail = (componentId: string, extraProps: IObject = {}) => {
  Navigation.push(componentId, {
    component: {
      id: 'SymbolAlarmDetail',
      name: 'SymbolAlarmDetail',
      passProps: extraProps,
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToIndexAlarmDetail = (componentId: string, extraProps: IObject = {}) => {
  Navigation.push(componentId, {
    component: {
      id: 'IndexAlarmDetail',
      name: 'IndexAlarmDetail',
      passProps: extraProps,
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToBiz = (
  componentId: string,
  extraProps: IObject = {},
  fromComponent = 'More',
  title?: string,
  toComponent?: string
) => {
  Navigation.push(fromComponent, {
    component: {
      id: toComponent ? toComponent : componentId,
      name: componentId,
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            text: title == null ? i18next.t(componentId) : i18next.t(title),
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToRegisterAccount = (extraProps: IObject = {}) => {
  Navigation.push('Login', {
    component: {
      id: 'RegisterAccount', // TODO
      name: 'RegisterAccount', // TODO
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            text: i18next.t('Open account2'),
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToOpenBankAccountDetail = (extraProps: IOpenBankAccount, title: string = '') => {
  Navigation.push('OpenBankAccount', {
    component: {
      id: 'OpenBankAccountDetail',
      name: 'OpenBankAccountDetail',
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            text: i18next.t(title),
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToEkyc = (fromComponent: string) => {
  Navigation.push(fromComponent, {
    component: {
      id: 'EkycFirstStep',
      name: 'EkycFirstStep',
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          title: {
            component: {
              id: 'EkycStepProgress',
              name: 'EkycStepProgress',
              alignment: 'center',
              passProps: { number: 1 },
            },
          },
        },
      },
    },
  });
};
export const goToIdPhase = (extraProps: IObject = {}) => {
  Navigation.push('RegisterAccount', {
    component: {
      id: 'IdPhase',
      name: 'IdPhase',
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            component: {
              id: 'TopBarStep',
              name: 'TopBarStep',
              alignment: 'center',
              passProps: {
                step: 1,
              },
            },
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToEkycPersonalInformation = (fromComponent: string, result: IObject) => {
  Navigation.push(fromComponent, {
    component: {
      id: 'EkycPersonalInformation',
      name: 'EkycPersonalInformation',
      passProps: result,
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          title: {
            component: {
              name: 'EkycStepProgress',
              alignment: 'center',
              passProps: { number: 3 },
            },
          },
        },
      },
    },
  });
};

export const goToIdSupport = (extraProps: IObject = {}) => {
  Navigation.push('IdScanner', {
    component: {
      id: 'IdSupport',
      name: 'IdSupport',
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            text: i18next.t('Support'),
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToEkycServiceInformation = (fromComponent: string, params: IEkycParams) => {
  Navigation.push(fromComponent, {
    component: {
      id: 'EkycServiceInformation',
      name: 'EkycServiceInformation',
      passProps: { params },
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          title: {
            component: {
              name: 'EkycStepProgress',
              alignment: 'center',
              passProps: { number: 4 },
            },
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToIdScanner = (extraProps: IObject = {}) => {
  Navigation.push('IdPhase', {
    component: {
      id: 'IdScanner',
      name: 'IdScanner',
      passProps: extraProps,
      options: {
        topBar: {
          visible: false,
        },
      },
    },
  });
};

export const goToEkycUploadSignature = (fromComponent: string, params: IEkycParams) => {
  Navigation.push(fromComponent, {
    component: {
      id: 'EkycUploadSignature',
      name: 'EkycUploadSignature',
      passProps: { params },
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          title: {
            component: {
              name: 'EkycStepProgress',
              alignment: 'center',
              passProps: { number: 4 },
            },
          },
        },
      },
    },
  });
};

export const goToFaceScanner = (extraProps: IObject = {}) => {
  Navigation.push('FacePhase', {
    component: {
      id: 'FaceScanner',
      name: 'FaceScanner',
      passProps: extraProps,
      options: {
        topBar: {
          visible: false,
        },
      },
    },
  });
};

export const goToFacePhase = (extraProps: IObject = {}) => {
  Navigation.push('IdScanner', {
    component: {
      id: 'FacePhase',
      name: 'FacePhase',
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            component: {
              id: 'TopBarStep',
              name: 'TopBarStep',
              alignment: 'center',
              passProps: {
                step: 2,
              },
            },
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToEkycOTP = (fromComponent: string, params: IEkycParams) => {
  Navigation.push(fromComponent, {
    component: {
      id: 'EkycOTP',
      name: 'EkycOTP',
      passProps: { params },
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          title: {
            component: {
              name: 'EkycStepProgress',
              alignment: 'center',
              passProps: { number: 4 },
            },
          },
        },
      },
    },
  });
};

export const goToConfirmInfo = (extraProps: IObject = {}) => {
  Navigation.push('FaceScanner', {
    component: {
      id: 'ConfirmInfo',
      name: 'ConfirmInfo',
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            component: {
              id: 'TopBarStep',
              name: 'TopBarStep',
              alignment: 'center',
              passProps: {
                step: 3,
              },
            },
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToEkycSuccessfulRegistration = (fromComponent: string) => {
  Navigation.push(fromComponent, {
    component: {
      id: 'EkycSuccessfulRegistration',
      name: 'EkycSuccessfulRegistration',
      options: {
        topBar: {
          backButton: {
            color: Colors.WHITE,
            showTitle: false,
          },
          title: {
            component: {
              name: 'EkycStepProgress',
              alignment: 'center',
              passProps: { number: 5 },
            },
          },
        },
      },
    },
  });
};

export const goToRegisterAccountService = (extraProps: IObject = {}) => {
  Navigation.push('ConfirmInfo', {
    component: {
      id: 'RegisterAccountService',
      name: 'RegisterAccountService',
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            component: {
              id: 'TopBarStep',
              name: 'TopBarStep',
              alignment: 'center',
              passProps: {
                step: 4,
              },
            },
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};

export const goToRegisterAccountLastNotification = (extraProps: IObject = {}) => {
  Navigation.push('RegisterAccountService', {
    component: {
      id: 'RegisterAccountLastNotification',
      name: 'RegisterAccountLastNotification',
      passProps: extraProps,
    },
  });
};

export const goToForgotPassword = (extraProps: IObject = {}) => {
  Navigation.push('Login', {
    component: {
      id: 'ForgotPassword',
      name: 'ForgotPassword',
      passProps: extraProps,
      options: {
        topBar: {
          title: {
            text: i18next.t('Forgot Password'),
          },
          backButton: {
            color: Colors.WHITE,
            showTitle: Platform.OS === 'ios' ? false : undefined,
          },
          rightButtons: [],
        },
      },
    },
  });
};
