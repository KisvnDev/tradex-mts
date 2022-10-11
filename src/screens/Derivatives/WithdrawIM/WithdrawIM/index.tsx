import React from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP } from 'react-native-responsive-screen';

import { SYSTEM_TYPE, DERIVATIVES_TRANSFER_IM_BANK_TYPE, DERIVATIVES_TRANSFER_IM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import NumericInput from 'components/NumericInput';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import Button from 'components/Button';
import Tooltip from 'rn-tooltip';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ModalVerifyOtp from 'components/ModalVerifyOtp';
import RowContent from 'components/RowContent';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject, ISubAccount } from 'interfaces/common';
import {
  queryWithdrawIMSourceBank,
  queryWithdrawIMTargetBank,
  requestWithdrawIM,
  queryDerivativesWithdrawIMInfo,
  queryDerivativesWithdrawIMFee,
} from './actions';
import styles from './styles';
import config from 'config';
import { Colors, width } from 'styles';
import UIText from 'components/UiText';

interface IWithdrawMoneyProps extends React.ClassAttributes<WithdrawMoney>, WithTranslation {
  sourceBank: IObject | null;
  targetBank: IObject | null;
  selectedAccount: IAccount | null;
  withdrawIMInfo: IObject & TransferWithdraw;
  withdrawIMFee: IObject;
  withdrawIMResult: { success: boolean } | null;
  accounts?: ISubAccount[];
  username?: string;

  queryWithdrawIMSourceBank(params: IObject): void;

  queryWithdrawIMTargetBank(params: IObject): void;

  requestWithdrawIM(params: IObject): void;

  queryDerivativesWithdrawIMInfo(): void;

  queryDerivativesWithdrawIMFee(params: IObject): void;
}

interface IWithdrawMoneyState {
  amount: number;
  errorAmount: boolean;
  errorAmountContent: string;
  note: string;
  errorNote: boolean;
  errorNoteContent: string;
  modalVisible: boolean;
}

class WithdrawMoney extends React.Component<IWithdrawMoneyProps, IWithdrawMoneyState> {
  private transferableAmount = 0;

  constructor(props: IWithdrawMoneyProps) {
    super(props);
    this.state = {
      amount: 0,
      errorAmount: false,
      errorAmountContent: '',
      note: '',
      errorNote: false,
      errorNoteContent: '',
      modalVisible: false,
    };
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      this.props.queryDerivativesWithdrawIMInfo();

      if (
        this.props.sourceBank == null ||
        this.props.sourceBank.accountNumber !== this.props.selectedAccount!.accountNumber
      ) {
        this.props.queryWithdrawIMSourceBank({
          type: DERIVATIVES_TRANSFER_IM_BANK_TYPE.WITHDRAW_FROM,
        });
      }

      if (
        this.props.targetBank == null ||
        this.props.targetBank.accountNumber !== this.props.selectedAccount!.accountNumber
      ) {
        this.props.queryWithdrawIMTargetBank({
          type: DERIVATIVES_TRANSFER_IM_BANK_TYPE.WITHDRAW_TO,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps: IWithdrawMoneyProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.DERIVATIVES
    ) {
      this.props.queryWithdrawIMSourceBank({
        type: DERIVATIVES_TRANSFER_IM_BANK_TYPE.WITHDRAW_FROM,
      });
      this.props.queryWithdrawIMTargetBank({
        type: DERIVATIVES_TRANSFER_IM_BANK_TYPE.WITHDRAW_TO,
      });
      this.props.queryDerivativesWithdrawIMInfo();
    }

    if (this.props.withdrawIMInfo !== nextProps.withdrawIMInfo) {
      this.transferableAmount = this.props.withdrawIMInfo.availableFundForWithdraw as number;
    }

    if (this.props.withdrawIMResult !== nextProps.withdrawIMResult) {
      this.props.queryDerivativesWithdrawIMInfo();
    }

    return true;
  }

  componentDidUpdate(prevProps: IWithdrawMoneyProps) {
    if (
      this.props.withdrawIMResult &&
      this.props.withdrawIMResult !== prevProps.withdrawIMResult &&
      this.props.withdrawIMResult.success === true
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

  private validateAmount = (value: number) => {
    let errorAmountContent = '';
    let errorAmount = false;

    if (!isNaN(value)) {
      if (value <= 0) {
        errorAmountContent = 'Amount must be greater than 0';
        errorAmount = true;
      } else if (
        value > this.transferableAmount ||
        (config.usingNewKisCore && value > (this.props.withdrawIMInfo.transferableAmountOfVSDAccount ?? 0))
      ) {
        errorAmountContent = 'Amount must be less than available amount';
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
    const isKisCore = config.usingNewKisCore;
    const { errorAmount, errorAmountContent } = this.validateAmount(this.state.amount);
    if (
      errorAmount !== true &&
      (isKisCore || (this.props.withdrawIMFee && this.props.sourceBank && this.props.targetBank))
    ) {
      const params = {
        [isKisCore ? 'transferAmount' : 'amount']: this.state.amount,
        [isKisCore ? 'content' : 'note']: this.state.note,
        sourceBank: this.props.sourceBank?.bankAccountNumber || '',
        destBank: this.props.targetBank?.bankAccountNumber || '',
        ...this.props.withdrawIMFee,
      };

      if (isKisCore) {
        params.beneficiaryAccountNo = this.props.selectedAccount?.accountNumber!;
        params.transferType = 'VSD_WITHDRAW';
        params.transferableAmount = this.props.withdrawIMInfo.transferableAmountOfVSDAccount ?? 0;
      }

      this.props.requestWithdrawIM(params);
    }

    this.setState({
      modalVisible: false,
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

  private openModal = () => {
    const { errorAmount, errorAmountContent } = this.validateAmount(this.state.amount);
    if (errorAmount === true) {
      this.setState({
        errorAmount,
        errorAmountContent,
      });
      return;
    }

    if (config.usingNewKisCore) {
      this.setState({
        modalVisible: true,
      });
      return;
    }

    if (this.props.sourceBank && this.props.targetBank) {
      this.setState(
        {
          modalVisible: true,
        },
        () => {
          this.props.queryDerivativesWithdrawIMFee({
            sendingBank: this.props.sourceBank!.bankAccountNumber,
            receivingBank: this.props.targetBank!.bankAccountNumber,
            amount: this.state.amount,
            type: DERIVATIVES_TRANSFER_IM_TYPE.WITHDRAW,
          });
        }
      );
    }
  };

  private closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const isKisCore = config.usingNewKisCore;
    const { t, sourceBank, targetBank, withdrawIMFee, withdrawIMInfo } = this.props;

    const accountName = this.props.accounts?.find((item) => item.accountNumber?.includes('D'))?.accountName || '';

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScrollView style={styles.form}>
          {!isKisCore && (
            <View style={[styles.item, styles.itemOneRow]}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Deposit')}
                </UIText>
              </View>
              <View style={styles.data}>
                <UIText allowFontScaling={false} style={styles.dataTextOneRow}>
                  {withdrawIMInfo && formatNumber(withdrawIMInfo.depositAmount as number, 2)}
                </UIText>
              </View>
            </View>
          )}

          <View style={[styles.item, styles.itemOneRow]}>
            <View style={styles.label}>
              <UIText allowFontScaling={false} style={styles.labelText}>
                {t('Transferable Amount')}
              </UIText>
            </View>
            <TouchableOpacity style={styles.available} onPress={this.onPressTransferableAmount}>
              <UIText allowFontScaling={false} style={styles.labelTouch}>
                {withdrawIMInfo &&
                  formatNumber(
                    isKisCore
                      ? withdrawIMInfo.transferableAmountOfVSDAccount
                      : (withdrawIMInfo.availableFundForWithdraw as number),
                    2
                  )}
              </UIText>
            </TouchableOpacity>
          </View>

          {isKisCore && (
            <View style={[styles.item, styles.itemOneRow]}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Beneficiary Account No')}
                </UIText>
              </View>
              <View style={styles.data}>
                <UIText allowFontScaling={false} style={styles.dataTextOneRow}>
                  {this.props.selectedAccount?.accountNumber}
                </UIText>
              </View>
            </View>
          )}

          <View style={styles.input}>
            <NumericInput
              isRow={isKisCore}
              labelStyle={isKisCore && styles.title}
              label={isKisCore ? 'Transfer Amount' : 'Amount'}
              error={this.state.errorAmount}
              errorContent={this.state.errorAmountContent}
              value={this.state.amount}
              onChange={this.onChangeAmount}
            />
          </View>

          {isKisCore && (
            <View style={[styles.item, styles.itemOneRow]}>
              <View>
                <View style={[styles.label]}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Transfer Fee')}
                  </UIText>
                </View>
              </View>
              <Tooltip
                width={width - 20}
                backgroundColor={Colors.PRIMARY_1}
                popover={
                  <UIText style={[styles.popover]} allowFontScaling={false}>
                    {t('FEE_NOTE_VSD')}{' '}
                  </UIText>
                }
                height={heightPercentageToDP(10)}
              >
                <View style={styles.mgtop10}>
                  <FontAwesome5Icon name="exclamation-circle" />
                </View>
              </Tooltip>
              <View style={styles.data}>
                <UIText allowFontScaling={false} style={styles.dataTextOneRow}>
                  5,500
                </UIText>
              </View>
            </View>
          )}

          {config.usingNewKisCore ? (
            <View style={styles.noteCt}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Content')}
                </UIText>
              </View>
              <View style={styles.dataCt}>
                <UIText allowFontScaling={false} style={styles.txtEnd}>
                  {t('CONTENT_WITHDRAW')} {'057' + this.props.username} {t('to')} {accountName}
                </UIText>
              </View>
            </View>
          ) : (
            <View style={styles.note}>
              <TextBox
                containerStyle={isKisCore && styles.itemOneRow}
                label={isKisCore ? 'Content' : 'Note'}
                type={TEXTBOX_TYPE.TEXT}
                onChange={this.onChangeNote}
                multiline={true}
                numberOfLines={3}
                textInputStyle={
                  !isKisCore ? styles.textInputStyle : [styles.textInputStyle, styles.container, styles.labelText]
                }
                labelSectionStyle={isKisCore ? styles.leftRowContent : styles.noteBox}
              />
            </View>
          )}

          <View style={[styles.button, withdrawIMInfo == null && styles.disabledButton]}>
            <Button onPress={this.openModal} title={t('WITHDRAW')} disabled={withdrawIMInfo == null} />
          </View>
        </ScrollView>
        {isKisCore ? (
          <ModalVerifyOtp
            childrenTop={
              <>
                <RowContent notScaping left="Sending Account" right={'057' + this.props.username} />
                <RowContent notScaping left="Receiving Account" right={this.props.selectedAccount?.accountNumber} />

                <RowContent notScaping left="Full Name" right={accountName} />
                <RowContent notScaping left="Transfer Amount" right={this.state?.amount} />
                <RowContent notScaping left="Transfer Fee" right={5500} />
                <RowContent
                  notScaping
                  left="Content"
                  right={`${t('CONTENT_WITHDRAW')} ${'057' + this.props.username} ${t('to')} 
                  ${accountName}`}
                />
              </>
            }
            notShowAccount
            onSubmit={this.submit}
            isOpenModalVerify={this.state.modalVisible}
            closeModal={() => this.setState({ modalVisible: false })}
          />
        ) : (
          <Modal visible={this.state.modalVisible}>
            <View style={styles.form}>
              <View style={[styles.titleContainer, styles.subContainer, styles.titleContainerBorder]}>
                <UIText allowFontScaling={false} style={styles.title}>
                  {t('Withdraw IM')}
                </UIText>
              </View>
              <View style={[styles.item, styles.itemTwoRow]}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Deposit')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {withdrawIMInfo && formatNumber(withdrawIMInfo.depositAmount as number, 2)}
                  </UIText>
                </View>
              </View>

              <View style={[styles.item, styles.itemTwoRow]}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Transferable Amount')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {withdrawIMInfo && formatNumber(withdrawIMInfo.availableFundForWithdraw as number, 2)}
                  </UIText>
                </View>
              </View>

              <View style={[styles.item, styles.itemTwoRow]}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Source Bank')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {sourceBank && sourceBank.bankAccountNumber
                      ? `${sourceBank.bankAccountNumber} - ${sourceBank.bankAccountName}`
                      : ''}
                  </UIText>
                </View>
              </View>
              <View style={[styles.item, styles.itemTwoRow]}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Target Bank')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {targetBank && targetBank.bankAccountNumber
                      ? `${targetBank.bankAccountNumber} - ${targetBank.bankAccountName}`
                      : ''}
                  </UIText>
                </View>
              </View>

              <View style={[styles.item, styles.itemTwoRow]}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Transfering Amount')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formatNumber(this.state.amount as number, 2)}
                  </UIText>
                </View>
              </View>

              <View style={[styles.item, styles.itemTwoRow]}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Fee')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {withdrawIMFee && formatNumber(withdrawIMFee.feeAmount as number, 2)}
                  </UIText>
                </View>
              </View>

              <View style={[styles.item, styles.itemTwoRow]}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Received Amount')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {withdrawIMFee && formatNumber(withdrawIMFee.receivedAmount as number, 2)}
                  </UIText>
                </View>
              </View>

              <View style={[styles.buttonInModal]}>
                <TouchableOpacity onPress={this.closeModal} style={[styles.confirmCancelButton, styles.cancelButton]}>
                  <UIText allowFontScaling={false} style={styles.buttonText2}>
                    {t('Cancel')}
                  </UIText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.submit}
                  disabled={withdrawIMInfo == null || withdrawIMFee == null}
                  style={[
                    styles.confirmCancelButton,
                    (withdrawIMInfo == null || withdrawIMFee == null) && styles.disabledButton,
                  ]}
                >
                  <UIText allowFontScaling={false} style={styles.buttonText1}>
                    {t('Confirm 2')}
                  </UIText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  sourceBank: state.derivativesWithdrawIMSourceBank,
  targetBank: state.derivativesWithdrawIMTargetBank,
  withdrawIMInfo: state.derivativesWithdrawIMInfo,
  withdrawIMFee: state.derivativesWithdrawIMFee,
  withdrawIMResult: state.derivativesWithdrawIMResult,
  accounts: state.userInfo?.accounts,
  username: state.userInfo?.username,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryWithdrawIMSourceBank,
      queryWithdrawIMTargetBank,
      requestWithdrawIM,
      queryDerivativesWithdrawIMInfo,
      queryDerivativesWithdrawIMFee,
    })(WithdrawMoney)
  ),
  Fallback,
  handleError
);
