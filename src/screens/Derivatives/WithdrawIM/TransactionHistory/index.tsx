import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import { DERIVATIVES_TRANSFER_IM_TYPE } from 'global';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount, IAccountInfo } from 'interfaces/common';
import { formatDateToDisplay, formatDateToString, substractMonth } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import config from 'config';
import { queryWithdrawIMTransactionHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ITransactionHistoryProps extends React.ClassAttributes<TransactionHistory>, WithTranslation {
  selectedAccount: IAccount | null;
  transactionHistory: IObject | null;
  withdrawIMResult: { success: boolean } | null;
  accountInfo: IAccountInfo;

  queryWithdrawIMTransactionHistory(params: IObject): void;
}

interface ITransactionHistoryState {
  modalVisible: boolean;
}

class TransactionHistory extends React.Component<ITransactionHistoryProps, ITransactionHistoryState> {
  private refresh = true;
  private configGrid: ISheetDataConfig;
  private fromDate: Date = substractMonth(new Date());
  private toDate: Date = new Date();
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: ITransactionHistoryProps) {
    super(props);

    this.state = {
      modalVisible: false,
    };

    this.configGrid = {
      columnFrozen: 2,
      header: config.usingNewKisCore
        ? [
            {
              label: 'No.',
              width: 50,
              element: (_key: string, _: IObject, index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {index + 1}
                </UIText>
              ),
            },
            {
              label: 'Date',
              width: 90,
              element: (_key: string, rowData: CashDWEnquiry) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatDateToDisplay(rowData.date)}
                </UIText>
              ),
            },
            {
              label: 'Transfer Type',
              width: 70,
              element: (_key: string, rowData: CashDWEnquiry) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {this.props.t(rowData.transferType || '')}
                </UIText>
              ),
            },
            {
              label: 'Beneficiary',
              width: 120,
              element: (_key: string) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {this.props?.accountInfo?.customerProfile?.userName}
                </UIText>
              ),
            },
            {
              label: 'Transfer Amount',
              width: 90,
              element: (_key: string, rowData: CashDWEnquiry) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.transferAmount, 2)}
                </UIText>
              ),
            },
            {
              label: 'Transfer Fee',
              width: 90,
              element: (_key: string, rowData: CashDWEnquiry) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.transferFee)}
                </UIText>
              ),
            },
            {
              label: 'Status',
              width: 90,
              element: (_key: string, rowData: CashDWEnquiry) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {this.props.t(rowData.status || '')}
                </UIText>
              ),
            },
          ]
        : [
            {
              label: 'Transaction Date',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatDateToDisplay(rowData.transactionDate as string)}
                </UIText>
              ),
            },
            {
              label: 'Seq No',
              width: 70,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.sequenceNumber}
                </UIText>
              ),
            },
            {
              label: 'Amount',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.amount as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Accounting Amount',
              width: 100,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.receivedAmount as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Fee',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.feeAmount as number, 2)}
                </UIText>
              ),
            },
            {
              label: 'Cancel Y/N',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.isCancel ? this.props.t('CANCELLED') : ''}
                </UIText>
              ),
            },
            {
              label: 'VTB Status',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.bankStatus}
                </UIText>
              ),
            },
            {
              label: 'BOS Status',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.bosStatus}
                </UIText>
              ),
            },
            {
              label: 'VSD Status',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.vsdStatus}
                </UIText>
              ),
            },
            {
              label: 'Source Bank',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.sourceBank}
                </UIText>
              ),
            },
            {
              label: 'Target Bank',
              width: 90,
              element: (_key: string, rowData: IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.destBank}
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
            },
          ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ITransactionHistoryProps, _nextState: ITransactionHistoryState) {
    if (this.props.selectedAccount !== nextProps.selectedAccount) {
      this.refresh = true;
      this.requestData();
    }

    if (this.props.withdrawIMResult !== nextProps.withdrawIMResult) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private requestData = (loadMore = false) => {
    const params: IObject = {
      fetchCount: config.fetchCount,
      loadMore,
      type: DERIVATIVES_TRANSFER_IM_TYPE.WITHDRAW,
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
    };

    config.usingNewKisCore && (params.transferType = 'VSD_WITHDRAW');

    this.props.queryWithdrawIMTransactionHistory(params);
  };

  private requestLoadMore = () => {
    if (config.usingNewKisCore) {
      return;
    }

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
                  defaultValue={this.fromDate}
                  ref={(ref: DatePickerComp) => (this.fromDateRef = ref)}
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
        {refresh === true || this.props.transactionHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.transactionHistory.data as IObject[]}
            nextData={this.props.transactionHistory.nextData as IObject[]}
            loadMore={this.props.transactionHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  accountInfo: state.accountInfo,
  transactionHistory: state.derivativesWithdrawIMTransactionHistory,
  withdrawIMResult: state.derivativesWithdrawIMResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryWithdrawIMTransactionHistory,
    })(TransactionHistory)
  ),
  Fallback,
  handleError
);
