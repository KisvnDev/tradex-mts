import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { formatNumber, handleError } from 'utils/common';
import { SYSTEM_TYPE } from 'global';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { formatDateToDisplay } from 'utils/datetime';
import { queryLoanHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IDetailLoanInformationProps extends React.ClassAttributes<DetailLoanInformation>, WithTranslation {
  selectedAccount: IAccount | null;
  equityLoanDetail: IObject | null;

  queryLoanHistory(data: IObject): void;
}

class DetailLoanInformation extends React.Component<IDetailLoanInformationProps> {
  private configGrid: ISheetDataConfig;
  private refresh = true;

  constructor(props: IDetailLoanInformationProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 1,
      header: [
        {
          label: 'Loan Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.stockCode, styles.data]}>
              {formatDateToDisplay(rowData.loanDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Expire Date',
          width: 50,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatDateToDisplay(rowData.expiredDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Stock',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.stockCode}
            </UIText>
          ),
        },
        {
          label: 'Loan Type',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.loanType}
            </UIText>
          ),
        },
        {
          label: 'Quantity',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.loanQuantity as number)}
            </UIText>
          ),
        },
        {
          label: 'Loan Amount',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.loanAmount as number)}
            </UIText>
          ),
        },
        {
          label: 'Interest',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.loanInterest as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Repay Amount',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.loanRepayAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Remain Amount',
          width: 120,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.loanRemainAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Status',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.status}
            </UIText>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: IDetailLoanInformationProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private requestData = (loadMore = false) => {
    const params = {
      fetchCount: config.fetchCount,
      loadMore,
    };

    this.props.queryLoanHistory(params);
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
        {refresh === true || this.props.equityLoanDetail == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.equityLoanDetail.data as IObject[]}
            nextData={this.props.equityLoanDetail.nextData as IObject[]}
            loadMore={this.props.equityLoanDetail.next as boolean}
            requestLoadMore={this.requestLoadMore}
            onRefreshData={this.handleRefreshData}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  equityLoanDetail: state.equityLoanHistory,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryLoanHistory,
    })(DetailLoanInformation)
  ),
  Fallback,
  handleError
);
