/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { Navigation } from 'react-native-navigation';
import { Platform, Alert, AppState } from 'react-native';
import { Linking } from 'react-native';
import codePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import semver from 'semver';
import { registerScreens } from './build/screens';
import { Colors } from 'styles';
import config from './src/config';
import NetInfo from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';

const MINUTE_TIME = 60;
Navigation.events().registerAppLaunchedListener(() => {
  // MTS version check
  checkLatestVersion();

  fetchSymbolURL();

  Navigation.setDefaultOptions({
    layout: {
      topMargin: Platform.OS === 'android' && Platform.Version <= 19 ? -17 : undefined,
    },
    topBar: {
      animate: true,
      background: {
        color: config.domain === 'kbsv' ? Colors.PRIMARY_KBSV : Colors.PRIMARY_1,
      },
      title: {
        color: config.domain === 'kbsv' ? Colors.BLACK : Colors.WHITE,
      },
      backButton: {
        color: config.domain === 'kbsv' ? Colors.BLACK : Colors.PRIMARY_1,
      },
    },
    bottomTab: {
      textColor: Colors.DARK_GREY,
      iconColor: Colors.DARK_GREY,
      selectedTextColor: Colors.BLACK,
      selectedIconColor: config.domain === 'kbsv' ? Colors.PRIMARY_KBSV : Colors.PRIMARY_1,
    },
    bottomTabs: {
      backgroundColor: Colors.WHITE,
      titleDisplayMode: 'alwaysShow',
    },
    animations: {
      setRoot: {
        enabled: true,
        x: {
          from: 1,
          to: 0,
          duration: 200,
          interpolation: 'accelerate',
        },
        alpha: {
          from: 0,
          to: 1,
          duration: 200,
          interpolation: 'accelerate',
        },
      },
      push: {
        enabled: true,
        content: {
          x: {
            from: 1,
            to: 0,
            duration: 200,
            interpolation: 'accelerate',
          },
          alpha: {
            from: 0,
            to: 1,
            duration: 200,
            interpolation: 'accelerate',
          },
        },
      },
      pop: {
        enabled: true,
        content: {
          x: {
            from: 0,
            to: 1,
            duration: 200,
            interpolation: 'accelerate',
          },
          alpha: {
            from: 1,
            to: 0,
            duration: 200,
            interpolation: 'decelerate',
          },
        },
      },
    },
  });
});

function updateFromStore() {
  Alert.alert(
    'Update Available',
    'This version of the app is outdated. Please update app from the ' +
      (Platform.OS === 'ios' ? 'App Store' : 'Play Store') +
      '.',
    [
      {
        text: 'Update Now',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL(config.appStoreLink).catch((err) => console.error('An error occurred', err));
          } else {
            Linking.openURL(config.playStoreLink).catch((err) => console.error('An error occurred', err));
          }
        },
      },
    ]
  );
}

function checkCodePushUpdate() {
  return codePush.sync({
    checkFrequency: codePush.CheckFrequency.ON_APP_START,
    installMode: codePush.InstallMode.ON_NEXT_RESUME,
    mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESUME,
    //Automatically update when running in the background for 30 minutes
    minimumBackgroundDuration: MINUTE_TIME * 30,
  });
}

function startCodePushSync() {
  checkCodePushUpdate().then(() => {
    // wait for the initial code sync to complete else we get flicker
    // in the app when it updates after it has started up and is
    // on the Home screen
    // AppState.addEventListener('change', onAppStateChange);
    return null;
  });
}

function checkLatestVersion() {
  if (config.urls.versionUrl != null && config.urls.versionUrl.length != 0) {
    fetch(config.urls.versionUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        Timeout: '5000',
      },
    })
      .then((response) => {
        if (!response.ok) {
          // *** Check errors
          throw new Error('HTTP status ' + response.status);
        }
        return response.text(); // *** Read the TEXT of the response
      })
      .then((dataSourceText) => {
        // *** More accurate name
        const dataSource = JSON.parse(dataSourceText);

        let domainPlatform = config.domain.concat('_', Platform.OS);
        let latestVersion = dataSource[domainPlatform];
        let currentVersion = DeviceInfo.getVersion();

        console.log('Domain Platform: ', domainPlatform);
        console.log('Latest Version: ', latestVersion);
        console.log('Current Version: ', currentVersion);

        if (currentVersion != undefined && latestVersion != undefined) {
          const check = semver.gt(latestVersion, currentVersion);
          if (check === true) {
            console.log('New version found');
            updateFromStore();
          } else {
            console.log('No new version');
            startNavigation();
            startCodePushSync();
          }
        } else {
          console.log("Can't fetch new version info");
          startNavigation();
          startCodePushSync();
        }
      })
      .catch((error) => {
        Alert.alert('Network Error', 'Please check your internet connection then try again!', [
          { text: 'OK', onPress: () => checkLatestVersion() },
        ]);
      });
  }
}

function fetchSymbolURL() {
  if (config.urls.symbolUrlEnv != null && config.urls.symbolUrlEnv.length != 0) {
    fetch(config.urls.symbolUrlEnv, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
      .then((response) => {
        if (!response.ok) {
          // *** Check errors
          throw new Error('Symbol URL HTTP status ' + response.status);
        }
        return response.text(); // *** Read the TEXT of the response
      })
      .then((dataSourceText) => {
        // *** More accurate name
        const dataSource = JSON.parse(dataSourceText);

        let symbolURL = dataSource[config.domain];
        !config.usingNewKisCore && (config.urls.symbolUrl = symbolURL);
        console.log('SYMBOL URL:', config.urls.symbolUrl);
      });
  }
}

function listenDisconnect() {
  let isConnect = true;
  const retry = () => {
    isConnect ? RNRestart.Restart() : showErrorNetworkAlert();
  };

  const showErrorNetworkAlert = () => {
    Alert.alert('Network Error', 'No internet connection. Please check and try again', [
      { text: 'Retry', onPress: retry },
    ]);
  };

  NetInfo.addEventListener((state) => {
    isConnect = state.isConnected;
    !state.isConnected && showErrorNetworkAlert();
  });
}

function startNavigation() {
  listenDisconnect();
  registerScreens();

  Navigation.setRoot({
    root: {
      component: {
        name: 'TradeX',
      },
    },
  });
}
