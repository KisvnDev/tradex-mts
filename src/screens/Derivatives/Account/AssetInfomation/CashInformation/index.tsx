import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import RowData from 'components/RowDataCustomer';
import { IState } from 'redux-sagas/reducers';
import { formatNumber, handleError } from 'utils/common';
import { ICashBalanceState, ICashInformation } from '../../reducers';
import styles from './styles';

interface CashInformationDetail {
  title: string;
  value: string | string[];
  isLabel?: boolean;
}
interface ICashInformationProps extends React.ClassAttributes<CashInformation> {
  accCashBalance: ICashBalanceState;
}

class CashInformation extends React.Component<ICashInformationProps> {
  constructor(props: ICashInformationProps) {
    super(props);
  }
  private renderItem = ({ title, value, isLabel }: CashInformationDetail) => {
    if (!value && !isLabel) {
      return null;
    }
    return <RowData label={title} value={value} isLabel={isLabel} />;
  };

  render() {
    const cashInformation: ICashInformation = this.props.accCashBalance?.cashInformation;
    const internal = cashInformation?.internal;
    const exchange = cashInformation?.exchange;

    if (!internal && !exchange) {
      return <ActivityIndicator />;
    }

    const dataSumaryDetail: CashInformationDetail[] = [
      {
        title: '',
        value: ['Internal', 'Exchange'],
        isLabel: true,
      },
      {
        title: 'Cash',
        value: [formatNumber(internal.cash), formatNumber(exchange.cash)],
      },
      {
        title: 'Total Value',
        value: [formatNumber(internal.totalValue), formatNumber(exchange.totalValue)],
      },
      {
        title: 'Cash Withdrawable',
        value: [formatNumber(internal.cashWithdrawable), formatNumber(exchange.cashWithdrawable)],
      },
      { title: 'EE', value: [formatNumber(internal.EE), formatNumber(exchange.EE)] },
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

export default withErrorBoundary(connect(mapStateToProps, {})(CashInformation), Fallback, handleError);
