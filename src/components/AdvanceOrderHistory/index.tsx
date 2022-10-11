import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { goToBiz } from 'navigations';
import { SYSTEM_TYPE, ORDER_KIND, ORDER_FORM_ACTION_MODE, SELL_BUY_TYPE } from 'global';
import { formatTimeToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryAdvanceOrderHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IAdvanceOrderHistoryProps extends React.ClassAttributes<AdvanceOrderHistory>, WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  advanceOrderHistory: IObject | null;
  orderTrigger: IOrderTrigger | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryAdvanceOrderHistory(params: IObject): void;
}

interface IAdvanceOrderHistoryState {}

class AdvanceOrderHistory extends React.Component<IAdvanceOrderHistoryProps, IAdvanceOrderHistoryState> {
  private configGrid: ISheetDataConfig;
  private refresh = true;

  constructor(props: IAdvanceOrderHistoryProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 3,
      header: [
        {
          label: '',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <TouchableOpacity onPress={() => this.onClickCancel(rowData)}>
              <Feather name="x" style={[globalStyles.alignCenter, styles.iconSize, globalStyles.ORANGE]} />
            </TouchableOpacity>
          ),
        },
        {
          label: config.domain !== 'kis' ? 'Time' : 'Order Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {config.domain !== 'kis'
                ? formatTimeToDisplay(rowData.orderTime as string, 'HH:mm:ss', 'HHmmss')
                : `${formatTimeToDisplay(rowData.orderDate as string, 'dd/MM/yyyy', 'yyyyMMdd')}`}
            </UIText>
          ),
        },
        {
          label: 'Order No',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.orderNumber}
            </UIText>
          ),
        },
        {
          label: 'Stock Code',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.stockCode}
            </UIText>
          ),
        },
        {
          label: 'Sell/Buy',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText
              allowFontScaling={false}
              style={[
                globalStyles.alignCenter,
                styles.data,
                { ...(rowData.sellBuyType === 'SELL' ? globalStyles.down : globalStyles.up) },
              ]}
            >
              {this.props.t(rowData.sellBuyType === SELL_BUY_TYPE.SELL ? 'Sell' : 'Buy')}
            </UIText>
          ),
        },
        {
          label: 'Quantity',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatNumber(rowData.orderQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.orderPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'User',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.username}
            </UIText>
          ),
        },
      ],
    };

    if (config.domain !== 'kis') {
      this.configGrid.header.concat([
        {
          label: 'Status',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.orderStatus as string)}
            </UIText>
          ),
        },
        {
          label: 'Modify/Cancel Quantity',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.modifyCancelQuantity as number)}
            </UIText>
          ),
        },
      ]);
    } else {
      this.configGrid.header.push({
        label: 'Order Type',
        width: 50,
        element: (key: string, rowData: IObject, index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
            {rowData.orderType}
          </UIText>
        ),
      });
    }

    this.state = {};
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IAdvanceOrderHistoryProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    if (
      this.props.orderTrigger !== nextProps.orderTrigger &&
      nextProps.orderTrigger &&
      nextProps.orderTrigger.orderKind === ORDER_KIND.ADVANCE_ORDER
    ) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private onClickCancel = (params: IObject) => {
    const symbolMap = getSymbolMap(store.getState());

    if (symbolMap) {
      const symbolInfo = symbolMap[params.stockCode as string];

      if (symbolInfo) {
        this.props.setCurrentSymbol(symbolInfo);
        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: ORDER_KIND.ADVANCE_ORDER,
            actionMode: ORDER_FORM_ACTION_MODE.CANCEL,
          },
          this.props.componentId,
          undefined,
          'OrderStack2'
        );
      }
    }
  };

  private requestData = (loadMore = false) => {
    const params = {
      loadMore,
      fetchCount: config.fetchCount,
    };
    this.props.queryAdvanceOrderHistory(params);
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
        {refresh === true || this.props.advanceOrderHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.advanceOrderHistory.data as IObject[]}
            nextData={this.props.advanceOrderHistory.nextData as IObject[]}
            loadMore={this.props.advanceOrderHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  advanceOrderHistory: state.equityAdvanceOrderHistory,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryAdvanceOrderHistory, setCurrentSymbol })(AdvanceOrderHistory)),
  Fallback,
  handleError
);
