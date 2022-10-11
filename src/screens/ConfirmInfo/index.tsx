import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { Item } from 'react-native-picker-select';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError, isBlank } from 'utils/common';
import Fallback from 'components/Fallback';
import ScreenLoader from 'components/ScreenLoader';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import Picker from 'components/Picker';
import { IState } from 'redux-sagas/reducers';
import { IObject } from 'interfaces/common';
import config from 'config';
import { goToRegisterAccountService } from 'navigations';
import styles from './styles';
import UIText from 'components/UiText';

interface IConfirmInfoProps extends React.ClassAttributes<ConfirmInfo>, WithTranslation {
  idImageInfo: IObject | null;
  registerAccountFormRequestInfo: IObject;
}

interface IConfirmInfoState {
  noteValue: string;
  contactAddress: string;
  errorcontactAddress: boolean;
  errorcontactAddressContent: string;
  email: string;
  errorEmail: boolean;
  errorEmailContent: string;
  fullNameErroring: boolean;
  nationalityErroring: boolean;
  genderErroring: boolean;
  dOBErroring: boolean;
  idErroring: boolean;
  issueDateErroring: boolean;
  issuePlaceErroring: boolean;
  addressErroring: boolean;
}

class ConfirmInfo extends React.Component<IConfirmInfoProps, IConfirmInfoState> {
  private gender: string;
  private listGenders: Item[] = [
    {
      value: 'MALE',
      label: this.props.t('Male'),
    },
    {
      value: 'FEMALE',
      label: this.props.t('Female'),
    },
  ];

  constructor(props: IConfirmInfoProps) {
    super(props);
    this.gender = this.props.registerAccountFormRequestInfo.sex as string;
    this.state = {
      noteValue: '',
      contactAddress: ((props.idImageInfo as IObject).userData as IObject).noiTru as string,
      errorcontactAddress: false,
      errorcontactAddressContent: '',
      email: this.props.registerAccountFormRequestInfo.email as string,
      errorEmail: false,
      errorEmailContent: '',
      fullNameErroring: false,
      nationalityErroring: false,
      genderErroring: false,
      dOBErroring: false,
      idErroring: false,
      issueDateErroring: false,
      issuePlaceErroring: false,
      addressErroring: false,
    };
  }

  private onPressErrorText = (label: string, value: string) => {
    switch (label) {
      case 'Full name':
        if (this.state.fullNameErroring === false) {
          this.setState({
            fullNameErroring: !this.state.fullNameErroring,
          });
        } else {
          this.setState({
            fullNameErroring: !this.state.fullNameErroring,
          });
          return;
        }
        break;
      case 'Nationality':
        if (this.state.nationalityErroring === false) {
          this.setState({
            nationalityErroring: !this.state.nationalityErroring,
          });
        } else {
          this.setState({
            nationalityErroring: !this.state.nationalityErroring,
          });
          return;
        }
        break;
      case 'Gender':
        if (this.state.genderErroring === false) {
          this.setState({
            genderErroring: !this.state.genderErroring,
          });
        } else {
          this.setState({
            genderErroring: !this.state.genderErroring,
          });
          return;
        }
        break;
      case 'DOB':
        if (this.state.dOBErroring === false) {
          this.setState({
            dOBErroring: !this.state.dOBErroring,
          });
        } else {
          this.setState({
            dOBErroring: !this.state.dOBErroring,
          });
          return;
        }
        break;
      case 'ID':
        if (this.state.idErroring === false) {
          this.setState({
            idErroring: !this.state.idErroring,
          });
        } else {
          this.setState({
            idErroring: !this.state.idErroring,
          });
          return;
        }
        break;
      case 'ISSUE_DATE':
        if (this.state.issueDateErroring === false) {
          this.setState({
            issueDateErroring: !this.state.issueDateErroring,
          });
        } else {
          this.setState({
            issueDateErroring: !this.state.issueDateErroring,
          });
          return;
        }
        break;
      case 'ISSUE_PLACE':
        if (this.state.issuePlaceErroring === false) {
          this.setState({
            issuePlaceErroring: !this.state.issuePlaceErroring,
          });
        } else {
          this.setState({
            issuePlaceErroring: !this.state.issuePlaceErroring,
          });
          return;
        }
        break;
      case 'Address_2':
        if (this.state.addressErroring === false) {
          this.setState({
            addressErroring: !this.state.addressErroring,
          });
        } else {
          this.setState({
            addressErroring: !this.state.addressErroring,
          });
          return;
        }
        break;
      default:
        break;
    }
    if (this.state.noteValue.trim() === '') {
      this.setState({
        noteValue: `${this.props.t(label)}: `,
      });
    } else {
      this.setState({
        noteValue: `${this.state.noteValue},\n${this.props.t(label)}: `,
      });
    }
  };

  private onChangeNote = (data: string) => {
    this.setState({
      noteValue: data,
    });
  };

  private validate() {
    if (this.state.contactAddress.length < 15) {
      this.setState({
        errorcontactAddress: true,
        errorcontactAddressContent: 'Contact address must be at least 15 characters',
      });
      return false;
    } else {
      this.setState({
        errorcontactAddress: false,
        errorcontactAddressContent: '',
      });
    }
    if (!isBlank(this.state.email)) {
      if (((config.regex as IObject).email as RegExp).test(this.state.email)) {
        this.setState({
          errorEmail: false,
          errorEmailContent: '',
        });
      } else {
        this.setState({
          errorEmail: true,
          errorEmailContent: this.props.t('Email is not validate'),
        });
        return false;
      }
    } else {
      this.setState({
        errorEmail: true,
        errorEmailContent: 'Email can not be blank',
      });
      return false;
    }
    return true;
  }

  private handleNext = () => {
    if (this.validate()) {
      const params = {
        address_permermanent: this.state.addressErroring,
        country: this.state.nationalityErroring,
        dob: this.state.dOBErroring,
        gender: this.state.genderErroring,
        id_issue_date: this.state.issueDateErroring,
        id_issue_place: this.state.issuePlaceErroring,
        id_number: this.state.idErroring,
        name: this.state.fullNameErroring,
        notes: this.state.noteValue,
        address: this.state.contactAddress,
        email: this.state.email,
        genderValue: this.gender,
      };
      goToRegisterAccountService(params);
    }
  };

  private onChangeContactAddress = (data: string) => {
    this.setState({
      contactAddress: data,
    });
  };

  private onChangeGender = (index: number, value: string, label: string) => {
    this.gender = value;
  };

  private onChangeEmail = (data: string) => {
    this.setState({
      email: data,
    });
  };

  render() {
    const { t } = this.props;
    const { userData } = this.props.idImageInfo!;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.titleContainer}>
            <UIText style={styles.mainTextTitle}>{t('Confirm Information')}</UIText>
            <UIText>{t('Please check information below')}</UIText>
          </View>
          <View style={styles.formSection}>
            <View style={styles.formItem}>
              <UIText style={styles.mainTextTitle}>{t('Personal Information')}</UIText>
              <TextBox
                label="Full name"
                type={TEXTBOX_TYPE.TEXT}
                value={(userData as IObject).hoVaTen as string}
                autoCorrect={false}
                disabled={true}
                onPressErrorText={this.onPressErrorText}
                errorTicking={this.state.fullNameErroring}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Nationality"
                type={TEXTBOX_TYPE.TEXT}
                value={
                  ((userData as IObject).quocTich as string).trim() === ''
                    ? 'Việt Nam'
                    : ((userData as IObject).quocTich as string)
                }
                autoCorrect={false}
                disabled={true}
                onPressErrorText={
                  ((userData as IObject).quocTich as string).trim() === '' ? undefined : this.onPressErrorText
                }
                errorTicking={
                  ((userData as IObject).quocTich as string).trim() === '' ? undefined : this.state.nationalityErroring
                }
              />
            </View>
            <View style={styles.formItem}>
              {((userData as IObject).gioiTinh as string).trim() === '' ? (
                <Picker
                  placeholder={{}}
                  list={this.listGenders}
                  selectedValue={this.gender}
                  onChange={this.onChangeGender}
                  allowPlaceHolderSelect={false}
                />
              ) : (
                <TextBox
                  label="Gender"
                  type={TEXTBOX_TYPE.TEXT}
                  value={(userData as IObject).gioiTinh as string}
                  autoCorrect={false}
                  disabled={true}
                  onPressErrorText={this.onPressErrorText}
                  errorTicking={this.state.genderErroring}
                />
              )}
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="DOB"
                type={TEXTBOX_TYPE.TEXT}
                value={(userData as IObject).namSinh as string}
                autoCorrect={false}
                disabled={true}
                onPressErrorText={this.onPressErrorText}
                errorTicking={this.state.dOBErroring}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="ID"
                type={TEXTBOX_TYPE.TEXT}
                value={(userData as IObject).soCmt as string}
                autoCorrect={false}
                disabled={true}
                onPressErrorText={this.onPressErrorText}
                errorTicking={this.state.idErroring}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="ISSUE_DATE"
                type={TEXTBOX_TYPE.TEXT}
                value={(userData as IObject).ngayCap as string}
                autoCorrect={false}
                disabled={true}
                onPressErrorText={this.onPressErrorText}
                errorTicking={this.state.issueDateErroring}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="ISSUE_PLACE"
                type={TEXTBOX_TYPE.TEXT}
                value={(userData as IObject).noiCap as string}
                autoCorrect={false}
                disabled={true}
                onPressErrorText={this.onPressErrorText}
                errorTicking={this.state.issuePlaceErroring}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Address_2"
                type={TEXTBOX_TYPE.TEXT}
                value={(userData as IObject).noiTru as string}
                autoCorrect={false}
                disabled={true}
                onPressErrorText={this.onPressErrorText}
                errorTicking={this.state.addressErroring}
              />
            </View>
            {(this.state.fullNameErroring === true ||
              this.state.nationalityErroring === true ||
              this.state.genderErroring === true ||
              this.state.dOBErroring === true ||
              this.state.idErroring === true ||
              this.state.issueDateErroring === true ||
              this.state.issuePlaceErroring === true ||
              this.state.addressErroring === true) && (
              <View style={styles.formItem2}>
                <UIText style={styles.mainTextTitle}>{t('Note Personal Information')}</UIText>
                <TextBox
                  label="Please Note"
                  type={TEXTBOX_TYPE.TEXT}
                  value={this.state.noteValue}
                  onChange={this.onChangeNote}
                  multiline={true}
                  numberOfLines={3}
                  textInputStyle={styles.textInputStyle}
                />
              </View>
            )}
            <View style={styles.formItem}>
              <UIText style={styles.mainTextTitle}>{t('Contact')}</UIText>
              <TextBox
                label="Contact Address"
                type={TEXTBOX_TYPE.TEXT}
                value={this.state.contactAddress}
                error={this.state.errorcontactAddress}
                errorContent={this.state.errorcontactAddressContent}
                onChange={this.onChangeContactAddress}
                multiline={true}
                numberOfLines={3}
                textInputStyle={styles.textInputStyle}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Phone Number"
                type={TEXTBOX_TYPE.TEXT}
                value={this.props.registerAccountFormRequestInfo.phone as string}
                disabled={true}
              />
            </View>
            <View style={styles.formItem}>
              <TextBox
                label="Email"
                type={TEXTBOX_TYPE.TEXT}
                value={this.state.email}
                error={this.state.errorEmail}
                errorContent={this.state.errorEmailContent}
                onChange={this.onChangeEmail}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this.handleNext} title={'NEXT_2'} buttonStyle={styles.buttonUnderstood} />
          </View>
        </KeyboardAwareScrollView>
        <ScreenLoader />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  idImageInfo: state.idImageInfo,
  registerAccountFormRequestInfo: state.registerAccountFormRequestInfo,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps, null)(ConfirmInfo)), Fallback, handleError);
