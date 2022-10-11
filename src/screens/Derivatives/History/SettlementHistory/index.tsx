import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import config from 'config';
import { formatNumber, handleError } from 'utils/common';
import { formatDateToDisplay, formatDateToString } from 'utils/datetime';
import { querySettlementHistory } from './actions';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ISettlementHistoryProps extends React.ClassAttributes<SettlementHistory>, WithTranslation {
  settlementHistory: IObject | null;
  selectedAccount: IAccount | null;

  querySettlementHistory(params: IObject): void;
}

class SettlementHistory extends React.Component<ISettlementHistoryProps> {
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private configGrid: ISheetDataConfig;
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: ISettlementHistoryProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Trading Date',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.tradingDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Settle Date',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.settleDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Variation Margin (VM)',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.variationMargin as number, 2)}
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
          label: 'Available Cash',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.depositBalance as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Deficit Amount',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.deficitAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'VM Status',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.variationMarginStatus === true ? this.props.t('Paid') : ''}
            </UIText>
          ),
        },
        {
          label: 'Fee Status',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.feeStatus === true ? this.props.t('Paid') : ''}
            </UIText>
          ),
        },
        {
          label: 'Tax Status',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.taxStatus === true ? this.props.t('Paid') : ''}
            </UIText>
          ),
        },
        {
          label: 'Total Fee',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.totalFee as number, 2)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  componentDidUpdate(prevProps: ISettlementHistoryProps, prevState: ISettlementHistoryProps) {
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

    this.props.querySettlementHistory(param);
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
        {refresh === true || this.props.settlementHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.settlementHistory.data as IObject[]}
            nextData={this.props.settlementHistory.nextData as IObject[]}
            loadMore={this.props.settlementHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  settlementHistory: state.derivativesSettlementHistory,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      querySettlementHistory,
    })(SettlementHistory)
  ),
  Fallback,
  handleError
);
