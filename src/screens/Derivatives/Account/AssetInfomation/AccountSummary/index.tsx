import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import RowData from 'components/RowData';
import { IState } from 'redux-sagas/reducers';
import { formatNumber, handleError } from 'utils/common';
import { IAccountSummaryDetail, ICashBalanceState } from '../../reducers';
import styles from './styles';

interface SummaryShow {
  title: string;
  value: string;
  color?: string;
}
interface IAccountSummaryProps extends React.ClassAttributes<AccountSummary> {
  accCashBalance: ICashBalanceState;
}

class AccountSummary extends React.Component<IAccountSummaryProps> {
  constructor(props: IAccountSummaryProps) {
    super(props);
  }
  private renderItem = ({ title, value, color }: SummaryShow) => {
    if (!value) {
      return null;
    }

    if (value === '0') {
      color = '';
    }

    return <RowData label={title} value={value} color={color} />;
  };

  private removeCharactorStr = (char: string, src: string): string | string[] => {
    if (src.includes(char)) {
      return src.split(char);
    } else {
      return src;
    }
  };

  render() {
    let summaryDetail: IAccountSummaryDetail = this.props.accCashBalance?.accountSummary;

    if (!summaryDetail) {
      return <ActivityIndicator />;
    }

    const floating_PL = this.removeCharactorStr('/', summaryDetail.floatingPL_tradingPL);
    const cash = this.removeCharactorStr('/', summaryDetail.cash_nonCash);

    const dataSumaryDetail: SummaryShow[] = [
      { title: 'Net Asset Value', value: formatNumber(summaryDetail.totalEquity) },
      { title: 'Account Balance', value: formatNumber(summaryDetail.accountBalance) },
      { title: 'Commission', value: this.removeCharactorStr('/', summaryDetail.commission_tax)?.[0] },
      { title: 'Tax', value: this.removeCharactorStr('/', summaryDetail.commission_tax)?.[1] },
      { title: 'Total Loans', value: formatNumber(summaryDetail.extLoan) },
      { title: 'Delivery Amount', value: formatNumber(summaryDetail.deliveryAmount) },
      { title: 'Interest', value: formatNumber(summaryDetail.interest) },
      { title: 'Floating P/L', value: floating_PL?.[0], color: Number(floating_PL?.[0]) > 0 ? '#009e0f' : '#d4412e' },
      { title: 'Trading P/L', value: floating_PL?.[1], color: Number(floating_PL?.[0]) > 0 ? '#009e0f' : '#d4412e' },
      {
        title: 'Total P/L',
        value: formatNumber(summaryDetail.totalPL),
        color: summaryDetail.totalPL > 0 ? '#009e0f' : '#d4412e',
      },
      { title: 'Min Reserve', value: formatNumber(summaryDetail.minReserve) },
      { title: 'Marginable', value: formatNumber(summaryDetail.marginable) },
      { title: 'RC Call', value: formatNumber(summaryDetail.rcCall) },
      { title: 'Cash', value: cash?.[0] },
      { title: 'Non-Cash', value: cash?.[1] },
    ];

    return (
      <FlatList
        style={styles.container}
        data={dataSumaryDetail}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={(_item, index) => `item${index}`}
      />
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accCashBalance: state.derivativesAccountCashBalance,
});

export default withErrorBoundary(connect(mapStateToProps, {})(AccountSummary), Fallback, handleError);
