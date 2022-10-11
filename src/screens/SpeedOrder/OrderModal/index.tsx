import React from 'react';
import { Modal, TouchableOpacity, View, FlatList } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import config from 'config';
import Fallback from 'components/Fallback';
import ModalContent from 'components/ModalContent';
import ModalVerifyOtp from 'components/ModalVerifyOtp';
import RowContent from 'components/RowContent';
import { formatNumber, handleError } from 'utils/common';
import { ICurrentRow, PROMPT_MODE } from '../reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface IOrderModalProps extends React.ClassAttributes<OrderModal>, WithTranslation {
  currentRow: ICurrentRow;
  inputQuantity: number;

  confirm(): void;

  closeModal(): void;
}

interface IOrderModalState {}

class OrderModal extends React.Component<IOrderModalProps, IOrderModalState> {
  private modalContentInfo: Array<{ key: string; value: string }> = [];

  constructor(props: IOrderModalProps) {
    super(props);
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
    const { t, currentRow, inputQuantity } = this.props;
    const isUsingNewKisCore = config.usingNewKisCore;

    if (!currentRow && isUsingNewKisCore) {
      return null;
    }

    switch (currentRow.promptMode) {
      case PROMPT_MODE.CANCEL_ALL: {
        this.modalContentInfo = [];
        break;
      }
      case PROMPT_MODE.MOVE: {
        this.modalContentInfo = [
          {
            key: 'Quantity',
            value: formatNumber(currentRow.quantity),
          },
          {
            key: 'From Price',
            value: formatNumber(Number(currentRow.price), 2),
          },
          {
            key: 'To Price',
            value: formatNumber(Number(currentRow.newPrice), 2),
          },
        ];
        break;
      }
      case PROMPT_MODE.PLACE: {
        this.modalContentInfo = [
          {
            key: 'Quantity',
            value: formatNumber(inputQuantity),
          },
          {
            key: 'Price',
            value: formatNumber(Number(currentRow.price), 2),
          },
        ];
        break;
      }
      case PROMPT_MODE.CANCEL: {
        this.modalContentInfo = [
          {
            key: 'Quantity',
            value: formatNumber(currentRow.quantity),
          },
          {
            key: 'Price',
            value: formatNumber(Number(currentRow.price), 2),
          },
        ];
        break;
      }
      default:
        break;
    }

    if (isUsingNewKisCore) {
      return (
        <ModalVerifyOtp
          isOpenModalVerify={!!currentRow?.showModal}
          closeModal={this.closeModal}
          titleModal={t(`${PROMPT_MODE[currentRow.promptMode!]} ${currentRow.orderKind} ${currentRow.sellBuyType}`)}
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
              <View
                style={[
                  styles.titleContainer,
                  styles.subContainer,
                  { ...(currentRow.promptMode !== PROMPT_MODE.CANCEL_ALL && styles.titleContainerBorder) },
                ]}
              >
                <UIText allowFontScaling={false} style={styles.title}>
                  {t(`${PROMPT_MODE[currentRow.promptMode!]} ${currentRow.orderKind} ${currentRow.sellBuyType}`)}
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

export default withErrorBoundary(withTranslation()(OrderModal), Fallback, handleError);
