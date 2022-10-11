import React from 'react';
import { connect } from 'react-redux';
import UserInactivityComp from 'react-native-user-inactivity';
import { withErrorBoundary } from 'react-error-boundary';
import store from 'redux-sagas/store';
import { NOTIFICATION_TYPE, SESSION_TIME_KEY } from 'global';
import { IState } from 'redux-sagas/reducers';
import { handleError } from 'utils/common';
import { setKey } from 'utils/asyncStorage';
import Fallback from 'components/Fallback';
import ScreenLoader from 'components/ScreenLoader';
import { INotification } from 'interfaces/common';
import { signOut, showNotification } from 'redux-sagas/global-actions';
import { hideLoader } from './actions';
import styles from './styles';

interface IUserInactivityProps extends React.ClassAttributes<UserInactivity> {
  signOut(): void;

  showNotification(payload: INotification): void;

  hideLoader(): void;
}

interface IUserInactivityState {}

class UserInactivity extends React.Component<IUserInactivityProps, IUserInactivityState> {
  constructor(props: IUserInactivityProps) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    setKey(SESSION_TIME_KEY, new Date().getTime());
    this.props.hideLoader();
  };

  private signOut = (active: boolean) => {
    if (active === false) {
      this.props.signOut();

      this.props.showNotification({
        type: NOTIFICATION_TYPE.WARN,
        title: 'Session Timed Out',
        content: 'Your session is timed out because of no activity!',
        time: new Date(),
      });
    }
  };

  render() {
    const settings = store.getState().userExtraInfo.settings;
    const timeoutSession = (settings && settings.loginSession ? settings.loginSession : 30) * 60000;

    return (
      <UserInactivityComp timeForInactivity={timeoutSession} onAction={this.signOut} style={styles.container}>
        {this.props.children}
        <ScreenLoader />
      </UserInactivityComp>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(
  connect(mapStateToProps, { signOut, showNotification, hideLoader })(UserInactivity),
  Fallback,
  handleError
);
