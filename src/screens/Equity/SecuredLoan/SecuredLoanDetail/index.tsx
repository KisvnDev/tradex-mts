import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatDateToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import NumericInput from 'components/NumericInput';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { ISecuredLoanBank } from 'components/SecuredLoanBankPicker/reducers';
import { querySecuredLoanDetail, registerSecuredLoan } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ISecuredLoanDetailProps extends React.ClassAttributes<SecuredLoanDetail>, WithTranslation {
  selectedAccount: IAccount | null;
  securedLoanBank: ISecuredLoanBank | null;
  securedLoanDetail: IObject[];
  formData: IObject | null;

  registerSecuredLoan(payload: IObject): void;

  querySecuredLoanDetail(payload: IObject): void;

  closeModal(): void;
}

interface ISecuredLoanDetailState {
  loanAmount: number;
  errorLoanAmount: boolean;
  errorLoanAmountContent: string;
}

class SecuredLoanDetail extends React.Component<ISecuredLoanDetailProps, ISecuredLoanDetailState> {
  private refresh = true;
  private securedLoanData: IObject | null;
  private configGrid: ISheetDataConfig;

  constructor(props: ISecuredLoanDetailProps) {
    super(props);
    this.state = {
      loanAmount: 0,
      errorLoanAmount: false,
      errorLoanAmountContent: '',
    };

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Trade Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.cellData]}>
              {formatDateToDisplay(rowData.matchDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Settle Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.cellData]}>
              {formatDateToDisplay(rowData.settleDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Stock Code',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.cellData]}>
              {rowData.stockCode}
            </UIText>
          ),
        },
        {
          label: 'Match Amt',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.cellData]}>
              {formatNumber(rowData.matchAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Match Qty',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.cellData]}>
              {formatNumber(rowData.matchQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Trading Fee',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.cellData]}>
              {formatNumber(rowData.tradingFee as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Adjusted Amt',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.cellData]}>
              {formatNumber(rowData.adjustAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Possible Amt',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.cellData]}>
              {formatNumber(rowData.possibleAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Tax',
          width: 30,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.cellData]}>
              {formatNumber(rowData.tax as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Settle Bank',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.cellData]}>
              {rowData.settleBankName}
            </UIText>
          ),
        },
      ],
    };

    this.securedLoanData = this.props.formData;
  }

  componentDidMount() {
    this.requestData(this.securedLoanData, this.props.securedLoanBank);
  }

  shouldComponentUpdate(nextProps: ISecuredLoanDetailProps) {
    if (this.props.formData !== nextProps.formData) {
      this.securedLoanData = nextProps.formData;

      this.refresh = true;
      this.requestData(nextProps.formData, nextProps.securedLoanBank);
    }

    if (this.props.securedLoanBank !== nextProps.securedLoanBank) {
      this.refresh = true;
      this.requestData(nextProps.formData, nextProps.securedLoanBank);
    }

    return true;
  }

  private requestData = (securedLoanData: IObject | null, securedLoanBank: ISecuredLoanBank | null) => {
    if (securedLoanBank && securedLoanData) {
      const data = {
        loanBankCode: securedLoanBank.bankCode,
        bankCode: securedLoanData.settleBankCode,
        matchDate: securedLoanData.matchDate,
        settleDate: securedLoanData.settleDate,
        loanOrderType: securedLoanData.loanOrderType,
      };

      this.props.querySecuredLoanDetail(data);
    }
  };

  private validateLoanAmount = (value: number) => {
    let errorLoanAmountContent = '';
    let errorLoanAmount = false;
    if (!isNaN(value)) {
      if (value <= 0) {
        errorLoanAmountContent = 'Loan amount must be greater than 0';
        errorLoanAmount = true;
      } else if (Number(value) > Number(this.securedLoanData!.possibleAmount)) {
        errorLoanAmountContent = 'Loan amount must be less than possible amount';
        errorLoanAmount = true;
      }
    } else {
      errorLoanAmountContent = 'Loan amount must be number';
      errorLoanAmount = true;
    }
    return { errorLoanAmount, errorLoanAmountContent };
  };

  private onChangeLoanAmount = (data: number) => {
    const { errorLoanAmount, errorLoanAmountContent } = this.validateLoanAmount(data);

    this.setState({
      loanAmount: data,
      errorLoanAmount,
      errorLoanAmountContent,
    });
  };

  private onPressPossibleAmount = () => {
    if (this.securedLoanData) {
      this.setState({
        loanAmount: this.securedLoanData!.possibleAmount as number,
      });
    }
  };

  private submit = () => {
    const { errorLoanAmount, errorLoanAmountContent } = this.validateLoanAmount(this.state.loanAmount);

    if (!errorLoanAmount && this.securedLoanData) {
      const params: IObject = {
        items: [],
      };

      let loanRemainingAmount = this.state.loanAmount;

      this.props.securedLoanDetail.forEach((item: IObject) => {
        if (loanRemainingAmount > 0) {
          let loanAmount = loanRemainingAmount;
          if (Number(loanRemainingAmount) >= (item.possibleAmount as number)) {
            loanAmount = item.possibleAmount as number;
          }

          loanRemainingAmount = Number(loanRemainingAmount) - loanAmount;

          (params.items as IObject[]).push({
            accountNumber: this.props.selectedAccount!.accountNumber,
            subNumber: this.props.selectedAccount!.subNumber,
            loanBankCode: this.props.securedLoanBank!.bankCode,
            settleBankCode: item.settleBankCode,
            matchDate: item.matchDate,
            settleDate: item.settleDate,
            stockCode: item.stockCode,
            matchQuantity: item.matchQuantity,
            matchAmount: item.matchAmount,
            tradingFee: item.tradingFee,
            tax: item.tax,
            adjustAmount: item.adjustAmount,
            possibleAmount: item.possibleAmount,
            loanAmount,
            feeRate: this.securedLoanData!.feeRate,
            loanOrderType: item.loanOrderType,
            contractNumber: this.securedLoanData!.contractNumber,
            totalLoanAmount: this.state.loanAmount,
          });
        }
      });

      this.props.registerSecuredLoan(params);
    }

    this.setState({
      errorLoanAmount,
      errorLoanAmountContent,
    });

    this.props.closeModal();
  };

  render() {
    const { t } = this.props;

    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          <ScrollView style={styles.form}>
            <View style={[styles.titleContainer, styles.subContainer, styles.titleContainerBorder]}>
              <UIText allowFontScaling={false} style={globalStyles.boldText}>
                {t('Register Secure Loan')}
              </UIText>
            </View>
            <View style={styles.item}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.data}>
                <UIText allowFontScaling={false} style={styles.dataText}>
                  {this.props.selectedAccount!.accountNumber} - {this.props.selectedAccount!.subNumber}
                </UIText>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Available Loan Amount')}
                </UIText>
              </View>
              <TouchableOpacity style={styles.data} onPress={this.onPressPossibleAmount}>
                <UIText allowFontScaling={false} style={[styles.dataText, globalStyles.up]}>
                  {formatNumber(this.securedLoanData!.possibleAmount as number, 2)}
                </UIText>
              </TouchableOpacity>
            </View>

            <View style={styles.formItem}>
              <NumericInput
                label={'Loan Amount'}
                error={this.state.errorLoanAmount}
                errorContent={this.state.errorLoanAmountContent}
                value={this.state.loanAmount}
                onChange={this.onChangeLoanAmount}
              />
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        <View style={styles.sheet}>
          {refresh === true || this.props.securedLoanDetail == null ? (
            <ActivityIndicator />
          ) : (
            <SheetData config={this.configGrid} data={this.props.securedLoanDetail} nextData={null} />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.props.closeModal}
            style={[styles.subContainer, styles.button, styles.buttonBorder]}
          >
            <UIText allowFontScaling={false} style={styles.buttonText2}>
              {t('Cancel').toUpperCase()}
            </UIText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.submit}
            style={[
              styles.subContainer,
              styles.button,
              { ...(this.securedLoanData != null && this.state.loanAmount <= 0 && styles.buttonDisabled) },
            ]}
            disabled={this.securedLoanData != null && this.state.loanAmount <= 0}
          >
            <UIText allowFontScaling={false} style={styles.buttonText1}>
              {t('TRANSFER_2')}
            </UIText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  securedLoanBank: state.securedLoanBank,
  securedLoanDetail: state.securedLoanDetail,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      querySecuredLoanDetail,
      registerSecuredLoan,
    })(SecuredLoanDetail)
  ),
  Fallback,
  handleError
);
