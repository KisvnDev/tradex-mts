import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { isAfter } from 'date-fns';
import config from 'config';
import Fallback from 'components/Fallback';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import Picker from 'components/Picker';
import ModalContent from 'components/ModalContent';
import DatePicker, { DatePicker as DatePickerComp } from 'components/DatePicker';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import { IState } from 'redux-sagas/reducers';
import { IObject, IAccount } from 'interfaces/common';
import { formatDateToDisplay, formatDateToString } from 'utils/datetime';
import { formatNumber, isBlank, handleError } from 'utils/common';
import { queryCashTransferTransactionHistory, cancelCashTransfer } from './actions';
import globalStyles from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ITransactionHistoryProps extends React.ClassAttributes<TransactionHistory>, WithTranslation {
  type: 'INTERNAL' | 'EXTERNAL';
  selectedAccount: IAccount | null;
  cashTransferTransactionHistory: IObject | null;
  cashTransferResult: { success: boolean } | null;
  cancelCashTransferResult: { success: boolean } | null;

  queryCashTransferTransactionHistory(params: IObject): void;

  cancelCashTransfer(params: IObject): void;
}

interface ITransactionHistoryState {
  status: string;
  modalVisible: boolean;
  cancelNote?: string;
  errorCancelNote?: boolean;
  errorCancelNoteContent?: string;
}

class TransactionHistory extends React.Component<ITransactionHistoryProps, ITransactionHistoryState> {
  private transferRequestData: IObject | null;
  private refresh = true;
  private configGrid: ISheetDataConfig;
  private fromDate: Date = new Date();
  private toDate: Date = new Date();
  private transactionHistoryStatusList = [
    { label: this.props.t('Pending'), value: 'PENDING' },
    { label: this.props.t('Cancelled'), value: 'CANCELLED' },
    { label: this.props.t('Approved'), value: 'APPROVED' },
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

    this.initSheetData(this.state.status);
  }

  componentDidMount() {
    this.requestData();
  }

  shouldComponentUpdate(nextProps: ITransactionHistoryProps, nextState: ITransactionHistoryState) {
    if (this.state.status !== nextState.status) {
      this.initSheetData(nextState.status);
    }

    if (this.props.selectedAccount !== nextProps.selectedAccount) {
      this.refresh = true;
      this.requestData();
    }

    if (this.props.cashTransferResult !== nextProps.cashTransferResult) {
      this.refresh = true;
      this.requestData();
    }

    if (this.props.cancelCashTransferResult !== nextProps.cancelCashTransferResult) {
      this.refresh = true;
      this.requestData();
    }

    return true;
  }

  private initSheetData = (status?: string) => {
    this.configGrid = {
      columnFrozen: 2,
      header: [
        {
          label: 'Transaction Date',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {formatDateToDisplay(rowData.transactionDate as string)}
            </UIText>
          ),
        },
        {
          label: 'Seq No',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.sequenceNumber}
            </UIText>
          ),
        },
        {
          label: 'Amount',
          width: 100,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignRight, styles.data]}>
              {formatNumber(rowData.amount as number, 2)}
            </UIText>
          ),
        },
        {
          label: 'Received Account',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {`${rowData.receivedAccountNumber} - ${rowData.receivedSubNumber} - ${rowData.receivedAccountName}`}
            </UIText>
          ),
        },
        {
          label: 'Status',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.isCancel === true
                ? this.props.t('CANCELLED')
                : this.props.type === 'INTERNAL'
                ? this.props.t('APPROVED')
                : this.props.t(status!.toUpperCase())}
            </UIText>
          ),
        },
        {
          label: 'Note',
          width: 90,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} ellipsizeMode="tail" style={[globalStyles.alignCenter, styles.data]}>
              {rowData.note}
            </UIText>
          ),
        },
      ],
    };

    if (this.props.type === 'EXTERNAL') {
      this.configGrid.header.concat([
        {
          label: 'Send Seq No',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.sendSequenceNumber}
            </UIText>
          ),
        },
        {
          label: 'Receive Seq No',
          width: 70,
          element: (key: string, rowData: IObject, index: number) => (
            <UIText allowFontScaling={false} style={[globalStyles.alignCenter, styles.data]}>
              {rowData.receiveSequenceNumber}
            </UIText>
          ),
        },
      ]);

      if (status === 'PENDING' || isBlank(status)) {
        this.configGrid.header.unshift({
          label: '',
          width: 60,
          element: (key: string, rowData: IObject, index: number) => (
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
    }
  };

  private onClickCancel = (params: IObject) => {
    this.transferRequestData = params;
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
        key: 'Received Account',
        value: `${params.receivedAccountNumber} - ${params.receivedSubNumber} - ${params.receivedAccountName}`,
      },
    ];
    if (this.props.type === 'EXTERNAL') {
      this.modalContentInfo = [
        ...this.modalContentInfo,
        {
          key: 'Send Seq No',
          value: params.sendSequenceNumber as string,
        },
        {
          key: 'Receive Seq No',
          value: params.receiveSequenceNumber as string,
        },
      ];
    }
    this.setState({
      modalVisible: true,
    });
  };

  private closeModal = () => {
    this.transferRequestData = null;
    this.setState({
      modalVisible: false,
    });
  };

  private cancelWithdrawMoney = () => {
    if (this.transferRequestData != null) {
      const { errorCancelNote, errorCancelNoteContent } = this.validateCancelNote(this.state.cancelNote as string);
      if (errorCancelNote !== true) {
        const params = {
          amount: this.transferRequestData.amount,
          sequenceNumber: this.transferRequestData.sequenceNumber,
          sendSequenceNumber: this.transferRequestData.sendSequenceNumber,
          receiveSequenceNumber: this.transferRequestData.receiveSequenceNumber,
          receivedAccountNumber: this.transferRequestData.receivedAccountNumber,
          receivedSubNumber: this.transferRequestData.receivedSubNumber,
          note: this.state.cancelNote!,
        };

        this.props.cancelCashTransfer(params);
      }
      this.setState({
        errorCancelNote,
        errorCancelNoteContent,
      });
    }
  };

  private requestData = (loadMore = false) => {
    const params = {
      fetchCount: config.fetchCount,
      loadMore,
      fromDate: formatDateToString(this.fromDate)!,
      toDate: formatDateToString(this.toDate)!,
      status: this.state.status,
      type: this.props.type,
    };

    this.props.queryCashTransferTransactionHistory(params);
  };

  private onChangeTransactionHistoryStatus = (index: number, value: string) => {
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
        <View style={[styles.inputSection, this.props.type !== 'INTERNAL' && styles.extraInputSection]}>
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
          {this.props.type !== 'INTERNAL' && (
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
                    list={this.transactionHistoryStatusList}
                    selectedValue={'PENDING'}
                    onChange={this.onChangeTransactionHistoryStatus}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {refresh === true || this.props.cashTransferTransactionHistory == null ? (
          <ActivityIndicator />
        ) : (
          <SheetData
            config={this.configGrid}
            data={this.props.cashTransferTransactionHistory.data as IObject[]}
            nextData={this.props.cashTransferTransactionHistory.nextData as IObject[]}
            loadMore={this.props.cashTransferTransactionHistory.next as boolean}
            requestLoadMore={this.requestLoadMore}
          />
        )}
        <Modal visible={this.state.modalVisible} transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.subContainer}>
                <View style={[styles.titleContainer, styles.subContainer, styles.titleContainerBorder]}>
                  <UIText allowFontScaling={false} style={styles.title}>
                    {t('Cancel Transfer Cash')}
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
  cashTransferTransactionHistory: state.cashTransferTransactionHistory,
  cashTransferResult: state.cashTransferResult,
  cancelCashTransferResult: state.cancelCashTransferResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryCashTransferTransactionHistory,
      cancelCashTransfer,
    })(TransactionHistory)
  ),
  Fallback,
  handleError
);
