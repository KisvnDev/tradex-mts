import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import Picker from 'components/Picker';
import { IState } from 'redux-sagas/reducers';
import { ISecuredLoanBank } from './reducers';
import { querySecuredLoanBanks, setSecuredLoanBank } from './actions';
import styles from './styles';

interface ISecuredLoanBankPickerProps extends React.ClassAttributes<SecuredLoanBankPicker> {
  securedLoanBanks: ISecuredLoanBank[];
  securedLoanBank: ISecuredLoanBank;

  querySecuredLoanBanks(): void;

  setSecuredLoanBank(bank: ISecuredLoanBank): void;
}

class SecuredLoanBankPicker extends React.Component<ISecuredLoanBankPickerProps> {
  constructor(props: ISecuredLoanBankPickerProps) {
    super(props);
  }

  componentDidMount() {
    if (this.props.securedLoanBanks == null || this.props.securedLoanBanks.length === 0) {
      this.props.querySecuredLoanBanks();
    }
  }

  private onChangeSecuredLoanBank = (index: number, value: ISecuredLoanBank) => {
    this.props.setSecuredLoanBank(value);
  };

  render() {
    let securedLoanBanks: Array<{
      value: ISecuredLoanBank;
      label: string;
    }> = [];

    if (this.props.securedLoanBanks != null && this.props.securedLoanBanks.length > 0) {
      securedLoanBanks = this.props.securedLoanBanks.map((item) => {
        return {
          value: item,
          label: `${item.bankCode} - ${item.bankName}`,
        };
      });
    }

    return securedLoanBanks.length === 0 ? (
      <ActivityIndicator />
    ) : (
      <View style={styles.textBox}>
        <Picker
          list={securedLoanBanks}
          {...(this.props.securedLoanBank && { selectedValue: this.props.securedLoanBank })}
          onChange={this.onChangeSecuredLoanBank}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  securedLoanBanks: state.securedLoanBanks,
  securedLoanBank: state.securedLoanBank,
});

export default withErrorBoundary(
  connect(mapStateToProps, {
    querySecuredLoanBanks,
    setSecuredLoanBank,
  })(SecuredLoanBankPicker),
  Fallback,
  handleError
);
