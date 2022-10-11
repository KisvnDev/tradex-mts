import React from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import RowData from 'components/RowData';
import config from 'config';
import { formatNumber, handleError } from 'utils/common';
import { formatDateToString } from 'utils/datetime';
import { queryDailyProfitLoss } from './actions';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IDailyProfitLossProps extends React.ClassAttributes<DailyProfitLoss>, WithTranslation {
  dailyProfitLoss: IObject | null;
  selectedAccount: IAccount | null;

  queryDailyProfitLoss(params: IObject): void;
}

class DailyProfitLoss extends React.Component<IDailyProfitLossProps> {
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private configGrid: ISheetDataConfig;
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: IDailyProfitLossProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Code',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.code}
            </UIText>
          ),
        },
        {
          label: 'Last Price',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.lastPrice as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Closed Long',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.closedLongQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Closed Short',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.closedShortQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Realized P/L',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.realizedPL as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Fee',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.fee as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Tax',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.tax as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Long Position',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.longQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Short Position',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.shortQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Unrealized P/L',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.unrealizedPL as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Net P/L',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.netProfitLoss as number, 2)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  componentDidUpdate(prevProps: IDailyProfitLossProps, prevState: IDailyProfitLossProps) {
    if (this.props.selectedAccount !== prevProps.selectedAccount) {
      this.refresh = true;
      this.setState({}, () => this.requestData(false));
    }
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

  private requestData = (loadMore = false) => {
    const param = {
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.queryDailyProfitLoss(param);
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

    let summaryData: IObject = {};

    if (this.props.dailyProfitLoss != null && this.props.dailyProfitLoss.summary != null) {
      summaryData = this.props.dailyProfitLoss.summary as IObject;
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
        </View>

        {refresh === true || this.props.dailyProfitLoss == null ? (
          <ActivityIndicator />
        ) : (
          <View>
            <View style={styles.summaryContainer}>
              <ScrollView contentContainerStyle={styles.summary}>
                <RowData label="Realized P/L" value={formatNumber(summaryData.realizedPL as number, 2)} />
                <RowData label="Unrealized P/L" value={formatNumber(summaryData.unrealizedPL as number, 2)} />
                <RowData label="Net Profit/Loss" value={formatNumber(summaryData.netProfitLoss as number, 2)} />
                <RowData label="Fee" value={formatNumber(summaryData.fee as number, 2)} />
                <RowData label="Tax" value={formatNumber(summaryData.tax as number, 2)} />
                <RowData label="Long" value={formatNumber(summaryData.longQuantity as number)} />
                <RowData label="Closed Long" value={formatNumber(summaryData.closedLongQuantity as number)} />
                <RowData label="Short" value={formatNumber(summaryData.shortQuantity as number)} />
                <RowData label="Closed Short" value={formatNumber(summaryData.closedShortQuantity as number)} />
              </ScrollView>
            </View>
          </View>
        )}
        {refresh !== true && this.props.dailyProfitLoss != null && (
          <SheetData
            config={this.configGrid}
            data={this.props.dailyProfitLoss.data == null ? [] : (this.props.dailyProfitLoss.data as IObject[])}
            nextData={
              this.props.dailyProfitLoss.nextData == null ? [] : (this.props.dailyProfitLoss.nextData as IObject[])
            }
            loadMore={this.props.dailyProfitLoss.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  dailyProfitLoss: state.derivativesDailyProfitLoss,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryDailyProfitLoss,
    })(DailyProfitLoss)
  ),
  Fallback,
  handleError
);
