import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import NumericInput from 'components/NumericInput';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IWithdrawBankAccountItems, IWithdrawBankAccount } from './reducers';
import {
  queryWithdrawBankAccounts,
  requestWithdrawMoney,
  queryDerivativesWithdrawInfo,
  queryAccountBalance,
} from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IWithdrawMoneyProps extends React.ClassAttributes<WithdrawMoney>, WithTranslation {
  withdrawBankAccounts: IWithdrawBankAccountItems | null;
  selectedAccount: IAccount | null;
  derivativesWithdrawInfo: IObject | null;
  equityWithdrawInfo: IObject | null;
  withdrawResult: { success: boolean } | null;

  queryWithdrawBankAccounts(): void;

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
}

class WithdrawMoney extends React.Component<IWithdrawMoneyProps, IWithdrawMoneyState> {
  private bankAccount: IWithdrawBankAccount;
  private withdrawableAmount = 0;
  private data: IObject | null = {};

  constructor(props: IWithdrawMoneyProps) {
    super(props);
    this.state = {
      amount: 0,
      errorAmount: false,
      errorAmountContent: '',
      note: '',
      errorNote: false,
      errorNoteContent: '',
    };
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      if (
        this.props.withdrawBankAccounts == null ||
        this.props.withdrawBankAccounts.accountNumber !== this.props.selectedAccount.accountNumber ||
        this.props.withdrawBankAccounts.subNumber !== this.props.selectedAccount.subNumber
      ) {
        this.props.queryWithdrawBankAccounts();
      }

      if (this.props.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        this.props.queryDerivativesWithdrawInfo();
      } else {
        this.props.queryAccountBalance();
      }
    }
  }

  shouldComponentUpdate(nextProps: IWithdrawMoneyProps) {
    if (this.props.selectedAccount !== nextProps.selectedAccount && nextProps.selectedAccount) {
      this.props.queryWithdrawBankAccounts();
      if (nextProps.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        this.props.queryDerivativesWithdrawInfo();
      } else {
        this.props.queryAccountBalance();
      }
    }

    if (this.props.withdrawResult !== nextProps.withdrawResult && nextProps.selectedAccount) {
      if (nextProps.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        this.props.queryDerivativesWithdrawInfo();
      } else {
        this.props.queryAccountBalance();
      }
    }

    return true;
  }

  componentDidUpdate(prevProps: IWithdrawMoneyProps) {
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
      });
    }
  }

  private onChangeBankAccount = (index: number, value: IWithdrawBankAccount) => {
    this.bankAccount = value;
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

  private onChangeNote = (data: string) => {
    this.setState({
      note: data,
    });
  };

  private submit = () => {
    const { errorAmount, errorAmountContent } = this.validateAmount(this.state.amount);
    const { errorNote, errorNoteContent } = this.validateNote(this.state.note);
    if (errorAmount !== true && this.bankAccount && errorNote !== true) {
      const params = {
        amount: this.state.amount,
        bankCode: this.bankAccount.bankCode,
        bankAccount: this.bankAccount.bankAccountNumber,
        note: this.state.note,
      };
      this.props.requestWithdrawMoney(params);
    }

    this.setState({
      errorAmount,
      errorAmountContent,
      errorNote,
      errorNoteContent,
    });
  };

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

  render() {
    const { t } = this.props;

    const withdrawBankAccounts =
      this.props.withdrawBankAccounts == null || this.props.withdrawBankAccounts.bankAccounts == null
        ? []
        : this.props.withdrawBankAccounts.bankAccounts;
    this.data = {};

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
      this.bankAccount = withdrawBankAccounts[0].value;
    }

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScrollView style={styles.form}>
          <View style={styles.amount}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Deposit')}
              </UIText>
            </View>
            <View style={styles.data}>
              <UIText allowFontScaling={false} style={styles.dataText}>
                {this.data && formatNumber(this.data.depositAmount as number, 2)}
              </UIText>
            </View>
          </View>

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

          <View style={styles.bank}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Receiving Bank Account')}
            </UIText>

            <View style={styles.bankContainer}>
              <Picker
                list={withdrawBankAccounts}
                selectedValue={this.bankAccount}
                onChange={this.onChangeBankAccount}
              />
            </View>
          </View>

          <View style={styles.input}>
            <NumericInput
              label="Amount"
              error={this.state.errorAmount}
              errorContent={this.state.errorAmountContent}
              value={this.state.amount}
              onChange={this.onChangeAmount}
            />
          </View>

          <View style={styles.note}>
            <TextBox
              label="Note"
              type={TEXTBOX_TYPE.TEXT}
              onChange={this.onChangeNote}
              error={this.state.errorNote}
              errorContent={this.state.errorNoteContent}
              multiline={true}
              numberOfLines={3}
              textInputStyle={styles.textInputStyle}
            />
          </View>

          <View style={[styles.button, withdrawBankAccounts.length === 0 && styles.disabledButton]}>
            <Button onPress={this.submit} title={t('WITHDRAW')} disabled={withdrawBankAccounts.length === 0} />
          </View>
        </ScrollView>
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
