import React from 'react';
import { Modal, TouchableOpacity, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import ModalContent from 'components/ModalContent';
import Fallback from 'components/Fallback';
import { formatNumber, handleError } from 'utils/common';
import { formatDateToDisplay } from 'utils/datetime';
import { ORDER_KIND, SYSTEM_TYPE, ORDER_TYPE, ORDER_FORM_ACTION_MODE } from 'global';
import { IOrderForm } from '..';
import { IPayloadVerifyOTP, verifyOTP } from 'components/ModalVerifyOtp/actions';
import { IObject } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import ModalVerifyOtp from 'components/ModalVerifyOtp';
import RowContent from 'components/RowContent';
import config from 'config';
import { IOrderInput } from '../reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface IOrderModalProps extends React.ClassAttributes<OrderModal>, WithTranslation {
  formData: IOrderForm;
  orderKind: ORDER_KIND;
  orderInput: IOrderInput;
  orderType?: ORDER_TYPE;
  actionMode?: ORDER_FORM_ACTION_MODE;
  generateKisCardResult: IObject | null;
  isVisibleModal?: boolean;
  limitPriceLO?: boolean;

  confirm(): void;

  closeModal(): void;

  verifyOTP(payload: IPayloadVerifyOTP): void;
}

interface IOrderModalState {
  disabledSubmitButton: boolean;
}

class OrderModal extends React.Component<IOrderModalProps, IOrderModalState> {
  private modalContentInfo: Array<{ key: string; value: string }> = [];

  constructor(props: IOrderModalProps) {
    super(props);

    this.state = {
      disabledSubmitButton: true,
    };
  }

  private closeModal = () => {
    this.props.closeModal();
  };

  private renderContentModal = () => {
    return (
      <FlatList
        data={this.modalContentInfo}
        renderItem={({ item }) => <RowContent notScaping left={item.key} right={item.value} />}
      />
    );
  };

  render() {
    const { orderKind, formData, orderInput, orderType, t } = this.props;
    const { selectedAccount } = orderInput;
    const isNewKisCore = config.usingNewKisCore;

    if (formData) {
      if (orderKind === ORDER_KIND.NORMAL_ORDER) {
        this.modalContentInfo = [
          {
            key: 'Type',
            value: formData.orderType!,
          },
          {
            key: 'Quantity',
            value: formatNumber(Number(formData.orderQuantity || formData.orderQty)),
          },
        ];

        if (this.props.actionMode !== ORDER_FORM_ACTION_MODE.CANCEL) {
          this.modalContentInfo.push({
            key: 'Available Quantity',
            value: formatNumber(Number(formData.availableQuantity)),
          });
        }

        if (orderType === ORDER_TYPE.LO) {
          this.modalContentInfo.push({
            key: 'Price',
            value: formatNumber(Number(formData.orderPrice), 2),
          });
        }
      } else if (orderKind === ORDER_KIND.STOP_ORDER) {
        this.modalContentInfo = [
          {
            key: 'Quantity',
            value: formatNumber(Number(formData.orderQuantity)),
          },
          {
            key: 'Stop Price',
            value: formatNumber(Number(formData.stopPrice), 2),
          },
          {
            key: 'From Date',
            value: formatDateToDisplay(formData.fromDate)!,
          },
          {
            key: 'To Date',
            value: formatDateToDisplay(formData.toDate)!,
          },
        ];
      } else if (orderKind === ORDER_KIND.STOP_LIMIT_ORDER) {
        if (this.props.limitPriceLO === true || this.props.limitPriceLO == null) {
          if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
            this.modalContentInfo = [
              {
                key: 'Quantity',
                value: formatNumber(Number(formData.orderQuantity)),
              },
              {
                key: 'Stop Price',
                value: formatNumber(Number(formData.stopPrice), 2),
              },
              {
                key: 'Limit Price',
                value: formatNumber(Number(formData.orderPrice), 2),
              },
              {
                key: 'From Date',
                value: formatDateToDisplay(formData.fromDate)!,
              },
              {
                key: 'To Date',
                value: formatDateToDisplay(formData.toDate)!,
              },
            ];
          } else {
            this.modalContentInfo = [
              {
                key: 'Quantity',
                value: formatNumber(Number(formData.orderQuantity)),
              },
              {
                key: 'Stop Price',
                value: formatNumber(Number(formData.stopPrice), 2),
              },
              {
                key: 'Limit Price',
                value: formatNumber(Number(formData.orderPrice), 2),
              },
              {
                key: 'Date',
                value: formatDateToDisplay(formData.fromDate)!,
              },
            ];
          }
        } else {
          if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
            this.modalContentInfo = [
              {
                key: 'Quantity',
                value: formatNumber(Number(formData.orderQuantity)),
              },
              {
                key: 'Stop Price',
                value: formatNumber(Number(formData.stopPrice), 2),
              },
              {
                key: 'From Date',
                value: formatDateToDisplay(formData.fromDate)!,
              },
              {
                key: 'To Date',
                value: formatDateToDisplay(formData.toDate)!,
              },
            ];
          } else {
            this.modalContentInfo = [
              {
                key: 'Quantity',
                value: formatNumber(Number(formData.orderQuantity)),
              },
              {
                key: 'Stop Price',
                value: formatNumber(Number(formData.stopPrice), 2),
              },
              {
                key: 'Date',
                value: formatDateToDisplay(formData.fromDate)!,
              },
            ];
          }
        }
      } else if (orderKind === ORDER_KIND.ADVANCE_ORDER) {
        if (selectedAccount!.type === SYSTEM_TYPE.EQUITY) {
          this.modalContentInfo = [
            {
              key: 'Type',
              value: formData.orderType!,
            },
            {
              key: 'Quantity',
              value: formatNumber(Number(formData.orderQuantity)),
            },
          ];

          if (orderType === ORDER_TYPE.LO) {
            this.modalContentInfo.push({
              key: 'Price',
              value: formatNumber(Number(formData.orderPrice), 2),
            });
          }
        } else {
          this.modalContentInfo = [
            {
              key: 'Type',
              value: formData.orderType!,
            },
            {
              key: 'Quantity',
              value: formatNumber(Number(formData.orderQuantity)),
            },
          ];

          if (orderType === ORDER_TYPE.LO) {
            this.modalContentInfo.push({
              key: 'Price',
              value: formatNumber(Number(formData.orderPrice), 2),
            });
          }

          this.modalContentInfo = this.modalContentInfo.concat([
            {
              key: 'Advance Type',
              value: formData.advanceOrderType!,
            },
            {
              key: 'Market Session',
              value: formData.marketSession!,
            },
            {
              key: 'From Date',
              value: formatDateToDisplay(formData.fromDate)!,
            },
            {
              key: 'To Date',
              value: formatDateToDisplay(formData.toDate)!,
            },
          ]);
        }
      } else {
        this.modalContentInfo = [
          {
            key: 'Quantity',
            value: formatNumber(Number(formData.orderQuantity)),
          },
          {
            key: 'Available Quantity',
            value: formatNumber(Number(formData.availableQuantity)),
          },
        ];
      }
    }

    if (isNewKisCore) {
      return (
        <ModalVerifyOtp
          isOpenModalVerify={this.props.isVisibleModal!}
          closeModal={this.closeModal}
          titleModal={this.props.actionMode ? `${t(this.props.actionMode + ' ' + orderKind)}` : t(orderKind)}
          onSubmit={this.props.confirm}
          childrenTop={this.renderContentModal()}
        />
      );
    }

    return (
      <Modal visible={true} transparent={true}>
        <View style={[styles.container, styles.subContainer]}>
          <View style={styles.modalContainer}>
            <View style={styles.subContainer}>
              <View style={[styles.titleContainer, styles.subContainer, styles.titleContainerBorder]}>
                <UIText allowFontScaling={false} style={styles.title}>
                  {this.props.actionMode ? `${t(this.props.actionMode + ' ' + orderKind)}` : t(orderKind)}
                </UIText>
              </View>
              <ModalContent info={this.modalContentInfo} />
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
              <TouchableOpacity onPress={this.props.confirm} style={[styles.subContainer, styles.button]}>
                <UIText allowFontScaling={false} style={styles.buttonText1}>
                  {t('Confirm 2')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  generateKisCardResult: state.generateKisCardResult,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      verifyOTP,
    })(OrderModal)
  ),
  Fallback,
  handleError
);
