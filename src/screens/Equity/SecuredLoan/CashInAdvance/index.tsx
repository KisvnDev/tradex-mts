import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { sumBy } from 'lodash';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import SecuredLoanDetail from '../SecuredLoanDetail';
import { SYSTEM_TYPE } from 'global';
import { formatNumber, handleError } from 'utils/common';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { queryTransactionInfo, updateCashInAdvance } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import CheckBox from 'components/CheckBox';
import { ICashInAdvance, IICACashChildT } from 'components/CashInAdvance/reducers';
import config from 'config';
import UIText from 'components/UiText';

interface ITransactionInfoProps extends React.ClassAttributes<TransactionInfo>, WithTranslation {
  transactionInfor: IObject[] | null;
  accountNumber: string;
  selectedAccount: IAccount | null;

  queryTransactionInfo(payload: IObject): void;
  updateCashInAdvance(payload: ICashInAdvance): void;
}

interface ITransactionInfoState {
  modalVisible: boolean;
  chooseItems: IICACashChildT[];
}

class TransactionInfo extends React.Component<ITransactionInfoProps, ITransactionInfoState> {
  private securedLoanData: IObject | null = null;
  private refresh = true;
  private configGrid: ISheetDataConfig;

  constructor(props: ITransactionInfoProps) {
    super(props);

    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: '',
          width: 70,
          element: (key: string, rowData: any, index: number) => {
            if (config.usingNewKisCore && global.isIicaAccount) {
              return (
                <CheckBox
                  checked={this.state.chooseItems.findIndex((el) => el.id === rowData.id) !== -1}
                  onChange={this.handleChoose(rowData as IICACashChildT)}
                />
              );
            }
            return null;
          },
        },
        {
          label: 'ID',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.id}
            </UIText>
          ),
        },
        {
          label: 'Sold Date',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.soldDate}
            </UIText>
          ),
        },
        {
          label: 'Payment Date',
          width: 80,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.paymentDate}
            </UIText>
          ),
        },
        {
          label: 'Stock',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {rowData.stock}
            </UIText>
          ),
        },
        {
          label: 'Quantity',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.volume as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Value',
          width: 75,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.value as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Fee+Tax',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.feeTax as number)}
            </UIText>
          ),
        },
        {
          label: 'Net Sold Amount',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => {
            return (
              <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                {formatNumber(rowData.netSoldAmount as number, 2)}
              </UIText>
            );
          },
        },
      ],
    };

    this.state = {
      modalVisible: false,
      chooseItems: [],
    };
  }

  componentDidMount() {
    if (this.props.accountNumber) {
      this.requestData(this.props.accountNumber);
    }
  }

  shouldComponentUpdate(nextProps: ITransactionInfoProps) {
    if (
      this.props.selectedAccount !== nextProps.selectedAccount &&
      nextProps.selectedAccount &&
      nextProps.selectedAccount.type === SYSTEM_TYPE.EQUITY &&
      nextProps.selectedAccount.accountNumber
    ) {
      this.refresh = true;
      this.requestData(nextProps.selectedAccount.accountNumber);
    }

    return true;
  }

  private handleChooseT = (data: IICACashChildT[], specificT: string) => {
    return data.findIndex((item: IICACashChildT) => item.mvSettleDay.includes(specificT)) !== -1 ? 1 : 0;
  };

  private handleChoose = (item: IICACashChildT) => () => {
    const isFound = this.state.chooseItems?.findIndex((el) => el.id === item.id) !== -1;
    let newChooseList: IICACashChildT[] = [];

    if (isFound) {
      newChooseList = this.state.chooseItems.filter((el: IICACashChildT) => el.id !== item.id);
    } else {
      newChooseList.push(item);
    }

    const payload: ICashInAdvance = {
      availableCashAdvance: sumBy(newChooseList, 'mvAvailableAmount') || 0,
      interestRate: sumBy(newChooseList, 'feeTax') || 0,
      maxFee: 0,
      t0AdvAvailable: this.handleChooseT(newChooseList, 'T0'),
      t0Days: 0,
      t1AdvAvailable: this.handleChooseT(newChooseList, 'T1'),
      t1Days: 0,
      t2AdvAvailable: this.handleChooseT(newChooseList, 'T2'),
      t2Days: 0,
      item,
    };

    this.props.updateCashInAdvance(payload);

    this.setState((state: ITransactionInfoState) => ({
      ...state,
      chooseItems: newChooseList,
    }));
  };

  private requestData = (accountNumber: string) => {
    if (accountNumber) {
      const params = {
        accountNo: accountNumber,
      };

      this.props.queryTransactionInfo(params);
    }
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
        {refresh === true || this.props.transactionInfor == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.transactionInfor as IObject[]}
            nextData={this.props.transactionInfor as IObject[]}
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
  transactionInfor: state.transactionInfo,
  accountNumber: state.selectedAccount!.accountNumber,
  selectedAccount: state.selectedAccount,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryTransactionInfo,
      updateCashInAdvance,
    })(TransactionInfo)
  ),
  Fallback,
  handleError
);
