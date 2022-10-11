import React, { ReactNode } from 'react';
import { TouchableOpacity, View, Image, SafeAreaView, Platform, ActivityIndicator, Modal } from 'react-native';
import { Navigation } from 'react-native-navigation';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { connect } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import { Camera, CameraType } from 'react-native-camera-kit';
import { readFile as read } from 'react-native-fs';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IObject } from 'interfaces/common';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { LANG } from 'global';
import { goToAuth, goToFacePhase, goToIdSupport } from 'navigations';
import { IState } from 'redux-sagas/reducers';
import { sendIdImage } from './actions';
import { Colors, width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

export enum EFlashMode {
  ON = 'on',
  OFF = 'off',
  AUTO = 'auto',
}

interface IIdScannerProps extends React.ClassAttributes<IdScanner>, WithTranslation {
  registerAccountForm: IObject | null;
  idImageInfo: IObject | null;
  getFaceActionSuccessTrigger: boolean;
  SendIdImageFailedTrigger: boolean;

  sendIdImage(params: IObject): void;
}

interface IIdScannerState {
  imageUrl: string;
  imageName: string;
  imageName2: string;
  imageUrlBase64: string;
  imageUrl2: string;
  imageUrl2Base64: string;
  flashMode: EFlashMode;
  phase2: boolean;
  loading: boolean;
  lowScoreWarningModal: boolean;
}

class IdScanner extends React.Component<IIdScannerProps, IIdScannerState> {
  private camera: Camera;
  private imageFrontView: string;
  private imageBackView: string;

  constructor(props: IIdScannerProps) {
    super(props);

    this.state = {
      imageUrl: '',
      imageName: '',
      imageName2: '',
      imageUrlBase64: '',
      imageUrl2: '',
      imageUrl2Base64: '',
      flashMode: EFlashMode.OFF,
      phase2: false,
      loading: false,
      lowScoreWarningModal: false,
    };
  }

  componentDidUpdate(prevProps: IIdScannerProps) {
    if (this.props.SendIdImageFailedTrigger !== prevProps.SendIdImageFailedTrigger) {
      this.setState({
        imageUrl: '',
        imageUrlBase64: '',
        imageUrl2: '',
        imageUrl2Base64: '',
        phase2: false,
        loading: false,
      });
    }

    if (this.props.getFaceActionSuccessTrigger !== prevProps.getFaceActionSuccessTrigger) {
      if (this.props.idImageInfo != null) {
        if (this.props.idImageInfo.errorContent != null) {
          this.setState({
            imageUrl: '',
            imageUrlBase64: '',
            imageUrl2: '',
            imageUrl2Base64: '',
            phase2: false,
            loading: false,
            lowScoreWarningModal: true,
          });
        } else {
          if (this.props.idImageInfo.main_score >= 85) {
            this.setState(
              {
                imageUrl: '',
                imageUrlBase64: '',
                imageUrl2: '',
                imageUrl2Base64: '',
                phase2: false,
                loading: false,
              },
              () => {
                goToFacePhase();
              }
            );
          } else {
            this.setState({
              imageUrl: '',
              imageUrlBase64: '',
              imageUrl2: '',
              imageUrl2Base64: '',
              phase2: false,
              loading: false,
              lowScoreWarningModal: true,
            });
          }
        }
      }
    }
  }

  //   private getRealPathFromUri = (Context con  Uri contentUri) => {
  //   Cursor cursor = null;
  //   try {
  //     String[] proj = { MediaStore.Images.Media.DATA };
  //     cursor = context.getContentResolver().query(contentUri, proj, null, null, null);
  //     int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
  //     cursor.moveToFirst();
  //     return cursor.getString(column_index);
  //   } finally {
  //     if (cursor != null) {
  //       cursor.close();
  //     }
  //   }
  // }

  private takePicture = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        if (this.camera) {
          const image = await this.camera.capture();
          if (Platform.OS === 'android') {
            if (image.uri.startsWith('content://')) {
              const uriComponents = image.uri.split('/');
              const fileNameAndExtension = uriComponents[uriComponents.length - 1];
              const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
              await RNFS.copyFile(image.uri, `${destPath}`);
              this.imageFrontView = `file://${destPath}`;
            }
            // this.setState({
            //   imageUrl: `file://${destPath}`,
            // }, () => {
            ImageResizer.createResizedImage(image.uri, width, width / 1.57, 'PNG', 1, 0, undefined, false, {
              onlyScaleDown: true,
              mode: 'cover',
            }).then((response) => {
              // response.uri is the URI of the new image that can now be displayed, uploaded...
              // response.path is the path of the new image
              // response.name is the name of the new image with the extension
              // response.size is the size of the new image
              console.log('responseImage', response);
              this.setState({
                imageUrl: response.uri,
                imageName: response.name,
                loading: false,
              });
            });
            // });
            // }
          } else {
            this.imageFrontView = image.uri;
            ImageResizer.createResizedImage(image.uri, width, width / 1.57, 'PNG', 1, 0, undefined, false, {
              onlyScaleDown: true,
              mode: 'cover',
            })
              .then(async (response) => {
                // response.uri is the URI of the new image that can now be displayed, uploaded...
                // response.path is the path of the new image
                // response.name is the name of the new image with the extension
                // response.size is the size of the new image
                const image64 = await read(image.uri, 'base64');
                this.setState({
                  imageUrl: response.uri,
                  imageName: response.name,
                  imageUrlBase64: image64,
                  loading: false,
                });
              })
              .catch((err) => {
                console.log('errImage222', err);
                this.setState({
                  loading: false,
                });
                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
              });
          }
        }
      }
    );
  };

  private takePicture2 = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        if (this.camera) {
          const image = await this.camera.capture();
          if (Platform.OS === 'android') {
            if (image.uri.startsWith('content://')) {
              const uriComponents = image.uri.split('/');
              const fileNameAndExtension = uriComponents[uriComponents.length - 1];
              const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
              await RNFS.copyFile(image.uri, `${destPath}`);
              this.imageBackView = `file://${destPath}`;
            }
            ImageResizer.createResizedImage(image.uri, width, width / 1.57, 'PNG', 1, 0, undefined, false, {
              onlyScaleDown: true,
              mode: 'cover',
            })
              .then((response) => {
                // response.uri is the URI of the new image that can now be displayed, uploaded...
                // response.path is the path of the new image
                // response.name is the name of the new image with the extension
                // response.size is the size of the new image
                console.log('responseImage', response);
                this.setState({
                  imageUrl2: response.uri,
                  imageName2: response.name,
                  loading: false,
                });
              })
              .catch((err) => {
                console.log('errImage222', err);
                this.setState({
                  loading: false,
                });
                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
              });
            //   });
            // }
          } else {
            this.imageBackView = image.uri;
            ImageResizer.createResizedImage(image.uri, width, width / 1.57, 'PNG', 1, 0, undefined, false, {
              onlyScaleDown: true,
              mode: 'cover',
            })
              .then((response) => {
                // response.uri is the URI of the new image that can now be displayed, uploaded...
                // response.path is the path of the new image
                // response.name is the name of the new image with the extension
                // response.size is the size of the new image
                console.log('responseImage', response);
                this.setState({
                  imageUrl2: response.uri,
                  imageName2: response.name,
                  loading: false,
                });
              })
              .catch((err) => {
                console.log('errImage222', err);
                this.setState({
                  loading: false,
                });
                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
              });
          }
        }
      }
    );
  };

  private quitCamera = () => {
    Navigation.pop('IdScanner');
  };

  private reTakePicture = () => {
    this.setState({
      imageUrl: '',
      imageName: '',
      imageUrlBase64: '',
    });
  };

  private reTakePicture2 = () => {
    this.setState({
      imageUrl2: '',
      imageName2: '',
      imageUrl2Base64: '',
    });
  };

  private onClickRetakeWarning = () => {
    this.setState({
      imageUrl: '',
      imageUrlBase64: '',
      imageUrl2: '',
      imageUrl2Base64: '',
      phase2: false,
      loading: false,
      lowScoreWarningModal: false,
    });
  };

  private onClickConfirmWarning = () => {
    goToAuth();
  };

  private onClickNextWarning = () => {
    this.setState(
      {
        imageUrl: '',
        imageUrlBase64: '',
        imageUrl2: '',
        imageUrl2Base64: '',
        phase2: false,
        loading: false,
        lowScoreWarningModal: false,
      },
      () => {
        goToFacePhase();
      }
    );
  };

  private continueToPhase2 = () => {
    this.setState({
      phase2: true,
    });
  };

  private continueSubmitImage = () => {
    this.setState({
      loading: true,
    });
    const params = {
      front: this.state.imageUrl,
      frontName: this.state.imageName,
      back: this.state.imageUrl2,
      backName: this.state.imageName2,
      ref: this.props.registerAccountForm!.draft_id,
    };
    this.props.sendIdImage(params);
  };

  private toggleFlashMode = () => {
    if (this.state.flashMode === EFlashMode.ON) {
      this.setState({
        flashMode: EFlashMode.OFF,
      });
    } else {
      this.setState({
        flashMode: EFlashMode.ON,
      });
    }
  };

  private goToIdSupport = () => {
    goToIdSupport({ isIdSupport: true });
  };

  render() {
    const { t } = this.props;
    let modalContent: ReactNode;

    if (this.state.lowScoreWarningModal === true) {
      if (global.lang === LANG.VI) {
        modalContent = (
          <UIText style={styles.modalContent}>
            Ảnh CMND/ Thẻ CCCD của Quý khách chưa đủ rõ ràng, sắc nét (
            <UIText style={styles.boldText}>dưới 90/100 điểm</UIText>). Quý khách nên chụp lại ảnh để tăng kết quả định
            danh.
          </UIText>
        );
      } else {
        modalContent = (
          <UIText style={styles.modalContent}>
            Your ID card is not taken clearly (<UIText style={styles.boldText}>scored under 90/100</UIText>). Retaking
            should be considered to improve the identification result.
          </UIText>
        );
      }
    } else {
      modalContent = <UIText />;
    }

    if (this.state.phase2 === true) {
      return this.state.imageUrl2.trim() !== '' ? (
        <SafeAreaView style={styles.containers}>
          <View style={styles.container}>
            <View style={styles.cameraTop}>
              {/* <View style={styles.cameraTop2}> */}
              <View style={styles.cameraTitle}>
                <UIText style={styles.cameraNoteText}>{t('BACK_ID')}</UIText>
              </View>
              {/* </View> */}
              {/* <View style={styles.containers}></View> */}
            </View>
            <Image style={styles.containers} source={{ uri: this.imageBackView }} />
            <View style={styles.cameraBottom}>
              {/* <View style={styles.containers}></View> */}
              {/* <View style={styles.cameraBottom2}> */}
              <View style={styles.optionImage}>
                <View style={styles.retakeButtonContainerContainer}>
                  <TouchableOpacity style={styles.retakeButtonContainer} onPress={this.reTakePicture2}>
                    <UIText style={styles.retakeButtonText}>{t('RE_TAKE')}</UIText>
                  </TouchableOpacity>
                </View>
                <View style={styles.retakeButtonContainerContainer}>
                  <TouchableOpacity style={styles.continueButtonContainer} onPress={this.continueSubmitImage}>
                    <UIText style={styles.retakeButtonText}>{t('CONTINUE')}</UIText>
                  </TouchableOpacity>
                </View>
              </View>
              {/* </View> */}
            </View>
            <View style={styles.retryArea}>
              <UIText style={styles.resendText2}>{`${t('NEED_SUPPORT')} `}</UIText>
              <TouchableOpacity onPress={this.goToIdSupport}>
                <UIText style={styles.resendText}>{t('SUPPORT')}</UIText>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.loading === true && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.containers}>
          <View style={styles.container}>
            <View style={styles.cameraTop}>
              {/* <View style={styles.cameraTop2}> */}
              <View style={styles.cameraFlash}>
                {this.state.flashMode === EFlashMode.ON ? (
                  <EntypoIcon name={'flash'} size={23} color={Colors.WHITE} onPress={this.toggleFlashMode} />
                ) : (
                  <MaterialIcons name={'flash-off'} size={23} color={Colors.WHITE} onPress={this.toggleFlashMode} />
                )}
              </View>
              <View style={styles.cameraTitle}>
                <UIText style={styles.cameraNoteText}>{t('BACK_ID')}</UIText>
              </View>
              <View style={styles.cameraQuit}>
                <EntypoIcon name={'cross'} size={23} color={Colors.WHITE} onPress={this.quitCamera} />
              </View>
              {/* </View> */}
              {/* <View style={styles.containers}></View> */}
            </View>
            {/* <RNCamera
                ref={(ref: RNCamera) => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={this.state.flashMode === EFlashMode.ON ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
              /> */}
            <Camera
              ref={(ref: Camera) => (this.camera = ref)}
              cameraType={CameraType.Back}
              style={styles.containers}
              flashMode={this.state.flashMode}
              focusMode={'on'}
              // outputPath={`file://${RNFS.TemporaryDirectoryPath}/back.jpg`}
              // ratioOverlay={'16:9'}
              // cameraOptions={{
              //   ratioOverlay: `16:9`,            // optional, ratio overlay on the camera and crop the image seamlessly
              // }}
              // showFrame={true}
            />
            <View style={styles.cameraBottom}>
              {/* <View style={styles.containers}></View> */}
              {/* <View style={styles.cameraBottom2}> */}
              <View style={styles.cameraNote}>
                <UIText style={styles.cameraNoteText}>{t('CAMERA_NOTE')}</UIText>
              </View>
              <View style={styles.capture}>
                <TouchableOpacity onPress={this.takePicture2} style={styles.captureInside} />
              </View>
              {/* </View> */}
            </View>
          </View>
          {this.state.loading === true && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </SafeAreaView>
      );
    } else {
      return this.state.imageUrl.trim() !== '' ? (
        <SafeAreaView style={styles.containers}>
          <View style={styles.container}>
            <View style={styles.cameraTop}>
              {/* <View style={styles.cameraTop2}> */}
              <View style={styles.cameraTitle}>
                <UIText style={styles.cameraNoteText}>{t('FRONT_ID')}</UIText>
              </View>
              {/* </View> */}
              {/* <View style={styles.containers}>
                </View> */}
            </View>
            <Image style={styles.containers} source={{ uri: this.imageFrontView }} />
            <View style={styles.cameraBottom}>
              {/* <View style={styles.containers}>
                </View> */}
              {/* <View style={styles.cameraBottom2}> */}
              <View style={styles.optionImage}>
                <View style={styles.retakeButtonContainerContainer}>
                  <TouchableOpacity style={styles.retakeButtonContainer} onPress={this.reTakePicture}>
                    <UIText style={styles.retakeButtonText}>{t('RE_TAKE')}</UIText>
                  </TouchableOpacity>
                </View>
                <View style={styles.retakeButtonContainerContainer}>
                  <TouchableOpacity style={styles.continueButtonContainer} onPress={this.continueToPhase2}>
                    <UIText style={styles.retakeButtonText}>{t('CONTINUE')}</UIText>
                  </TouchableOpacity>
                </View>
              </View>
              {/* </View> */}
            </View>
            <View style={styles.retryArea}>
              <UIText style={styles.resendText2}>{`${t('NEED_SUPPORT')} `}</UIText>
              <TouchableOpacity onPress={this.goToIdSupport}>
                <UIText style={styles.resendText}>{t('SUPPORT')}</UIText>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.containers}>
          <View style={styles.container}>
            <View style={styles.cameraTop}>
              {/* <View style={styles.cameraTop2}> */}
              <View style={styles.cameraFlash}>
                {this.state.flashMode === EFlashMode.ON ? (
                  <EntypoIcon name={'flash'} size={23} color={Colors.WHITE} onPress={this.toggleFlashMode} />
                ) : (
                  <MaterialIcons name={'flash-off'} size={23} color={Colors.WHITE} onPress={this.toggleFlashMode} />
                )}
              </View>
              <View style={styles.cameraTitle}>
                <UIText style={styles.cameraNoteText}>{t('FRONT_ID')}</UIText>
              </View>
              <View style={styles.cameraQuit}>
                <EntypoIcon name={'cross'} size={23} color={Colors.WHITE} onPress={this.quitCamera} />
              </View>
              {/* </View> */}
              {/* <View style={styles.containers}></View> */}
            </View>
            {/* <RNCamera
                ref={(ref: RNCamera) => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={this.state.flashMode === EFlashMode.ON ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
              /> */}
            <Camera
              ref={(ref: Camera) => (this.camera = ref)}
              cameraType={CameraType.Back}
              style={styles.containers}
              flashMode={this.state.flashMode}
              focusMode={'on'}
              // outputPath={`file://${RNFS.TemporaryDirectoryPath}/front.jpg`}
              // showFrame={true}
              // laserColor={'transparent'}
              // ratioOverlay={'16:9'}
              // cameraOptions={{
              //   ratioOverlay: `16:9`,            // optional, ratio overlay on the camera and crop the image seamlessly
              // }}
            />
            <View style={styles.cameraBottom}>
              {/* <View style={styles.containers}></View> */}
              {/* <View style={styles.cameraBottom2}> */}
              <View style={styles.cameraNote}>
                <UIText style={styles.cameraNoteText}>{t('CAMERA_NOTE')}</UIText>
              </View>
              <View style={styles.capture}>
                <TouchableOpacity onPress={this.takePicture} style={styles.captureInside} />
              </View>
              {/* </View> */}
            </View>
          </View>
          {this.state.loading === true && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          )}
          <Modal transparent={true} visible={this.state.lowScoreWarningModal} animationType="none">
            <View style={styles.OTPContainerContainer}>
              <View style={styles.OTPContainer}>
                <View style={styles.OTPBody}>
                  <View style={styles.iconContainer}>
                    <Svg width={54} height={56} fill="none" viewBox="0 0 54 56">
                      <Path
                        fill="#F6C04B"
                        d="M33.254 48.937v1.636a2.595 2.595 0 01-2.2 2.57l-.404 1.486A1.85 1.85 0 0128.864 56h-3.998a1.85 1.85 0 01-1.786-1.371l-.392-1.487a2.607 2.607 0 01-2.212-2.58v-1.637c0-.876.703-1.578 1.578-1.578h9.622a1.59 1.59 0 011.578 1.59zm7.41-22.055c0 3.722-1.476 7.098-3.872 9.576a12.651 12.651 0 00-3.388 6.867 2.28 2.28 0 01-2.258 1.924h-8.562c-1.117 0-2.085-.806-2.247-1.912-.403-2.57-1.59-5.013-3.41-6.89a13.736 13.736 0 01-3.849-9.415 13.755 13.755 0 0113.7-13.942c7.663-.058 13.885 6.141 13.885 13.792zm-12.238-8.354c0-.852-.691-1.555-1.555-1.555-5.485 0-9.956 4.46-9.956 9.955a1.556 1.556 0 003.111 0c0-3.779 3.077-6.844 6.845-6.844a1.55 1.55 0 001.555-1.556zm-1.555-9.967c.853 0 1.555-.691 1.555-1.555v-5.45a1.556 1.556 0 00-3.11 0v5.45c0 .864.702 1.555 1.555 1.555zM8.56 26.871c0-.853-.691-1.556-1.555-1.556h-5.45a1.556 1.556 0 000 3.111h5.45c.864 0 1.555-.691 1.555-1.555zm43.625-1.556h-5.45a1.556 1.556 0 000 3.111h5.45a1.556 1.556 0 000-3.11zM11.73 39.822l-3.86 3.86a1.55 1.55 0 001.095 2.65c.391 0 .795-.15 1.094-.449l3.86-3.86a1.55 1.55 0 000-2.2 1.536 1.536 0 00-2.189 0zM40.917 14.38c.392 0 .795-.15 1.094-.45l3.86-3.86a1.55 1.55 0 000-2.2 1.55 1.55 0 00-2.2 0l-3.86 3.86a1.55 1.55 0 001.106 2.65zm-29.187-.46a1.557 1.557 0 002.189-.001 1.55 1.55 0 000-2.2l-3.86-3.86a1.55 1.55 0 00-2.2 0 1.55 1.55 0 000 2.2l3.871 3.86zm30.281 25.902a1.55 1.55 0 00-2.2 0 1.55 1.55 0 000 2.201l3.86 3.86a1.553 1.553 0 002.19 0c.61-.61.61-1.59 0-2.2l-3.85-3.86z"
                      />
                    </Svg>
                  </View>
                  <View style={styles.note}>
                    {this.props.idImageInfo != null && this.props.idImageInfo.errorContent != null ? (
                      <UIText style={styles.modalContent}>{t('EXISTED_ID_NOTIFICATION')}</UIText>
                    ) : (
                      modalContent
                    )}
                  </View>
                  {this.props.idImageInfo != null && this.props.idImageInfo.errorContent != null ? (
                    <View style={styles.optionImage3}>
                      <View style={styles.retakeButtonContainerContainer}>
                        <TouchableOpacity style={styles.continueButtonContainer} onPress={this.onClickConfirmWarning}>
                          <UIText style={styles.retakeButtonText}>{t('CONFIRM_3')}</UIText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.optionImage3}>
                      <View style={styles.retakeButtonContainerContainer}>
                        <TouchableOpacity style={styles.retakeButtonContainer} onPress={this.onClickRetakeWarning}>
                          <UIText style={styles.retakeButtonText}>{t('RE_TAKE')}</UIText>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.retakeButtonContainerContainer}>
                        <TouchableOpacity style={styles.continueButtonContainer} onPress={this.onClickNextWarning}>
                          <UIText style={styles.retakeButtonText}>{t('CONTINUE')}</UIText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps = (state: IState) => ({
  registerAccountForm: state.registerAccountForm,
  getFaceActionSuccessTrigger: state.getFaceActionSuccessTrigger,
  SendIdImageFailedTrigger: state.SendIdImageFailedTrigger,
  idImageInfo: state.idImageInfo,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      sendIdImage,
    })(IdScanner)
  ),
  Fallback,
  handleError
);
