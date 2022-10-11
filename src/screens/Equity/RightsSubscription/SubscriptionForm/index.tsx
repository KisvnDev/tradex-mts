import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatDateToDisplay } from 'utils/datetime';
import Fallback from 'components/Fallback';
import NumericInput from 'components/NumericInput';
import FormOTP from 'components/ModalVerifyOtp/FormOTP';
import { IState } from 'redux-sagas/reducers';
import { IAccount, IObject, IAccountBank } from 'interfaces/common';
import { formatNumber, handleError } from 'utils/common';
import { IPayloadVerifyOTP, verifyOTP } from 'components/ModalVerifyOtp/actions';
import { queryRightsDetail, requestRightsSubscription } from './actions';
import styles from './styles';
import UIText from 'components/UiText';

interface ISubscriptionFormProps extends React.ClassAttributes<SubscriptionForm>, WithTranslation {
  selectedAccount: IAccount | null;
  accountBank: IAccountBank | null;
  rightType: 'ADDITIONAL_STOCK' | 'BOND';
  formData: IObject | null;
  rightsRegisterResult: { success: boolean } | null;
  rightsDetail: IObject | null;
  isNewCore?: boolean;
  verifyOTPSuccessTrigger: boolean;
  generateKisCardResult: IObject | null;

  queryRightsDetail(payload: IObject): void;

  requestRightsSubscription(payload: IObject): void;

  closeModal(): void;

  verifyOTP(payload: IPayloadVerifyOTP): void;
}

interface ISubscriptionFormState {
  quantity: number;
  limitQuantity: number;
  errorQuantity: boolean;
  errorQuantityContent: string;
  errorLimitQuantity: boolean;
  errorLimitQuantityContent: string;
  note: string;
  disabledSubmitButton: boolean;
}

class SubscriptionForm extends React.Component<ISubscriptionFormProps, ISubscriptionFormState> {
  private rightsData: IObject | null;
  private totalAmount: number = 0;
  private wordMatrixValue = '';

  constructor(props: ISubscriptionFormProps) {
    super(props);
    this.state = {
      quantity: 0,
      limitQuantity: 0,
      errorQuantity: false,
      errorQuantityContent: '',
      errorLimitQuantity: false,
      errorLimitQuantityContent: '',
      note: '',
      disabledSubmitButton: true,
    };
    this.rightsData = this.props.rightsDetail;
  }

  componentDidMount() {
    this.queryRightsDetail(this.props.rightType, this.props.formData, this.props.accountBank);
  }

  shouldComponentUpdate(nextProps: ISubscriptionFormProps, nextState: ISubscriptionFormState) {
    if (this.props.rightsDetail !== nextProps.rightsDetail) {
      this.rightsData = nextProps.rightsDetail;
    }

    if (
      this.props.rightType !== nextProps.rightType ||
      this.props.formData !== nextProps.formData ||
      this.props.accountBank !== nextProps.accountBank
    ) {
      this.queryRightsDetail(nextProps.rightType, nextProps.formData, nextProps.accountBank);
    }

    if (this.props.verifyOTPSuccessTrigger !== nextProps.verifyOTPSuccessTrigger && nextProps.isNewCore === true) {
      const { errorQuantity } = this.validateQuantity(nextState.quantity);
      if (!errorQuantity && nextProps.formData != null) {
        const params = {
          entitlementId: nextProps.formData.entitlementId,
          locationId: nextProps.formData.locationId,
          marketId: nextProps.formData.marketId,
          registerQuantity: `${this.state.quantity}`,
          bankAccountNumber: nextProps.formData.bankAccountNumber,
          symbolCode: nextProps.formData.symbolCode,
          interfaceSeq: nextProps.formData.interfaceSeq,
        };
        nextProps.requestRightsSubscription(params);
        nextProps.closeModal();
      }
    }

    return true;
  }

  private queryRightsDetail = (
    rightType: 'ADDITIONAL_STOCK' | 'BOND',
    formData: IObject | null,
    accountBank: IAccountBank | null
  ) => {
    if (formData && accountBank) {
      const params = {
        baseDate: formData.baseDate,
        rightType,
        sequenceNumber: formData.sequenceNumber,
        bankCode: accountBank.bankCode,
        bankName: accountBank.bankName,
        bankAccount: accountBank.bankAccount,
      };
      if (this.props.isNewCore !== true) {
        this.props.queryRightsDetail(params);
      }
    }
  };

  private validateQuantity = (value: number) => {
    let errorQuantityContent = '';
    let errorQuantity = false;
    if (this.props.isNewCore === true) {
      if (!isNaN(value)) {
        if (Number(value) > Number(this.props.formData!.availableRightQty)) {
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
    } else {
      if (this.rightsData) {
        if (!isNaN(value)) {
          if (Number(value) > Number(this.rightsData!.availableQuantity)) {
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
    }

    return { errorQuantity, errorQuantityContent };
  };

  private onChangeQuantity = (data: number) => {
    const { errorQuantity, errorQuantityContent } = this.validateQuantity(data);
    if (!errorQuantity) {
      if (this.props.isNewCore === true && this.props.formData != null) {
        this.totalAmount = data * (this.props.formData.offeringPrice as number);
      }
      this.setState({
        quantity: data,
        errorQuantity,
        errorQuantityContent,
      });
    } else {
      if (this.props.isNewCore === true) {
        this.totalAmount = 0;
      }
      this.setState({
        errorQuantity,
        errorQuantityContent,
      });
    }
  };

  private onPressAvailableQuantity = () => {
    if (this.rightsData) {
      this.setState({
        quantity: this.rightsData!.availableQuantity as number,
      });
    }
  };

  private submit = () => {
    const { errorQuantity, errorQuantityContent } = this.validateQuantity(this.state.quantity);

    if (this.props.isNewCore === true) {
      if (global.OTPTokenMatrix) {
        if (!errorQuantity && this.props.formData != null) {
          const params = {
            entitlementId: this.props.formData.entitlementId,
            locationId: this.props.formData.locationId,
            marketId: this.props.formData.marketId,
            registerQuantity: `${this.state.quantity}`,
            bankAccountNumber: this.props.formData.bankAccountNumber,
            symbolCode: this.props.formData.symbolCode,
            interfaceSeq: this.props.formData.interfaceSeq,
          };
          this.props.requestRightsSubscription(params);
          this.props.closeModal();
        }
        return;
      }

      const payload: IPayloadVerifyOTP = {
        wordMatrixValue: this.wordMatrixValue,
        verifyType: 'MATRIX_CARD',
        wordMatrixId: this.props.generateKisCardResult?.wordMatrixId,
      };

      this.props.verifyOTP(payload);
    } else {
      if (!errorQuantity && this.rightsData && this.props.formData && this.props.accountBank) {
        const params = {
          quantity: this.state.quantity,
          amount: this.state.quantity * (this.rightsData.issuePrice as number),
          baseDate: this.rightsData!.baseDate,
          stockCode: this.props.formData.stockCode,
          tradeNumber: this.rightsData!.tradeNumber,
          sequenceNumber: this.props.formData.sequenceNumber,
          bankCode: this.props.accountBank.bankCode,
          bankAccount: this.props.accountBank.bankAccount,
          rightType: this.props.rightType,
        };
        this.props.requestRightsSubscription(params);
        this.props.closeModal();
      }
    }

    this.setState({
      errorQuantity,
      errorQuantityContent,
    });
  };

  private finishLoadOtpIndex = () => {
    this.setState({
      disabledSubmitButton: false,
    });
  };

  private onChangeOTPValue = (value: string) => {
    this.wordMatrixValue = value;
  };

  render() {
    const { t, formData } = this.props;

    if (this.props.isNewCore !== true) {
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={[styles.titleContainer, styles.subContainer, styles.titleContainerBorder]}>
              <UIText allowFontScaling={false} style={styles.title}>
                {t('Register Subscription')}
              </UIText>
            </View>
            <ScrollView style={styles.form}>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Account')}
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
                    {t('Code')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {this.props.formData!.stockCode}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Issue Price')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {this.rightsData && formatNumber(this.rightsData.issuePrice as number, 2)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Base Quantity')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && formatNumber(this.rightsData.standardQuantity as number)}
                  </UIText>
                </View>
              </View>

              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Available Quantity')}
                  </UIText>
                </View>
                <TouchableOpacity style={styles.data} onPress={this.onPressAvailableQuantity}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && formatNumber(this.rightsData.availableQuantity as number)}
                  </UIText>
                </TouchableOpacity>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Available Amount')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && formatNumber(this.rightsData.availableAmount as number, 2)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Pending Approval Quantity')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && formatNumber(this.rightsData.approveWaitingQuantity as number, 2)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Status')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && t(this.rightsData.processStatusName as string)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Start Date')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && formatDateToDisplay(this.rightsData.startDate as string)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('End Date')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && formatDateToDisplay(this.rightsData.endDate as string)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Trade Number')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {this.rightsData && this.rightsData.tradeNumber}
                  </UIText>
                </View>
              </View>
            </ScrollView>
            <View style={styles.formItem}>
              <NumericInput
                label="Quantity"
                error={this.state.errorQuantity}
                errorContent={this.state.errorQuantityContent}
                value={this.state.quantity}
                onChange={this.onChangeQuantity}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.props.closeModal}
                style={[styles.subContainer, styles.button, styles.buttonBorder]}
              >
                <UIText allowFontScaling={false} style={styles.buttonText2}>
                  {t('Cancel')}
                </UIText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.submit}
                style={[
                  styles.subContainer,
                  styles.button,
                  { ...(this.props.formData != null && this.rightsData != null && styles.buttonDisabled) },
                ]}
                disabled={this.props.formData != null && this.rightsData != null}
              >
                <UIText allowFontScaling={false} style={styles.buttonText1}>
                  {t('Register').toUpperCase()}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      );
    } else {
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={[styles.titleContainer, styles.subContainer, styles.titleContainerBorder]}>
              <UIText allowFontScaling={false} style={styles.title}>
                {t('Rights Registration')}
              </UIText>
            </View>
            <ScrollView style={styles.form}>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Account No')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {this.props.selectedAccount!.accountNumber}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Account Name')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.accountName}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Cash Available')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.cashAvailable}
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
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.symbolCode}
                  </UIText>
                </View>
              </View>

              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Company Name')}
                  </UIText>
                </View>
                {/* <TouchableOpacity style={styles.data} onPress={this.onPressAvailableQuantity}>
                  <UIText allowFontScaling={false} style={styles.dataTouch}>
                    {formData?.companyName}
                    </UIText>
                  </TouchableOpacity> */}
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.companyName}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Closed Date')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.closedDate != null &&
                      formatDateToDisplay(formData.closedDate as string, undefined, 'yyyy-MM-dd')}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Ratio')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.ratio}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Offering Price')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.offeringPrice != null && formatNumber(formData.offeringPrice as number, 2)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Available Right Quantity')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formData?.availableRightQty != null && formatNumber(formData.availableRightQty as number)}
                  </UIText>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.label}>
                  <UIText allowFontScaling={false} style={styles.labelText}>
                    {t('Total Amount')}
                  </UIText>
                </View>
                <View style={styles.data}>
                  <UIText allowFontScaling={false} style={styles.dataText}>
                    {formatNumber(this.totalAmount)}
                  </UIText>
                </View>
              </View>
              <View style={styles.formItem}>
                <NumericInput
                  label="Registered Qty"
                  error={this.state.errorQuantity}
                  errorContent={this.state.errorQuantityContent}
                  value={this.state.quantity}
                  onChange={this.onChangeQuantity}
                />
              </View>
              {(global.OTPTokenMatrix == null || global.OTPTokenMatrix === '') && (
                <FormOTP
                  isNotModal
                  onSetWordMatrixValue={this.onChangeOTPValue}
                  finishLoadOtpIndex={this.finishLoadOtpIndex}
                />
              )}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.props.closeModal}
                style={[styles.subContainer, styles.button, styles.buttonBorder]}
              >
                <UIText allowFontScaling={false} style={styles.buttonText2}>
                  {t('Cancel')}
                </UIText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.submit}
                style={[
                  styles.subContainer,
                  styles.button,
                  {
                    ...((global.OTPTokenMatrix == null || global.OTPTokenMatrix === '') &&
                      this.state.disabledSubmitButton === true &&
                      styles.buttonDisabled),
                  },
                ]}
                disabled={
                  (global.OTPTokenMatrix == null || global.OTPTokenMatrix === '') &&
                  this.state.disabledSubmitButton === true
                }
              >
                <UIText allowFontScaling={false} style={styles.buttonText1}>
                  {t('Register').toUpperCase()}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      );
    }
  }
}

const mapStateToProps = (state: IState) => ({
  selectedAccount: state.selectedAccount,
  accountBank: state.accountBank,
  rightsDetail: state.rightsDetail,
  rightsRegisterResult: state.rightsRegisterResult,
  generateKisCardResult: state.generateKisCardResult,
  verifyOTPSuccessTrigger: state.verifyOTPSuccessTrigger,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      queryRightsDetail,
      requestRightsSubscription,
      verifyOTP,
    })(SubscriptionForm)
  ),
  Fallback,
  handleError
);
