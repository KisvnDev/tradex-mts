import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import RowData from 'components/RowDataCustomer';
import { IState } from 'redux-sagas/reducers';
import { formatNumber, handleError } from 'utils/common';
import { ICashBalanceState, IPortfolioAssessment } from '../../reducers';
import styles from './styles';

interface PortfolioAssessmenDetail {
  title: string;
  value: string | string[];
  isLabel?: boolean;
}
interface IPortfolioAssessmentProps extends React.ClassAttributes<PortfolioAssessment>, WithTranslation {
  accCashBalance: ICashBalanceState;
}

class PortfolioAssessment extends React.Component<IPortfolioAssessmentProps> {
  constructor(props: IPortfolioAssessmentProps) {
    super(props);
  }
  private renderItem = ({ title, value, isLabel }: PortfolioAssessmenDetail) => {
    if (!value && !isLabel) {
      return null;
    }
    return <RowData label={title} value={value} isLabel={isLabel} />;
  };

  render() {
    const portfolioAssessment: IPortfolioAssessment = this.props.accCashBalance?.portfolioAssessment;
    const internal = portfolioAssessment?.internal;
    const exchange = portfolioAssessment?.exchange;

    if (!internal && !exchange) {
      return <ActivityIndicator />;
    }

    const dataSummaryDetail: PortfolioAssessmenDetail[] = [
      {
        title: '',
        value: [this.props.t('Internal'), this.props.t('Exchange')],
        isLabel: true,
      },
      {
        title: 'Initial Margin',
        value: formatNumber(internal.initialMargin),
      },
      {
        title: 'Spread Margin',
        value: [formatNumber(internal.spreadMargin), formatNumber(exchange.spreadMargin)],
      },
      {
        title: 'Delivery Margin',
        value: [formatNumber(internal.deliveryMargin), formatNumber(exchange.deliveryMargin)],
      },
      { title: 'Margin Req', value: [formatNumber(internal.marginReq), formatNumber(exchange.marginReq)] },
      { title: 'Account Ratio', value: [formatNumber(internal.accountRatio), formatNumber(exchange.accountRatio)] },
      { title: 'Warning 1/2/3', value: [internal.warning123, exchange.warning123] },
      { title: 'Margin Call', value: [formatNumber(internal.marginCall), formatNumber(exchange.marginCall)] },
    ];

    return (
      <FlatList
        style={styles.container}
        data={dataSummaryDetail}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={(_item, index) => `item${index}`}
      />
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accCashBalance: state.derivativesAccountCashBalance,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, {})(PortfolioAssessment)),
  Fallback,
  handleError
);
