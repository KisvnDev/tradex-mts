import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
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
import { goToEkycUploadSignature } from 'navigations';
import { IEkycParams } from 'interfaces/common';
import { changeEkycParams } from '../action';
import { IState } from 'redux-sagas/reducers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { Linking } from 'react-native';
import EkycPicker from '../EkycPicker';
import { readJson } from 'utils/socketApi';
import config from 'config';
import UIText from 'components/UiText';
import { bankAccountRegex } from '../PersonalInformation';

export interface BANKType {
  _id: string;
  name: string;
  longName: string;
  shortName: string;
  branch: Branch[];
  id: string;
}

export interface Branch {
  branchCode: string;
  branchName: string;
}

const BANK_URL = 'https://beta.kisvn.vn:8443/files/resources/bank_info_data.json';

interface IEkycServiceInformationProps extends React.ClassAttributes<EkycServiceInformation>, WithTranslation {
  params: IEkycParams;
  ekycParams: IState['ekycParams'];
  changeEkycParams: (param: IEkycParams) => void;
}

interface IEkycServiceInformationState {
  accountType: string;
  bankAccount: string;
  bankAccountErr: boolean;
  accountName: string;
  bankName: string;
  branch: string;
  agreeCondition: boolean;
  isRequired: boolean;
  bankData: (Item & { id?: string })[];
  branchData: Item[];
  branchId: string;
  bankId?: string;
}

class EkycServiceInformation extends React.Component<IEkycServiceInformationProps, IEkycServiceInformationState> {
  constructor(props: IEkycServiceInformationProps) {
    super(props);
    this.state = {
      accountType: 'equity',
      bankAccount: this.props.ekycParams.bankAccount || '',
      bankAccountErr: false,
      accountName: this.props.ekycParams.accountName || '',
      bankName: this.props.ekycParams.bankName || '',
      branch: this.props.ekycParams.branch || '',
      agreeCondition: true,
      isRequired: false,
      bankData: [],
      branchData: [],
      branchId: '',
      bankId: '',
    };
  }

  componentDidMount() {
    this.readBankAccount();
  }

  readBankAccount() {
    readJson(BANK_URL).then((bankData: BANKType[]) => {
      if (bankData) {
        const data = bankData.map((item: BANKType) => ({
          label: item.longName,
          value: item.branch,
          id: item._id,
          searchKey: (item.longName || '') + '_' + (item?.shortName || '') + '_' + (item.name || ''),
        }));

        this.setState({ bankData: data });
      }
    });
  }

  render() {
    const { t } = this.props;

    return (
      <UserInactivity>
        <KeyboardAwareScrollView>
          <ScrollView>
            <View style={styles.container}>
              <UIText style={styles.heading}>{t('Service Information')}</UIText>
              <View>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => {
                    this.onChangeCheckbox('equity');
                  }}
                >
                  <View style={styles.text}>
                    <UIText>{t('Opening Equity Account')}</UIText>
                  </View>
                  <View style={styles.box}>
                    <CheckBox checked={this.state.accountType === 'equity'} />
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <UIText style={styles.title}>{t('Transfer Online')}</UIText>
                <TextBox
                  label={t('Bank account')}
                  type={TEXTBOX_TYPE.TEXT}
                  keyboardType="default"
                  value={this.state.bankAccount}
                  onChange={this.onChangeBankAccount}
                  autoCorrect={false}
                  emphasize={true}
                  required={this.state.isRequired}
                  error={this.state.bankAccountErr}
                  onBlur={this.onBlurBankAccount}
                />
                <TextBox
                  label={t('Account Name')}
                  type={TEXTBOX_TYPE.TEXT}
                  keyboardType="default"
                  value={
                    this.props.ekycParams?.fullName
                      ? this.state.accountName
                        ? this.state.accountName
                        : this.props.ekycParams?.fullName
                      : this.state.accountName
                  }
                  onChange={this.onChangeAccountName}
                  autoCorrect={false}
                  required={this.state.isRequired}
                  emphasize={true}
                />
                <EkycPicker
                  label={t('Bank Name')}
                  data={this.state.bankData}
                  onSelect={this.onChangeBankName}
                  required={this.state.isRequired}
                  emphasize={true}
                />
                <EkycPicker
                  label={t('Branch')}
                  data={this.state.branchData}
                  onSelect={this.onChangeBranch}
                  required={this.state.isRequired}
                  emphasize={true}
                />
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkboxBox}>
                  <CheckBox checked={this.state.agreeCondition} onChange={this.onChangeCondition} />
                </View>
                <UIText style={styles.checkboxText}>
                  <UIText>{t('I_AGREE_FULLNAME_WITH_KIS', { fullname: this.props.ekycParams?.fullName })} </UIText>
                  <UIText
                    style={{ color: 'blue' }}
                    onPress={() =>
                      Linking.openURL(
                        global.lang === 'vi'
                          ? 'https://kisvn.vn/wp-content/uploads/2020/10/KIS_H%E1%BB%A2P-%C4%90%E1%BB%92NG-MTK-TI%E1%BA%BENG-VI%E1%BB%86T_06.2020.pdf'
                          : 'https://kisvn.vn/en/wp-content/uploads/sites/2/2020/08/H%C4%90-MTK-TIENG-ANH-LOGO-10-NAM.pdf'
                      )
                    }
                  >
                    {t('terms and conditions')}
                  </UIText>
                  <UIText> {t('of opening account and service registration')}</UIText>
                </UIText>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button title={t('ACCEPT')} onPress={this.onPressButton} />
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </UserInactivity>
    );
  }

  private onBlurBankAccount = () => {
    if (bankAccountRegex.test(this.state.bankAccount.trim())) {
      this.setState({
        bankAccount: this.state.bankAccount.trim(),
        bankAccountErr: false,
      });
    } else {
      this.setState({ bankAccountErr: true });
    }
  };

  private onChangeCondition = (checked: boolean) => {
    this.setState({ agreeCondition: checked });
  };
  private onChangeCheckbox = (accountType: string) => {
    this.setState({ accountType });
  };

  private onChangeBankAccount = (bankAccount: string) => {
    this.setState({ bankAccount });
  };

  private onChangeBankName = (bankName: string, branchData: any[]) => {
    let branchId = '';
    let bankId = this.state.bankData.filter((val) => val.label === bankName)[0].id;
    const branchs = config.usingNewKisCore
      ? branchData.map((branch) => {
          branchId = branch.branchCode;
          return { label: branch.branchName, value: branch.branchName };
        })
      : branchData.map((branch) => {
          branchId = branch.branchCode;
          return { label: branch, value: branch };
        });

    this.setState({ bankName, branchData: branchs, branch: '', branchId, bankId });
  };

  private onChangeBranch = (branch: string) => {
    this.setState({ branch });
  };

  private onChangeAccountName = (accountName: string) => {
    this.setState({ accountName });
  };

  private checkRequired = () => {
    this.setState({ isRequired: true });

    if (
      this.state.branch.trim() &&
      (this.state.accountName.trim() || this.props.ekycParams?.fullName) &&
      this.state.bankName.trim() &&
      bankAccountRegex.test(this.state.bankAccount.trim()) &&
      this.state.agreeCondition
    ) {
      return false;
    }
    return true;
  };

  private onPressButton = () => {
    const params = { ...this.props.params };
    params.isMargin = this.state.accountType === 'margin';
    params.bankAccount = this.state.bankAccount;
    params.accountName = this.state.accountName;
    params.bankName = this.state.bankId;
    params.branch = this.state.branch;
    params.branchId = this.state.branchId;

    if (!this.checkRequired()) {
      this.props.changeEkycParams(params);
      goToEkycUploadSignature('EkycServiceInformation', params);
    }
  };
}

const mapStateToProps = (state: IState) => ({
  ekycParams: state.ekycParams,
});

const mapDispathToProps = {
  changeEkycParams,
};

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, mapDispathToProps)(EkycServiceInformation)),
  Fallback,
  handleError
);
