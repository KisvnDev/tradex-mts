import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import store from 'redux-sagas/store';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { goToBiz } from 'navigations';
import { SYSTEM_TYPE, ORDER_FORM_ACTION_MODE, ORDER_KIND } from 'global';
import { formatNumber, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { ISymbolInfo } from 'interfaces/market';
import { getSymbolMap } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { setCurrentSymbol } from 'redux-sagas/global-actions';
import { queryOddlotTodayUnmatch } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IOddlotTodayUnmatchProps extends React.ClassAttributes<OddlotTodayUnmatch>, WithTranslation {
  selectedAccount: IAccount | null;
  orderTodayUnmatch: IObject | null;
  componentId: string;
  orderTrigger: IOrderTrigger | null;

  setCurrentSymbol(payload: ISymbolInfo): void;

  queryOddlotTodayUnmatch(params: IObject): void;
}

interface IOddlotTodayUnmatchState {}

class OddlotTodayUnmatch extends React.Component<IOddlotTodayUnmatchProps, IOddlotTodayUnmatchState> {
  private configGrid: ISheetDataConfig;
  private refresh = true;

  constructor(props: IOddlotTodayUnmatchProps) {
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
          label: 'Stock Code',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.stockCode}
            </UIText>
          ),
        },
        {
          label: 'Order No',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.orderNumber}
            </UIText>
          ),
        },
        {
          label: 'Quantity',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatNumber(rowData.quantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.price as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Status',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.status}
            </UIText>
          ),
        },
        {
          label: 'Bank Name',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.bankName}
            </UIText>
          ),
        },
      ],
    };

    this.state = {};
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IOddlotTodayUnmatchProps) {
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
      nextProps.orderTrigger.orderKind === ORDER_KIND.ODDLOT_ORDER
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
        params.availableQuantity = params.sellableQuantity;

        goToBiz(
          'Order',
          {
            formData: params,
            orderKind: ORDER_KIND.ODDLOT_ORDER,
            actionMode: ORDER_FORM_ACTION_MODE.CANCEL,
          },
          this.props.componentId,
          undefined,
          'OrderStack'
        );
      }
    }
  };

  private requestData = (loadMore = false) => {
    const params = {
      loadMore,
      fetchCount: config.fetchCount,
    };

    this.props.queryOddlotTodayUnmatch(params);
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
        {refresh === true || this.props.orderTodayUnmatch == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.orderTodayUnmatch.data as IObject[]}
            nextData={this.props.orderTodayUnmatch.nextData as IObject[]}
            loadMore={this.props.orderTodayUnmatch.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  orderTodayUnmatch: state.equityOddlotTodayUnmatch,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryOddlotTodayUnmatch, setCurrentSymbol })(OddlotTodayUnmatch)),
  Fallback,
  handleError
);
