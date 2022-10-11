import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import RowData from 'components/RowData';
import { IAccount, IObject } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import { queryRiskRatio } from './actions';
import styles from './styles';

interface IRiskRatioProps extends React.ClassAttributes<RiskRatio> {
  selectedAccount: IAccount | null;
  riskRatio: IObject;

  queryRiskRatio(): void;
}

class RiskRatio extends React.Component<IRiskRatioProps> {
  componentDidMount() {
    this.props.queryRiskRatio();
  }

  componentDidUpdate(prevProps: IRiskRatioProps, prevState: IRiskRatioProps) {
    if (this.props.selectedAccount !== prevProps.selectedAccount && prevProps.selectedAccount != null) {
      this.props.queryRiskRatio();
    }
  }

  render() {
    const { riskRatio } = this.props;

    if (riskRatio == null) {
      return <ActivityIndicator size="large" />;
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <RowData label="Asset Collateral Value" value={formatNumber(riskRatio.acceptedCollateralValue as number, 2)} />
        <RowData label="Initial Margin (IM)" value={formatNumber(riskRatio.initialMargin as number, 2)} />
        <RowData label="Variation Margin (VM)" value={formatNumber(riskRatio.variationMargin as number, 2)} />
        <RowData label="Spread Margin (SM)" value={formatNumber(riskRatio.spreadMargin as number, 2)} />
        <RowData label="Initial Margin Delivery" value={formatNumber(riskRatio.initialMarginDelivery as number, 2)} />
        <RowData label="Margin Requirement" value={formatNumber(riskRatio.marginRequirement as number, 2)} />
        <RowData label="Margin Utilization" value={formatNumber(riskRatio.marginUtilization as number, 2)} />
        <RowData label="Total Position" value={formatNumber(riskRatio.position as number, 2)} />
        <RowData label="Margin Level" value={riskRatio.marginLevel as string} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  riskRatio: state.derivativesRiskRatio,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    queryRiskRatio,
  })(RiskRatio),
  Fallback,
  handleError
);
