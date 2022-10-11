import React from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
// import { RNCamera } from 'react-native-camera';
import { readFile as read } from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { Camera, CameraType } from 'react-native-camera-kit';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError } from 'utils/common';
import { EFlashMode } from 'screens/IdScanner';
import { IObject } from 'interfaces/common';
import Fallback from 'components/Fallback';
import ScreenLoader from 'components/ScreenLoader';
import { IState } from 'redux-sagas/reducers';
import { sendFaceImages } from './actions';
import { Colors, width } from 'styles';
import styles from './styles';
import { goToIdSupport } from 'navigations';
import UIText from 'components/UiText';

interface IFaceScannerProps extends React.ClassAttributes<FaceScanner>, WithTranslation {
  getFaceActionInfo: IObject | null;
  idImageInfo: IObject | null;
  registerAccountForm: IObject | null;

  sendFaceImages(params: IObject): void;
}

interface IFaceScannerState {
  timer: number;
}

class FaceScanner extends React.Component<IFaceScannerProps, IFaceScannerState> {
  private camera: Camera;
  private interval: NodeJS.Timeout | undefined;

  constructor(props: IFaceScannerProps) {
    super(props);

    this.state = {
      timer: 0,
    };
  }

  private takePicture = async () => {
    // if (this.camera) {
    //   const options = { quality: 0.5, base64: true };
    //   const data = await this.camera.takePictureAsync(options);
    //   this.setState({
    //     imageUrl2: data.uri,
    //     imageUrl2Base64: data.base64 as string,
    //   });
    // }
    this.setState({
      timer: Number(this.props.getFaceActionInfo!.thoiGianQuayVideo),
    });
    const cams: IObject[] = [];
    this.interval = setInterval(async () => {
      if (this.camera) {
        const data = await this.camera.capture();
        const resizedImage = await ImageResizer.createResizedImage(
          data.uri,
          width,
          width,
          'PNG',
          1,
          0,
          undefined,
          false,
          { onlyScaleDown: true, mode: 'cover' }
        );
        const image64 = await read(resizedImage.uri, 'base64');
        //   this.setState({
        //     imageUrl2: data.uri,
        //     imageUrl2Base64: data.base64 as string,
        //   });
        cams.push({
          anh: `data:image/png;base64,${image64}`,
          thoiGian: `${this.state.timer}`,
        });
        this.setState(
          (prevState) => ({ timer: prevState.timer - 1 }),
          () => {
            if (this.state.timer === 0) {
              clearInterval(this.interval as NodeJS.Timeout);
              this.interval = undefined;
              this.setState({}, () => {
                const params = {
                  anhMatTruoc: this.props.idImageInfo!.frontImg,
                  anhVideo: cams,
                  hanhDong: this.props.getFaceActionInfo,
                  ref: this.props.registerAccountForm!.draft_id,
                };
                // Alert.alert('ref', this.props.registerAccountForm!.draft_id as string);
                this.props.sendFaceImages(params as IObject);
              });
            }
          }
        );
      }
    }, 1000 / Number(this.props.getFaceActionInfo!.soAnhGuiLenTrong1s));
  };

  private quitCamera = () => {
    Navigation.pop('FaceScanner');
  };

  private goToFaceSupport = () => {
    goToIdSupport({ isIdSupport: false });
  };

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={styles.containers}>
        <View style={styles.container}>
          <View style={styles.cameraTop}>
            <View style={styles.cameraFlash}>
              <MaterialIcons name={'flash-off'} size={23} color={Colors.WHITE} style={{ display: 'none' }} />
            </View>
            <View style={styles.cameraTitle}>
              <UIText style={styles.cameraNoteText}>{t('FACE_SCANNING')}</UIText>
            </View>
            <View style={styles.cameraQuit}>
              <EntypoIcon name={'cross'} size={23} color={Colors.WHITE} onPress={this.quitCamera} />
            </View>
          </View>
          <View style={styles.cameraContainer}>
            <View style={styles.camera}>
              {/* <RNCamera
                ref={(ref: RNCamera) => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.front}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
              /> */}
              <Camera
                ref={(ref: Camera) => (this.camera = ref)}
                cameraType={CameraType.Front}
                style={styles.cameras}
                flashMode={EFlashMode.OFF}
                focusMode={'off'}
              />
            </View>
          </View>
          <View style={styles.cameraBottom}>
            <View style={styles.cameraNote}>
              <UIText style={styles.cameraNoteText}>
                {this.interval == null ? t('FACE_NOTE') : t('FACE_NOTE_DETAIL')}
              </UIText>
            </View>
            <View style={styles.capture}>
              {this.interval == null ? (
                <TouchableOpacity onPress={this.takePicture} style={styles.captureInside} />
              ) : (
                <View style={styles.captureInside2}>
                  <UIText style={styles.timerText}>{this.state.timer}</UIText>
                </View>
              )}
            </View>
          </View>
          <View style={styles.retryArea}>
            <UIText style={styles.resendText2}>{`${t('NEED_SUPPORT')} `}</UIText>
            <TouchableOpacity onPress={this.goToFaceSupport}>
              <UIText style={styles.resendText}>{t('SUPPORT')}</UIText>
            </TouchableOpacity>
          </View>
        </View>
        <ScreenLoader />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  getFaceActionInfo: state.getFaceActionInfo,
  idImageInfo: state.idImageInfo,
  registerAccountForm: state.registerAccountForm,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      sendFaceImages,
    })(FaceScanner)
  ),
  Fallback,
  handleError
);
