import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { formatNumber, handleError } from 'utils/common';
import { SYSTEM_TYPE } from 'global';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { queryStockBalanceDetail } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IStockBalanceDetailProps extends React.ClassAttributes<StockBalanceDetail>, WithTranslation {
  selectedAccount: IAccount | null;
  stockBalanceDetail: IObject | null;

  queryStockBalanceDetail(data: IObject): void;
}

class StockBalanceDetail extends React.Component<IStockBalanceDetailProps> {
  private configGrid: ISheetDataConfig;
  private refresh = true;

  constructor(props: IStockBalanceDetailProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 3,
      header: [
        {
          label: 'Stock Code',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.stockCode, styles.data]}>
              {rowData.stockCode}
            </UIText>
          ),
        },
        {
          label: 'Margin Ratio',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.marginRatio as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Total Balance',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.totalBalance as number)}
            </UIText>
          ),
        },
        {
          label: 'Available Quantity',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.availableQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Mortgaged Quantity',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.mortgageQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Bonus Shares',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.bonusShares as number)}
            </UIText>
          ),
        },
        {
          label: 'Buy Amount',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.buyingAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Subscriptions Quantity',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.subscriptionsQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Registered Subscriptions Quantity',
          width: 120,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.registeredSubscriptionsQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Blockade Quantity',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.blockadeQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Buy T-0',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.tBuyQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Sell T-0',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.tSellQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Buy T-1',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t1BuyQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Sell T-1',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t1SellQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Buy T-2',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t2BuyQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Sell T-2',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.t2SellQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Unmatched Selling Qty',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.unmatchedSellT as number)}
            </UIText>
          ),
        },
        {
          label: 'Average Buying Price',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.avgBuyingPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Market Price',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.marketPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Total Buying Amount',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.totalBuyingAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Total Market Value',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.totalMarketValue as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Cash Dividends',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.cashDividends as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Profit/Loss',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.profitOnLoss as number, 2)}
            </UIText>
          ),
        },
        {
          label: '% Profit/Loss',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.profitOnLossRate as number, 2)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IStockBalanceDetailProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private requestData = (loadMore = false) => {
    const params = {
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.queryStockBalanceDetail(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.stockBalanceDetail == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.stockBalanceDetail.data as IObject[]}
            nextData={this.props.stockBalanceDetail.nextData as IObject[]}
            loadMore={this.props.stockBalanceDetail.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  stockBalanceDetail: state.stockBalanceDetail,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryStockBalanceDetail,
    })(StockBalanceDetail)
  ),
  Fallback,
  handleError
);
