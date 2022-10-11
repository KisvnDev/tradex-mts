import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import Button from 'components/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import CheckBox from 'components/CheckBox';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import styles from './styles';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { goToEkycServiceInformation } from 'navigations';
import { IAndroidEkycResult, IEkycParams, IObject, IPersonalInfoType } from 'interfaces/common';
import { getDocumentType } from './utility';
import EkycDocumentResult from './DocumentResult';
import { formatDateToString, formatStringToDate } from 'utils/datetime';
import { changeEkycParams, showNoti, showLoading, hideLoading } from '../action';
import { IState } from 'redux-sagas/reducers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { addressData, IEkycCityData } from './data';
import EkycPicker from '../EkycPicker';
import { branchEN, branchVN } from './data';
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';
import { getPresignedUrl, uploadImage } from './api';
import { NOTIFICATION_TYPE } from 'global';
import config from 'config';
import UIText from 'components/UiText';
import { Navigation } from 'react-native-navigation';

const genderCheckbox = [
  { title: 'Female', value: 'Nữ' },
  { title: 'Male', value: 'Nam' },
  { title: 'Others', value: 'others' },
];

const genderCheckboxNew = [
  { title: 'Female', value: 'F' },
  { title: 'Male', value: 'M' },
];

const nationPolicy = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
const CMT = 'CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM';
const emailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const phoneValidator = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const accountNameRegex = /^[a-zA-Z ]*$/;
export const bankAccountRegex = /^[a-zA-Z0-9]{1,32}$/;
export const referrerIdNameRegex = /^[a-zA-Z0-9.]{1,16}$/;
export const accountNameRegexCheck = (str: string) => {
  return accountNameRegex.test(
    str
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
  );
};

interface IEkycPersonalInformationProps extends React.ClassAttributes<EkycPersonalInformation>, WithTranslation {
  result: IAndroidEkycResult;
  ekycParams: IState['ekycParams'];
  changeEkycParams: (params: IEkycParams) => void;
  showNoti: (title: string, content: string, type: NOTIFICATION_TYPE) => void;
  showLoading: typeof showLoading;
  hideLoading: typeof hideLoading;
}

interface IEkycPersonalInformationState {
  gender: string;
  occupation: string;
  permanentCity: string;
  permanentDistrict: string;
  permanentAddress: string;
  contactCity: string;
  contactDistrict: string;
  contactAddress: string;
  email: string;
  mobilePhone: string;
  idName: string;
  branch: string;
  isRequired: boolean;
  isCheckDocumentDone: boolean;
  type: IPersonalInfoType;
  emailErr: boolean;
  phoneErr: boolean;
  idNameErr: boolean;
  cityData: Item[];
  districtData: Item[];
  branchData: Item[];
  showErrorMessage: boolean;
  isShowForeigner: boolean;
  uploadingFailed: boolean;
}
class EkycPersonalInformation extends React.Component<IEkycPersonalInformationProps, IEkycPersonalInformationState> {
  private params: IEkycParams = {};
  private frontImageUrl: string = '';
  private backImageUrl: string = '';
  private portraitImageUrl: string = '';
  private tradingCodeImageUrl: string = '';
  private imageUploadResult: string[] = [];
  constructor(props: IEkycPersonalInformationProps) {
    super(props);
    let documentType: IPersonalInfoType = 'CC';
    let gender = '';
    if (Platform.OS === 'android') {
      if (this.props.result?.object) {
        documentType = getDocumentType(this.props.result.object.card_type);
        gender = this.props.result.object.gender;
      }
    }
    if (Platform.OS === 'ios') {
      const sdkData = (JSON.parse(this.props.result.info as string) as IAndroidEkycResult).object;
      documentType = getDocumentType(sdkData?.card_type as string);
      gender = sdkData?.gender as string;
    }

    this.state = {
      gender: gender,
      occupation: this.props.ekycParams?.occupation || '',
      permanentCity: this.props.ekycParams?.permanentProvince || '',
      permanentAddress: this.props.ekycParams?.permanentAddress || '',
      permanentDistrict: this.props.ekycParams?.permanentDistrict || '',
      contactCity: this.props.ekycParams?.contactProvince || '',
      contactDistrict: this.props.ekycParams?.contactDistrict || '',
      contactAddress: this.props.ekycParams?.contactAddress || '',
      email: this.props.ekycParams?.email || '',
      mobilePhone: this.props.ekycParams?.phoneNo || '',
      idName: this.props.ekycParams?.referrerIdName || '',
      branch: this.props.ekycParams?.referrerBranch || '',
      isRequired: false,
      emailErr: false,
      phoneErr: false,
      idNameErr: false,
      type: documentType,
      isCheckDocumentDone: false,
      cityData: addressData.map((e) => ({ label: e.city, value: e })),
      districtData: [],
      branchData:
        global.lang === 'en'
          ? branchEN.map((e) => ({ label: e, value: {} }))
          : branchVN.map((e) => ({ label: e, value: {} })),
      showErrorMessage: false,
      isShowForeigner: true,
      uploadingFailed: false,
    };
  }

  componentDidMount() {
    console.log('Personal Information', this.props.result);
  }

  render() {
    const { t } = this.props;
    let isVietnamese = this.props.result.object
      ? this.props.result.object.nation_policy === nationPolicy || this.props.result.object.nation_policy === CMT
      : true;

    const foreignCustomer = (
      <>
        <View style={styles.container}>
          <UIText style={styles.heading}>{t('You are a foreign investor:')}</UIText>
          <UIText>
            {t('If you have trading code, please click OK buttons to take a photo/upload image your trading code')}
          </UIText>
        </View>
        {this.state.showErrorMessage && <UIText style={styles.err}>{t('Image error')}</UIText>}
        <View style={styles.buttonContainer}>
          <Button title={t('OK')} onPress={this.selectPhotoTapped} />
        </View>
      </>
    );

    const personalInfomation = (
      <>
        <View style={styles.container}>
          <UIText style={styles.heading}>{t('Personal Information')}</UIText>
          <View>
            <UIText style={styles.title}>
              {t('Gender ')}{' '}
              {config.usingNewKisCore ? (
                <UIText style={styles.err}>* {this.state.isRequired ? 'Gender is required' : ''}</UIText>
              ) : (
                ''
              )}
            </UIText>
            <View style={styles.checkbox}>
              {(config.usingNewKisCore ? genderCheckboxNew : genderCheckbox).map((gender) => (
                <View style={styles.checkboxItem} key={gender.value}>
                  <CheckBox
                    label={t(gender.title)}
                    checked={this.state.gender === gender.value}
                    onChange={() => {
                      this.onChangeGender(gender.value);
                    }}
                  />
                </View>
              ))}
            </View>
          </View>

          <TextBox
            label={t('Your occupation')}
            type={TEXTBOX_TYPE.TEXT}
            keyboardType="default"
            value={this.state.occupation}
            onChange={this.onChangeOccupation}
            autoCorrect={false}
          />
          <View>
            <UIText style={styles.title}>{t('Permanent Address')}</UIText>
            <View style={styles.textInputRow}>
              <View style={styles.textInput1}>
                <TextBox
                  noEditable={true}
                  label={t('Province/City')}
                  type={TEXTBOX_TYPE.TEXT}
                  keyboardType="default"
                  value={this.state.permanentCity}
                  autoCorrect={false}
                />
              </View>
              <View style={styles.textInput2}>
                <TextBox
                  noEditable={true}
                  label={t('District')}
                  type={TEXTBOX_TYPE.TEXT}
                  keyboardType="default"
                  value={this.state.permanentDistrict}
                  autoCorrect={false}
                />
              </View>
            </View>
            <TextBox
              noEditable={true}
              label={t('Address')}
              type={TEXTBOX_TYPE.TEXT}
              keyboardType="default"
              value={this.state.permanentAddress}
              autoCorrect={false}
            />
          </View>

          <View>
            <UIText style={styles.title}>{t('Contact Address')}</UIText>
            <View style={styles.textInputRow}>
              <View style={styles.textInput1}>
                <EkycPicker
                  label={t('Province/City')}
                  data={this.state.cityData}
                  onSelect={this.onChangeContactCity}
                  required={this.state.isRequired}
                  emphasize={true}
                />
              </View>
              <View style={styles.textInput2}>
                <EkycPicker
                  label={t('District')}
                  data={this.state.districtData}
                  onSelect={this.onChangeContactDistrict}
                  required={this.state.isRequired}
                  emphasize={true}
                />
              </View>
            </View>
            <TextBox
              label={t('Address')}
              type={TEXTBOX_TYPE.TEXT}
              keyboardType="default"
              value={this.state.contactAddress}
              onChange={this.onChangeContactAddress}
              autoCorrect={false}
              required={this.state.isRequired}
              emphasize={true}
            />
          </View>
          <TextBox
            label={t('Email')}
            type={TEXTBOX_TYPE.TEXT}
            keyboardType="default"
            value={this.state.email}
            onChange={this.onChangeEmail}
            autoCorrect={false}
            emphasize={true}
            required={this.state.isRequired}
            error={this.state.emailErr}
          />
          <TextBox
            label={t('Mobile Phone')}
            type={TEXTBOX_TYPE.TEXT}
            keyboardType="default"
            value={this.state.mobilePhone}
            onChange={this.onChangeMobilePhone}
            autoCorrect={false}
            emphasize={true}
            required={this.state.isRequired}
            error={this.state.phoneErr}
          />
          <View>
            <UIText style={styles.title}>{t('Referrer Information')}</UIText>
            <View style={styles.textInputRow}>
              <View style={styles.textInput1}>
                <TextBox
                  label={t('ID Name')}
                  type={TEXTBOX_TYPE.TEXT}
                  keyboardType="default"
                  value={this.state.idName}
                  onChange={this.onChangeIdName}
                  autoCorrect={false}
                  onBlur={this.onBlurIdName}
                  error={this.state.idNameErr}
                />
              </View>
              <View style={styles.textInput2}>
                <EkycPicker
                  required={this.state.isRequired}
                  label={t('Branch')}
                  data={this.state.branchData}
                  onSelect={this.onChangeBranch}
                  emphasize={true}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title={t('CONFIRM')} onPress={this.onPressContinue} />
        </View>
      </>
    );

    const data =
      Platform.OS === 'ios'
        ? (JSON.parse(this.props.result.info as string) as IAndroidEkycResult).object
        : this.props.result.object;
    const faceResult =
      Platform.OS === 'ios'
        ? (JSON.parse(this.props.result.compare as string) as IAndroidEkycResult).object
        : JSON.parse(this.props.result.faceResult as string).object;
    return (
      <UserInactivity>
        <KeyboardAwareScrollView>
          <ScrollView>
            {data && !this.state.isCheckDocumentDone ? (
              <EkycDocumentResult
                documentResult={data}
                onCheckDocument={this.onCheckDocument}
                faceResult={faceResult}
              />
            ) : isVietnamese ? (
              personalInfomation
            ) : this.state.isShowForeigner ? (
              foreignCustomer
            ) : (
              personalInfomation
            )}
          </ScrollView>
        </KeyboardAwareScrollView>
      </UserInactivity>
    );
  }

  private onBlurIdName = () => {
    if (this.state.idName.length > 0) {
      if (referrerIdNameRegex.test(this.state.idName.trim())) {
        this.setState({
          idName: this.state.idName.trim().toUpperCase(),
          idNameErr: false,
        });
      } else {
        this.setState({ idNameErr: true, idName: this.state.idName.trim().toUpperCase() });
      }
    }
  };

  private onCheckDocument = (result: IObject, isReturn?: boolean) => {
    console.log('onCheckDocument', isReturn, Object.keys(this.props));
    if (isReturn) {
      Navigation.pop('EkycPersonalInformation');
      // goToEkyc('EkycPersonalInformation');
      return;
    }
    this.props.showLoading();

    if (Platform.OS === 'android') {
      // Upload Front Image
      getPresignedUrl(`ekyc_front_image_${this.props.result.object?.id}.jpg`)
        .then((url: string) => {
          uploadImage(url, 'file://' + this.props.result.imgFront)
            .then(() => {
              this.imageUploadResult.push('success');
              if (this.imageUploadResult.length === 3) {
                this.props.hideLoading();
                this.setState({
                  isCheckDocumentDone: true,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.props.hideLoading();
              this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
            });
          this.frontImageUrl = url.split('?')[0];
        })
        .catch(() => {
          this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
          this.props.hideLoading();
        });
      if (this.state.type !== 'PASSPORT') {
        // Upload Rear Image
        getPresignedUrl(`ekyc_back_image_${this.props.result.object?.id}.jpg`)
          .then((url: string) => {
            uploadImage(url, 'file://' + this.props.result.imgRear)
              .then(() => {
                this.imageUploadResult.push('success');
                if (this.imageUploadResult.length === 3) {
                  this.props.hideLoading();
                  this.setState({
                    isCheckDocumentDone: true,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                this.props.hideLoading();

                this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
              });
            this.backImageUrl = url.split('?')[0];
          })
          .catch(() => {
            this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
            this.props.hideLoading();
          });
      }

      // Upload Portrait Image
      getPresignedUrl(`ekyc_portrait_image_${this.props.result.object?.id}.jpg`)
        .then((url: string) => {
          uploadImage(url, 'file://' + this.props.result.imagePortrait)
            .then(() => {
              this.imageUploadResult.push('success');
              if (this.imageUploadResult.length === 3) {
                this.props.hideLoading();
                this.setState({
                  isCheckDocumentDone: true,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.props.hideLoading();
              this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
            });
          this.portraitImageUrl = url.split('?')[0];
        })
        .catch(() => {
          this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
          this.props.hideLoading();
        });
    } else {
      let abc = 'data:image/jpeg;base64,';
      getPresignedUrl(`ekyc_front_image_${JSON.parse(this.props.result.info as string).object?.id}.jpg`)
        .then((url: string) => {
          uploadImage(url, abc + this.props.result.imageFront)
            .then(() => {
              this.imageUploadResult.push('success');
              if (this.imageUploadResult.length === 3) {
                this.props.hideLoading();
                this.setState({
                  isCheckDocumentDone: true,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.props.hideLoading();
              this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
            });
          this.frontImageUrl = url.split('?')[0];
        })
        .catch(() => {
          this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
          this.props.hideLoading();
        });

      if (this.state.type !== 'PASSPORT') {
        getPresignedUrl(`ekyc_back_image_${JSON.parse(this.props.result.info as string).object?.id}.jpg`)
          .then((url: string) => {
            uploadImage(url, abc + this.props.result.imageBack)
              .then(() => {
                this.imageUploadResult.push('success');
                if (this.imageUploadResult.length === 3) {
                  this.props.hideLoading();
                  this.setState({
                    isCheckDocumentDone: true,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                this.props.hideLoading();
                this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
              });
            this.backImageUrl = url.split('?')[0];
          })
          .catch(() => {
            this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
            this.props.hideLoading();
          });
      }

      getPresignedUrl(`ekyc_portrait_image_${JSON.parse(this.props.result.info as string).object?.id}.jpg`)
        .then((url: string) => {
          uploadImage(url, abc + this.props.result.imageFace)
            .then(() => {
              this.imageUploadResult.push('success');
              if (this.imageUploadResult.length === 3) {
                this.props.hideLoading();
                this.setState({
                  isCheckDocumentDone: true,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.props.hideLoading();
              this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
            });
          this.portraitImageUrl = url.split('?')[0];
        })
        .catch(() => {
          this.props.showNoti('Upload Image', this.props.t('IMAGE_UPLOAD_FAILED'), NOTIFICATION_TYPE.ERROR);
          this.props.hideLoading();
        });
    }
    const hometown = (result.address as string).split(',');

    if (hometown.length >= 3) {
      this.setState({
        permanentCity: hometown[hometown.length - 1],
        permanentDistrict: hometown[hometown.length - 2],
        permanentAddress: hometown.slice(0, hometown.length - 2).toString(),
      });
    }

    if (hometown.length === 2) {
      this.setState({ permanentCity: hometown[1], permanentDistrict: hometown[0] });
    }

    this.params = {
      identifierId: result.idCard as string,
      birthDay: formatDateToString(formatStringToDate(result.birthday as string, 'dd/MM/yyyy'), 'yyyyMMdd') || '',
      address: result.address as string,
      issuePlace: result.issuePlace as string,
      issueDate: formatDateToString(formatStringToDate(result.issueDate as string, 'dd/MM/yyyy'), 'yyyyMMdd') || '',
      fullName: result.name as string,
    };
  };

  private onChangeOccupation = (value: string) => {
    this.setState({ occupation: value });
  };

  private onChangeContactAddress = (value: string) => {
    this.setState({ contactAddress: value });
  };

  private onChangeContactCity = (value: string, data: IEkycCityData) => {
    const districtData = data.quan.map((district) => ({ label: district.name, value: district.name }));
    this.setState({ contactCity: value, districtData }, () => {
      this.onChangeContactDistrict(districtData[0].label);
    });
  };

  private onChangeContactDistrict = (value: string) => {
    this.setState({ contactDistrict: value });
  };

  private onChangeEmail = (value: string) => {
    this.setState({ email: value });
  };

  private onChangeMobilePhone = (value: string) => {
    this.setState({ mobilePhone: value });
  };

  private onChangeIdName = (value: string) => {
    if (!value) {
      this.setState({ idName: value, idNameErr: false });
    } else {
      this.setState({ idName: value });
    }
  };

  private onChangeBranch = (value: string) => {
    this.setState({ branch: value });
  };

  private onChangeGender = (gender: string) => {
    this.setState({ gender });
  };

  private checkRequireFeild() {
    this.setState({
      isRequired: true,
      emailErr: !emailValidator.test(this.state.email.trim()),
      phoneErr: !phoneValidator.test(this.state.mobilePhone.trim()),
    });

    if (
      this.state.email.trim() &&
      this.state.gender.trim() !== '-' &&
      this.state.mobilePhone.trim() &&
      this.state.branch.trim() &&
      this.state.contactCity.trim() &&
      this.state.contactDistrict.trim() &&
      this.state.contactAddress.trim() &&
      emailValidator.test(this.state.email.trim()) &&
      phoneValidator.test(this.state.mobilePhone.trim()) &&
      !this.state.idNameErr
    ) {
      return false;
    }
    return true;
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
        this.setState({ showErrorMessage: true });
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ showErrorMessage: true });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        console.log('Here the photo', response);
        getPresignedUrl(`ekyc_trading_code_image_${this.params.identifierId}.jpg`).then((url: string) => {
          uploadImage(url, response.uri).then((data) => console.log('Upload trading code img', data));
          this.tradingCodeImageUrl = url.split('?')[0];
          // this.onPressContinue()
          this.setState({ isShowForeigner: false });
        });
      }
    });
  };

  private onPressContinue = () => {
    const data =
      Platform.OS === 'ios'
        ? (JSON.parse(this.props.result.info as string) as IAndroidEkycResult).object
        : this.props.result.object;

    const expiredDate = data
      ? data.valid_date !== '-'
        ? formatDateToString(formatStringToDate(data.valid_date as string, 'dd/MM/yyyy'), 'yyyyMMdd') || ''
        : ''
      : '';

    const matchingRate =
      Platform.OS === 'ios'
        ? ((JSON.parse(this.props.result.compare as string) as IAndroidEkycResult).object?.prob as number)
        : (JSON.parse(this.props.result.faceResult as string).object?.prob as number);

    if (!this.checkRequireFeild()) {
      this.params = {
        ...this.params,
        type: this.state.type,
        gender: this.state.gender,
        phoneNo: this.state.mobilePhone,
        occupation: this.state.occupation,
        permanentProvince: this.state.permanentCity,
        permanentDistrict: this.state.permanentDistrict,
        permanentAddress: this.state.permanentAddress,
        contactProvince: this.state.contactCity,
        contactDistrict: this.state.contactDistrict,
        contactAddress: this.state.contactAddress,
        email: this.state.email,
        referrerIdName: this.state.idName,
        referrerBranch: this.state.branch,
        matchingRate,
        expiredDate,
        frontImageUrl: this.frontImageUrl,
        backImageUrl: this.backImageUrl,
        portraitImageUrl: this.portraitImageUrl,
        tradingCodeImageUrl: this.tradingCodeImageUrl || '',
      };
      console.log(this.params);

      this.props.changeEkycParams(this.params);
      goToEkycServiceInformation('EkycPersonalInformation', this.params);
    }
  };
}

const mapStateToProps = (state: IState) => ({
  ekycParams: state.ekycParams,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, { changeEkycParams, showNoti, showLoading, hideLoading })(EkycPersonalInformation)
  ),
  Fallback,
  handleError
);
