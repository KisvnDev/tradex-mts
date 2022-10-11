import React from 'react';
import { View, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import styles from './styles';
import UIText from 'components/UiText';

interface IModalContentProps extends React.ClassAttributes<ModalContent>, WithTranslation {
  info: Array<{ key: string; value: string }>;
}

interface IModalContentState {}

class ModalContent extends React.Component<IModalContentProps, IModalContentState> {
  constructor(props: IModalContentProps) {
    super(props);
  }

  render() {
    const { t, info } = this.props;

    return (
      <ScrollView style={styles.minmaxHeight}>
        <View style={styles.infoContent}>
          <View style={styles.infoContentLeft}>
            {info.map((item, index) => (
              <View style={styles.rowHeight} key={index}>
                <UIText allowFontScaling={false} style={styles.infoText}>
                  {t(item.key)}
                </UIText>
              </View>
            ))}
          </View>
          <View style={styles.infoContentRight}>
            {info.map((item, index) => (
              <View style={styles.rowHeight} key={index}>
                <UIText allowFontScaling={false} style={styles.infoText}>
                  {t(item.value)}
                </UIText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withErrorBoundary(withTranslation()(ModalContent), Fallback, handleError);
