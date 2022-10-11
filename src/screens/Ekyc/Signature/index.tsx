import React from 'react';
import { View, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Button from 'components/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CheckBox from 'components/CheckBox';
import { goToEkycOTP } from 'navigations';
import { IEkycParams } from 'interfaces/common';
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';
import { getPresignedUrl, uploadImage } from '../PersonalInformation/api';
import { changeEkycParams, showNoti, showLoading, hideLoading } from '../action';
import { Navigation } from 'react-native-navigation';
import { NOTIFICATION_TYPE } from 'global';
import UIText from 'components/UiText';

interface IEkycUploadSignatureProps extends React.ClassAttributes<EkycUploadSignature>, WithTranslation {
  params: IEkycParams;
  changeEkycParams: (params: IEkycParams) => void;
  showNoti: (title: string, content: string, type: NOTIFICATION_TYPE) => void;
  showLoading: typeof showLoading;
  hideLoading: typeof hideLoading;
}

interface IEkycUploadSignatureState {
  confirmSignature: boolean;
  imgUri: { uri: string };
  showErrorMessage: boolean;
}

class EkycUploadSignature extends React.Component<IEkycUploadSignatureProps, IEkycUploadSignatureState> {
  private signatureUri: string = '';
  constructor(props: IEkycUploadSignatureProps) {
    super(props);
    this.state = {
      confirmSignature: true,
      imgUri: { uri: '' },
      showErrorMessage: false,
    };
  }

  render() {
    const { t } = this.props;
    return (
      <UserInactivity>
        <ScrollView style={styles.container}>
          <UIText style={styles.heading}>{t('Signature')}</UIText>
          <UIText>{t('Please, upload your signature to experience the services of KIS')}</UIText>
          <ImageBackground source={this.state.imgUri} style={styles.image}>
            <TouchableOpacity style={styles.uploadContainer} onPress={this.selectPhotoTapped}>
              <View style={styles.icon}>
                <FontAwesome5 name="plus-circle" size={50} color={'#2569B0'} />
              </View>
              <UIText>{t('Upload your signature')}</UIText>
              <UIText style={styles.note}>{t('(Signature and fullname)')}</UIText>
            </TouchableOpacity>
          </ImageBackground>
          <CheckBox
            label={t('I confirmed this is my signature')}
            checked={this.state.confirmSignature}
            onChange={this.onChangeConfirmSignature}
          />
          {this.state.showErrorMessage && <UIText style={styles.warning}>{t('Upload Failed')}</UIText>}
          <View style={styles.buttonContainer}>
            <Button title={t('CONTINUE')} onPress={this.onPressButton} />
            <TouchableOpacity style={styles.returnButton} onPress={this.onPressReturn}>
              <UIText style={styles.returnButtonText}>{t('Return')}</UIText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </UserInactivity>
    );
  }

  private onChangeConfirmSignature = (checked: boolean) => {
    this.setState({ confirmSignature: checked });
  };

  private onPressReturn = () => {
    Navigation.pop('EkycUploadSignature');
  };

  private onPressButton = () => {
    const params = { ...this.props.params, signatureImageUrl: this.signatureUri };
    if (this.state.confirmSignature && this.state.imgUri.uri !== '' && this.signatureUri !== '') {
      this.props.changeEkycParams(params);
      goToEkycOTP('EkycUploadSignature', params);
    } else {
      this.props.showNoti(this.props.t('Upload Image'), this.props.t('UPLOAD_IMAGE'), NOTIFICATION_TYPE.ERROR);
    }
  };

  private selectPhotoTapped = () => {
    const options: ImagePickerOptions = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        this.setState({ showErrorMessage: true });
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ showErrorMessage: true });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ imgUri: source });
        getPresignedUrl(`ekyc_signature_image_${this.props.params.identifierId}.jpg`)
          .then((url: string) => {
            uploadImage(url, response.uri)
              .then(() => {
                this.signatureUri = url.split('?')[0];
              })
              .catch((err) => {
                console.log(err);
                this.props.showNoti('Upload Image', 'FAILED', NOTIFICATION_TYPE.ERROR);
              });
          })
          .catch((err) => {
            console.log(err);
            this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
          });
      }
    });
  };
}

const mapStateToProps = () => ({});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, { changeEkycParams, showNoti, showLoading, hideLoading })(EkycUploadSignature)
  ),
  Fallback,
  handleError
);
