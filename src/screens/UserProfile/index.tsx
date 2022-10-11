import React from 'react';
import { View, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { goToBiz } from 'navigations';
import { maskingEmail, maskingNumber, handleError } from 'utils/common';
import { formatDateToDisplay } from 'utils/datetime';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import Button from 'components/Button';
import ImagePicker from 'components/ImagePicker';
import { IState } from 'redux-sagas/reducers';
import { IAccountInfo, IObject } from 'interfaces/common';
import { IUserInfo } from 'interfaces/common';
import { updateProfile, getSignedData, uploadImage } from './actions';
import styles from './styles';
import config from 'config';
import UIText from 'components/UiText';

interface ClientInfo {
  title: string;
  value?: string;
}

interface IItemContentType {
  customerName?: string;
  dateOfBirth?: string;
  identifierNumber?: string;
  identifierIssueDate?: string;
  identifierIssuePlace?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  listClientInfo?: ClientInfo[];
  t: TFunction;
}

interface IUserProfileProps extends React.ClassAttributes<UserProfile>, WithTranslation {
  userInfo: IUserInfo | null;
  accountInfo: IAccountInfo | null;
  signedData: IObject | null;
  uploadImageInfo: string | null;

  uploadImage(payload: IObject): void;

  updateProfile(payload: IObject): void;

  getSignedData(payload: IObject): void;
}

class UserProfile extends React.Component<IUserProfileProps> {
  private image?: IObject;

  constructor(props: IUserProfileProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: IUserProfileProps) {
    if (this.props.signedData !== nextProps.signedData && nextProps.signedData) {
      this.props.uploadImage({
        image: this.image as Object,
        signedData: nextProps.signedData,
      });
    }

    if (this.props.uploadImageInfo !== nextProps.uploadImageInfo && nextProps.uploadImageInfo) {
      const input = {
        avatar: nextProps.uploadImageInfo as Object,
      };
      this.props.updateProfile(input);
    }

    if (this.props.userInfo !== nextProps.userInfo) {
      return true;
    }

    return false;
  }

  private goToChangePassword = () => {
    goToBiz('ChangePassword', {}, 'UserProfile', 'Change Password');
  };

  private onChangeImage = (value: IObject) => {
    this.image = value;

    this.props.getSignedData({ key: `avatar/${this.props.userInfo!.username}_avatar` });
  };

  private renderItem = (listClientInfo: ClientInfo[]) => {
    const { t } = this.props;

    return listClientInfo.map((item: ClientInfo) => {
      if (item.value) {
        return (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t(item.title)}
            </UIText>
            <UIText allowFontScaling={false} style={[styles.contentText, styles.textBold]}>
              {item.value}
            </UIText>
          </View>
        );
      }

      return null;
    });
  };

  private renderContentProfileInfo = ({
    customerName,
    dateOfBirth,
    identifierNumber,
    identifierIssueDate,
    identifierIssuePlace,
    address,
    email,
    phoneNumber,
    listClientInfo,
    t,
  }: IItemContentType) => (
    <ScrollView>
      <View style={styles.accountInfo}>
        {listClientInfo && this.renderItem(listClientInfo)}
        {!!customerName && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('Display Name')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {customerName}
            </UIText>
          </View>
        )}

        {!!dateOfBirth && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('Date of Birth')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {formatDateToDisplay(dateOfBirth as string)}
            </UIText>
          </View>
        )}

        {!!identifierNumber && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('ID/Passport No')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {maskingNumber(identifierNumber)}
            </UIText>
          </View>
        )}

        {!!identifierIssueDate && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('Issue Date')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {formatDateToDisplay(identifierIssueDate as string)}
            </UIText>
          </View>
        )}

        {!!identifierIssuePlace && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('Issued By')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {identifierIssuePlace}
            </UIText>
          </View>
        )}

        {!!address && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('Address')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {address}
            </UIText>
          </View>
        )}

        {!!email && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('Email')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {maskingEmail(email)}
            </UIText>
          </View>
        )}

        {!!phoneNumber && (
          <View style={styles.rowContent}>
            <UIText allowFontScaling={false} style={styles.label}>
              {t('Phone Number')}
            </UIText>
            <UIText allowFontScaling={false} style={styles.contentText}>
              {maskingNumber(phoneNumber)}
            </UIText>
          </View>
        )}
      </View>
    </ScrollView>
  );

  render() {
    const { t, accountInfo, userInfo } = this.props;
    const isNewCoreKis = config.usingNewKisCore;
    const authorizedPerson = accountInfo?.authorizedPerson;
    const customerProfile = accountInfo?.customerProfile;

    return (
      <UserInactivity>
        <View style={styles.container}>
          {!isNewCoreKis && (
            <View style={styles.imageContainer}>
              {userInfo && <ImagePicker avatarSource={userInfo.avatar} onChangeImage={this.onChangeImage} />}
            </View>
          )}
          {isNewCoreKis
            ? this.renderContentProfileInfo({
                t,
                listClientInfo: [
                  { title: 'Account No', value: customerProfile?.accountNo },
                  { title: 'Customer ID', value: customerProfile?.customerID },
                  { title: 'Email', value: customerProfile?.email },
                  { title: 'Address', value: customerProfile?.address },
                  { title: 'Username', value: customerProfile?.userName },
                  { title: 'Telephone', value: customerProfile?.telephone },
                  { title: 'Mobile Phone', value: customerProfile?.mobilePhone },
                  { title: "Authorized Person's Name", value: authorizedPerson?.authorizedPersonsName },
                  { title: "Authorized Person's ID", value: authorizedPerson?.authorizedPersonsID },
                  { title: "Authorized Person's Email", value: authorizedPerson?.email },
                ],
              })
            : this.renderContentProfileInfo({
                customerName: accountInfo?.customerName,
                dateOfBirth: accountInfo?.dateOfBirth,
                identifierIssueDate: accountInfo?.identifierIssueDate,
                identifierIssuePlace: accountInfo?.identifierIssuePlace,
                identifierNumber: accountInfo?.identifierNumber,
                email: accountInfo?.email,
                phoneNumber: accountInfo?.phoneNumber,
                address: accountInfo?.address,
                t,
              })}
          {global.viewMode !== true && (
            <View style={styles.buttonSection}>
              <Button
                buttonStyle={styles.button}
                textStyle={styles.buttonText}
                onPress={this.goToChangePassword}
                title={t('Change Password')}
              />
            </View>
          )}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  userInfo: state.userInfo,
  accountInfo: state.accountInfo,
  signedData: state.awsSignedData,
  uploadImageInfo: state.awsUploadImageInfo,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      updateProfile,
      getSignedData,
      uploadImage,
    })(UserProfile)
  ),
  Fallback,
  handleError
);
