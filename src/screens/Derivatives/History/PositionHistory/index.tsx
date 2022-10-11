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
import { queryPositionHistory } from './actions';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IPositionHistoryProps extends React.ClassAttributes<PositionHistory>, WithTranslation {
  positionHistory: IObject | null;
  selectedAccount: IAccount | null;

  queryPositionHistory(params: IObject): void;
}

class PositionHistory extends React.Component<IPositionHistoryProps> {
  private refresh = true;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private configGrid: ISheetDataConfig;
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: IPositionHistoryProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Date',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.tradingDate as string)}
            </UIText>
          ),
        },
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
          label: 'Buy/Sell',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {this.props.t(rowData.sellBuyType as string)}
            </UIText>
          ),
        },
        {
          label: 'Quantity',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.quantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Match Price',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.matchPrice as number, 2)}
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
          label: 'Unrealized P/L',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.unrealizedPL as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Maturity Date',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.maturityDate as string)}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  componentDidUpdate(prevProps: IPositionHistoryProps, prevState: IPositionHistoryProps) {
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

    this.props.queryPositionHistory(param);
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
        {refresh === true || this.props.positionHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.positionHistory.data as IObject[]}
            nextData={this.props.positionHistory.nextData as IObject[]}
            loadMore={this.props.positionHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  positionHistory: state.derivativesPositionHistory,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryPositionHistory,
    })(PositionHistory)
  ),
  Fallback,
  handleError
);
