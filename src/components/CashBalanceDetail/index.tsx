import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { SYSTEM_TYPE } from 'global';
import Fallback from 'components/Fallback';
import RowData from 'components/RowData';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount, IAccountBank } from 'interfaces/common';
import { formatNumber, handleError } from 'utils/common';
import { queryCashBalanceDetail } from './actions';
import styles from './styles';

interface ICashBalanceDetailProps extends React.ClassAttributes<CashBalanceDetail>, WithTranslation {
  selectedAccount: IAccount | null;
  cashBalanceDetail: IObject | null;
  accountBank: IAccountBank | null;

  queryCashBalanceDetail(): void;
}

interface ICashBalanceDetailState {}

class CashBalanceDetail extends React.Component<ICashBalanceDetailProps, ICashBalanceDetailState> {
  private refresh = true;

  constructor(props: ICashBalanceDetailProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    if (this.props.accountBank) {
      this.props.queryCashBalanceDetail();
    }
  }

  shouldComponentUpdate(nextProps: ICashBalanceDetailProps, nextState: ICashBalanceDetailState) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
    }

    if (
      this.props.accountBank !== nextProps.accountBank &&
      nextProps.accountBank &&
      nextProps.accountBank.account &&
      nextProps.selectedAccount &&
      nextProps.accountBank.account.accountNumber === nextProps.selectedAccount.accountNumber &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.props.queryCashBalanceDetail();
    }

    return true;
  }

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    let cashBalanceDetail: IObject = {};
    if (this.props.cashBalanceDetail != null) {
      cashBalanceDetail = this.props.cashBalanceDetail;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.cashBalanceDetail == null ? (
          <ActivityIndicator />
        ) : (
          <ScrollView style={styles.dataContainer}>
            <RowData label="Net Asset Value" value={formatNumber(cashBalanceDetail.netAssetValue as number, 2)} />
            <RowData label="Current Cash" value={formatNumber(cashBalanceDetail.currentCash as number, 2)} />
            <RowData label="Blocked Cash" value={formatNumber(cashBalanceDetail.blockedCash as number, 2)} />
            <RowData label="Unsettled Cash" value={formatNumber(cashBalanceDetail.unsettledCash as number, 2)} />
            <RowData label="Unpaid Dividend" value={formatNumber(cashBalanceDetail.unpaidDividend as number, 2)} />
            <RowData label="Total Asset" value={formatNumber(cashBalanceDetail.totalAsset as number, 2)} />
            <RowData
              label="Current Holding Value"
              value={formatNumber(cashBalanceDetail.currentHoldingValue as number, 2)}
            />
            <RowData
              label="Value Of Unpaid Rights"
              value={formatNumber(cashBalanceDetail.valueOfUnpaidRights as number, 2)}
            />

            <RowData label="Invested Capital" value={formatNumber(cashBalanceDetail.investedCapital as number, 2)} />
            <RowData label="Unrealized Profit/Loss" value={formatNumber(cashBalanceDetail.unrealisedPL as number, 2)} />
            <RowData
              label="Unrealized Profit/Loss %"
              value={formatNumber(cashBalanceDetail.unrealisedPLRate as number, 2)}
            />
            <RowData label="Depository fee" value={formatNumber(cashBalanceDetail.depositoryFee as number, 2)} />
            <RowData label="Margin Loan" value={formatNumber(cashBalanceDetail.marginLoan as number, 2)} />
            <RowData label="Mortgaged Loan" value={formatNumber(cashBalanceDetail.mortgagedLoan as number, 2)} />
            <RowData label="Loan Interest" value={formatNumber(cashBalanceDetail.loanInterest as number, 2)} />
            <RowData
              label="Unsettled Buying Amount"
              value={formatNumber(cashBalanceDetail.unsettledBuyingAmount as number, 2)}
            />
            <RowData label="Total Debt" value={formatNumber(cashBalanceDetail.totalDebt as number, 2)} />
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  cashBalanceDetail: state.equityCashBalanceDetail,
  selectedAccount: state.selectedAccount,
  accountBank: state.accountBank,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryCashBalanceDetail,
    })(CashBalanceDetail)
  ),
  Fallback,
  handleError
);
