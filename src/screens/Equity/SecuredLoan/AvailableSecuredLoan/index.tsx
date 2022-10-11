import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { formatDateToDisplay } from 'utils/datetime';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import SecuredLoanDetail from '../SecuredLoanDetail';
import config from 'config';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { ISecuredLoanBank } from 'components/SecuredLoanBankPicker/reducers';
import { queryAvailableSecuredLoan } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IAvailableSecuredLoanProps extends React.ClassAttributes<AvailableSecuredLoan>, WithTranslation {
  selectedAccount: IAccount | null;
  securedLoanAvailable: IObject | null;
  securedLoanBank: ISecuredLoanBank | null;
  securedLoanRegisterResult: { success: boolean } | null;

  queryAvailableSecuredLoan(payload: IObject): void;
}

interface IAvailableSecuredLoanState {
  modalVisible: boolean;
}

class AvailableSecuredLoan extends React.Component<IAvailableSecuredLoanProps, IAvailableSecuredLoanState> {
  private securedLoanData: IObject | null = null;
  private refresh = true;
  private configGrid: ISheetDataConfig;

  constructor(props: IAvailableSecuredLoanProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Trade Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <TouchableOpacity onPress={() => this.onClickShowDetail(rowData)}>
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.date, styles.data]}>
                {formatDateToDisplay(rowData.matchDate as string)}
              </UIText>
            </TouchableOpacity>
          ),
        },
        {
          label: 'Settle Date',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.settleDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Trade Amt',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.matchAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Available Loan Amt',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.possibleAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Adjusted Amt',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.adjustAmount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Loan Period',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.loanPeriod as number)}
            </UIText>
          ),
        },
        {
          label: 'Fee',
          width: 30,
          element: (key: string, rowData: IObject, index: number) => {
            return (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.estimatedFee as number, 2)}
              </UIText>
            );
          },
        },
        {
          label: 'Tax',
          width: 30,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.tax as number, 2)}
            </UIText>
          ),
        },
      ],
    };

    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      this.requestData(this.props.securedLoanBank);
    }
  }

  shouldComponentUpdate(nextProps: IAvailableSecuredLoanProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY
    ) {
      this.refresh = true;
      this.requestData(nextProps.securedLoanBank);
    }

    if (this.props.securedLoanBank !== nextProps.securedLoanBank) {
      this.refresh = true;
      this.requestData(nextProps.securedLoanBank);
    }

    if (this.props.securedLoanRegisterResult !== nextProps.securedLoanRegisterResult) {
      this.refresh = true;
      this.requestData(nextProps.securedLoanBank);
    }

    return true;
  }

  private onClickShowDetail = (params: IObject) => {
    this.securedLoanData = params;
    this.setState({ modalVisible: true });
  };

  private requestData = (securedLoanBank: ISecuredLoanBank | null, loadMore = false) => {
    if (securedLoanBank) {
      const params = {
        fetchCount: config.fetchCount,
        loadMore,
        loanBankCode: securedLoanBank!.bankCode,
      };

      this.props.queryAvailableSecuredLoan(params);
    }
  };

  private requestLoadMore = () => {
    this.requestData(this.props.securedLoanBank, true);
  };

  private closeModal = () => {
    this.securedLoanData = null;
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        {refresh === true || this.props.securedLoanAvailable == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.securedLoanAvailable.data as IObject[]}
            nextData={this.props.securedLoanAvailable.nextData as IObject[]}
            loadMore={this.props.securedLoanAvailable.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
        <Modal visible={this.state.modalVisible && this.securedLoanData != null}>
          <SecuredLoanDetail formData={this.securedLoanData} closeModal={this.closeModal} />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  securedLoanAvailable: state.securedLoanAvailable,
  securedLoanBank: state.securedLoanBank,
  securedLoanRegisterResult: state.securedLoanRegisterResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryAvailableSecuredLoan,
    })(AvailableSecuredLoan)
  ),
  Fallback,
  handleError
);
