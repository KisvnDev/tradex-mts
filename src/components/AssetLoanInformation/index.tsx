import React from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { SYSTEM_TYPE } from 'global';
import Fallback from 'components/Fallback';
import RowData from 'components/RowData';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount, IAccountBank } from 'interfaces/common';
import { formatNumber, handleError } from 'utils/common';
import { queryAssetInfoDetail } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface IAssetLoanDetailProps extends React.ClassAttributes<AssetLoanDetail>, WithTranslation {
  selectedAccount: IAccount | null;
  equityAssetInfoDetail: IObject | null;
  accountBank: IAccountBank | null;
  informationType: 'AssetLoan' | 'Margin';

  queryAssetInfoDetail(params: IObject): void;
}

interface IAssetLoanDetailState {
  refreshing: boolean;
}

class AssetLoanDetail extends React.Component<IAssetLoanDetailProps, IAssetLoanDetailState> {
  private refresh = true;

  constructor(props: IAssetLoanDetailProps) {
    super(props);

    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    if (this.props.accountBank) {
      this.props.queryAssetInfoDetail((this.props.accountBank as unknown) as IObject);
    }
  }

  shouldComponentUpdate(nextProps: IAssetLoanDetailProps, nextState: IAssetLoanDetailState) {
    if (this.props.equityAssetInfoDetail !== nextProps.equityAssetInfoDetail && this.state.refreshing) {
      this.setState({ refreshing: false });
      this.props.queryAssetInfoDetail((nextProps.accountBank as unknown) as IObject);
      return true;
    }

    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.props.queryAssetInfoDetail((nextProps.accountBank as unknown) as IObject);
    }

    if (
      this.props.accountBank !== nextProps.accountBank &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.props.queryAssetInfoDetail((nextProps.accountBank as unknown) as IObject);
    }

    return true;
  }

  componentDidUpdate(prevProps: IAssetLoanDetailProps) {
    if (this.props.equityAssetInfoDetail !== prevProps.equityAssetInfoDetail && this.state.refreshing) {
      this.setState({ refreshing: false });
    }
  }

  private handleRefreshData = () => {
    this.setState({ refreshing: true });
  };

  render() {
    const { t } = this.props;
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    let AssetLoanDetail: IObject = {};
    if (this.props.equityAssetInfoDetail != null) {
      AssetLoanDetail = this.props.equityAssetInfoDetail;
    }

    const listAssetLoanInfo = [
      {
        label: t('Net Asset'),
        value: formatNumber(AssetLoanDetail.netAsset as number, 2),
      },
      {
        label: t('Total Asset'),
        value: formatNumber(AssetLoanDetail.totalAsset as number, 2),
      },
      {
        label: `- ${t('Cash Total')}`,
        value: formatNumber(AssetLoanDetail.totalCash as number, 2),
      },
      {
        label: `- ${t('Available Cash')}`,
        value: formatNumber(AssetLoanDetail.availableCash as number, 2),
      },
      {
        label: `- ${t('Unavailable Cash')}`,
        value: formatNumber(AssetLoanDetail.unavailableCash as number, 2),
      },
      {
        label: `- ${t('Selling wait amount without PIA')}`,
        value: formatNumber(AssetLoanDetail.reuseAmount as number, 2),
      },
      {
        label: `- ${t('Divident')}`,
        value: formatNumber(AssetLoanDetail.divident as number, 2),
      },
      {
        label: t('Stock amount'),
        value: formatNumber(AssetLoanDetail.stockEvaluationAmount as number, 2),
      },
      {
        label: `- ${t('Available stock amount')}`,
        value: formatNumber(AssetLoanDetail.availableStockAmount as number, 2),
      },
      {
        label: `- ${t('Unavailable stock amount')}`,
        value: formatNumber(AssetLoanDetail.unavailableStockAmount as number, 2),
      },
      {
        label: `- ${t('Buying wait amount')}`,
        value: formatNumber(AssetLoanDetail.buyingStockWaitingAmount as number, 2),
      },
      {
        label: `- ${t('Right')}`,
        value: formatNumber(AssetLoanDetail.rights as number, 2),
      },
      {
        label: `- ${t('Waiting Trading')}`,
        value: formatNumber(AssetLoanDetail.pendingStockAmount as number, 2),
      },
      {
        label: t('Total Loan'),
        value: formatNumber(AssetLoanDetail.totalLoanAmount as number, 2),
      },
      {
        label: `- ${t('Margin')}`,
        value: formatNumber(AssetLoanDetail.marginLoan as number, 2),
      },
      {
        label: `- ${t('Mortgage')}`,
        value: formatNumber(AssetLoanDetail.totalLoanMortgage as number, 2),
      },
      {
        label: `- ${t('Buying')}`,
        value: formatNumber(AssetLoanDetail.totalLoanBuying as number, 2),
      },
      {
        label: `- ${t('Expected loan amount')}`,
        value: formatNumber(AssetLoanDetail.totalLoanExpectedAmount as number, 2),
      },
      {
        label: `- ${t('Buy amount not yet settle')}`,
        value: formatNumber(AssetLoanDetail.nonSettledBuyingAmount as number, 2),
      },
      {
        label: `- ${t('Buy amount not yet match')}`,
        value: formatNumber(AssetLoanDetail.unmatchBuyingAmount as number, 2),
      },
      {
        label: `- ${t('Interest')}`,
        value: formatNumber(AssetLoanDetail.interest as number, 2),
      },
      {
        label: `- ${t('Depository fee')}`,
        value: formatNumber(AssetLoanDetail.depositoryFee as number, 2),
      },
    ];

    const listMarginInfo = [
      {
        label: t('Stock amount can use margin'),
        value: formatNumber(AssetLoanDetail.stockAmountCanUseMargin as number, 2),
      },
      {
        label: `- ${t('Available stock quantity')}`,
        value: formatNumber(AssetLoanDetail.marginAvailableStockAmount as number, 2),
      },
      {
        label: `- ${t('Wait quantity for buying settlement')}`,
        value: formatNumber(AssetLoanDetail.marginUnavailableStockAmount as number, 2),
      },
      {
        label: `- ${t('Wait trading')}`,
        value: formatNumber(AssetLoanDetail.marginPendingStockAmount as number, 2),
      },
      {
        label: `- ${t('Wait right')}`,
        value: formatNumber(AssetLoanDetail.marginRights as number, 2),
      },
      {
        label: t('Evaluation amount'),
        value: formatNumber(AssetLoanDetail.evaluationAmount as number, 2),
      },
      {
        label: `- ${t('Available stock quantity')}`,
        value: formatNumber(AssetLoanDetail.evaluationAvailableStockAmount as number, 2),
      },
      {
        label: `- ${t('Wait quantity for buying settlement')}`,
        value: formatNumber(AssetLoanDetail.evaluationUnavailableStockAmount as number, 2),
      },
      {
        label: `- ${t('Wait trading')}`,
        value: formatNumber(AssetLoanDetail.evaluationPendingStockAmount as number, 2),
      },
      {
        label: `- ${t('Wait right')}`,
        value: formatNumber(AssetLoanDetail.evaluationRights as number, 2),
      },
      {
        label: t('Min BP'),
        value: formatNumber(AssetLoanDetail.minBuyingPower as number, 2),
      },
      {
        label: t('Withdrawable amount with in CWR'),
        value: formatNumber(AssetLoanDetail.withdrawableAmount as number, 2),
      },
      {
        label: t('TL/TA of total account'),
        value: formatNumber(AssetLoanDetail.tlTaOfTotalAccount as number, 2),
      },
      {
        label: t('TL/TA of margin list'),
        value: formatNumber(AssetLoanDetail.tlTaOfMarginList as number, 2),
      },
      {
        label: t('CMR'),
        value: formatNumber(AssetLoanDetail.cmr as number, 2),
      },
      {
        label: t('Cash amount to be reached MMR'),
        value: formatNumber(AssetLoanDetail.cashAmountForMMR as number, 2),
      },
      {
        label: t('Stock amount to be reached MMR'),
        value: formatNumber(AssetLoanDetail.stockAmountForMMR as number, 2),
      },
      {
        label: t('Virtual Deposit'),
        value: formatNumber(AssetLoanDetail.virtualDeposit as number, 2),
      },
      {
        label: t('Used Virtual Deposit'),
        value: formatNumber(AssetLoanDetail.usedVirtualDeposit as number, 2),
      },
      {
        label: t('Lack amount for settlement'),
        value: formatNumber(AssetLoanDetail.totalLackingSettledAmount as number, 2),
      },
      {
        label: `- ${t('Lack amount of margin loan')}`,
        value: formatNumber(AssetLoanDetail.lackingMarginAmount as number, 2),
      },
      {
        label: `- ${t('Lack amount of virtual deposit')}`,
        value: formatNumber(AssetLoanDetail.lackingVirtualDepositAmount as number, 2),
      },
      {
        label: `- ${t('Total loan of T-1')}`,
        value: formatNumber(AssetLoanDetail.lackingLoanAmountForT1 as number, 2),
      },
    ];

    let displayList = [];

    if (this.props.informationType === 'AssetLoan') {
      displayList = listAssetLoanInfo;
    } else {
      displayList = listMarginInfo;
    }

    return (
      <View style={styles.container}>
        {refresh === true && this.props.equityAssetInfoDetail !== null ? (
          <ActivityIndicator />
        ) : (
          <ScrollView
            style={styles.dataContainer}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
          >
            {this.props.equityAssetInfoDetail !== null &&
              displayList.map((item, index) => (
                <RowData
                  label={(item as IObject).label as string}
                  value={(item as IObject).value as string}
                  key={index}
                  translateLabel={false}
                />
              ))}
            {this.props.equityAssetInfoDetail === null && !this.state.refreshing && (
              <View style={styles.containerError}>
                <UIText style={styles.labelError}>{this.props.t('Error while fetching data, pull to refresh')}</UIText>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  equityAssetInfoDetail: state.equityAssetInfoDetail,
  selectedAccount: state.selectedAccount,
  accountBank: state.accountBank,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryAssetInfoDetail,
    })(AssetLoanDetail)
  ),
  Fallback,
  handleError
);
