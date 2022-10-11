import React from 'react';
import { View, PermissionsAndroid, Platform } from 'react-native';
import { connect } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError } from 'utils/common';
import Button from 'components/Button';
import Fallback from 'components/Fallback';
import { goToIdScanner } from 'navigations';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface IIdPhaseProps extends React.ClassAttributes<IdPhase>, WithTranslation {}

interface IIdPhaseState {}

class IdPhase extends React.Component<IIdPhaseProps, IIdPhaseState> {
  constructor(props: IIdPhaseProps) {
    super(props);

    this.state = {};
  }

  private handleNext = async () => {
    if (Platform.OS === 'android') {
      if ((await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)) !== true) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      }
      if ((await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) !== true) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      }
      if (
        (await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE && PermissionsAndroid.PERMISSIONS.CAMERA
        )) === true
      ) {
        goToIdScanner();
      }
    } else {
      goToIdScanner();
    }
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Svg width={120} height={120} viewBox="0 0 90 90">
            <Path
              fill="#E8ECED"
              d="M4.676 12.625h80.648A4.673 4.673 0 0190 17.297v55.289a4.676 4.676 0 01-4.676 4.676H4.676A4.676 4.676 0 010 72.586v-55.29a4.673 4.673 0 014.676-4.671zm0 0"
            />
            <Path fill="#103877" d="M9.352 31.09h28.05v28.055H9.352zm0 0" />
            <Path
              fill="#FFF"
              d="M24.957 36.578c2.355.137 3.844-1.36 4.29-2.121.14.227.339.883 0 1.695-.337.817-.645 1.246-.755 1.36.14.199.57.832 1.176 1.781.605.95.477 2.148.336 2.629.363.086 1.11.426 1.18 1.101.082.852.082 2.04-.508 2.633-.586.594-1.176.676-1.43 1.528-.25.847-.672 1.949-1.848 2.543-1.18.593-1.683 1.273-1.515 2.46.168 1.188 3.027 1.868 4.793 2.797 1.414.75 1.488 3.086 1.347 4.16H14.867c-.14-.312-.336-1.238 0-2.46.418-1.528 1.68-2.207 3.195-2.63 1.512-.425 2.524-1.359 2.524-2.206 0-.68-.281-1.075-.422-1.188-.195.028-.809-.117-1.68-.933-1.093-1.02-1.347-1.95-1.937-3.137-.586-1.188-1.094-.512-1.094-1.274 0-.765-.082-1.187 0-2.293.07-.878.758-.93 1.094-.847.086-.707.508-2.461 1.515-3.817 1.262-1.695 3.954-1.949 6.895-1.78zm0 0"
            />
            <Path
              fill="#3B85B6"
              d="M42.078 42.313c0-.907.73-1.637 1.637-1.637h15.43c.902 0 1.632.73 1.632 1.636 0 .903-.73 1.637-1.632 1.637h-15.43a1.636 1.636 0 01-1.637-1.636zm0 5.609a1.636 1.636 0 113.273-.001 1.636 1.636 0 01-3.273 0zm15.664 0c0-.902.73-1.637 1.633-1.637h1.172c.902 0 1.637.735 1.637 1.637s-.735 1.637-1.637 1.637h-1.172a1.635 1.635 0 01-1.633-1.637zm16.594 0c0-.902.734-1.637 1.637-1.637h3.039a1.636 1.636 0 110 3.274h-3.04a1.639 1.639 0 01-1.636-1.637zM61.95 42.313c0-.907.73-1.637 1.636-1.637h15.426a1.636 1.636 0 110 3.273H63.586a1.636 1.636 0 01-1.637-1.636zm-15.43 5.609c0-.902.734-1.637 1.636-1.637h6.778a1.636 1.636 0 110 3.274h-6.778a1.639 1.639 0 01-1.636-1.637zm16.832 0c0-.902.73-1.637 1.636-1.637h6.543a1.636 1.636 0 110 3.274h-6.543a1.636 1.636 0 01-1.636-1.637zm0 0"
            />
          </Svg>
        </View>
        <View style={styles.titleContainer}>
          <UIText style={styles.titleText}>{t('Take photo of identity card')}</UIText>
          <UIText style={styles.text}>{t('Please take photos 2 side of your Identity card')}</UIText>
        </View>
        <View style={styles.ruleContainer}>
          <View style={styles.ruleItem}>
            <View style={styles.numberContainer}>
              <UIText style={styles.numberText}>1</UIText>
            </View>
            <UIText style={styles.ruleText}>{t('ID_RULE_1')}</UIText>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.numberContainer}>
              <UIText style={styles.numberText}>2</UIText>
            </View>
            <UIText style={styles.ruleText}>{t('ID_RULE_2')}</UIText>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.numberContainer}>
              <UIText style={styles.numberText}>3</UIText>
            </View>
            <UIText style={styles.ruleText}>{t('ID_RULE_3')}</UIText>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={this.handleNext} title={'UNDERSTOOD'} buttonStyle={styles.buttonUnderstood} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps, null)(IdPhase)), Fallback, handleError);
