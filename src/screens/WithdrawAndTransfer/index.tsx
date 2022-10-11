import React from 'react';
import { View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import WithdrawMoney from 'screens/WithdrawMoney';
import CashTransfer from 'screens/CashTransfer';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import UserInactivity from 'components/UserInactivity';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface IMoneyProps extends React.ClassAttributes<WithdrawAndTransfer>, WithTranslation {
  componentId: string;
}

interface IMoneyState {
  tab: string;
}

class WithdrawAndTransfer extends React.Component<IMoneyProps, IMoneyState> {
  private list = [
    { label: this.props.t('Withdraw Money'), value: 'WithdrawMoney' },
    { label: this.props.t('Transfer Cash btw Main/Sub'), value: 'InternalTransfer' },
    { label: this.props.t('Transfer Cash to other account'), value: 'ExternalTransfer' },
  ];
  constructor(props: IMoneyProps) {
    super(props);

    this.state = {
      tab: 'WithdrawMoney',
    };
  }

  private renderTab = () => {
    if (this.state.tab === 'WithdrawMoney') {
      return <WithdrawMoney />;
    } else if (this.state.tab === 'InternalTransfer') {
      return <CashTransfer type={'INTERNAL'} />;
    } else {
      return <CashTransfer type={'EXTERNAL'} />;
    }
  };

  private onChangeComp = (index: number, value: string) => {
    this.setState({
      tab: value,
    });
  };

  render() {
    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.inputSection}>
            <View style={styles.itemSection}>
              <View style={styles.labelContainer}>
                <UIText allowFontScaling={false} style={styles.label}>
                  {this.props.t('Transaction Type')}
                </UIText>
              </View>
              <View style={styles.transactionTypeContainer}>
                <Picker placeholder={{}} list={this.list} selectedValue={undefined} onChange={this.onChangeComp} />
              </View>
            </View>
          </View>
          <View style={styles.container}>{this.renderTab()}</View>
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps)(WithdrawAndTransfer)),
  Fallback,
  handleError
);
