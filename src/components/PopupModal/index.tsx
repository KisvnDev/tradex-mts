import React from 'react';
import { View, Modal, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import styles from './styles';
import UIText from 'components/UiText';

interface IPopupModalProps extends React.ClassAttributes<PopupModal>, WithTranslation {
  animationType: 'slide' | 'fade' | 'none';
  header: string;
  modalVisible: boolean;
  modalContainerStyle?: StyleProp<ViewStyle>;

  closeModal(): void;
}

interface IPopupModalState {}

class PopupModal extends React.Component<IPopupModalProps, IPopupModalState> {
  constructor(props: IPopupModalProps) {
    super(props);
  }

  render() {
    const { modalVisible, header, t, children } = this.props;
    return (
      <Modal animationType={this.props.animationType} transparent={true} visible={modalVisible}>
        <View style={[styles.modal, styles.container]}>
          <View style={[styles.modalContainer, this.props.modalContainerStyle && this.props.modalContainerStyle]}>
            <View style={styles.modalHeader}>
              <UIText allowFontScaling={false} style={styles.modalHeaderTitle}>
                {t(header)}
              </UIText>
            </View>
            {children}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.cancelButton, styles.container]} onPress={this.props.closeModal}>
                <UIText allowFontScaling={false} style={styles.textButtonColor}>
                  {t('Cancel')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default withErrorBoundary(withTranslation()(PopupModal), Fallback, handleError);
