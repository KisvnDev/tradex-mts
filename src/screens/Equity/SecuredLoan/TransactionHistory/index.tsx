import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import config from 'config';
import { formatDateToDisplay, formatDateTimeDisplay } from 'utils/datetime';
import { formatNumber, handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { ISecuredLoanBank } from 'components/SecuredLoanBankPicker/reducers';
import { querySecuredLoanHistory } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ITransactionHistoryTabProps extends React.ClassAttributes<TransactionHistory>, WithTranslation {
  selectedAccount: IAccount | null;
  securedLoanHistory: IObject | null;
  securedLoanBank: ISecuredLoanBank | null;
  securedLoanRegisterResult: { success: boolean } | null;

  querySecuredLoanHistory(params: IObject): void;
}

class TransactionHistory extends React.Component<ITransactionHistoryTabProps> {
  private refresh = true;
  private configGrid: ISheetDataConfig;
  private offset: number = 0;

  constructor(props: ITransactionHistoryTabProps) {
    super(props);

    if (config.usingNewKisCore === false) {
      this.configGrid = {
        columnFrozen: 2,
        header: [
          {
            label: 'Loan Date',
            width: 90,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {formatDateToDisplay(rowData.loanDate as string)}
              </UIText>
            ),
          },
          {
            label: 'Loan Amt',
            width: 70,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.loanAmount as number, 2)}
              </UIText>
            ),
          },
          {
            label: 'Loan Repay Amt',
            width: 70,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.loanRepayAmount as number, 2)}
              </UIText>
            ),
          },
          {
            label: 'Loan Remain Amt',
            width: 70,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.loanRemainAmount as number, 2)}
              </UIText>
            ),
          },
          {
            label: 'Trade Date',
            width: 90,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {formatDateToDisplay(rowData.matchDate as string)}
              </UIText>
            ),
          },
          {
            label: 'Stock',
            width: 70,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {rowData.stockCode}
              </UIText>
            ),
          },
          {
            label: 'Trade Amt',
            width: 100,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.matchAmount as number, 2)}
              </UIText>
            ),
          },
          {
            label: 'Status',
            width: 100,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {rowData.status}
              </UIText>
            ),
          },
          {
            label: 'Loan Bank',
            width: 90,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {rowData.loanBankCode} - {rowData.loanBankName}
              </UIText>
            ),
          },
        ],
      };
    } else {
      this.configGrid = {
        columnFrozen: 2,
        header: [
          {
            label: 'Request Time',
            width: 90,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {formatDateTimeDisplay(rowData.requestTime as string)}
              </UIText>
            ),
          },
          {
            label: 'Required Advance Amount',
            width: 120,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.requireAdvanceAmount as number, 2)}
              </UIText>
            ),
          },
          {
            label: 'Advance Fee',
            width: 70,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.advanceFee as number, 2)}
              </UIText>
            ),
          },
          {
            label: 'Tax',
            width: 40,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.tax as number, 2)}
              </UIText>
            ),
          },
          {
            label: 'Sold Amount in Advanced',
            width: 120,
            element: (key: string, rowData: IObject, index: number) => (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {formatDateToDisplay(rowData.soldAmountInAdvance as string)}
              </UIText>
            ),
          },
        ],
      };
    }
  }

  componentDidMount() {
    this.requestData(this.props.securedLoanBank);
  }

  shouldComponentUpdate(nextProps: ITransactionHistoryTabProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount ||
      this.props.securedLoanBank !== nextProps.securedLoanBank
    ) {
      this.refresh = true;
      this.requestData(nextProps.securedLoanBank);
    }

    if (this.props.securedLoanRegisterResult !== nextProps.securedLoanRegisterResult) {
      this.refresh = true;
      this.requestData(nextProps.securedLoanBank);
    }

    return true;
  }

  private requestData = (securedLoanBank: ISecuredLoanBank | null, loadMore = false, offset?: number) => {
    if (config.usingNewKisCore) {
      let params: IObject = {
        fetchCount: config.fetchCount,
      };

      if (offset) {
        params.offset = offset;
      }

      this.props.querySecuredLoanHistory(params);

      return;
    }
    if (securedLoanBank) {
      const params = {
        loanBankCode: securedLoanBank!.bankCode,
        fetchCount: config.fetchCount,
        loadMore,
      };

      this.props.querySecuredLoanHistory(params);
    }
  };

  private requestLoadMore = () => {
    const data = this.props.securedLoanHistory?.data as IObject[];
    this.offset = this.offset + data?.length ?? 0;

    this.requestData(this.props.securedLoanBank, true, this.offset);
  };

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.securedLoanHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.securedLoanHistory.data as IObject[]}
            nextData={this.props.securedLoanHistory?.nextData as IObject[]}
            loadMore={this.props.securedLoanHistory?.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  securedLoanBank: state.securedLoanBank,
  securedLoanHistory: state.securedLoanHistory,
  securedLoanRegisterResult: state.securedLoanRegisterResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      querySecuredLoanHistory,
    })(TransactionHistory)
  ),
  Fallback,
  handleError
);
