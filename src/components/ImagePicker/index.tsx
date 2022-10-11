import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withTranslation, WithTranslation } from 'react-i18next';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IObject } from 'interfaces/common';
import styles from './styles';
import UIText from 'components/UiText';

interface IImagePickerComponentProps extends React.ClassAttributes<ImagePickerComponent>, WithTranslation {
  avatarSource?: string;

  onChangeImage(data: IObject): void;
}

class ImagePickerComponent extends React.Component<IImagePickerComponentProps> {
  constructor(props: IImagePickerComponentProps) {
    super(props);
  }

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
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: response.uri,
        });

        this.props.onChangeImage({
          avatarSource: response.uri,
          data: response.data,
          type: response.type as string,
        });
      }
    });
  };

  render() {
    const { t } = this.props;
    return (
      <TouchableOpacity onPress={this.selectPhotoTapped}>
        <View style={[styles.avatar, styles.avatarContainer]}>
          {this.props.avatarSource === '' ? (
            <View style={styles.image}>
              <IoniconsIcon style={styles.icon} name="md-person" />
              <UIText allowFontScaling={false} style={styles.label}>
                {t('Upload a photo')}
              </UIText>
            </View>
          ) : (
            <View style={styles.image}>
              {this.props.avatarSource && (
                <FastImage style={styles.avatar} source={{ uri: `${this.props.avatarSource}?${new Date()}` }} />
              )}
            </View>
          )}
          <Image style={styles.imageSmall} source={require('../../../assets/images/imgCamera.png')} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default withErrorBoundary(withTranslation()(ImagePickerComponent), Fallback, handleError);
