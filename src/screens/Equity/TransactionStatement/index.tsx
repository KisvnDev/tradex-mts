import React from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import { IState } from 'redux-sagas/reducers';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { IAccount, IObject } from 'interfaces/common';
import { handleError, formatNumber } from 'utils/common';
import { formatDateToDisplay, formatDateToString } from 'utils/datetime';
import { queryTransactionStatement } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import moment from 'moment';
import UIText from 'components/UiText';

interface ITransactionStatementProps extends React.ClassAttributes<TransactionStatement>, WithTranslation {
  componentId: string;
  selectedAccount: IAccount | null;
  transactionStatement: IObject | null;

  queryTransactionStatement(payload: IObject): void;
}

interface ITransactionStatementState {}

class TransactionStatement extends React.Component<ITransactionStatementProps, ITransactionStatementState> {
  private refresh = true;
  private configGrid: ISheetDataConfig;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;
  private type: String = 'ALL';
  private isErrorMonth: boolean = false;

  private typeList = [
    { label: 'All', value: 'ALL' },
    { label: 'Receipt payment', value: 'RECEIPT_PAYMENT' },
    { label: 'Warehousing Delivery', value: 'WAREHOUSING_DELIVERY' },
    { label: 'Buy/Sell', value: 'BUY_SELL' },
    { label: 'Loan repayment', value: 'LOAN_REPAYMENT' },
    { label: 'Cash of right', value: 'CASH_OF_RIGHT' },
    { label: 'Stock of right', value: 'STOCK_OF_RIGHT' },
  ];

  constructor(props: ITransactionStatementProps) {
    super(props);
    this.isErrorMonth = false;
    this.configGrid = {
      columnFrozen: 1,
      header: [
        {
          label: 'Trade date',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {`${formatDateToDisplay(rowData.tradingDate as string)}`}
            </UIText>
          ),
        },
        {
          label: 'Trans. Name',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.transactionName as string)}
            </UIText>
          ),
        },
        {
          label: 'Stock 2',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.stockCode as string)}
            </UIText>
          ),
        },
        {
          label: 'Balance 2',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.balanceQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Trading Qty',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.tradingQuantity as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Trading Price',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.tradingPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Trading Amt',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.tradingAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Fee',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.fee as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Loan Interest 2',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.loanInterest as number)}
            </UIText>
          ),
        },
        {
          label: 'Adjusted Amt 2',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.adjustedAmount as number)}
            </UIText>
          ),
        },
        {
          label: 'Prev.Deposit',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.prevDepositAmount as number)}
            </UIText>
          ),
        },
        {
          label: 'Deposit',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.depositAmount as number)}
            </UIText>
          ),
        },
        {
          label: 'Channels',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(`${rowData.channel}`)}
            </UIText>
          ),
        },
        {
          label: 'Remarks',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(`${rowData.remarks}`)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ITransactionStatementProps) {
    if (this.props.selectedAccount !== nextProps.selectedAccount && nextProps.selectedAccount) {
      const params: IObject = {
        accountNumber: nextProps.selectedAccount!.accountNumber,
        subNumber: nextProps.selectedAccount!.subNumber,
        fromDate: formatDateToString(this.fromDate)!,
        toDate: formatDateToString(this.toDate)!,
        TradingTypeEnum: this.type,
      };

      this.refresh = true;
      this.props.queryTransactionStatement(params);
    }
    return true;
  }

  private onChangeDateFrom = (value: Date) => {
    this.fromDate = value;

    if (isAfter(this.fromDate, this.toDate)) {
      this.toDate = this.fromDate;

      if (this.toDateRef) {
        this.toDateRef.setValue(this.toDate);
      }
    }

    let start = moment(this.fromDate);
    let end = moment(this.toDate);
    const countMonth = end.diff(start, 'months') + 1;

    if (countMonth > 10) {
      this.isErrorMonth = true;
      this.setState({});
      return;
    } else {
      this.isErrorMonth = false;
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

    let start = moment(this.fromDate);
    let end = moment(this.toDate);
    const countMonth = end.diff(start, 'months') + 1;

    if (countMonth > 10) {
      this.isErrorMonth = true;
      this.setState({});
      return;
    } else {
      this.isErrorMonth = false;
    }

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

  private requestData = (loadMore = false) => {
    const params: IObject = {
      accountNumber: this.props.selectedAccount!.accountNumber,
      subNumber: this.props.selectedAccount!.subNumber,
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      tradingType: this.type,
      loadMore,
    };
    this.props.queryTransactionStatement(params);
  };

  private onChangeType = (index: number, value: String) => {
    this.type = value;

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };

  renderData = () => {
    if (this.isErrorMonth) {
      return (
        <View>
          <UIText style={styles.txtMonths}>{this.props.t('Data is only queried within 10 months')}</UIText>
        </View>
      );
    }
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    if (refresh === true || this.props.transactionStatement == null) {
      return (
        <View style={styles.sheetData}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.sheetData}>
        <SheetData
          config={this.configGrid}
          data={this.props.transactionStatement.data as IObject[]}
          nextData={this.props.transactionStatement.nextData as IObject[]}
          loadMore={this.props.transactionStatement.next as boolean}
          requestLoadMore={this.requestLoadMore}
        />
      </View>
    );
  };

  render() {
    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.inputSection}>
            <View style={styles.itemSection}>
              <View style={styles.labelPickerContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {this.props.t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker type="EQUITY" />
              </View>
            </View>
            <View style={styles.itemSection}>
              <View style={styles.labelPickerContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {this.props.t('Transaction Type')}
                </UIText>
              </View>
              <View style={styles.pickerContainer}>
                <Picker placeholder={{}} list={this.typeList} selectedValue={undefined} onChange={this.onChangeType} />
              </View>
            </View>
            <View style={styles.itemSection}>
              <View style={styles.item}>
                <View style={styles.labelContainer}>
                  <UIText allowFontScaling={false} style={styles.label}>
                    {'From'}
                  </UIText>
                </View>
                <View style={styles.dataContainer}>
                  <DatePicker
                    ref={(ref: DatePickerComp) => (this.fromDateRef = ref)}
                    onChange={this.onChangeDateFrom}
                  />
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.labelContainer}>
                  <UIText allowFontScaling={false} style={styles.label}>
                    {'To'}
                  </UIText>
                </View>
                <View style={styles.dataContainer}>
                  <DatePicker ref={(ref: DatePickerComp) => (this.toDateRef = ref)} onChange={this.onChangeDateTo} />
                </View>
              </View>
            </View>
          </View>
          {this.renderData()}
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  transactionStatement: state.transactionStatement,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryTransactionStatement })(TransactionStatement)),
  Fallback,
  handleError
);
