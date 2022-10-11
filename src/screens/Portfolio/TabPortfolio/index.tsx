import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { formatNumber, handleError } from 'utils/common';
import { queryPortfolio, queryClientCashBalance } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import { PortfolioType } from './reducers';
import { SELL_BUY_TYPE, SYSTEM_TYPE } from 'global';
import { goToBiz } from 'navigations';
import UIText from 'components/UiText';

interface IportfolioProps extends React.ClassAttributes<TabPortfolio>, WithTranslation {
  selectedAccount: IAccount | null;
  portfolio: PortfolioType;
  isRealizePortfolio?: boolean;

  queryPortfolio(): void;
  queryClientCashBalance(): void;
}

class TabPortfolio extends React.Component<IportfolioProps> {
  private configGrid: ISheetDataConfig;

  constructor(props: IportfolioProps) {
    super(props);

    this.initSheetData(props.isRealizePortfolio);
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IportfolioProps) {
    if (this.props.selectedAccount !== nextProps.selectedAccount) {
      this.requestData(nextProps);
    }

    return true;
  }

  private initSheetData = (isRealized?: boolean) => {
    this.configGrid = {
      columnFrozen: isRealized ? 1 : 2,
      header: [
        {
          label: 'Series ID',
          width: 70,
          element: (key: string, rowData: PositionList) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.seriesID}
            </UIText>
          ),
        },
        // {
        //   label: 'Expired Date',
        //   width: 90,
        //   element: (key: string, rowData: PositionList & IObject, index: number) => (
        //     <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
        //       {formatDateToDisplay(rowData.)}
        //     </UIText>
        //   ),
        // },
        {
          label: 'Long',
          width: 80,
          element: (key: string, rowData: PositionList & IObject) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.long}
            </UIText>
          ),
        },
        {
          label: 'Short',
          width: 50,
          element: (key: string, rowData: PositionList & IObject) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.short}
            </UIText>
          ),
        },
        {
          label: 'Average Bid',
          width: 70,
          element: (key: string, rowData: PositionList) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.averageBid}
            </UIText>
          ),
        },
        {
          label: 'Average Ask',
          width: 90,
          element: (key: string, rowData: PositionList & IObject) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.averageAsk}
            </UIText>
          ),
        },
        {
          label: isRealized ? 'Floating P/L' : 'Current Price',
          width: 90,
          element: (key: string, rowData: PositionList & IObject) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {isRealized ? rowData.floatingPL : rowData.marketPrice}
            </UIText>
          ),
        },
      ],
    };
    if (!isRealized) {
      this.configGrid.header.push({
        label: 'Floating P/L',
        width: 90,
        element: (key: string, rowData: PositionList & IObject) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
            {rowData.floatingPL}
          </UIText>
        ),
      });
      this.configGrid.header.unshift({
        label: '',
        width: 70,
        element: (_: string, rowData: PositionList & IObject) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              goToBiz('Order', {
                sellBuyType: rowData.short ? SELL_BUY_TYPE.BUY : SELL_BUY_TYPE.SELL,
              });
            }}
          >
            <UIText style={styles.colorButton} allowFontScaling={false}>
              {this.props.t('Change')}
            </UIText>
          </TouchableOpacity>
        ),
      });
    }
  };

  private requestData = (props?: IportfolioProps) => {
    this.props.queryClientCashBalance();
    this.isDerivativesAccount(props) && this.props.queryPortfolio();
  };

  private isDerivativesAccount = (props?: IportfolioProps) =>
    props
      ? props.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES
      : this.props.selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES;

  render() {
    const { t, portfolio, isRealizePortfolio } = this.props;
    const dataSheetPortfolio = isRealizePortfolio
      ? this.props.portfolio.closePositionList
      : this.props.portfolio.openPositionList;
    const { accountRatio, netAssetValue, purchasingPower, profitLoss } = portfolio.info || {};

    return (
      <View style={styles.container}>
        <View style={styles.amount}>
          <View style={styles.label}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Net Asset Value')}
            </UIText>
          </View>
          <View style={styles.data}>
            <UIText allowFontScaling={false} style={styles.dataText}>
              {formatNumber(netAssetValue, 0)}
            </UIText>
          </View>
        </View>
        <View style={styles.amount}>
          <View style={styles.label}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Purchasing Power')}
            </UIText>
          </View>
          <View style={styles.data}>
            <UIText allowFontScaling={false} style={styles.dataText}>
              {formatNumber(purchasingPower, 0)}
            </UIText>
          </View>
        </View>
        <View style={styles.amount}>
          <View style={styles.label}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Profit/Loss')}
            </UIText>
          </View>
          <View style={styles.data}>
            <UIText allowFontScaling={false} style={styles.dataText}>
              {formatNumber(profitLoss, 0)}
            </UIText>
          </View>
        </View>
        <View style={styles.amount}>
          <View style={styles.label}>
            <UIText allowFontScaling={false} style={styles.labelText}>
              {t('Account Ratio')}
            </UIText>
          </View>
          <View style={styles.data}>
            <UIText allowFontScaling={false} style={styles.dataText}>
              {accountRatio}%
            </UIText>
          </View>
        </View>
        {!dataSheetPortfolio ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={dataSheetPortfolio as IObject[]}
            nextData={[]}
            // loadMore={this.props.withdrawTransactionHistory.next as boolean}
            // requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  portfolio: state.Portfolio,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryPortfolio,
      queryClientCashBalance,
    })(TabPortfolio)
  ),
  Fallback,
  handleError
);
