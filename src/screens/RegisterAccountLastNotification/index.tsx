import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { withTranslation, WithTranslation } from 'react-i18next';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import Button from 'components/Button';
import { IState } from 'redux-sagas/reducers';
import { goToAuth } from 'navigations';
import styles from './styles';
import UIText from 'components/UiText';

interface IRegisterAccountLastNotificationProps
  extends React.ClassAttributes<RegisterAccountLastNotification>,
    WithTranslation {}

interface IRegisterAccountLastNotificationState {}

class RegisterAccountLastNotification extends React.Component<
  IRegisterAccountLastNotificationProps,
  IRegisterAccountLastNotificationState
> {
  constructor(props: IRegisterAccountLastNotificationProps) {
    super(props);

    this.state = {};
  }

  private onClickOK = () => {
    goToAuth();
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.OTPBody}>
          <View style={styles.iconContainer}>
            <Svg width={64} height={64} fill="none" viewBox="0 0 64 64">
              <Path
                fill="#5DC7F3"
                d="M13.814 36.978l18.47 11.287 18.471-11.287 12.314-7.524v27.705A6.84 6.84 0 0156.23 64H8.341A6.842 6.842 0 011.5 57.159V29.452l12.314 7.526z"
              />
              <Path
                fill="#0161BD"
                d="M63.01 27.24v2.242l-12.315 7.524V18.043l.782.363 10.058 6.207a3.083 3.083 0 011.475 2.628z"
              />
              <Path
                fill="#F7F7F7"
                d="M50.754 18.014v18.963L32.282 48.264 13.814 36.978V4.883A4.881 4.881 0 0118.694 0h18.621l.248.025v8.287a4.88 4.88 0 004.881 4.883H49.4l1.355 1.511v3.308h-.002zm-7.707 6.289c0-5.951-4.824-10.775-10.775-10.775-5.95 0-10.775 4.824-10.775 10.775 0 5.951 4.824 10.775 10.775 10.775 5.951 0 10.775-4.824 10.775-10.775z"
              />
              <Path fill="#E9E9E9" d="M37.588.028l11.81 13.165h-6.955a4.882 4.882 0 01-4.881-4.882V.025l.026.003z" />
              <Path
                fill="#46AB00"
                d="M43.047 24.303c0 5.951-4.824 10.775-10.775 10.775-5.95 0-10.775-4.824-10.775-10.775 0-5.951 4.824-10.775 10.775-10.775 5.951.001 10.775 4.825 10.775 10.775z"
              />
              <Path fill="#0161BD" d="M13.814 18.014v18.963L1.5 29.452v-2.24a3.08 3.08 0 011.473-2.627l10.841-6.57z" />
              <Path
                fill="#fff"
                d="M30.684 27.65c-.316 0-.616-.138-.82-.378l-2.396-2.805a1.078 1.078 0 111.638-1.4l1.712 2.006 4.76-3.874a1.078 1.078 0 111.362 1.671l-5.576 4.537a1.058 1.058 0 01-.68.242z"
              />
            </Svg>
          </View>
          <View style={styles.note}>
            <UIText style={{ fontWeight: 'bold', color: 'green', textAlign: 'center', fontSize: 17 }}>
              {t('FINISH_NOTE_1')}
            </UIText>
          </View>
          <View style={styles.note2}>
            <UIText style={{ fontSize: 15, textAlign: 'center' }}>{t('FINISH_NOTE_2')}</UIText>
          </View>
          <View style={styles.note}>
            <UIText style={{ fontWeight: 'bold', color: 'black' }}>{`${t('HOTLINE')} (+84 4) 3821 6636`}</UIText>
          </View>
          <Button onPress={this.onClickOK} title={t('CONFIRM_3')} buttonStyle={styles.confirmButton} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, null)(RegisterAccountLastNotification)),
  Fallback,
  handleError
);
