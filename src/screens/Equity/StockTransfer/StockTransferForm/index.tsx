import React from 'react';
import { View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item } from 'react-native-picker-select';
import Fallback from 'components/Fallback';
import TextBox, { TEXTBOX_TYPE } from 'components/TextBox';
import NumericInput from 'components/NumericInput';
import ModalVerifyOtp from 'components/ModalVerifyOtp';
import Picker from 'components/Picker';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject } from 'interfaces/common';
import { formatNumber, handleError } from 'utils/common';
import { SYSTEM_TYPE } from 'global';
import { requestStockTransfer } from './actions';
import RowContent from 'components/RowContent';
import config from 'config';
import styles from './styles';
import UIText from 'components/UiText';

interface IStockTransferFormProps extends React.ClassAttributes<StockTransferForm>, WithTranslation {
  selectedAccount: IAccount | null;
  accountList: IAccount[];
  formData: IObject | null;
  stockTransferData: Stock[] | null;

  requestStockTransfer(payload: IObject): void;

  closeModal(): void;
}

interface IStockTransferFormState {
  quantity: number;
  limitQuantity: number;
  errorQuantity: boolean;
  errorQuantityContent: string;
  errorLimitQuantity: boolean;
  errorLimitQuantityContent: string;
  note: string;
  showModal: boolean;
}

class StockTransferForm extends React.Component<IStockTransferFormProps, IStockTransferFormState> {
  private stockTransferData: IObject | null;
  private transferAccount: IAccount | null;
  private transferAccounts: Item[] = [];
  private listStockCode: ItemDropdown[] = [];
  private stockSelected?: Stock;

  constructor(props: IStockTransferFormProps) {
    super(props);
    this.state = {
      quantity: 0,
      limitQuantity: 0,
      errorQuantity: false,
      errorQuantityContent: '',
      errorLimitQuantity: false,
      errorLimitQuantityContent: '',
      note: '',
      showModal: false,
    };
    this.stockTransferData = this.props.formData;
    if (config.usingNewKisCore) {
      this.stockSelected = this.stockTransferData as Stock;
      this.convertStockToDropdown();
    }
  }

  shouldComponentUpdate(nextProps: IStockTransferFormProps) {
    if (this.props.formData !== nextProps.formData) {
      this.stockTransferData = nextProps.formData;
    }

    if (this.props.selectedAccount !== nextProps.selectedAccount) {
      this.selectReceivingAccount();
      this.setState({});
    }

    if (config.usingNewKisCore && this.props.stockTransferData !== nextProps.stockTransferData) {
      this.convertStockToDropdown();
    }

    return true;
  }
  private convertStockToDropdown() {
    this.listStockCode =
      this.props.stockTransferData?.map<ItemDropdown>((item) => ({
        label: item.stockCode!,
        value: item.stockCode!,
        key: item.stockCode,
      })) || [];
  }

  private onChangeStockCode = (index: number, value: string) => {
    this.stockSelected = this.props.stockTransferData?.find((item) => item.stockCode === value);
    this.setState({});
  };

  private onChangeAccount = (index: number, value: IAccount) => {
    this.transferAccount = value;
    this.setState({});
  };

  private validateQuantity = (value: number) => {
    let errorQuantityContent = '';
    let errorQuantity = false;
    if (this.stockTransferData) {
      if (!isNaN(value)) {
        if (Number(value) > Number(this.stockTransferData!.availableQuantity)) {
          errorQuantityContent = 'The quantity is greater than the available quantity';
          errorQuantity = true;
        } else if (Number(value) <= 0) {
          errorQuantityContent = 'Quantity must be greater than 0';
          errorQuantity = true;
        }
      } else {
        errorQuantityContent = 'Quantity must be number';
        errorQuantity = true;
      }
    }

    return { errorQuantity, errorQuantityContent };
  };

  private validateLimitQuantity = (value: number) => {
    let errorLimitQuantityContent = '';
    let errorLimitQuantity = false;
    if (this.stockTransferData) {
      if (!isNaN(value)) {
        if (Number(value) > Number(this.stockTransferData!.limitAvailableQuantity)) {
          errorLimitQuantityContent = 'The limit quantity is greater than the quantity';
          errorLimitQuantity = true;
        }
      } else {
        errorLimitQuantityContent = 'Limit Quantity must be number';
        errorLimitQuantity = true;
      }
    }
    return { errorLimitQuantity, errorLimitQuantityContent };
  };

  private onChangeQuantity = (data: number) => {
    const { errorQuantity, errorQuantityContent } = this.validateQuantity(data);

    this.setState({
      quantity: data,
      errorQuantity,
      errorQuantityContent,
    });
  };

  private onChangeLimitQuantity = (data: number) => {
    const { errorLimitQuantity, errorLimitQuantityContent } = this.validateLimitQuantity(data);

    this.setState({
      limitQuantity: data,
      errorLimitQuantity,
      errorLimitQuantityContent,
    });
  };

  private onChangeNote = (data: string) => {
    this.setState({
      note: data,
    });
  };

  private onPressAvailableQuantity = () => {
    if (this.stockTransferData) {
      this.setState({
        quantity: this.stockTransferData!.availableQuantity as number,
      });
    }
  };

  private onPressLimitAvailableQuantity = () => {
    if (this.stockTransferData) {
      this.setState({
        limitQuantity: this.stockTransferData!.limitAvailableQuantity as number,
      });
    }
  };

  private submit = () => {
    const { errorQuantity, errorQuantityContent } = this.validateQuantity(this.state.quantity);
    const { errorLimitQuantity, errorLimitQuantityContent } = this.validateLimitQuantity(this.state.limitQuantity);

    if (!errorQuantity && !errorQuantity && this.stockTransferData) {
      const params = config.usingNewKisCore
        ? {
            senderAccountNo: this.props.selectedAccount?.accountNumber!,
            receiverAccountNo: this.transferAccount!.accountNumber,
            stockSymbol: this.stockSelected?.stockCode,
            transferVolume: this.state.quantity,
            marketID: this.stockTransferData!.marketID,
          }
        : {
            quantity: this.state.quantity,
            limitedQuantity: this.state.limitQuantity,
            receivedSubNumber: this.transferAccount!.subNumber,
            stockCode: this.stockSelected?.stockCode,
            note: this.state.note,
          };
      this.props.requestStockTransfer(params as any);
    }

    this.setState({
      errorQuantity,
      errorQuantityContent,
      errorLimitQuantity,
      errorLimitQuantityContent,
    });

    this.props.closeModal();
  };

  private selectReceivingAccount = () => {
    this.transferAccounts = this.props.accountList.reduce((list: Item[], item: IAccount) => {
      if (
        (config.usingNewKisCore
          ? item.accountNumber !== this.props.selectedAccount!.accountNumber
          : item.accountNumber === this.props.selectedAccount!.accountNumber &&
            item.subNumber !== this.props.selectedAccount!.subNumber) &&
        item.type === SYSTEM_TYPE.EQUITY
      ) {
        const account = {
          label: `${item.accountNumber} - ${item.subNumber}`,
          value: item,
        };
        if (list.indexOf(account) === -1) {
          list.push(account);
        }
      }

      return list;
    }, []);

    if (this.transferAccounts && this.transferAccounts.length > 0) {
      this.transferAccount = this.transferAccounts[0].value as IAccount;
    }
  };
  private openModal = () => this.setState({ showModal: true });
  render() {
    const isKisCore = config.usingNewKisCore;
    const { t } = this.props;

    this.selectReceivingAccount();

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={[styles.form]}>
            <View style={styles.item}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Transfering Account')}
                </UIText>
              </View>
              <View style={styles.data}>
                <UIText allowFontScaling={false} style={styles.dataText}>
                  {this.props.selectedAccount!.accountNumber} - {this.props.selectedAccount!.subNumber}
                </UIText>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.label}>
                <UIText allowFontScaling={false} style={styles.labelText}>
                  {t('Stock Code')}
                </UIText>
              </View>
              <View style={styles.data}>
                {isKisCore ? (
                  <Picker
                    list={this.listStockCode as Item[]}
                    onChange={this.onChangeStockCode}
                    selectedValue={this.stockSelected?.stockCode}
                  />
                ) : (
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {this.stockTransferData!.stockCode}
                  </UIText>
                )}
              </View>
            </View>
            {!isKisCore ? (
              <>
                <View style={styles.item}>
                  <View style={styles.label}>
                    <UIText allowFontScaling={false} style={styles.labelText}>
                      {t('Available Quantity')}
                    </UIText>
                  </View>
                  <TouchableOpacity style={styles.data} onPress={this.onPressAvailableQuantity}>
                    <UIText allowFontScaling={false} style={styles.dataTouch}>
                      {formatNumber(this.stockTransferData!.availableQuantity as number)}
                    </UIText>
                  </TouchableOpacity>
                </View>

                <View style={styles.item}>
                  <View style={styles.label}>
                    <UIText allowFontScaling={false} style={styles.labelText}>
                      {t('Limit Available Quantity')}
                    </UIText>
                  </View>
                  <TouchableOpacity style={styles.data} onPress={this.onPressLimitAvailableQuantity}>
                    <UIText allowFontScaling={false} style={styles.dataTouch}>
                      {formatNumber(this.stockTransferData!.limitAvailableQuantity as number)}
                    </UIText>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.item}>
                  <View style={styles.label}>
                    <UIText allowFontScaling={false} style={styles.labelText}>
                      {t('Available Quantity')}
                    </UIText>
                  </View>
                  <View style={styles.data}>
                    <UIText allowFontScaling={false} style={styles.dataText}>
                      {this.stockSelected?.availableVolume}
                    </UIText>
                  </View>
                </View>
                <View style={styles.item}>
                  <View style={styles.label}>
                    <UIText allowFontScaling={false} style={styles.labelText}>
                      {t('Stock Type')}
                    </UIText>
                  </View>
                  <View style={styles.data}>
                    <UIText allowFontScaling={false} style={styles.dataText}>
                      {this.stockSelected?.stockType}
                    </UIText>
                  </View>
                </View>
              </>
            )}

            <View style={[styles.formItem, isKisCore && styles.item]}>
              <View style={styles[isKisCore ? 'label' : 'labelSection']}>
                <UIText allowFontScaling={false} style={styles.labelTextBox}>
                  {t('Receiving Account')}
                </UIText>
              </View>
              {isKisCore ? (
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {this.transferAccount?.account}
                  </UIText>
                </View>
              ) : (
                <View style={styles.picker}>
                  <Picker
                    list={this.transferAccounts as Item[]}
                    onChange={this.onChangeAccount}
                    {...(this.transferAccount && { selectedValue: this.transferAccount })}
                  />
                </View>
              )}
            </View>
            <View style={styles.formItem}>
              <NumericInput
                isRow={isKisCore}
                label={isKisCore ? 'Transfer Quantity' : 'Quantity'}
                error={this.state.errorQuantity}
                errorContent={this.state.errorQuantityContent}
                value={this.state.quantity}
                onChange={this.onChangeQuantity}
              />
            </View>
            {!isKisCore && (
              <>
                <View style={styles.formItem}>
                  <NumericInput
                    label="Limit Quantity"
                    error={this.state.errorLimitQuantity}
                    errorContent={this.state.errorLimitQuantityContent}
                    value={this.state.limitQuantity}
                    onChange={this.onChangeLimitQuantity}
                  />
                </View>
                <View style={styles.note}>
                  <TextBox
                    label="Note"
                    type={TEXTBOX_TYPE.TEXT}
                    onChange={this.onChangeNote}
                    multiline={true}
                    numberOfLines={3}
                    textInputStyle={styles.textInputStyle}
                  />
                </View>
              </>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.buttonLeft, styles.button]} onPress={this.props.closeModal}>
              <UIText allowFontScaling={false} style={styles.buttonCancel}>
                {t('Cancel')}
              </UIText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isKisCore ? this.openModal : this.submit}
              disabled={
                this.stockTransferData == null ||
                this.transferAccounts == null ||
                this.transferAccounts.length === 0 ||
                this.state.quantity === 0
              }
              style={[
                styles.button,
                {
                  ...((this.stockTransferData == null ||
                    this.transferAccounts == null ||
                    this.transferAccounts.length === 0 ||
                    this.state.quantity === 0) &&
                    styles.buttonDisabled),
                },
              ]}
            >
              <UIText allowFontScaling={false} style={styles.buttonTransfer}>
                {t('TRANSFER_2')}
              </UIText>
              <ModalVerifyOtp
                childrenTop={
                  <>
                    <RowContent notScaping left="From Account No." right={this.props.selectedAccount?.accountNumber} />
                    <RowContent notScaping left="To Account No. " right={this.transferAccount?.account} />
                    <RowContent notScaping left="Symbol" right={this.stockSelected?.stockCode} />
                    <RowContent notScaping left="Stock Type" right={this.stockSelected?.stockType} />
                    <RowContent notScaping left="Transfer Volume" right={this.state.quantity} />
                  </>
                }
                notShowAccount
                onSubmit={this.submit}
                isOpenModalVerify={this.state.showModal}
                closeModal={() => this.setState({ showModal: false })}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accountList: state.accountList,
  selectedAccount: state.selectedAccount,
  stockTransferData: state.stockTransferAvailable?.data as Stock[] | null,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      requestStockTransfer,
    })(StockTransferForm)
  ),
  Fallback,
  handleError
);
