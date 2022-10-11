import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { SYSTEM_TYPE, ORDER_KIND } from 'global';
import { formatDateToDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Picker from 'components/Picker';
import Fallback from 'components/Fallback';
import config from 'config';
import { IState } from 'redux-sagas/reducers';
import { IOrderTrigger } from 'redux-sagas/global-reducers/OrderTrigger-reducers';
import { IAccount, IObject } from 'interfaces/common';
import { queryOddlotOrderHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IOddlotOrderHistoryProps extends React.ClassAttributes<OddlotOrderHistory>, WithTranslation {
  selectedAccount: IAccount | null;
  orderHistory: IObject | null;
  orderTrigger: IOrderTrigger | null;

  queryOddlotOrderHistory(params: IObject): void;
}

interface IOddlotOrderHistoryState {}

class OddlotOrderHistory extends React.Component<IOddlotOrderHistoryProps, IOddlotOrderHistoryState> {
  private configGrid: ISheetDataConfig;
  private refresh = true;
  private matchType: string;

  private matchTypeList = [
    { label: this.props.t('-- Matched/Unmatched --'), value: '' },
    { label: this.props.t('Matched'), value: 'MATCHED' },
    { label: this.props.t('Unmatched'), value: 'UNMATCHED' },
  ];

  constructor(props: IOddlotOrderHistoryProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.orderDate as string)}
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
          label: 'Order No',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.orderNumber}
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
              {this.props.t(rowData.sellBuyType as string)}
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
          label: 'Status',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.status}
            </UIText>
          ),
        },
        {
          label: 'Filled Quantity',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.matchedQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Filled Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.matchedPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Modify/Cancel Type',
          width: 130,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.modifyCancelType as string)}
            </UIText>
          ),
        },
        {
          label: 'Cancel Reason',
          width: 130,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.cancelReason as string)}
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

  shouldComponentUpdate(nextProps: IOddlotOrderHistoryProps) {
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

  private requestData = (loadMore = false) => {
    const params = {
      matchType: this.matchType,
      loadMore,
      fetchCount: config.fetchCount,
    };

    this.props.queryOddlotOrderHistory(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private handleRefreshData = () => {
    this.requestData();
  };

  private onChangeMatchType = (index: number, value: string) => {
    this.matchType = value;
    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputSection}>
          <View style={styles.itemSection}>
            <View style={styles.item}>
              <View style={styles.pickerContainer}>
                <Picker
                  placeholder={{}}
                  list={this.matchTypeList}
                  selectedValue={undefined}
                  onChange={this.onChangeMatchType}
                />
              </View>
            </View>
          </View>
        </View>
        {refresh === true || this.props.orderHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.orderHistory.data as IObject[]}
            nextData={this.props.orderHistory.nextData as IObject[]}
            loadMore={this.props.orderHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  orderHistory: state.equityOddlotOrderHistory,
  selectedAccount: state.selectedAccount,
  orderTrigger: state.orderTrigger,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryOddlotOrderHistory })(OddlotOrderHistory)),
  Fallback,
  handleError
);
