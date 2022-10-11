import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import { IAccount, IAccountBanks, IAccountBank } from 'interfaces/common';
import { IState } from 'redux-sagas/reducers';
import { queryAccountBanks, setAccountBank } from './actions';
import styles from './styles';

interface IAccountBankPickerProps extends React.ClassAttributes<AccountBankPicker> {
  selectedAccount: IAccount | null;
  accountBanks: IAccountBanks;
  accountBank: IAccountBank;

  queryAccountBanks(): void;

  setAccountBank(bank: IAccountBank): void;
}

class AccountBankPicker extends React.Component<IAccountBankPickerProps> {
  constructor(props: IAccountBankPickerProps) {
    super(props);
  }

  componentDidMount() {
    if (
      this.props.accountBanks == null ||
      (this.props.accountBanks.account !== this.props.selectedAccount && global.viewMode !== true)
    ) {
      this.props.queryAccountBanks();
    }
  }

  componentDidUpdate(prevProps: IAccountBankPickerProps) {
    if (this.props.selectedAccount !== prevProps.selectedAccount) {
      this.props.queryAccountBanks();
    }
  }

  private onChangeAccountBank = (index: number, value: IAccountBank) => {
    if (this.props.selectedAccount) {
      value.account = this.props.selectedAccount;
      this.props.setAccountBank(value);
    }
  };

  render() {
    let accountBanks: Array<{
      value: IAccountBank;
      label: string;
    }> = [];

    if (
      this.props.accountBanks != null &&
      this.props.accountBanks.banks != null &&
      this.props.accountBanks.account === this.props.selectedAccount
    ) {
      accountBanks = this.props.accountBanks.banks.map((item) => {
        return {
          value: item,
          label: `${item.bankCode} - ${item.bankName} - ${item.bankAccount}`,
        };
      });
    }

    return accountBanks.length === 0 ? (
      <ActivityIndicator />
    ) : (
      <View style={styles.textBox}>
        <Picker
          list={accountBanks}
          {...(this.props.accountBank &&
            this.props.accountBank.account === this.props.selectedAccount && { selectedValue: this.props.accountBank })}
          onChange={this.onChangeAccountBank}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  accountBanks: state.accountBanks,
  selectedAccount: state.selectedAccount,
  accountBank: state.accountBank,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    queryAccountBanks,
    setAccountBank,
  })(AccountBankPicker),
  Fallback,
  handleError
);
