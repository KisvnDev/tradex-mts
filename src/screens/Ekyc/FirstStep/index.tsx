import React from 'react';
import { View, NativeModules, Platform, Image, TouchableOpacity } from 'react-native';
import Button from 'components/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import styles from './styles';
import { goToEkycPersonalInformation } from 'navigations';
import i18n from 'i18next';
import { IAndroidEkycResult } from 'interfaces/common';
import { showNoti } from '../action';
import { NOTIFICATION_TYPE } from 'global';
import UIText from 'components/UiText';

// import * as pako from 'pako';

// const getData = () => {
// return fetch('https://trading.kisvn.vn/files/ekyc-resources/don_vi_hanh_chinh.json.gz', {
//   method: 'GET',
// }).then(async (response) => {
//   try {
//     const blob = await response.arrayBuffer();
//     return new Uint8Array(blob);
//   } catch (error) {
//     console.error('get buffer', error);
//     throw error;
//   }
// });
// };

const requirements = [
  "Document must be valid. It's still in original form and not a copy/scanned copy one",
  'Put the document on the flat surface',
  'Ensure document details are clear to read with no blur or glare',
];

interface IEkycFirstStepProps extends React.ClassAttributes<EkycFirstStep>, WithTranslation {
  showNoti: (title: string, content: string, type: NOTIFICATION_TYPE) => void;
}

interface IEkycFirstStepState {
  isChosenDocument: boolean;
}

class EkycFirstStep extends React.Component<IEkycFirstStepProps, IEkycFirstStepState> {
  constructor(props: IEkycFirstStepProps) {
    super(props);
    this.state = {
      isChosenDocument: false,
    };
  }

  componentDidMount() {
    // RNFetchBlob.fetch('GET', 'https://trading.kisvn.vn/files/ekyc-resources/don_vi_hanh_chinh.json.gz').then((res) => {
    //   let status = res.info().status;
    //   console.log('TEXT', res.base64());
    //   const data = res.base64();
    //   if (status === 200) {
    //     try {
    //       const gz = pako.ungzip(data, { to: 'string' });
    //       console.log('Gz than chuong', gz);
    //     } catch (error) {
    //       console.error('pako ungzip', error);
    //       throw error;
    //     }
    //   } else {
    //     // handle other status codes
    //   }
    // });
  }

  render() {
    const { t } = this.props;
    const introduction = (
      <>
        <View style={styles.container}>
          <Image style={styles.card} source={require('../../../../assets/images/Group.png')} />
          <UIText style={styles.title}>{t('ID Card/Citizen Card/ Passport')}</UIText>
          <UIText style={styles.note}>
            {t('Please help to take a photo of both side of your ID Card/Citizen Card/Passport')}
          </UIText>

          {requirements.map((req, i) => (
            <View style={styles.requirement} key={'requirement' + i}>
              <View style={styles.requirementNumberContainer}>
                <UIText style={styles.requirementNumber}>{i + 1}</UIText>
              </View>
              <UIText style={styles.requirementContent}>{t(req)}</UIText>
            </View>
          ))}
        </View>
        <View style={styles.button}>
          <Button
            title={t('Take photos')}
            onPress={() => {
              this.setState({ isChosenDocument: true });
            }}
          />
        </View>
      </>
    );

    const chosenDocument = (
      <>
        <UIText style={styles.titleDocument}>{t('You are Investor?')}</UIText>
        <TouchableOpacity
          style={styles.selectDocument}
          onPress={() => {
            this.onPress('ID');
          }}
        >
          <UIText>{t('Vietnamese Investor')}</UIText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectDocument}
          onPress={() => {
            this.onPress('Passport');
          }}
        >
          <UIText>{t('Foreign Investor')}</UIText>
        </TouchableOpacity>
      </>
    );
    return <UserInactivity>{this.state.isChosenDocument ? chosenDocument : introduction}</UserInactivity>;
  }

  private onPress = (type: string) => {
    i18n.changeLanguage(global.lang);
    if (Platform.OS === 'ios') {
      const iosType = type === 'ID' ? '0' : '2';
      let RNEkycVnptSdk = NativeModules.RNEkycVnptSdk;
      RNEkycVnptSdk.initVnptEkyc(iosType, global.lang)
        .then((result: any) => {
          const data = JSON.parse(result) as IAndroidEkycResult;

          if (JSON.parse(data?.info as string)?.errors && JSON.parse(data?.info as string)?.errors?.length > 0) {
            this.props.showNoti('Ekyc', 'FAILED', NOTIFICATION_TYPE.ERROR);
            return;
          }
          goToEkycPersonalInformation('EkycFirstStep', { result: JSON.parse(result) });
        })
        .catch((err: any) => {
          console.log('err ekyc:' + err);
        });
      return;
    } else {
      NativeModules.VnptEkyc.ekyc(type, global.lang, (result: string) => {
        const data = JSON.parse(result) as IAndroidEkycResult;
        if (data?.errors && data?.errors?.length > 0) {
          this.props.showNoti('Ekyc', 'FAILED', NOTIFICATION_TYPE.ERROR);
          return;
        }
        goToEkycPersonalInformation('EkycFirstStep', { result: JSON.parse(result) });
      });
    }
  };
}

const mapStateToProps = () => ({});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { showNoti })(EkycFirstStep)),
  Fallback,
  handleError
);
