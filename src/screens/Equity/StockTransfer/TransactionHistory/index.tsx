import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import config from 'config';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataColumn, ISheetDataConfig } from 'components/SheetData';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { formatDateTimeDisplay, formatDateToDisplay, formatDateToString, substractMonth } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import { queryStockTransferHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ITransactionHistoryTabProps extends React.ClassAttributes<TransactionHistory>, WithTranslation {
  selectedAccount: IAccount | null;
  stockTransferHistory: IObject | null;
  stockTransferResult: { success: boolean } | null;

  queryStockTransferHistory(params: IObject): void;
}

class TransactionHistory extends React.Component<ITransactionHistoryTabProps> {
  private refresh = true;
  private configGrid: ISheetDataConfig;
  private fromDate: Date = substractMonth(new Date());
  private toDate: Date = new Date();
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: ITransactionHistoryTabProps) {
    super(props);

    this.configGrid = {
      columnFrozen: config.usingNewKisCore ? 1 : 2,
      header: this.getHeader(),
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ITransactionHistoryTabProps) {
    if (this.props.selectedAccount !== nextProps.selectedAccount) {
      this.refresh = true;
      this.requestData();
    }

    if (this.props.stockTransferResult !== nextProps.stockTransferResult) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private getHeader = () => {
    const isKisCore = config.usingNewKisCore;
    const headers: ISheetDataColumn[] = [];
    headers.push({
      label: 'Process Date',
      width: 90,
      element: (_key: string, rowData: IObject, _index: number) => (
        <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
          {isKisCore
            ? formatDateTimeDisplay(rowData.requestTime as string)
            : formatDateToDisplay(rowData.transactionDate as string)}
        </UIText>
      ),
    });
    !isKisCore &&
      headers.push({
        label: 'Seq No',
        width: 70,
        element: (_key: string, rowData: IObject, _index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
            {rowData.sequenceNumber}
          </UIText>
        ),
      });
    headers.push(
      {
        label: 'Received Account',
        width: 120,
        element: (_key: string, rowData: IObject, _index: number) => {
          return (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {`${rowData.remark}`}
            </UIText>
          );
        },
      },
      {
        label: 'Stock',
        width: 70,
        element: (_key: string, rowData: IObject, _index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
            {isKisCore ? rowData.symbol : rowData.stockCode}
          </UIText>
        ),
      }
    );
    isKisCore &&
      headers.push({
        label: 'Stock Type',
        width: 90,
        element: (_key: string, rowData: IObject, _index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
            {this.props.t(rowData.stockType as string)}
          </UIText>
        ),
      });
    headers.push({
      label: 'Quantity',
      width: 100,
      element: (_key: string, rowData: IObject, _index: number) => (
        <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
          {formatNumber((isKisCore ? rowData.volume : rowData.quantity) as number)}
        </UIText>
      ),
    });
    isKisCore
      ? headers.push({
          label: 'Status',
          width: 100,
          element: (_key: string, rowData: IObject, _index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {this.props.t(rowData.status as string)}
            </UIText>
          ),
        })
      : headers.push(
          {
            label: 'Limit Quantity',
            width: 100,
            element: (_key: string, rowData: IObject, _index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.limitQuantity as number)}
              </UIText>
            ),
          },
          {
            label: 'Note',
            width: 90,
            element: (_key: string, rowData: IObject, _index: number) => (
              <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignCenter, styles.data]}>
                {rowData.note}
              </UIText>
            ),
          }
        );
    return headers;
  };

  private requestData = (loadMore = false) => {
    const params = {
      fetchCount: config.fetchCount,
      loadMore,
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
    };

    this.props.queryStockTransferHistory(params);
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private onChangeDateFrom = (value: Date) => {
    this.fromDate = value;

    if (isAfter(this.fromDate, this.toDate)) {
      this.toDate = this.fromDate;

      if (this.toDateRef) {
        this.toDateRef.setValue(this.toDate);
      }
    }

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private onChangeDateTo = (value: Date) => {
    this.toDate = value;

    if (isAfter(this.fromDate, this.toDate)) {
      this.fromDate = this.toDate;

      if (this.fromDateRef) {
        this.fromDateRef.setValue(this.fromDate);
      }
    }

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  render() {
    const { t } = this.props;
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputSection}>
          <View style={styles.itemSection}>
            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('From')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker
                  ref={(ref: DatePickerComp) => (this.fromDateRef = ref)}
                  defaultValue={this.fromDate}
                  onChange={this.onChangeDateFrom}
                />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('To')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker ref={(ref: DatePickerComp) => (this.toDateRef = ref)} onChange={this.onChangeDateTo} />
              </View>
            </View>
          </View>
        </View>

        {refresh === true || this.props.stockTransferHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.stockTransferHistory.data as IObject[]}
            nextData={this.props.stockTransferHistory.nextData as IObject[]}
            loadMore={this.props.stockTransferHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  stockTransferHistory: state.stockTransferHistory,
  stockTransferResult: state.stockTransferResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryStockTransferHistory,
    })(TransactionHistory)
  ),
  Fallback,
  handleError
);
