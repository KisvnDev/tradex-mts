import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UserInactivity from 'components/UserInactivity';
import AccountPicker from 'components/AccountPicker';
import { formatDateToString, formatStringToDate } from 'utils/datetime';
import { queryPositionStatement } from './actions';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import styles from './styles';
import globalStyles from 'styles';
import config from 'config';
import UIText from 'components/UiText';

interface IPositionStatementProps extends React.ClassAttributes<PositionStatement>, WithTranslation {
  selectedAccount: IAccount | null;
  listStockStatementEnquiry: StockStatementEnquiry;

  queryPositionStatement: (payload: any) => void;
}

interface IPositionStatementState {}

class PositionStatement extends React.Component<IPositionStatementProps, IPositionStatementState> {
  private refresh: boolean = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  //Ref
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;
  //UI
  private configGrid: ISheetDataConfig;

  constructor(props: IPositionStatementProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Series ID',
          width: 70,
          element: (key: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.seriesID}
            </UIText>
          ),
        },
        {
          label: 'Date',
          width: 70,
          element: (key: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatDateToString(formatStringToDate(rowData.date as string), 'dd/MM/yyyy')}
            </UIText>
          ),
        },
        {
          label: 'Netoff Long',
          width: 70,
          element: (key: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.netoffLong}
            </UIText>
          ),
        },
        {
          label: 'Netoff Short',
          width: 70,
          element: (key: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.netoffShort}
            </UIText>
          ),
        },
        {
          label: 'Expired Long',
          width: 70,
          element: (key: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.expiredLong}
            </UIText>
          ),
        },
        {
          label: 'Expired Short',
          width: 70,
          element: (_: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
              {rowData.expiredShort}
            </UIText>
          ),
        },
        {
          label: 'Balance Long',
          width: 70,
          element: (key: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.balanceLong}
            </UIText>
          ),
        },
        {
          label: 'Balance Short',
          width: 70,
          element: (_: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
              {rowData.balanceShort}
            </UIText>
          ),
        },
        {
          label: 'Balance Closing Price',
          width: 100,
          element: (key: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.balanceClosingPrice}
            </UIText>
          ),
        },
        {
          label: 'Total P/L',
          width: 70,
          element: (_: string, rowData: StockStatementEnquiryItem) => (
            <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignRight, styles.data]}>
              {rowData.totalPL}
            </UIText>
          ),
        },
      ],
    };
  }
  componentDidMount() {
    this.requestData();
  }
  shouldComponentUpdate(nextProps: IPositionStatementProps) {
    if (this.props.selectedAccount !== nextProps.selectedAccount) {
      this.requestData();
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

    this.refresh = true;
    this.setState({}, () => {
      this.requestData();
    });
  };
  private requestData = () => {
    this.props.queryPositionStatement({
      fromDate: formatDateToString(this.fromDate),
      toDate: formatDateToString(this.toDate),
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
      // this.requestData();
    });
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
          <View style={[styles.inputSection, config.usingNewKisCore && styles.kisInputSession]}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('Account')}
                </UIText>
              </View>
              <View style={styles.accountPicker}>
                <AccountPicker type={'DERIVATIVES'} />
              </View>
            </View>
          </View>
          <View style={[styles.itemSection, styles.bottomMargin]}>
            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('From')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker ref={(ref: DatePickerComp) => (this.fromDateRef = ref)} onChange={this.onChangeDateFrom} />
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
          {/* Body */}
          {refresh === true || this.props.listStockStatementEnquiry == null ? (
            <ActivityIndicator />
          ) : (
            <SheetData
              config={this.configGrid}
              data={(this.props.listStockStatementEnquiry as any) as IObject[]}
              nextData={[]}
            />
          )}
        </View>
      </UserInactivity>
    );
  }
}
const mapStateToProps = (state: IState) => ({
  listStockStatementEnquiry: state.positionStatement,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryPositionStatement,
    })(PositionStatement)
  ),
  Fallback,
  handleError
);
