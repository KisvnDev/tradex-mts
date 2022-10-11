import React from 'react';
import { View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import styles from './styles';
import UIText from 'components/UiText';

interface ISymbolTabRowProps extends React.ClassAttributes<SymbolTabRow>, WithTranslation {
  rowLeft: { title: string; content: string };
  rowRight?: { title: string; content: string };
}

class SymbolTabRow extends React.Component<ISymbolTabRowProps> {
  render() {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        {this.props.rowRight != null ? (
          <View style={styles.rowContainer}>
            <View style={[styles.row, styles.borderRight, styles.rowTitle, styles.borderRight]}>
              <UIText allowFontScaling={false} style={styles.titleText}>
                {t(this.props.rowLeft.title)}
              </UIText>
            </View>
            <View style={[styles.row, styles.rowContent, styles.borderRight, styles.borderBottom]}>
              <UIText allowFontScaling={false} style={styles.contentText}>
                {t(this.props.rowLeft.content)}
              </UIText>
            </View>

            <View style={[styles.row, styles.borderRight, styles.rowTitle, styles.borderRight]}>
              <UIText allowFontScaling={false} style={styles.titleText}>
                {t(this.props.rowRight.title)}
              </UIText>
            </View>
            <View style={[styles.row, styles.rowContent, styles.borderBottom]}>
              <UIText allowFontScaling={false} style={styles.contentText}>
                {t(this.props.rowRight.content)}
              </UIText>
            </View>
          </View>
        ) : (
          <View style={styles.rowContainer}>
            <View style={[styles.mainRowTitle, styles.borderRight, styles.rowTitle, styles.borderRight]}>
              <UIText allowFontScaling={false} style={styles.titleText}>
                {t(this.props.rowLeft.title)}
              </UIText>
            </View>
            <View style={[styles.mainRowContent, styles.rowContent, styles.borderRight, styles.borderBottom]}>
              <UIText allowFontScaling={false} style={styles.contentText}>
                {t(this.props.rowLeft.content)}
              </UIText>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withErrorBoundary(withTranslation()(SymbolTabRow), Fallback, handleError);
