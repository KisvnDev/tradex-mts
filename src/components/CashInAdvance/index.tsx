import React from 'react';
import { View, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import Button from 'components/Button';
import { ShowErrorTooltip } from 'components/ErrorTooltip';
import { IState } from 'redux-sagas/reducers';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CalculateInterest, ICashInAdvance } from './reducers';
import RowContent from 'components/RowContent';
import ModalVerifyOtp from 'components/ModalVerifyOtp';
import {
  queryCashInAdvances,
  submitAdvancePaymentCreation,
  IParamsSubmits,
  checkTime,
  queryCalculateInterest,
} from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface ICashAdvanceProps extends React.ClassAttributes<CashAdvance>, WithTranslation {
  cashInAdvance: ICashInAdvance;
  accountNumber: String;
  checkTimeSubmitAdvance: { result: boolean };
  submitCashInAdvance: { isSuccess: boolean };
  calculateInterest: CalculateInterest | null;

  queryCalculateInterest(mvAmount?: string, mvSettlement?: string): void;
  queryCashInAdvances(): void;
  submitAdvancePaymentCreation(payload: IParamsSubmits): void;
  checkTime(): void;
}

interface ICashAdvanceState {
  error: boolean;
  errorContent: string;
  isOpenModalVerify: boolean;
  loading: boolean;
}

class CashAdvance extends React.Component<ICashAdvanceProps, ICashAdvanceState> {
  private value: string = '';
  private inputRef?: any;

  constructor(props: ICashAdvanceProps) {
    super(props);

    this.state = {
      error: false,
      errorContent: '',
      isOpenModalVerify: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.props.queryCashInAdvances();
  }

  componentDidUpdate(prevProps: ICashAdvanceProps, prevState: ICashAdvanceState) {
    if (this.props.accountNumber !== prevProps.accountNumber) {
      this.props.queryCashInAdvances();
    }

    if (
      this.props.checkTimeSubmitAdvance !== prevProps?.checkTimeSubmitAdvance &&
      this.props.checkTimeSubmitAdvance.result
    ) {
      this.setState({ isOpenModalVerify: true });
    }

    if (this.props.submitCashInAdvance !== prevProps?.submitCashInAdvance) {
      this.setState({ loading: false }, () => {
        this.handleCloseModal();
      });
    }

    if (this.state.error !== prevState.error && this.state.error) {
      setTimeout(() => {
        this.setState({ error: false });
      }, 5000);
    }
  }

  private handleResetInput = () => {
    this.value = '';
    this.inputRef?.clear();
    this.state.error &&
      this.setState({
        error: false,
        errorContent: '',
      });
  };

  private handleSubmit = (fee: number, maxFee: number) => {
    if (fee && maxFee < fee) {
      !this.state.error &&
        this.setState({
          error: true,
          errorContent: this.props.t('Oversized fee'),
        });
    }
    if ((this.value && this.value === '0') || !this.value || !this.props.cashInAdvance) {
      !this.state.error &&
        this.setState({
          error: true,
          errorContent: this.props.t('Required Advance Amount must be greater than 0'),
        });
    } else {
      this.props.checkTime();
    }
  };

  private handleApplySubmit = () => {
    this.setState({ loading: true });

    let payload: IParamsSubmits = {
      accountNo: this.props.accountNumber,
      submitAmount: Number(this.value),
      availableAmount: this.props.cashInAdvance.availableCashAdvance,
    };

    if (global.isIicaAccount) {
      payload = { ...payload, item: this.props.cashInAdvance?.item };
    }

    this.props.submitAdvancePaymentCreation(payload);
  };

  private getSettlement = () => {
    const { cashInAdvance } = this.props;
    let mvSettlement: string = '3';
    let isSet: boolean = false;

    if (
      (cashInAdvance.t0AdvAvailable && cashInAdvance.t1AdvAvailable && cashInAdvance.t2AdvAvailable) ||
      (cashInAdvance.t0AdvAvailable && cashInAdvance.t2AdvAvailable) ||
      (cashInAdvance.t1AdvAvailable && cashInAdvance.t2AdvAvailable) ||
      (cashInAdvance.t0AdvAvailable && cashInAdvance.t1AdvAvailable)
    ) {
      isSet = true;
    }

    if (cashInAdvance.t0AdvAvailable && !isSet) {
      mvSettlement = '3';
      isSet = true;
    }

    if (cashInAdvance.t1AdvAvailable && !isSet) {
      mvSettlement = '2';
      isSet = true;
    }

    if (cashInAdvance.t2AdvAvailable && !isSet) {
      mvSettlement = '1';
      isSet = true;
    }

    return mvSettlement;
  };

  private handleChangeText = (text: string) => {
    const { error } = this.state;

    if (error) {
      this.setState({ error: false });
    }

    const { cashInAdvance } = this.props;
    this.value = text;
    const availableValue = cashInAdvance?.availableCashAdvance;

    this.props.queryCalculateInterest(text || String(0), this.getSettlement());

    if (availableValue && availableValue > 0 && Number(text) > availableValue) {
      this.value = `${availableValue}`;
      this.inputRef?.setNativeProps?.({ text: `${availableValue}`, mvSettlement: this.getSettlement() });
    }
  };

  private handleSetAdvanceValue = () => {
    const { cashInAdvance } = this.props;
    const availableValue = cashInAdvance?.availableCashAdvance;

    if (availableValue && availableValue > 0) {
      this.props.queryCalculateInterest(String(availableValue) || String(0), this.getSettlement());

      this.value = `${availableValue}`;
      this.inputRef?.setNativeProps?.({ text: `${availableValue}` });
    }
  };

  private handleCloseModal = () => {
    this.setState({ isOpenModalVerify: false });

    if (this.props.submitCashInAdvance?.isSuccess) {
      this.handleResetInput();
      this.props.queryCashInAdvances();
    }
  };

  private readonly renderModalContent = (fee: number, tax: number) => {
    return (
      <View>
        {this.state.loading && <ActivityIndicator />}
        <RowContent notScaping left={'Required Amount'} right={this.value} />
        <RowContent notScaping left={'Fee'} right={formatNumber(fee as number, 2)} />
      </View>
    );
  };

  render() {
    const { t, cashInAdvance } = this.props;

    if (!cashInAdvance) {
      return <ActivityIndicator />;
    }

    let { maxFee, availableCashAdvance: availableValue, interestRate: tax } = cashInAdvance;
    let fee = 0;

    const calculateInterest = this.props.calculateInterest;
    if (calculateInterest?.mvInterestAmt) {
      fee = Number(Number(calculateInterest?.mvInterestAmt).toFixed(1));
    }

    return (
      <View style={styles.container}>
        <View style={styles.containerContent}>
          <TouchableOpacity style={styles.row} onPress={this.handleSetAdvanceValue}>
            <UIText style={styles.label}>{t('Available Cash In Advance')}</UIText>
            {availableValue == null ? (
              <ActivityIndicator />
            ) : (
              <UIText style={styles.textBold}>{formatNumber(availableValue as number, 0)}</UIText>
            )}
          </TouchableOpacity>
          <View style={[styles.row, this.state.error && styles.wrapperTextInput, styles.spaceLine]}>
            <UIText style={styles.label}>{t('Required Advance Amount')}</UIText>
            <View style={styles.errorStyle}>
              <ShowErrorTooltip error={this.state.error} errorContent={this.state.errorContent} />
            </View>
            <View style={styles.textInput}>
              <TextInput
                ref={(ref) => (this.inputRef = ref)}
                style={styles.textInutStyle}
                keyboardType={'numeric'}
                onChangeText={this.handleChangeText}
                placeholder={'0'}
                editable={availableValue ? availableValue > 0 : false}
              />
            </View>
          </View>
          <View style={[styles.row, styles.feeStyle]}>
            <UIText style={styles.label}>{t('Fee')}</UIText>
            {maxFee == null ? (
              <ActivityIndicator />
            ) : (
              <UIText style={styles.nomalText}>{formatNumber(fee as number, 2)}</UIText>
            )}
          </View>
          <View style={[styles.row, styles.feeStyle]}>
            <UIText style={styles.label}>{t('Note')}</UIText>
            <UIText style={styles.nomalText}>{t('NOTE_MINIMUM_ADVANCE_FEE')}</UIText>
          </View>
        </View>
        <View style={[styles.row, styles.containerButton]}>
          <Button
            buttonStyle={styles.leftBtnStyle}
            title={t('Reset')}
            textStyle={styles.btnLeftTextStyle}
            onPress={this.handleResetInput}
          />
          <Button
            buttonStyle={styles.rightBtnStyle}
            title={t('Apply')}
            onPress={() => this.handleSubmit(fee, maxFee)}
          />
        </View>
        <ModalVerifyOtp
          isOpenModalVerify={this.state.isOpenModalVerify}
          closeModal={this.handleCloseModal}
          onSubmit={this.handleApplySubmit}
          childrenTop={this.renderModalContent(fee, tax)}
          titleModal={t('Cash In Advanced')}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  cashInAdvance: state.cashInAdvance,
  accountNumber: state.selectedAccount!.accountNumber,
  checkTimeSubmitAdvance: state.checkTimeSubmitAdvance,
  submitCashInAdvance: state.submitCashInAdvance,
  calculateInterest: state.calculateInterest,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryCashInAdvances,
      submitAdvancePaymentCreation,
      checkTime,
      queryCalculateInterest,
    })(CashAdvance)
  ),
  Fallback,
  handleError
);
