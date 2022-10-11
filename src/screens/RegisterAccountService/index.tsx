import React from 'react';
import { View, Modal, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Item } from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError, isBlank } from 'utils/common';
import Fallback from 'components/Fallback';
import CheckBox from 'components/CheckBox';
import ScreenLoader from 'components/ScreenLoader';
import Button from 'components/Button';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { IObject } from 'interfaces/common';
import { queryBankList, queryBankBranch, finishRegister } from './actions';
import { goToRegisterAccountLastNotification } from 'navigations';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import Svg, { Path } from 'react-native-svg';
import { LANG } from 'global';
import { Colors } from 'styles';
import UIText from 'components/UiText';

interface IRegisterAccountServiceProps extends React.ClassAttributes<RegisterAccountService>, WithTranslation {
  bankList: IObject[] | null;
  bankBranchList: IObject[] | null;
  idImageInfo: IObject | null;
  registerAccountForm: IObject | null;
  registerAccountFormRequestInfo: IObject;
  bankListSuccessTrigger: boolean;
  bankBranchListSuccessTrigger: boolean;
  finishRegisterAccountSuccessTrigger: boolean;

  address_permermanent: boolean;
  country: boolean;
  dob: boolean;
  gender: boolean;
  id_issue_date: boolean;
  id_issue_place: boolean;
  id_number: boolean;
  name: boolean;
  notes: string;
  address: string;
  email: string;
  genderValue: string;

  queryBankList(): void;

  queryBankBranch(params: IObject): void;

  finishRegister(params: IObject): void;
}

interface IRegisterAccountServiceState {
  accountNumber: string;
  searchBank: string;
  searchBankBranch: string;
  errorAccountNumber: boolean;
  errorAccountNumberContent: string;
  acceptPrivacy: boolean;
  equityRegistering: boolean;
  derivativesRegistering: boolean;
  marginRegistering: boolean;
  termModalVisible: boolean;
  modalVisible2: boolean;
  modalVisible3: boolean;
}

class RegisterAccountService extends React.Component<IRegisterAccountServiceProps, IRegisterAccountServiceState> {
  private listBanks: Item[] = [];
  private listBankBranches: Item[] = [];
  private bank: string | undefined;
  private bankBranch: string | undefined;

  constructor(props: IRegisterAccountServiceProps) {
    super(props);

    this.state = {
      accountNumber: '',
      searchBank: '',
      searchBankBranch: '',
      errorAccountNumber: false,
      errorAccountNumberContent: '',
      acceptPrivacy: false,
      equityRegistering: true,
      derivativesRegistering: true,
      marginRegistering: true,
      termModalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
    };
  }

  componentDidMount() {
    this.props.queryBankList();
  }

  shouldComponentUpdate(nextProps: IRegisterAccountServiceProps, nextState: IRegisterAccountServiceState) {
    if (this.props.bankListSuccessTrigger !== nextProps.bankListSuccessTrigger) {
      if (nextProps.bankList != null) {
        nextProps.bankList!.map((value, index) => {
          this.listBanks.push({
            label: value.text as string,
            value: value.value as string,
          });
        });
      } else {
        this.listBanks = [];
      }
      if (this.listBanks.length > 0) {
        this.bank = this.listBanks[0].value;
        const params = {
          bankCode: this.bank as string,
        };
        this.props.queryBankBranch(params);
      } else {
        this.bank = undefined;
        this.listBankBranches = [];
        this.bankBranch = undefined;
      }
    }
    if (this.props.bankBranchListSuccessTrigger !== nextProps.bankBranchListSuccessTrigger) {
      if (nextProps.bankBranchList != null) {
        nextProps.bankBranchList!.map((value, index) => {
          this.listBankBranches.push({
            label: value.text as string,
            value: value.value as string,
          });
        });
      } else {
        this.listBankBranches = [];
      }
      if (this.listBankBranches.length > 0) {
        this.bankBranch = this.listBankBranches[0].value;
      } else {
        this.bankBranch = undefined;
      }
    }
    return true;
  }

  componentDidUpdate(prevProps: IRegisterAccountServiceProps) {
    if (this.props.finishRegisterAccountSuccessTrigger !== prevProps.finishRegisterAccountSuccessTrigger) {
      goToRegisterAccountLastNotification();
    }
  }

  private onClickOKWarning = () => {
    this.setState({
      termModalVisible: false,
    });
  };

  private validate() {
    if (isBlank(this.state.accountNumber) || this.bankBranch == null) {
      this.setState({
        errorAccountNumber: true,
        errorAccountNumberContent: 'Account number and Bank Branch can not be blank',
      });
      return false;
    } else {
      this.setState({
        errorAccountNumber: false,
        errorAccountNumberContent: '',
      });
    }
    if (this.state.acceptPrivacy === false) {
      this.setState({
        termModalVisible: true,
      });
      return false;
    }
    return true;
  }

  private handleFinish = () => {
    if (this.validate()) {
      const params = {
        allow_margin_trade: this.state.marginRegistering,
        allow_derivative_trade: this.state.derivativesRegistering,
        allow_banking: this.state.equityRegistering,
        bank_account: this.state.accountNumber,
        bank_brand: this.bankBranch,
        bank_code: this.bank,
        hoVaTen: (this.props.idImageInfo!.userData as IObject).hoVaTen,
        soCmt: (this.props.idImageInfo!.userData as IObject).soCmt,
        loaiCmt: (this.props.idImageInfo!.userData as IObject).loaiCmt,
        namSinh: (this.props.idImageInfo!.userData as IObject).namSinh,
        noiCap: (this.props.idImageInfo!.userData as IObject).noiCap,
        ngayCap: (this.props.idImageInfo!.userData as IObject).ngayCap,
        draftId: this.props.registerAccountForm!.draft_id,
        email: this.props.email,
        sex:
          ((this.props.idImageInfo!.userData as IObject).gioiTinh as string).trim() === ''
            ? this.props.genderValue
            : this.props.registerAccountFormRequestInfo.sex,
        phone: this.props.registerAccountFormRequestInfo.phone,
        brand: this.props.registerAccountFormRequestInfo.brand,
        country: 'VIETNAM',
        address: this.props.address,
        wrong_data: {
          address_permermanent: this.props.address_permermanent,
          country: this.props.country,
          dob: this.props.dob,
          gender: this.props.gender,
          id_issue_date: this.props.id_issue_date,
          id_issue_place: this.props.id_issue_place,
          id_number: this.props.id_number,
          id_type: false,
          name: this.props.name,
          notes: this.props.notes,
        },
      };
      this.props.finishRegister(params as IObject);
    }
  };

  private onChangeAccountNumber = (data: string) => {
    this.setState({
      accountNumber: data,
    });
  };

  private onChangeBank = (index: number, value: string) => {
    this.listBankBranches = [];
    this.bankBranch = undefined;
    this.bank = value;
    this.setState(
      {
        modalVisible2: false,
        searchBank: '',
      },
      () => {
        const params = {
          bankCode: value,
        };
        this.props.queryBankBranch(params);
      }
    );
  };

  private onChangeBankBranches = (index: number, value: string) => {
    this.bankBranch = value;
    this.setState({
      modalVisible3: false,
      searchBankBranch: '',
    });
  };

  private changeEquityRegistering = (value: boolean) => {
    this.setState({
      equityRegistering: value,
    });
  };

  private changeMarginRegistering = (value: boolean) => {
    this.setState({
      marginRegistering: value,
    });
  };

  private changeDerivativesRegistering = (value: boolean) => {
    this.setState({
      derivativesRegistering: value,
    });
  };

  private changeAcceptPrivacy = (value: boolean) => {
    this.setState({
      acceptPrivacy: value,
    });
  };

  private onChangeSearchBank = (value: string) => {
    this.setState({
      searchBank: value,
    });
  };

  private onChangeSearchBankBranch = (value: string) => {
    this.setState({
      searchBankBranch: value,
    });
  };

  private showModal2 = () => {
    this.setState({
      modalVisible2: true,
    });
  };

  private showModal3 = () => {
    this.setState({
      modalVisible3: true,
    });
  };

  private closeModal2 = () => {
    this.setState({
      modalVisible2: false,
      searchBank: '',
    });
  };

  private closeModal3 = () => {
    this.setState({
      modalVisible3: false,
      searchBankBranch: '',
    });
  };

  render() {
    const { t } = this.props;
    // const { userData } = this.props.idImageInfo!;

    const listBanksRenderer = this.listBanks.map((item, index) => {
      if (this.state.searchBank.trim() === '') {
        return (
          <TouchableOpacity
            key={index}
            style={[styles.borderBottom, styles.paddingVertical2]}
            onPress={() => this.onChangeBank(index, item.value)}
          >
            <View style={[styles.flexDirectionRow, styles.paddingHorizontal]}>
              <UIText allowFontScaling={false} style={this.bank === item.value && styles.selectedItem}>
                {` ${item.label}`}
              </UIText>
            </View>
          </TouchableOpacity>
        );
      } else {
        if (item.label.trim().toLocaleLowerCase().includes(this.state.searchBank.trim().toLocaleLowerCase())) {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.borderBottom, styles.paddingVertical2]}
              onPress={() => this.onChangeBank(index, item.value)}
            >
              <View style={[styles.flexDirectionRow, styles.paddingHorizontal]}>
                <UIText allowFontScaling={false} style={this.bank === item.value && styles.selectedItem}>
                  {` ${item.label}`}
                </UIText>
              </View>
            </TouchableOpacity>
          );
        } else {
          return null;
        }
      }
    });

    const listBankBranchesRenderer = this.listBankBranches.map((item, index) => {
      if (this.state.searchBankBranch.trim() === '') {
        return (
          <TouchableOpacity
            key={index}
            style={[styles.borderBottom, styles.paddingVertical2]}
            onPress={() => this.onChangeBankBranches(index, item.value)}
          >
            <View style={[styles.flexDirectionRow, styles.paddingHorizontal]}>
              <UIText allowFontScaling={false} style={this.bankBranch === item.value && styles.selectedItem}>
                {` ${item.label}`}
              </UIText>
            </View>
          </TouchableOpacity>
        );
      } else {
        if (item.label.trim().toLocaleLowerCase().includes(this.state.searchBankBranch.trim().toLocaleLowerCase())) {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.borderBottom, styles.paddingVertical2]}
              onPress={() => this.onChangeBankBranches(index, item.value)}
            >
              <View style={[styles.flexDirectionRow, styles.paddingHorizontal]}>
                <UIText allowFontScaling={false} style={this.bank === item.value && styles.selectedItem}>
                  {` ${item.label}`}
                </UIText>
              </View>
            </TouchableOpacity>
          );
        } else {
          return null;
        }
      }
    });

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.titleContainer}>
            <UIText style={styles.mainTextTitle}>{t('Confirm Information')}</UIText>
          </View>
          <View style={styles.checkBoxSection}>
            <CheckBox
              label="Equity registering"
              checked={this.state.equityRegistering}
              onChange={this.changeEquityRegistering}
              disabled={true}
            />
          </View>
          <View style={styles.checkBoxSection}>
            <CheckBox
              label="Margin registering"
              checked={this.state.marginRegistering}
              onChange={this.changeMarginRegistering}
            />
          </View>
          <View style={styles.checkBoxSection}>
            <CheckBox
              label="Derivatives registering"
              checked={this.state.derivativesRegistering}
              onChange={this.changeDerivativesRegistering}
            />
          </View>
          <View style={styles.formItem}>
            <TextBox
              label="Account Number"
              type={TEXTBOX_TYPE.TEXT}
              value={this.state.accountNumber}
              error={this.state.errorAccountNumber}
              errorContent={this.state.errorAccountNumberContent}
              onChange={this.onChangeAccountNumber}
            />
          </View>
          <View style={styles.formItem}>
            {/* <TextBox
              label="Account Owner Name"
              type={TEXTBOX_TYPE.TEXT}
              value={(userData as IObject).hoVaTen as string}
              autoCorrect={false}
              disabled={true}
            /> */}
          </View>
          <View style={styles.formItem}>
            {/* <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Bank')}
            </UIText>

            <View style={styles.bankContainer}>
              <Picker
                placeholder={{}}
                list={this.listBanks}
                selectedValue={this.bank}
                onChange={this.onChangeBank}
                allowPlaceHolderSelect={false}
              />
            </View> */}
            <View style={styles.accountPickerContainer}>
              <View style={styles.container}>
                <View style={styles.labelSection}>
                  <UIText allowFontScaling={false} style={styles.labelTextBox}>
                    {t('Bank')}
                  </UIText>
                </View>
                <TouchableOpacity onPress={this.showModal2} style={styles.valueContainer}>
                  <View style={styles.pickerContainer}>
                    <UIText allowFontScaling={false}>
                      {this.bank != null ? `${this.bank}` : t('Select an item...')}
                    </UIText>
                    <FontAwesomeIcon name="caret-down" color={Colors.DARK_GREY} size={15} style={styles.iconPicker} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.formItem}>
            {/* <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Bank Branch')}
            </UIText>

            <View style={styles.bankContainer}>
              {this.listBankBranches.length > 0 &&
                <Picker
                  placeholder={{}}
                  list={this.listBankBranches}
                  selectedValue={this.bankBranch}
                  onChange={this.onChangeBankBranches}
                  allowPlaceHolderSelect={false}
                />}
            </View> */}
            <View style={styles.accountPickerContainer}>
              <View style={styles.container}>
                <View style={styles.labelSection}>
                  <UIText allowFontScaling={false} style={styles.labelTextBox}>
                    {t('Bank Branch')}
                  </UIText>
                </View>
                <TouchableOpacity onPress={this.showModal3} style={styles.valueContainer}>
                  <View style={styles.pickerContainer}>
                    <UIText allowFontScaling={false}>
                      {this.bankBranch != null
                        ? `${this.listBankBranches.find((item, index) => item.value.trim() === this.bankBranch)?.label}`
                        : t('Select an item...')}
                    </UIText>
                    <FontAwesomeIcon name="caret-down" color={Colors.DARK_GREY} size={15} style={styles.iconPicker} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.formItem}>
            <UIText allowFontScaling={false}>{t('NOTE1_PRIVACY')}</UIText>
            <UIText allowFontScaling={false} style={styles.boldText}>
              {`- ${t('NOTE2_PRIVACY')}`}
            </UIText>
            <UIText allowFontScaling={false} style={styles.boldText}>
              {`- ${t('NOTE3_PRIVACY')}`}
            </UIText>
            <UIText allowFontScaling={false} style={styles.boldText}>
              {`- ${t('NOTE4_PRIVACY')}`}
            </UIText>
          </View>
          <View style={styles.checkBoxSection}>
            <CheckBox
              label=""
              checked={this.state.acceptPrivacy}
              onChange={this.changeAcceptPrivacy}
              hyperLink={{
                label: global.lang === LANG.VI ? 'Tôi đồng ý với' : 'I agree with',
                labelLink:
                  global.lang === LANG.VI ? 'Điều khoản dịch vụ của VCSC' : "VCSC's Terms & Conditions of service",
                link: 'https://www.vcsc.com.vn/userfiles/upload/file/VCSC/bieu-mau/mo_tk_ca_nhan.pdf',
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this.handleFinish} title={'FINISH'} buttonStyle={styles.buttonUnderstood} />
          </View>
        </KeyboardAwareScrollView>
        {/* <Modal transparent={true} visible={this.state.successNotifyModalVisible} animationType="none">
          <View style={styles.OTPContainer}>
            <View style={styles.OTPBody}>
              <View style={styles.iconContainer}>
                <Svg
                  width={64}
                  height={64}
                  fill="none"
                  viewBox="0 0 64 64"
                >
                  <Path fill="#00ACDF" d="M47.5 59l16 4-4-12.5-12 8.5z" />
                  <Path
                    fill="#00ACDF"
                    d="M64 43c0 11.598-9.402 21-21 21s-21-9.402-21-21 9.402-21 21-21 21 9.402 21 21z"
                  />
                  <Path fill="#003778" d="M7.5 28C5 34.833 0 48.7 0 49.5L19 44 7.5 28z" />
                  <Path
                    fill="#003778"
                    d="M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25z"
                  />
                </Svg>
              </View>
              <View style={styles.note}>
                <UIText style={{ fontWeight: 'bold', color: 'green' }}>{t('FINISH_NOTE_1')}</UIText>
              </View>
              <Button onPress={this.onClickOK} title={t('confirm').toUpperCase()} />
            </View>
          </View>
        </Modal> */}
        <Modal transparent={true} visible={this.state.termModalVisible} animationType="none">
          <View style={styles.OTPContainer}>
            <View style={styles.OTPBody}>
              <View style={styles.iconContainer}>
                <Svg width={64} height={64} fill="none" viewBox="0 0 64 64">
                  <Path fill="#00ACDF" d="M47.5 59l16 4-4-12.5-12 8.5z" />
                  <Path
                    fill="#00ACDF"
                    d="M64 43c0 11.598-9.402 21-21 21s-21-9.402-21-21 9.402-21 21-21 21 9.402 21 21z"
                  />
                  <Path fill="#003778" d="M7.5 28C5 34.833 0 48.7 0 49.5L19 44 7.5 28z" />
                  <Path
                    fill="#003778"
                    d="M50 25c0 13.807-11.193 25-25 25S0 38.807 0 25 11.193 0 25 0s25 11.193 25 25z"
                  />
                </Svg>
              </View>
              <View style={styles.note}>
                <UIText style={{ fontWeight: 'bold', color: 'green' }}>{t('ACCEPT_TERM_REQUIRED')}</UIText>
              </View>
              <Button onPress={this.onClickOKWarning} title={t('confirm').toUpperCase()} />
            </View>
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={this.state.modalVisible2}>
          <View style={styles.containerModal}>
            {this.listBanks.length > 1 && (
              <View style={[styles.borderBottom, styles.backgroundColorGrey, styles.searchBar]}>
                <View style={[styles.flexDirectionRow, styles.paddingHorizontal, styles.paddingVertical3, styles.fill]}>
                  <TextInput
                    onChangeText={this.onChangeSearchBank}
                    value={this.state.searchBank}
                    style={[Platform.OS === 'android' ? styles.textInputStyle2 : styles.textInputStyle]}
                  />
                </View>
              </View>
            )}
            <ScrollView style={styles.scrollViewModal} contentContainerStyle={styles.justifyContentCenter}>
              <View style={styles.backgroundColorWhite}>{this.listBanks.length > 0 && listBanksRenderer}</View>
            </ScrollView>
            <TouchableOpacity style={styles.invisibleBackground} onPress={this.closeModal2} />
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={this.state.modalVisible3}>
          <View style={styles.containerModal}>
            {this.listBankBranches.length > 1 && (
              <View style={[styles.borderBottom, styles.backgroundColorGrey, styles.searchBar]}>
                <View style={[styles.flexDirectionRow, styles.paddingHorizontal, styles.paddingVertical3, styles.fill]}>
                  <TextInput
                    onChangeText={this.onChangeSearchBankBranch}
                    value={this.state.searchBankBranch}
                    style={[Platform.OS === 'android' ? styles.textInputStyle2 : styles.textInputStyle]}
                  />
                </View>
              </View>
            )}
            <ScrollView style={styles.scrollViewModal} contentContainerStyle={styles.justifyContentCenter}>
              <View style={styles.backgroundColorWhite}>
                {this.listBankBranches.length > 0 && listBankBranchesRenderer}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.invisibleBackground} onPress={this.closeModal3} />
          </View>
        </Modal>
        <ScreenLoader />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  bankList: state.bankList,
  bankBranchList: state.bankBranchList,
  bankListSuccessTrigger: state.bankListSuccessTrigger,
  bankBranchListSuccessTrigger: state.bankBranchListSuccessTrigger,
  idImageInfo: state.idImageInfo,
  registerAccountForm: state.registerAccountForm,
  registerAccountFormRequestInfo: state.registerAccountFormRequestInfo,
  finishRegisterAccountSuccessTrigger: state.finishRegisterAccountSuccessTrigger,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryBankList,
      queryBankBranch,
      finishRegister,
    })(RegisterAccountService)
  ),
  Fallback,
  handleError
);
