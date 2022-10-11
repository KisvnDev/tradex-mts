import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import InputPicker from 'components/InputPicker';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import NumericInput from 'components/NumericInput';
import Button from 'components/Button';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IWithdrawBankAccountItems, IWithdrawBankAccount, BankJson } from './reducers';
import {
  queryWithdrawBankAccounts,
  requestWithdrawMoney,
  queryDerivativesWithdrawInfo,
  queryAccountBalance,
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

  queryWithdrawBankAccounts(payload?: IObject): void;

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
  selectedBenefictiaryAccount?: BeneficiaryAccount;
  withdrawBankAccounts: (IWithdrawBankAccountItems & TransferWithdraw & BankJson) | null;
}

type BranchItem = {
  branchCode: string;
  branchName: string;
};

type BankBranch = {
  list: ItemDropdown[];
  selected?: BranchItem;
};

const isKisAccount = (account?: IWithdrawBankAccount | WithdrawReceivedAccount): account is WithdrawReceivedAccount =>
  !!(account as WithdrawReceivedAccount).subAccountID;

class WithdrawMoney extends React.Component<IWithdrawMoneyProps, IWithdrawMoneyState> {
  private bankAccount?: IWithdrawBankAccount | WithdrawReceivedAccount;
  private withdrawableAmount = 0;
  private data: IObject | null = {};
  private beneficiaryAccountList: ItemDropdown[] = [];
  private bankBranch: BankBranch = { list: [] };
  private isInputAccount: boolean;
  private jsonBankDropdown: ItemDropdown[] = [];

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
      withdrawBankAccounts: null,
    };
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      if (
        this.props.withdrawBankAccounts == null ||
        this.props.withdrawBankAccounts.accountNumber !== this.props.selectedAccount.accountNumber ||
        this.props.withdrawBankAccounts.subNumber !== this.props.selectedAccount.subNumber
      ) {
        this.props.queryWithdrawBankAccounts(
          config.usingNewKisCore ? { isExtend: this.props.transferType === TransferType.EXTEND } : undefined
        );
      }

      this.props.queryWithdrawBankAccounts(
        config.usingNewKisCore ? { isExtend: this.props.transferType === TransferType.EXTEND } : undefined
      );

      !config.usingNewKisCore &&
        (this.isDerivativesAccount() ? this.props.queryDerivativesWithdrawInfo() : this.props.queryAccountBalance());
    }
  }

  shouldComponentUpdate(nextProps: IWithdrawMoneyProps) {
    if (
      (this.props.selectedAccount !== nextProps.selectedAccount &&
        nextProps.selectedAccount &&
        nextProps.selectedAccount != null) ||
      (config.usingNewKisCore &&
        this.props.transferType !== nextProps.transferType &&
        nextProps.selectedAccount != null)
    ) {
      this.bankAccount = undefined;
      this.props.queryWithdrawBankAccounts(
        config.usingNewKisCore ? { isExtend: nextProps.transferType === TransferType.EXTEND } : undefined
      );
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

    config.usingNewKisCore &&
      this.props.withdrawBankAccounts?.beneficiaryAccountList !==
        nextProps.withdrawBankAccounts?.beneficiaryAccountList &&
      this.updateExtendListAccount(nextProps.withdrawBankAccounts?.beneficiaryAccountList);
    this.isExtendTransfer() &&
      this.props.withdrawBankAccounts?.jsonBank !== nextProps.withdrawBankAccounts?.jsonBank &&
      this.generateJsonBank(nextProps.withdrawBankAccounts?.jsonBank);

    if (
      this.isExtendTransfer() &&
      this.props.withdrawBankAccounts?.bankAccounts !== nextProps.withdrawBankAccounts?.bankAccounts
    ) {
      this.bankAccount = nextProps.withdrawBankAccounts?.bankAccounts?.[0]?.value || undefined;

      this.isInputAccount = !nextProps.withdrawBankAccounts?.bankAccounts.length;
      this.bankBranch = { list: [] };
      this.generateBranchName(this.bankAccount as any, nextProps.withdrawBankAccounts?.jsonBank);
    }

    return true;
  }

  componentDidUpdate(prevProps: IWithdrawMoneyProps) {
    if (this.props.withdrawBankAccounts !== prevProps.withdrawBankAccounts && this.props.withdrawBankAccounts != null) {
      this.bankAccount = undefined;
      this.setState({ withdrawBankAccounts: this.props.withdrawBankAccounts });
    }
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

  private generateJsonBank = (list?: JsonBankItem[]) => {
    this.jsonBankDropdown = list?.map((item) => ({ label: item._id, value: item._id })) || [];
  };

  private updateExtendListAccount = (list?: BeneficiaryAccount[]) => {
    this.beneficiaryAccountList = list?.map((item) => ({ label: item.accountNo, value: item })) || [];
    const selectedBenefictiaryAccount = this.beneficiaryAccountList?.length && this.beneficiaryAccountList[0].value;
    this.setState({ selectedBenefictiaryAccount });
  };

  private isDerivativesAccount = (props?: IWithdrawMoneyProps) =>
    props
      ? props.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES
      : this.props.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES;

  private onChangeBankAccount = (index: number, value: IWithdrawBankAccount) => {
    this.isExtendTransfer() && this.generateBranchName(value as any);
    this.bankAccount = value;
    this.setState({});
  };
  private generateBranchName = (selectedBank: KisBankAccount | string, jsonBank?: JsonBankItem[]) => {
    const listBank =
      (jsonBank || this.props.withdrawBankAccounts?.jsonBank)
        ?.find((item) => item._id === (typeof selectedBank === 'string' ? selectedBank : selectedBank?.bankID))
        ?.branch.map((it) => ({ label: it.branchName, value: it })) || [];
    this.bankBranch = { list: listBank };
    this.setState({});
  };
  private onChangeBenefictAccount = (_: number, value: BeneficiaryAccount) => {
    this.isInputAccount = false;
    this.setState({ selectedBenefictiaryAccount: value });
  };
  private onChangeTextBenefictAccount = (text: string) => {
    !this.isInputAccount && (this.bankBranch = { list: [] });
    this.isInputAccount = true;
    this.setState({ selectedBenefictiaryAccount: { ...this.state.selectedBenefictiaryAccount, accountNo: text } });
  };

  private validateAmount = (value: number) => {
    let errorAmountContent = '';
    let errorAmount = false;

    if (!isNaN(value)) {
      if (value <= 0) {
        errorAmountContent = 'Amount must be greater than 0';
        errorAmount = true;
      } else if (value > this.withdrawableAmount) {
        errorAmountContent = 'Amount must be less than withdrawable amount';
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
              beneficiaryAccountNo: isKisAccount(this.bankAccount) && this.bankAccount.subAccountID,
              transferableAmount: this.props.withdrawBankAccounts?.transferableAmount,
              transferType: isBankKis ? TransferType.EXTEND : this.isDerivativesAccount() ? 'DR_TO_EQT' : 'TO_SUB',
              beneficiaryFullName: isKisAccount(this.bankAccount) && this.bankAccount.subAccountName,
              [this.isDerivativesExtends() ? 'sendingFullName' : 'senderFullName']: this.props.withdrawBankAccounts
                ?.senderFullName,
              isExtend: this.props.transferType === TransferType.EXTEND,
            }
          : {
              bankCode: !isKisAccount(this.bankAccount) && this.bankAccount?.bankCode,
              bankAccount: !isKisAccount(this.bankAccount) && this.bankAccount?.bankAccountNumber,
            }),
      };
      this.isExtendTransfer() &&
        (params = {
          ...params,
          beneficiaryBankBranch: this.bankBranch.selected?.branchCode,
          [this.isDerivativesExtends() ? 'beneficiaryBank' : 'beneficiaryBankName']:
            typeof this.bankAccount === 'string' ? this.bankAccount : (this.bankAccount as IObject).bankID,
          [this.isDerivativesExtends() ? 'beneficiaryAccountNumber' : 'beneficiaryBankNumber']: this.state
            .selectedBenefictiaryAccount?.accountNo,
          beneficiaryFullName: this.isInputAccount
            ? this.props.withdrawBankAccounts?.senderFullName
            : this.state.selectedBenefictiaryAccount?.fullName,
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
  private onChangeBranch = (_: number, value: BranchItem) => {
    this.bankBranch.selected = value;
    this.setState({});
  };

  render() {
    const { t } = this.props;
    const { selectedBenefictiaryAccount } = this.state;
    const isKisCore = config.usingNewKisCore;

    const withdrawBankAccounts =
      this.state.withdrawBankAccounts == null || this.state.withdrawBankAccounts.bankAccounts == null
        ? []
        : this.state.withdrawBankAccounts.bankAccounts;
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

    if (this.bankAccount == null && withdrawBankAccounts.length > 0) {
      this.bankAccount = withdrawBankAccounts[0] != null ? withdrawBankAccounts[0].value : undefined;
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
                    0
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
                    onChangeText={this.onChangeTextBenefictAccount}
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
              <Picker
                valueContainer={isKisCore && styles.kisRightItem}
                list={this.isExtendTransfer() && this.isInputAccount ? this.jsonBankDropdown : withdrawBankAccounts}
                selectedValue={this.bankAccount}
                onChange={this.onChangeBankAccount}
                compareKey={'subAccountID'}
              />
            </View>
          </View>

          {this.isExtendTransfer() ? (
            <>
              <View style={[styles.bank, isKisCore && styles.kisContainer]}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Branch')}
                </UIText>

                <View style={styles.bankContainer}>
                  <Picker
                    valueContainer={isKisCore && styles.kisRightItem}
                    list={this.bankBranch.list}
                    selectedValue={this.bankBranch.selected}
                    onChange={this.onChangeBranch}
                  />
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
                    {selectedBenefictiaryAccount?.fullName}
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
                {t('CONTENT_INTERNAL')} {'\n'}
                {this.props.selectedAccount?.accountNumber} {t('to')}{' '}
                {this.bankAccount != null ? (this.bankAccount as IObject).subAccountID : ''}
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
              <RowContent left="Sending Account" right={this.props.selectedAccount?.accountNumber} notScaping />
              <RowContent
                notScaping
                left="Receiving Account"
                right={
                  this.isExtendTransfer()
                    ? this.state.selectedBenefictiaryAccount?.accountNo
                    : (this.bankAccount as WithdrawReceivedAccount)?.subAccountID
                }
              />
              {this.isExtendTransfer() && (
                <>
                  <RowContent
                    notScaping
                    left="Bank"
                    right={
                      typeof this.bankAccount === 'string' ? this.bankAccount : (this.bankAccount as IObject)?.bankID
                    }
                  />
                  <RowContent notScaping left="Branch" right={this.bankBranch?.selected?.branchCode} />
                </>
              )}
              <RowContent
                notScaping
                left="Full name"
                right={
                  this.isExtendTransfer()
                    ? this.state.selectedBenefictiaryAccount?.fullName
                    : (this.bankAccount as WithdrawReceivedAccount)?.subAccountName
                }
              />
              <RowContent notScaping left="Transfer Amount" right={this.state?.amount} />
              <RowContent notScaping left="Transfer Fee" right={0} />
              <RowContent
                notScaping
                left="Content"
                right={`${t('CONTENT_INTERNAL')}
                ${this.props.selectedAccount?.accountNumber} ${t('to')} 
                ${this.bankAccount != null ? (this.bankAccount as IObject).subAccountID : ''}`}
              />
            </>
          }
          notShowAccount
          onSubmit={this.submit}
          isOpenModalVerify={this.state.showModal}
          closeModal={() => this.setState({ showModal: false })}
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
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryWithdrawBankAccounts,
      requestWithdrawMoney,
      queryDerivativesWithdrawInfo,
      queryAccountBalance,
    })(WithdrawMoney)
  ),
  Fallback,
  handleError
);
