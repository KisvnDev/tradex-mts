import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Fallback from 'components/Fallback';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import config from 'config';
import { formatNumber, handleError } from 'utils/common';
import { formatDateToDisplay, formatDateToString } from 'utils/datetime';
import { queryDailyBalance } from './actions';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IDailyBalanceProps extends React.ClassAttributes<DailyBalance>, WithTranslation {
  dailyBalance: IObject | null;
  selectedAccount: IAccount | null;

  queryDailyBalance(params: IObject): void;
}

class DailyBalance extends React.Component<IDailyBalanceProps> {
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private configGrid: ISheetDataConfig;
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: IDailyBalanceProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Date',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.date as string)}
            </UIText>
          ),
        },
        {
          label: 'Prev Cash Balance',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.previousCashBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Deposit Balance',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.depositBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Withdrawable Cash',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.withdrawableBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Cash Balance',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.cashBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Prev Substitution',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.previousSubstituteBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Deposit Substitution',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.depositSubsituteBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Withdrawable Substitution',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.withdrawableSubstituteBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Substitution',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.substituteBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Margin Requirement',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.marginRequirement as number, 2)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  componentDidUpdate(prevProps: IDailyBalanceProps, prevState: IDailyBalanceProps) {
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

    this.props.queryDailyBalance(param);
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
        {refresh === true || this.props.dailyBalance == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.dailyBalance.data as IObject[]}
            nextData={this.props.dailyBalance.nextData as IObject[]}
            loadMore={this.props.dailyBalance.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  dailyBalance: state.derivativesDailyBalance,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryDailyBalance,
    })(DailyBalance)
  ),
  Fallback,
  handleError
);
