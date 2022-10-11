import React from 'react';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { goToBiz } from 'navigations';
import { SYSTEM_TYPE } from 'global';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import AccountBankPicker from 'components/AccountBankPicker';
import RowData from 'components/RowData';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount, IAccountBank } from 'interfaces/common';
import { formatNumber, handleError } from 'utils/common';
import { queryAccountBalance } from './actions';
import styles from './styles';
import config from 'config';
import Collapse from 'components/Collapse';
import UIText from 'components/UiText';

interface IAccountBalanceProps extends React.ClassAttributes<AccountBalance>, WithTranslation {
  selectedAccount: IAccount | null;
  accountBalance: IObject | null;
  accountBank: IAccountBank | null;

  queryAccountBalance(): void;
}

interface IAccountBalanceState {
  visible: boolean;
}

class AccountBalance extends React.Component<IAccountBalanceProps, IAccountBalanceState> {
  private refresh = true;

  constructor(props: IAccountBalanceProps) {
    super(props);
    Navigation.events().bindComponent(this);

    this.state = {
      visible: false,
    };
  }

  componentDidAppear() {
    this.refresh = true;
    this.setState(
      {
        visible: true,
      },
      () => {
        this.props.queryAccountBalance();
      }
    );
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  shouldComponentUpdate(nextProps: IAccountBalanceProps, nextState: IAccountBalanceState) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY &&
      nextState.visible === true
    ) {
      config.usingNewKisCore && this.props.queryAccountBalance();
      this.refresh = true;
    }

    if (
      this.props.accountBank !== nextProps.accountBank &&
      nextProps.accountBank &&
      nextProps.accountBank.account &&
      nextProps.selectedAccount &&
      nextProps.accountBank.account.accountNumber === nextProps.selectedAccount.accountNumber &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY &&
      nextState.visible === true
    ) {
      this.refresh = true;
      this.props.queryAccountBalance();
    }

    return true;
  }

  private goToWithdrawMoney = () => {
    goToBiz(
      'WithdrawMoney',
      {
        type: SYSTEM_TYPE.EQUITY,
      },
      'AccountBalance',
      'Withdraw Money'
    );
  };
  private renderAccountBalance = () => {
    let accountBalance: IObject = {};
    if (this.props.accountBalance != null) {
      accountBalance = this.props.accountBalance;
    }
    return (
      <>
        <RowData label="Deposit" value={formatNumber(accountBalance.depositAmount as number, 2)} />
        <RowData label="Deposit Block" value={formatNumber(accountBalance.depositBlockAmount as number, 2)} />
        <RowData label="Virtual Deposit" value={formatNumber(accountBalance.virtualDeposit as number, 2)} />
        <TouchableOpacity onPress={this.goToWithdrawMoney}>
          <RowData
            label="Withdrawable Amount"
            showIcon={true}
            value={formatNumber(accountBalance.withdrawableAmount as number, 2)}
          />
        </TouchableOpacity>
        <RowData label="Block Amount From Order" value={formatNumber(accountBalance.orderBlockAmount as number, 2)} />
        <RowData
          label="Waiting Arriving Cash Amount"
          value={formatNumber(accountBalance.waitSellAmount as number, 2)}
        />
        <RowData label="Margin Loan Amount" value={formatNumber(accountBalance.marginLoanAmount as number, 2)} />
        <RowData label="Secured Loan Amount" value={formatNumber(accountBalance.securedLoanAmount as number, 2)} />

        <RowData label="Expired Loan" value={formatNumber(accountBalance.expiredLoanAmount as number, 2)} />
        <RowData label="Stock Evaluation" value={formatNumber(accountBalance.stockEvaluationAmount as number, 2)} />
        <RowData label="Used Virtual Deposit" value={formatNumber(accountBalance.usedVirtualDeposit as number, 2)} />
      </>
    );
  };
  private renderAssetInformation = () => {
    const {
      accountSummary = {},
      buyingPower = {},
      cashInformation = {},
      margin = {},
      marginCallByCash,
      marginCallByStockMainAmount,
    } = this.props.accountBalance as AssetInfoPortfolio;
    const { totalAsset, netAssetValue, totalStockMarketValue } = accountSummary;
    const {
      availableAdvancedCash,
      cashWithdrawal,
      holdForExecutedPurchaseT0,
      holdForPendingPurchaseT0,
      pendingApprovalForWithdrawal,
      soldT0,
      soldT1,
    } = cashInformation;
    const { accuredDebitInterest, dayLoan, equity, fixedLoan, maintenanceRatio, marginRatio, stockMain } = margin;

    return (
      <View style={styles.paddingAssetInfo}>
        <Collapse title={'Account Summary'} maxHeight={200}>
          <RowData label="Total Asset" value={formatNumber(totalAsset, 0)} />
          <RowData label="Total Stock Market Value" value={formatNumber(totalStockMarketValue, 0)} />
          <RowData label="Net Asset Value" value={formatNumber(netAssetValue, 0)} />
          <RowData
            label="Purchasing Power"
            value={formatNumber(typeof buyingPower === 'number' ? buyingPower : buyingPower.purchasingPower, 0)}
          />
        </Collapse>
        <Collapse title={'Cash Information'} maxHeight={310}>
          <RowData
            label="Cash Withdrawal"
            value={formatNumber(cashWithdrawal, 0)}
            valueStyle={styles.textBlue}
            onPressValue={this.goToWithdrawMoney}
          />
          <RowData label="Available Cash In Advance" value={formatNumber(availableAdvancedCash, 0)} />
          <RowData label="Pending Withdrawal Approval" value={formatNumber(pendingApprovalForWithdrawal, 0)} />
          <RowData label="Hold For Pending Purchase" value={formatNumber(holdForPendingPurchaseT0, 0)} />
          <RowData label="Hold For Executed Purchase" value={formatNumber(holdForExecutedPurchaseT0, 0)} />
          <RowData label="Sold T0" value={formatNumber(soldT0, 0)} />
          <RowData label="Sold T1" value={formatNumber(soldT1, 0)} />
        </Collapse>
        {this.props.selectedAccount?.account.includes('M') && (
          <Collapse title={'Margin'} maxHeight={400}>
            <RowData label="Outstanding Loan" value={formatNumber(fixedLoan, 0)} />
            <RowData label="Day Loan" value={formatNumber(dayLoan, 0)} />
            <RowData label="Accrued Debit Interest" value={formatNumber(accuredDebitInterest, 0)} />
            <RowData label="Stock main" value={formatNumber(stockMain, 0)} />
            <RowData label="Equity" value={formatNumber(equity, 0)} />
            <RowData label="Margin ratio (%)" value={`${formatNumber(marginRatio, 2)} %`} />
            <RowData label="Maintenance ratio (%)" value={`${formatNumber(maintenanceRatio, 2)} %`} />
            <RowData label="Margin call by stock main amt" value={formatNumber(marginCallByStockMainAmount, 0)} />
            <RowData label="Margin call by cash" value={formatNumber(marginCallByCash, 0)} />
          </Collapse>
        )}
      </View>
    );
  };

  render() {
    const { t } = this.props;

    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.inputSection}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker type="EQUITY" />
              </View>
              {!config.usingNewKisCore && (
                <View style={styles.accountBankPicker}>
                  <AccountBankPicker />
                </View>
              )}
            </View>
          </View>

          {refresh === true || this.props.accountBalance == null || this.state.visible !== true ? (
            <ActivityIndicator />
          ) : (
            <ScrollView style={styles.dataContainer}>
              {config.usingNewKisCore ? this.renderAssetInformation() : this.renderAccountBalance()}
            </ScrollView>
          )}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accountBalance: state.equityAccountBalance,
  selectedAccount: state.selectedAccount,
  accountBank: state.accountBank,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryAccountBalance,
    })(AccountBalance)
  ),
  Fallback,
  handleError
);
