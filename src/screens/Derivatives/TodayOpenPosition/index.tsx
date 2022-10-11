import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { goToBiz } from 'navigations';
import config from 'config';
import store from 'redux-sagas/store';
import { formatNumber, handleError } from 'utils/common';
import { SYSTEM_TYPE, ORDER_KIND, SELL_BUY_TYPE } from 'global';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import AccountPicker from 'components/AccountPicker';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryTodayOpenPosition } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ITodayOpenPositionProps extends React.ClassAttributes<TodayOpenPosition>, WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  todayOpenPosition: IObject | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryTodayOpenPosition(data: IObject): void;
}

class TodayOpenPosition extends React.Component<ITodayOpenPositionProps> {
  private configGrid: ISheetDataConfig;
  private refresh = true;

  constructor(props: ITodayOpenPositionProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 3,
      header: [
        {
          label: '',
          width: 60,
          element: (key: string, rowData: IObject, index: number) =>
            (rowData.closableQuantity as number) > 0 && (
              <TouchableOpacity onPress={() => this.onClickSell(rowData)}>
                <UIText
                  allowFontScaling={false}
                  style={[globalStyles.alignCenter, styles.data, globalStyles.down, globalStyles.boldText]}
                >
                  {this.props.t('Sell')}
                </UIText>
              </TouchableOpacity>
            ),
        },
        {
          label: 'Code',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.code, styles.data]}>
              {rowData.code}
            </UIText>
          ),
        },
        {
          label: 'Sell/Buy',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.sellBuyType as string)}
            </UIText>
          ),
        },
        {
          label: 'Quantity',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.quantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Prev Quantity',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.previousQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Average Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.averagePrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Current Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.currentPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Unrealized P/L (%)',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.unrealizedPL as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Evaluated Amount',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.evaluationAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Closable Quantity',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.closableQuantity as number)}%
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ITodayOpenPositionProps) {
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

  private onClickSell = (params: IObject) => {
    const symbolMap = getSymbolMap(store.getState());
    if (symbolMap) {
      const symbolInfo = symbolMap[params.code as string];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);

        goToBiz(
          'Order',
          {
            sellBuyType: SELL_BUY_TYPE.SELL,
            orderKind: ORDER_KIND.NORMAL_ORDER,
          },
          this.props.componentId
        );
      }
    }
  };

  private requestData = (loadMore = false) => {
    const params = {
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.queryTodayOpenPosition(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
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
                <AccountPicker type="DERIVATIVES" />
              </View>
            </View>
          </View>
          {refresh === true || this.props.todayOpenPosition == null ? (
            <ActivityIndicator />
          ) : (
            <SheetData
              config={this.configGrid}
              data={this.props.todayOpenPosition.data as IObject[]}
              nextData={this.props.todayOpenPosition.nextData as IObject[]}
              loadMore={this.props.todayOpenPosition.next as boolean}
              requestLoadMore={this.requestLoadMore}
            />
          )}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  todayOpenPosition: state.derivativesTodayOpenPosition,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      setCurrentSymbol,
      queryTodayOpenPosition,
    })(TodayOpenPosition)
  ),
  Fallback,
  handleError
);
