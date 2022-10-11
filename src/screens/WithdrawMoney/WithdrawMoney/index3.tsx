import React from 'react';
import { View, TouchableOpacity, ScrollView, Text } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import InputPicker from 'components/InputPicker';
import Fallback from 'components/Fallback';
// import Picker from 'components/Picker';
import NumericInput from 'components/NumericInput';
import Button from 'components/Button';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IWithdrawBankAccountItems, BankJson } from './reducers';
import {
  queryWithdrawBankAccounts,
  requestWithdrawMoney,
  queryDerivativesWithdrawInfo,
  queryAccountBalance,
  queryBankInfo,
} from './actions';
import styles from './styles';
import config from 'config';
import { TransferType } from '..';
import ModalVerifyOtp from 'components/ModalVerifyOtp';
import RowContent from 'components/RowContent';
import UIText from 'components/UiText';

interface IWithdrawMoneyProps extends React.ClassAttributes<WithdrawMoney>, WithTranslation {
  withdrawBankAccounts: (IWithdrawBankAccountItems & TransferWithdraw & BankJson) | null;
  selectedAccount: IAccount | null;
  derivativesWithdrawInfo: IObject | null;
  equityWithdrawInfo: IObject | null;
  withdrawResult: { success: boolean } | null;
  transferType?: TransferType;
  withdrawBankAccountsInfo: IObject[] | null;

  queryWithdrawBankAccounts(payload?: IObject): void;

  queryBankInfo(): void;

  requestWithdrawMoney(params: IObject): void;

  queryDerivativesWithdrawInfo(): void;

  queryAccountBalance(): void;
}

interface IWithdrawMoneyState {
  amount: number;
  errorAmount: boolean;
  errorAmountContent: string;
  note: string;
  errorNote: boolean;
  errorNoteContent: string;
  showModal: boolean;
  selectedBenefictiaryAccount?: BeneficiaryAccount | IObject;
}

// type BranchItem = {
//   branchCode: string;
//   branchName: string;
// };

type BankBranch = {
  list: ItemDropdown[];
  selected?: string;
};

type IEquityQueryBankInfoItemResponse = {
  bankID: string;
  bankAccNo: string;
  balance: number;
  isDefault: boolean;
};
class WithdrawMoney extends React.Component<IWithdrawMoneyProps, IWithdrawMoneyState> {
  private bankAccount?: string;
  private withdrawableAmount = 0;
  private data: IObject | null = {};
  private beneficiaryAccountList: ItemDropdown[] = [];
  private bankBranch: BankBranch = { list: [] };
  private isInputAccount: boolean;
  // private jsonBankDropdown: ItemDropdown[] = [];

  constructor(props: IWithdrawMoneyProps) {
    super(props);
    this.state = {
      amount: 0,
      errorAmount: false,
      errorAmountContent: '',
      note: '',
      errorNote: false,
      errorNoteContent: '',
      showModal: false,
    };
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      this.props.queryWithdrawBankAccounts(
        config.usingNewKisCore ? { isExtend: this.props.transferType === TransferType.EXTEND } : undefined
      );

      config.usingNewKisCore && this.props.transferType === TransferType.EXTEND && this.props.queryBankInfo();

      !config.usingNewKisCore &&
        (this.isDerivativesAccount() ? this.props.queryDerivativesWithdrawInfo() : this.props.queryAccountBalance());
    }
  }

  shouldComponentUpdate(nextProps: IWithdrawMoneyProps) {
    if (
      (this.props.selectedAccount !== nextProps.selectedAccount && nextProps.selectedAccount) ||
      (config.usingNewKisCore && this.props.transferType !== nextProps.transferType)
    ) {
      if (config.usingNewKisCore) {
        this.bankAccount = undefined;
      }

      if (config.usingNewKisCore) {
        this.beneficiaryAccountList = [];
        this.setState({ selectedBenefictiaryAccount: undefined });
      }

      this.props.queryWithdrawBankAccounts(
        config.usingNewKisCore ? { isExtend: nextProps.transferType === TransferType.EXTEND } : undefined
      );
      config.usingNewKisCore && nextProps.transferType === TransferType.EXTEND && this.props.queryBankInfo();
      !config.usingNewKisCore &&
        (this.isDerivativesAccount(nextProps)
          ? this.props.queryDerivativesWithdrawInfo()
          : this.props.queryAccountBalance());
    }

    if (this.props.withdrawResult !== nextProps.withdrawResult && nextProps.selectedAccount) {
      !config.usingNewKisCore &&
        (this.isDerivativesAccount(nextProps)
          ? this.props.queryDerivativesWithdrawInfo()
          : this.props.queryAccountBalance());
    }
    config.usingNewKisCore &&
      this.props.withdrawBankAccounts?.transferableAmount !== nextProps.withdrawBankAccounts?.transferableAmount &&
      this.setState({ note: '', amount: 0 });

    if (
      config.usingNewKisCore &&
      this.props.withdrawBankAccountsInfo !== nextProps.withdrawBankAccountsInfo &&
      nextProps.withdrawBankAccountsInfo != null
    ) {
      this.updateExtendListAccount(nextProps.withdrawBankAccountsInfo);
      this.generateBranchName(nextProps.withdrawBankAccountsInfo);
      // if (this.isExtendTransfer()) {
      //   this.generateJsonBank(nextProps.withdrawBankAccountsInfo);
      // }
    }

    if (
      this.isExtendTransfer() &&
      this.props.withdrawBankAccounts?.bankAccounts !== nextProps.withdrawBankAccounts?.bankAccounts
    ) {
      this.bankAccount =
        (((nextProps.withdrawBankAccounts?.bankAccounts?.[0]?.value as unknown) as IObject)?.bankID as string) ||
        undefined;
      this.isInputAccount = !nextProps.withdrawBankAccounts?.bankAccounts.length;
      // this.bankBranch = { list: [] };
      // this.generateBranchName(nextProps.withdrawBankAccounts?.jsonBank);
    }

    return true;
  }

  componentDidUpdate(prevProps: IWithdrawMoneyProps, _prevState: IWithdrawMoneyState) {
    if (
      this.props.withdrawResult &&
      this.props.withdrawResult !== prevProps.withdrawResult &&
      this.props.withdrawResult.success === true
    ) {
      this.setState({
        amount: 0,
        errorAmount: false,
        errorAmountContent: '',
        note: '',
        errorNote: false,
        errorNoteContent: '',
        showModal: false,
      });
    }
  }

  // private generateJsonBank = (list?: JsonBankItem[]) => {
  //   this.jsonBankDropdown = list?.map((item) => ({ label: item._id, value: item._id })) || [];
  // };

  private updateExtendListAccount = (list: IObject[]) => {
    this.beneficiaryAccountList =
      (list?.map((item) => ({ label: item.bankAccNo, value: item })) as ItemDropdown[]) || [];
    const selectedBenefictiaryAccount = this.beneficiaryAccountList?.length && this.beneficiaryAccountList[0].value;
    this.setState({ selectedBenefictiaryAccount });
  };

  private isDerivativesAccount = (props?: IWithdrawMoneyProps) =>
    props
      ? props.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES
      : this.props.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES;

  // private onChangeBankAccount = (_index: number, value: string) => {
  //   this.isExtendTransfer() && this.generateBranchName(value as any);
  //   this.bankAccount = value;
  // };
  private generateBranchName = (withdrawBankAccountsInfo?: IObject[]) => {
    const listBank =
      withdrawBankAccountsInfo != null
        ? withdrawBankAccountsInfo.map((it) => ({
            label: it.bankBranchName as string,
            value: { branchName: it.bankBranchName, branchCode: it.bankBranchID },
          }))
        : [];
    this.bankBranch = {
      list: listBank,
      selected: listBank[0] != null ? (listBank[0].value.branchName as string) : undefined,
    };
    this.setState({});
  };
  private onChangeBenefictAccount = (_: number, value: BeneficiaryAccount | IObject) => {
    this.isInputAccount = false;
    this.setState({ selectedBenefictiaryAccount: value });
    if (
      this.props.withdrawBankAccounts != null &&
      this.props.withdrawBankAccounts.jsonBank != null &&
      (this.props.withdrawBankAccounts.jsonBank.length as number) > 0
    ) {
      const bankAccount = this.props.withdrawBankAccounts.jsonBank.find((item, _index) => {
        return item._id === (value as IObject)?.bankID;
      });
      if (bankAccount != null) {
        this.bankAccount = bankAccount?._id || undefined;
        this.bankBranch.list = bankAccount.branch.map((it) => ({ label: it.branchName, value: it.branchCode }));
        this.bankBranch.selected = this.bankBranch.list[0] != null ? this.bankBranch.list[0].label : undefined;
      }
    }
  };
  // private onChangeTextBenefictAccount = (text: string) => {
  //   this.bankBranch = { list: [] };
  //   this.bankAccount = undefined;
  //   this.isInputAccount = true;
  //   this.setState({ selectedBenefictiaryAccount: { bankAccNo: text } });
  // };

  private validateAmount = (value: number) => {
    let errorAmountContent = '';
    let errorAmount = false;

    if (!isNaN(value)) {
      if (value <= 0) {
        errorAmountContent = 'Amount must be greater than 0';
        errorAmount = true;
      } else if (value > this.withdrawableAmount) {
        errorAmountContent = 'Amount must be less than transferable amount';
        errorAmount = true;
      }
    } else {
      errorAmountContent = 'Amount must be number';
      errorAmount = true;
    }
    return { errorAmount, errorAmountContent };
  };

  private validateNote = (value: string) => {
    let errorNoteContent = '';
    let errorNote = false;

    if (value.trim() === '') {
      errorNoteContent = 'Note must not be empty';
      errorNote = true;
    } else {
      errorNoteContent = '';
      errorNote = false;
    }
    return { errorNote, errorNoteContent };
  };

  private onChangeAmount = (data: number) => {
    const { errorAmount, errorAmountContent } = this.validateAmount(data);

    this.setState({
      amount: data,
      errorAmount,
      errorAmountContent,
    });
  };

  private submit = () => {
    const isKisCore = config.usingNewKisCore;
    const isBankKis = this.isExtendTransfer();
    isKisCore && this.setState({ showModal: false });
    const { errorAmount, errorAmountContent } = this.validateAmount(this.state.amount);

    const { errorNote, errorNoteContent } = isKisCore
      ? { errorNote: false, errorNoteContent: '' }
      : this.validateNote(this.state.note);

    if (errorAmount !== true && (isKisCore || this.bankAccount) && errorNote !== true) {
      let params: any = {
        [isKisCore ? 'transferAmount' : 'amount']: this.state.amount,
        [isKisCore ? 'content' : 'note']: this.state.note,
        ...(isKisCore
          ? {
              beneficiaryAccountNo: (this.state.selectedBenefictiaryAccount as IEquityQueryBankInfoItemResponse)
                ?.bankAccNo,
              transferableAmount: this.props.withdrawBankAccounts?.transferableAmount,
              transferType: isBankKis ? TransferType.EXTEND : this.isDerivativesAccount() ? 'DR_TO_EQT' : 'TO_SUB',
              // beneficiaryFullName: isKisAccount(this.bankAccount) && this.bankAccount.subAccountName,
              [this.isDerivativesExtends() ? 'sendingFullName' : 'senderFullName']: this.props.withdrawBankAccounts
                ?.senderFullName,
              isExtend: this.props.transferType === TransferType.EXTEND,
            }
          : {
              // bankCode: !isKisAccount(this.bankAccount) && this.bankAccount?.bankCode,
              // bankAccount: !isKisAccount(this.bankAccount) && this.bankAccount?.bankAccountNumber,
            }),
      };
      this.isExtendTransfer() &&
        (params = {
          ...params,
          beneficiaryBankBranch: ((this.bankBranch.selected as unknown) as IObject)?.branchCode,
          [this.isDerivativesExtends() ? 'beneficiaryBank' : 'beneficiaryBankName']: this.bankAccount,
          [this.isDerivativesExtends() ? 'beneficiaryAccountNumber' : 'beneficiaryBankNumber']: (this.state
            .selectedBenefictiaryAccount as IEquityQueryBankInfoItemResponse)?.bankAccNo,
          beneficiaryFullName: this.props.withdrawBankAccounts?.senderFullName,
          transferFee: 0,
        });
      this.props.requestWithdrawMoney(params);
    }

    this.setState({
      errorAmount,
      errorAmountContent,
      errorNote,
      errorNoteContent,
    });
  };

  private isDerivativesExtends = () => this.isDerivativesAccount() && this.isExtendTransfer();

  private onPressWithdrawableAmount = () => {
    const { errorAmount, errorAmountContent } = this.validateAmount(this.withdrawableAmount as number);
    if (errorAmount !== true) {
      this.setState({
        amount: this.withdrawableAmount,
        errorAmount,
        errorAmountContent,
      });
    }
  };

  private openModal = () => this.setState({ showModal: true });
  private isExtendTransfer = () => config.usingNewKisCore && this.props.transferType === TransferType.EXTEND;
  // private onChangeBranch = (_: number, value: string) => {
  //   this.bankBranch.selected = value;
  //   this.setState({});
  // };

  render() {
    const { t } = this.props;
    const { selectedBenefictiaryAccount } = this.state;
    const isKisCore = config.usingNewKisCore;

    let withdrawBankAccounts: any[] = [];
    if (this.props.withdrawBankAccounts != null && this.props.withdrawBankAccounts.bankAccounts != null) {
      withdrawBankAccounts = this.props.withdrawBankAccounts.bankAccounts.map((item, _index) => {
        return { label: item.label, value: ((item.value as unknown) as IObject)?.bankID };
      });
    }
    this.data = {};

    isKisCore && (this.withdrawableAmount = this.props.withdrawBankAccounts?.transferableAmount || 0);
    if (this.props.selectedAccount) {
      if (this.props.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        if (this.props.derivativesWithdrawInfo != null) {
          this.data = this.props.derivativesWithdrawInfo;
          this.withdrawableAmount = this.props.derivativesWithdrawInfo.withdrawableAmount as number;
        }
      } else if (this.props.equityWithdrawInfo != null) {
        this.data = this.props.equityWithdrawInfo;
        this.withdrawableAmount = this.props.equityWithdrawInfo.withdrawableAmount as number;
      }
    }

    if (this.bankAccount == null && withdrawBankAccounts.length > 0 && this.isInputAccount === false) {
      this.bankAccount = withdrawBankAccounts[0].value;
    }

    const isDisabledSubmit =
      (!this.isExtendTransfer()
        ? withdrawBankAccounts.length === 0
        : isKisCore && (!selectedBenefictiaryAccount || !this.bankBranch.selected || !this.bankAccount)) ||
      this.state.errorAmount ||
      this.state.errorNote ||
      !this.state.amount;

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScrollView style={styles.form}>
          <View style={styles.amount}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t(isKisCore ? 'Transferable Amount' : 'Deposit')}
              </UIText>
            </View>
            <View style={styles.data}>
              <UIText allowFontScaling={false} style={styles.dataText}>
                {this.data &&
                  formatNumber(
                    (isKisCore
                      ? this.props.withdrawBankAccounts?.transferableAmount
                      : this.data.depositAmount) as number,
                    2
                  )}
              </UIText>
            </View>
          </View>

          {!isKisCore ? (
            <View style={styles.amount}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Withdrawable Amount')}
                </UIText>
              </View>
              <TouchableOpacity style={styles.withdrawable} onPress={this.onPressWithdrawableAmount}>
                <UIText allowFontScaling={false} style={styles.labelTouch}>
                  {this.data && formatNumber(this.data.withdrawableAmount as number, 2)}
                </UIText>
              </TouchableOpacity>
            </View>
          ) : (
            this.isExtendTransfer() && (
              <View style={[styles.bank, isKisCore && styles.kisContainer]}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Beneficiary Account No')}{' '}
                </UIText>

                <View style={styles.bankContainer}>
                  <InputPicker
                    keyboardType={'numeric'}
                    isInput={this.isInputAccount}
                    valueContainer={isKisCore && styles.kisRightItem}
                    list={this.beneficiaryAccountList}
                    selectedValue={selectedBenefictiaryAccount}
                    onChange={this.onChangeBenefictAccount}
                    // onChangeText={this.onChangeTextBenefictAccount}
                  />
                </View>
              </View>
            )
          )}

          <View style={[styles.bank, isKisCore && styles.kisContainer]}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t(this.isExtendTransfer() ? 'Bank' : 'Receiving Account')}
            </UIText>

            <View style={styles.bankContainer}>
              {/* <Picker
                valueContainer={isKisCore && styles.kisRightItem}
                list={this.jsonBankDropdown}
                selectedValue={this.bankAccount || this.jsonBankDropdown[0]}
                onChange={this.onChangeBankAccount}
                disabled={this.isExtendTransfer() && this.isInputAccount === false}
              /> */}
              {this.bankAccount != null && <Text>{this.bankAccount}</Text>}
            </View>
          </View>

          {this.isExtendTransfer() ? (
            <>
              <View style={[styles.bank, isKisCore && styles.kisContainer]}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Branch')}
                </UIText>

                <View style={styles.bankContainer}>
                  {/* <Picker
                    valueContainer={isKisCore && styles.kisRightItem}
                    list={this.bankBranch.list}
                    selectedValue={this.bankBranch.selected}
                    onChange={this.onChangeBranch}
                  /> */}
                  {this.bankBranch.selected != null && <Text>{this.bankBranch.selected}</Text>}
                </View>
              </View>
              <View style={styles.amount}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Beneficiary Account Name')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {this.props.withdrawBankAccounts?.senderFullName}
                  </UIText>
                </View>
              </View>
            </>
          ) : null}

          <View style={styles.input}>
            <NumericInput
              isRow={isKisCore}
              label={isKisCore ? 'Transfer Amount' : 'Amount'}
              error={this.state.errorAmount}
              errorContent={this.state.errorAmountContent}
              value={this.state.amount}
              textInputStyle={isKisCore && styles.kisRightItem}
              onChange={this.onChangeAmount}
            />
          </View>
          {isKisCore ? (
            <View style={styles.amount}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Transfer Fee')}
                </UIText>
              </View>
              <View style={styles.data}>
                <UIText allowFontScaling={false} style={styles.dataText}>
                  {this.isExtendTransfer()
                    ? t('Out')
                    : this.props.transferType === TransferType.INTERNAL
                    ? 0
                    : this.data && formatNumber(this.data.depositAmount as number, 2)}
                </UIText>
              </View>
            </View>
          ) : null}

          <View style={styles.note}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Content')}
              </UIText>
            </View>
            <View style={styles.data}>
              <UIText allowFontScaling={false}>
                {t('CONTENT_BANK')} {this.props.selectedAccount?.account} {t('to')}{' '}
                {this.props.withdrawBankAccounts?.senderFullName}
              </UIText>
            </View>
          </View>

          <View
            style={[
              styles.button,
              !this.isExtendTransfer() && withdrawBankAccounts.length === 0 && styles.disabledButton,
            ]}
          >
            <Button
              onPress={isKisCore ? this.openModal : this.submit}
              title={t(isKisCore ? 'TRANSFER_1' : 'WITHDRAW')}
              buttonStyle={isDisabledSubmit ? styles.disabledButton : undefined}
              disabled={isDisabledSubmit}
            />
          </View>
        </ScrollView>
        <ModalVerifyOtp
          childrenTop={
            <>
              <RowContent notScaping left="Sending Account" right={this.props.selectedAccount?.accountNumber} />
              <RowContent notScaping left="Transfer Amount" right={this.state?.amount} />
              <RowContent notScaping left="Transfer Fee" right={0} />
              <RowContent
                notScaping
                left="Content"
                right={`${t('CONTENT_BANK')} ${this.props.selectedAccount?.account} ${t('to')} 
                ${this.props.withdrawBankAccounts?.senderFullName}`}
              />
            </>
          }
          notShowAccount
          onSubmit={this.submit}
          isOpenModalVerify={this.state.showModal}
          closeModal={() => this.setState({ showModal: false })}
          // isAlwayVerify
        />
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  accountBalance: state.equityAccountBalance,
  withdrawResult: state.withdrawResult,
  withdrawBankAccounts: state.withdrawBankAccounts,
  equityWithdrawInfo: state.equityWithdrawInfo,
  derivativesWithdrawInfo: state.derivativesWithdrawInfo,
  withdrawBankAccountsInfo: state.withdrawBankAccountsInfo,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryWithdrawBankAccounts,
      requestWithdrawMoney,
      queryDerivativesWithdrawInfo,
      queryAccountBalance,
      queryBankInfo,
    })(WithdrawMoney)
  ),
  Fallback,
  handleError
);
