import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import NumericInput from 'components/NumericInput';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { ICashTransferAccountItems } from './reducers';
import config from 'config';
import {
  queryCashTransferAccounts,
  requestCashTransfer,
  queryDerivativesCashTransferInfo,
  queryAccountBalance,
} from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface ICashTransferProps extends React.ClassAttributes<CashTransfer>, WithTranslation {
  type: 'INTERNAL' | 'EXTERNAL';
  transferAccounts: ICashTransferAccountItems | null;
  selectedAccount: IAccount | null;
  accountList: IAccount[];
  derivativesCashTransferInfo: IObject | null;
  equityCashTransferInfo: IObject | null;
  cashTransferResult: { success: boolean } | null;

  queryCashTransferAccounts(): void;

  requestCashTransfer(params: IObject): void;

  queryDerivativesCashTransferInfo(): void;

  queryAccountBalance(): void;
}

interface ICashTransferState {
  amount: number;
  errorAmount: boolean;
  errorAmountContent: string;
  note: string;
  errorNote: boolean;
  errorNoteContent: string;
}

class CashTransfer extends React.Component<ICashTransferProps, ICashTransferState> {
  private transferAccount: IObject | null;
  private transferableAmount = 0;

  constructor(props: ICashTransferProps) {
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
        this.props.transferAccounts == null ||
        this.props.transferAccounts.accountNumber !== this.props.selectedAccount.accountNumber ||
        this.props.transferAccounts.subNumber !== this.props.selectedAccount.subNumber
      ) {
        if (this.props.type === 'EXTERNAL') {
          this.props.queryCashTransferAccounts();
        }
      }

      if (this.props.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        this.props.queryDerivativesCashTransferInfo();
      } else {
        this.props.queryAccountBalance();
      }
    }
  }

  shouldComponentUpdate(nextProps: ICashTransferProps) {
    if (this.props.selectedAccount !== nextProps.selectedAccount && nextProps.selectedAccount) {
      this.transferAccount = null;

      if (nextProps.type === 'EXTERNAL') {
        this.props.queryCashTransferAccounts();
      }
      if (nextProps.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        this.props.queryDerivativesCashTransferInfo();
      } else {
        this.props.queryAccountBalance();
      }
    }

    if (this.props.cashTransferResult !== nextProps.cashTransferResult && nextProps.selectedAccount) {
      if (nextProps.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        this.props.queryDerivativesCashTransferInfo();
      } else {
        this.props.queryAccountBalance();
      }
    }

    return true;
  }

  private onChangeAccount = (index: number, value: IObject) => {
    this.transferAccount = value;
  };

  private validateAmount = (value: number) => {
    let errorAmountContent = '';
    let errorAmount = false;

    if (!isNaN(value)) {
      if (value <= 0) {
        errorAmountContent = 'Amount must be greater than 0';
        errorAmount = true;
      } else if (value > this.transferableAmount) {
        errorAmountContent = config.usingNewKisCore
          ? 'Amount must be less than withdrawal amount show up'
          : 'Amount must be less than transferable amount';
        errorAmount = true;
      }
    } else {
      errorAmountContent = 'Amount must be number';
      errorAmount = true;
    }
    return { errorAmount, errorAmountContent };
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
    if (errorAmount !== true && this.transferAccount) {
      const params = {
        accountNumber: this.props.selectedAccount!.accountNumber,
        subNumber: this.props.selectedAccount!.subNumber,
        amount: this.state.amount,
        receivedAccountNumber: this.transferAccount.accountNumber,
        receivedSubNumber: this.transferAccount.subNumber,
        note: this.state.note,
      };
      this.props.requestCashTransfer(params);
    }

    this.setState({
      errorAmount,
      errorAmountContent,
    });
  };

  private onPressTransferableAmount = () => {
    const { errorAmount, errorAmountContent } = this.validateAmount(this.transferableAmount as number);
    if (errorAmount !== true) {
      this.setState({
        amount: this.transferableAmount,
        errorAmount,
        errorAmountContent,
      });
    }
  };

  render() {
    const { t } = this.props;

    let transferAccounts: Item[] = [];

    if (this.props.type === 'INTERNAL') {
      // Internal transfer btw Main/Sub
      transferAccounts = this.props.accountList.reduce((list: Item[], item: IAccount) => {
        if (
          item.accountNumber === this.props.selectedAccount!.accountNumber &&
          item.subNumber !== this.props.selectedAccount!.subNumber
        ) {
          const account = {
            label: `${item.accountNumber} - ${item.subNumber}`,
            value: item,
          };
          if (list.indexOf(account) === -1) {
            list.push(account);
          }
        }

        return list;
      }, []);
    } else {
      // External transfer to another account
      transferAccounts = this.props.transferAccounts == null ? [] : this.props.transferAccounts.accounts;
    }

    if (this.transferAccount == null && transferAccounts.length > 0) {
      this.transferAccount = transferAccounts[0].value as IObject;
    }

    let data: IObject | null = null;

    if (this.props.selectedAccount) {
      if (this.props.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES) {
        if (this.props.derivativesCashTransferInfo != null) {
          data = this.props.derivativesCashTransferInfo;
          this.transferableAmount = this.props.derivativesCashTransferInfo.transferableAmount as number;
        }
      } else if (this.props.equityCashTransferInfo != null) {
        data = this.props.equityCashTransferInfo;
        this.transferableAmount = this.props.equityCashTransferInfo.withdrawableAmount as number;
      }
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
                {data && formatNumber(data.depositAmount as number, 2)}
              </UIText>
            </View>
          </View>

          <View style={styles.amount}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Transferable Amount')}
              </UIText>
            </View>
            <TouchableOpacity style={styles.transferable} onPress={this.onPressTransferableAmount}>
              <UIText allowFontScaling={false} style={styles.labelTouch}>
                {formatNumber(this.transferableAmount as number, 2)}
              </UIText>
            </TouchableOpacity>
          </View>

          <View style={styles.account}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Receiving Account')}
            </UIText>

            <View style={styles.accountContainer}>
              <Picker
                list={transferAccounts}
                selectedValue={this.transferAccount != null && this.transferAccount}
                onChange={this.onChangeAccount}
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
              multiline={true}
              numberOfLines={3}
              textInputStyle={styles.textInputStyle}
            />
          </View>

          <View
            style={[
              styles.button,
              (this.transferAccount == null || transferAccounts.length === 0) && styles.disabledButton,
            ]}
          >
            <Button
              onPress={this.submit}
              title={t('TRANSFER_2')}
              disabled={this.transferAccount == null || transferAccounts.length === 0}
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  accountList: state.accountList,
  accountBalance: state.equityAccountBalance,
  transferAccounts: state.cashTransferAccounts,
  equityCashTransferInfo: state.equityCashTransferInfo,
  derivativesCashTransferInfo: state.derivativesCashTransferInfo,
  cashTransferResult: state.cashTransferResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryCashTransferAccounts,
      requestCashTransfer,
      queryDerivativesCashTransferInfo,
      queryAccountBalance,
    })(CashTransfer)
  ),
  Fallback,
  handleError
);
