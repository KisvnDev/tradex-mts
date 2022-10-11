import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { withErrorBoundary } from 'react-error-boundary';
import { isAfter } from 'date-fns';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig, ISheetDataColumn } from 'components/SheetData';
import Picker from 'components/Picker';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import ModalContent from 'components/ModalContent';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { TransferType } from '..';
import { formatDateToDisplay, formatDateToString, substractMonth } from 'utils/datetime';
import { formatNumber, handleError, isBlank } from 'utils/common';
import config from 'config';
import { queryWithdrawTransactionHistory, cancelWithdrawMoney } from './actions';
import globalStyles, { Colors } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ITransactionHistoryProps extends React.ClassAttributes<TransactionHistory>, WithTranslation {
  selectedAccount: IAccount | null;
  withdrawTransactionHistory: IObject | null;
  withdrawResult: { success: boolean } | null;
  cancelWithdrawResult: { success: boolean } | null;
  transferType?: TransferType;

  queryWithdrawTransactionHistory(params: IObject): void;

  cancelWithdrawMoney(params: IObject): void;
}

interface ITransactionHistoryState {
  status: string;
  modalVisible: boolean;
  cancelNote?: string;
  errorCancelNote?: boolean;
  errorCancelNoteContent?: string;
}

class TransactionHistory extends React.Component<ITransactionHistoryProps, ITransactionHistoryState> {
  private withdrawRequestData: IObject | null;
  private refresh = true;
  private configGrid: ISheetDataConfig;
  private fromDate: Date = substractMonth(new Date());
  private toDate: Date = new Date();
  private transactionHistoryStatusList =
    config.usingNewKisCore === false
      ? [
          { label: this.props.t('Pending'), value: 'PENDING' },
          { label: this.props.t('Cancelled'), value: 'CANCELLED' },
          { label: this.props.t('Approved'), value: 'APPROVED' },
        ]
      : [
          { label: this.props.t('Pending'), value: 'PENDING' },
          { label: this.props.t('Rejected 1'), value: 'REJECTED' },
          { label: this.props.t('Approved'), value: 'APPROVED' },
          { label: this.props.t('Deleted'), value: 'DELETED' },
        ];

  private modalContentInfo: Array<{ key: string; value: string }> = [];
  private fromDateRef: DatePickerComp;
  private toDateRef: DatePickerComp;

  constructor(props: ITransactionHistoryProps) {
    super(props);

    this.state = {
      status: this.transactionHistoryStatusList[0].value,
      modalVisible: false,
      cancelNote: '',
      errorCancelNote: false,
      errorCancelNoteContent: '',
    };

    this.initSheetData(this.state.status, this.props.transferType);
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ITransactionHistoryProps, nextState: ITransactionHistoryState) {
    if (this.state.status !== nextState.status || this.props.transferType !== nextProps.transferType) {
      this.initSheetData(nextState.status, nextProps.transferType);
    }

    if (
      this.props.selectedAccount !== nextProps.selectedAccount ||
      this.props.transferType !== nextProps.transferType
    ) {
      this.refresh = true;
      this.requestData(false, nextProps.transferType);
    }

    if (this.props.cancelWithdrawResult !== nextProps.cancelWithdrawResult) {
      this.refresh = true;
      this.requestData();
    }

    if (this.props.withdrawResult !== nextProps.withdrawResult) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private initSheetData = (status?: string, transferType?: TransferType) => {
    const isKisCore = config.usingNewKisCore;
    this.configGrid = {
      columnFrozen: isKisCore ? 3 : 2,
      header: isKisCore
        ? this.generateHeaderKis(transferType === TransferType.EXTEND)
        : [
            {
              label: 'Transaction Date',
              width: 90,
              element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {formatDateToDisplay(rowData.transactionDate)}
                </UIText>
              ),
            },
            {
              label: 'Seq No',
              width: 50,
              element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.sequenceNumber}
                </UIText>
              ),
            },
            {
              label: 'Amount',
              width: 50,
              element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
                  {formatNumber(rowData.amount, 2)}
                </UIText>
              ),
            },
            {
              label: 'Bank',
              width: 150,
              element: (_key: string, rowData: WithdrawHistory, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {`${rowData.bankCode} - ${rowData.bankName} - ${rowData.bankAccount}`}
                </UIText>
              ),
            },
            {
              label: 'Status',
              width: 70,
              element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
                <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.isCancel
                    ? this.props.t('CANCELLED')
                    : status === 'APPROVED'
                    ? this.props.t('APPROVED')
                    : this.props.t('PENDING')}
                </UIText>
              ),
            },
            {
              label: 'Note',
              width: 90,
              element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
                <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignCenter, styles.data]}>
                  {rowData.note}
                </UIText>
              ),
            },
          ],
    };

    if (!isKisCore && (status === 'PENDING' || isBlank(status))) {
      this.configGrid.header.unshift({
        label: '',
        width: 30,
        element: (_key: string, rowData: IObject, _index: number) => (
          <TouchableOpacity onPress={() => this.onClickCancel(rowData)} disabled={status !== 'PENDING'}>
            <Feather
              name="x"
              style={[
                globalStyles.alignCenter,
                styles.iconSize,
                globalStyles.ORANGE,
                { ...(status !== 'PENDING' && styles.disableButton) },
              ]}
            />
          </TouchableOpacity>
        ),
      });
    }
  };

  private onClickCancel = (params: IObject) => {
    this.withdrawRequestData = params;
    this.modalContentInfo = [
      {
        key: 'Transaction Date',
        value: formatDateToDisplay(params.transactionDate as string) as string,
      },
      {
        key: 'Amount',
        value: formatNumber(Number(params.amount), 2),
      },
      {
        key: 'Bank',
        value: `${params.bankCode} - ${params.bankName} - ${params.bankAccount}`,
      },
    ];
    this.setState({
      modalVisible: true,
    });
  };

  private generateHeaderKis = (isExtend: boolean): ISheetDataColumn[] => {
    const header = [
      {
        label: 'Date',
        width: 70,
        element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
            {formatDateToDisplay(rowData.date)}
          </UIText>
        ),
      },
      {
        label: 'Transfer Type',
        width: 70,
        element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
            {rowData.transferType === 'DEPOSIT'
              ? this.props.t('DEPOSIT_2')
              : rowData.transferType === 'INTERNAL'
              ? this.props.t('INTERNAL_2')
              : this.props.t(rowData.transferType || '')}
          </UIText>
        ),
      },
    ];

    isExtend &&
      header.push(
        {
          label: 'Beneficiary',
          width: 100,
          element: (_, rowData: KisBankHistoryRow) => {
            return (
              <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
                {rowData.beneficiary}
              </UIText>
            );
          },
        },
        {
          label: 'Beneficiary Account',
          width: 120,
          element: (_, rowData: KisBankHistoryRow) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.beneficiaryAccountNo}
            </UIText>
          ),
        },
        {
          label: 'Bank',
          width: 50,
          element: (_, rowData: KisBankHistoryRow) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.beneficiaryBank}
            </UIText>
          ),
        }
      );
    header.push(
      {
        label: 'Transfer Amount',
        width: 70,
        element: (_key: string, rowData: WithdrawHistory & IObject, _index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
            {formatNumber(rowData.transferAmount, 2)}
          </UIText>
        ),
      },
      {
        label: 'Status',
        width: 90,
        element: (_key: string, rowData: WithdrawHistory, _index: number) => (
          <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
            {this.props.t(rowData.status === 'PENDING' ? 'Pending' : rowData.status!)}
          </UIText>
        ),
      }
    );
    return header.slice(0);
  };

  private closeModal = () => {
    this.withdrawRequestData = null;
    this.setState({
      modalVisible: false,
    });
  };

  private cancelWithdrawMoney = () => {
    if (this.withdrawRequestData != null) {
      const { errorCancelNote, errorCancelNoteContent } = this.validateCancelNote(this.state.cancelNote as string);
      if (errorCancelNote !== true) {
        const params = {
          amount: this.withdrawRequestData.amount,
          sequenceNumber: this.withdrawRequestData.sequenceNumber,
          transactionType: this.withdrawRequestData.transactionType,
          transactionCode: this.withdrawRequestData.transactionCode,
          bankCode: this.withdrawRequestData.bankCode,
          bankAccount: this.withdrawRequestData.bankAccount,
          note: this.state.cancelNote!,
        };

        this.props.cancelWithdrawMoney(params);
      }
      this.setState({
        modalVisible: false,
        errorCancelNote,
        errorCancelNoteContent,
      });
    }
  };

  private requestData = (loadMore = false, transferType?: TransferType) => {
    const params: IObject = {
      fetchCount: config.fetchCount,
      loadMore,
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      status: 'ALL',
    };
    config.usingNewKisCore && (params.transferType = (transferType || this.props.transferType) as Object);

    this.props.queryWithdrawTransactionHistory(params);
  };

  private onChangeTransactionHistoryStatus = (_index: number, value: string) => {
    this.refresh = true;
    this.setState(
      {
        status: value,
      },
      () => this.requestData()
    );
  };

  private requestLoadMore = () => {
    this.requestData(true);
  };

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

  private validateCancelNote = (value: string) => {
    let errorCancelNoteContent = '';
    let errorCancelNote = false;

    if (value.length > config.limitNoteCharacters) {
      errorCancelNoteContent = 'Cancelling note must be less than 99 characters';
      errorCancelNote = true;
    }
    return { errorCancelNote, errorCancelNoteContent };
  };

  private onChangeCancelNote = (data: string) => {
    const { errorCancelNote, errorCancelNoteContent } = this.validateCancelNote(data);
    this.setState({
      cancelNote: data,
      errorCancelNote,
      errorCancelNoteContent,
    });
  };

  render() {
    const { t } = this.props;
    const refresh = this.refresh;
    if (this.refresh === true) {
      this.refresh = false;
    }

    return (
      <View style={styles.container}>
        <View>
          <View style={styles.itemSection}>
            <View style={styles.item}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {t('From')}
                </UIText>
              </View>
              <View style={styles.dataContainer}>
                <DatePicker
                  ref={(ref: DatePickerComp) => (this.fromDateRef = ref)}
                  defaultValue={this.fromDate}
                  onChange={this.onChangeDateFrom}
                />
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
          {!config.usingNewKisCore && (
            <View style={styles.itemSection}>
              <View style={styles.item}>
                <View style={styles.labelContainer2}>
                  <UIText allowFontScaling={false} style={styles.label}>
                    {t('Status')}
                  </UIText>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    placeholder={{}}
                    valueContainer={{
                      borderColor: Colors.DARK_GREY,
                    }}
                    list={this.transactionHistoryStatusList}
                    selectedValue={'PENDING'}
                    onChange={this.onChangeTransactionHistoryStatus}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {refresh === true || this.props.withdrawTransactionHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.withdrawTransactionHistory.data as IObject[]}
            nextData={this.props.withdrawTransactionHistory.nextData as IObject[]}
            loadMore={this.props.withdrawTransactionHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
        <Modal visible={this.state.modalVisible} transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.subContainer}>
                <View style={[styles.titleContainer, styles.subContainer, styles.titleContainerBorder]}>
                  <UIText allowFontScaling={false} style={styles.title}>
                    {t('Cancel Withdraw Money')}
                  </UIText>
                </View>
                <ModalContent info={this.modalContentInfo} />
                <View style={styles.note}>
                  <TextBox
                    label="Note"
                    type={TEXTBOX_TYPE.TEXT}
                    onChange={this.onChangeCancelNote}
                    multiline={true}
                    numberOfLines={3}
                    textInputStyle={styles.textInputStyle}
                  />
                </View>
              </View>
              <View style={[styles.buttonInModal]}>
                <TouchableOpacity onPress={this.closeModal} style={[styles.confirmCancelButton, styles.cancelButton]}>
                  <UIText allowFontScaling={false} style={styles.buttonText2}>
                    {t('Close')}
                  </UIText>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.cancelWithdrawMoney} style={[styles.confirmCancelButton]}>
                  <UIText allowFontScaling={false} style={styles.buttonText1}>
                    {t('Confirm 2')}
                  </UIText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  withdrawTransactionHistory: state.withdrawTransactionHistory,
  withdrawResult: state.withdrawResult,
  cancelWithdrawResult: state.cancelWithdrawResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryWithdrawTransactionHistory,
      cancelWithdrawMoney,
    })(TransactionHistory)
  ),
  Fallback,
  handleError
);
