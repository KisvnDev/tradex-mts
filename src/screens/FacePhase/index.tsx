import React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError } from 'utils/common';
import Button from 'components/Button';
import Fallback from 'components/Fallback';
import { IObject } from 'interfaces/common';
import { goToFaceScanner } from 'navigations';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface IFacePhaseProps extends React.ClassAttributes<FacePhase>, WithTranslation {
  getFaceActionInfo: IObject | null;
}

interface IFacePhaseState {}

class FacePhase extends React.Component<IFacePhaseProps, IFacePhaseState> {
  constructor(props: IFacePhaseProps) {
    super(props);

    this.state = {};
  }

  private handleNext = () => {
    goToFaceScanner();
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image source={require('../../../assets/images/vcsc/face_scanning_tutorial.gif')} style={styles.gif} />
        </View>
        <View style={styles.titleContainer}>
          <UIText style={styles.titleText}>{t('Face Authentication')}</UIText>
          <UIText style={styles.text}>{t('FACE_NOTE')}</UIText>
        </View>
        <View style={styles.ruleContainer}>
          <View style={styles.ruleItem}>
            <View style={styles.numberContainer}>
              <UIText style={styles.numberText}>1</UIText>
            </View>
            <UIText style={styles.ruleText}>{t('FACE_RULE_1')}</UIText>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.numberContainer}>
              <UIText style={styles.numberText}>2</UIText>
            </View>
            <UIText style={styles.ruleText}>{t('FACE_RULE_2')}</UIText>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.numberContainer}>
              <UIText style={styles.numberText}>3</UIText>
            </View>
            <UIText style={styles.ruleText}>{t('FACE_RULE_3')}</UIText>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={this.handleNext} title={'UNDERSTOOD'} buttonStyle={styles.buttonUnderstood} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  getFaceActionInfo: state.getFaceActionInfo,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps, null)(FacePhase)), Fallback, handleError);
