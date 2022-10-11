import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import RowData from 'components/RowData';
import { IAccount, IObject } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import { formatNumber, handleError } from 'utils/common';
import { queryAccountSummary, queryAccountEquity } from './actions';
import styles from './styles';

interface IAccountSummaryProps extends React.ClassAttributes<AccountSummary> {
  selectedAccount: IAccount | null;
  accountSummary: IObject;
  accountEquity: IObject;

  queryAccountSummary(): void;

  queryAccountEquity(): void;
}

class AccountSummary extends React.Component<IAccountSummaryProps> {
  componentDidMount() {
    this.props.queryAccountSummary();
    this.props.queryAccountEquity();
  }

  componentDidUpdate(prevProps: IAccountSummaryProps, prevState: IAccountSummaryProps) {
    if (this.props.selectedAccount !== prevProps.selectedAccount) {
      this.props.queryAccountSummary();
      this.props.queryAccountEquity();
    }
  }

  render() {
    let accountSummary = this.props.accountSummary;
    let accountEquity = this.props.accountEquity;

    let nav = 0;

    if (accountSummary != null) {
      nav =
        nav +
        (accountSummary.todayCashBalance as number) +
        (accountSummary.CAA as number) +
        (accountSummary.realizedPL as number) +
        (accountSummary.unrealizedPL as number) -
        (accountSummary.fee as number) -
        (accountSummary.tax as number);
    } else {
      accountSummary = {};
    }

    if (this.props.accountEquity != null) {
      nav = nav + (accountEquity.totalCashBalance as number) + (accountEquity.totalStockAmount as number);
    } else {
      accountEquity = {};
    }

    return (
      <ScrollView style={styles.container}>
        <RowData label="Previous Day Deposit" value={formatNumber(accountSummary.previousCashBalance as number, 2)} />
        <RowData label="Today Deposit" value={formatNumber(accountSummary.todayCashBalance as number, 2)} />
        <RowData label="Cash In/Out" value={formatNumber(accountSummary.inOutAmount as number, 2)} />
        <RowData
          label="Req. Cash Amount for Withdraw"
          value={formatNumber(accountSummary.pendingWithdrawalAmount as number, 2)}
        />
        <RowData label="Collateral Asset Amount" value={formatNumber(accountSummary.CAA as number, 2)} />
        <RowData label="Requested CAA Release" value={formatNumber(accountSummary.pendingWithdrawalCAA as number, 2)} />
        <RowData
          label="Asset Collateral Value"
          value={formatNumber(accountSummary.assetCollateralValue as number, 2)}
        />

        <RowData label="Margin Requirement" value={formatNumber(accountSummary.marginRequirement as number, 2)} />
        <RowData label="Margin Req. of SEC" value={formatNumber(accountSummary.secMarginRequirement as number, 2)} />
        <RowData
          label="Margin Req. for unmatched orders"
          value={formatNumber(accountSummary.unmatchedOrderMarginRequirement as number, 2)}
        />
        <RowData label="Margin Utilization" value={formatNumber(accountSummary.marginUtilization as number, 2)} />
        <RowData label="Margin Deficit" value={formatNumber(accountSummary.marginDeficit as number, 2)} />
        <RowData label="Fee" value={formatNumber(accountSummary.fee as number, 2)} />
        <RowData label="NAV" value={formatNumber(nav, 2)} />

        <RowData label="Realized P/L" value={formatNumber(accountSummary.realizedPL as number, 2)} />
        <RowData label="Unrealized P/L" value={formatNumber(accountSummary.unrealizedPL as number, 2)} />
        <RowData label="Assigned Collateral Amount" value={formatNumber(accountSummary.assignedCAA as number, 2)} />
        <RowData
          label="Available Fund for Withdraw"
          value={formatNumber(accountSummary.availableFundForWithdraw as number, 2)}
        />
        <RowData
          label="Available Fund for Order"
          value={formatNumber(accountSummary.availableFundForOrder as number, 2)}
        />
        <RowData
          label="Available CAA for Release"
          value={formatNumber(accountSummary.availableFundForWithdrawCAA as number, 2)}
        />
        <RowData label="Tax" value={formatNumber(accountSummary.tax as number, 2)} />

        <RowData
          label="Available Amount of Cash"
          value={formatNumber(accountEquity.availableCashBalance as number, 2)}
        />
        <RowData label="Total amount of Cash" value={formatNumber(accountEquity.totalCashBalance as number, 2)} />
        <RowData
          label="Available Quantity of Stock"
          value={formatNumber(accountEquity.availableStockQuantity as number)}
        />
        <RowData
          label="Value of available stocks"
          value={formatNumber(accountEquity.availableStockAmount as number, 2)}
        />
        <RowData label="Total quantity of Stock" value={formatNumber(accountEquity.totalStockQuantity as number)} />
        <RowData label="Total value of stocks" value={formatNumber(accountEquity.totalStockAmount as number, 2)} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accountSummary: state.derivativesAccountSummary,
  accountEquity: state.derivativesAccountEquity,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    queryAccountEquity,
    queryAccountSummary,
  })(AccountSummary),
  Fallback,
  handleError
);
