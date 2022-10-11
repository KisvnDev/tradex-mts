import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { changeSearchText } from './actions';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface ISymbolSearchInputProps extends React.ClassAttributes<SymbolSearchInput>, WithTranslation {
  parentId: string;
  changeSearchText(data: string): void;
}

interface ISymbolSearchInputState {
  searchText: string;
}

class SymbolSearchInput extends React.Component<ISymbolSearchInputProps, ISymbolSearchInputState> {
  constructor(props: ISymbolSearchInputProps) {
    super(props);

    this.state = {
      searchText: '',
    };
  }

  componentWillUnmount() {
    this.props.changeSearchText('');
  }

  private onChangeText = (text: string) => {
    this.setState(
      {
        searchText: text,
      },
      () => {
        this.props.changeSearchText(text);
      }
    );
  };

  private clearText = () => {
    this.setState(
      {
        searchText: '',
      },
      () => {
        this.props.changeSearchText('');
      }
    );
  };

  private cancel = () => {
    Navigation.pop(this.props.parentId);
  };

  render() {
    return (
      <TouchableOpacity style={styles.container} activeOpacity={1}>
        <View style={styles.searchInput}>
          <View style={styles.innerLeftIconContainer}>
            <MaterialIcons style={styles.searchIcon} name={'search'} />
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={this.onChangeText}
            value={this.state.searchText}
            placeholder={this.props.t('Type for search symbol')}
          />
          {this.state.searchText !== '' && (
            <TouchableOpacity style={styles.innerRightIconContainer} onPress={this.clearText}>
              <MaterialIcons style={styles.clearIcon} name={'cancel'} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={this.cancel}>
          <UIText allowFontScaling={false} style={styles.cancelText}>
            {this.props.t('Cancel')}
          </UIText>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      changeSearchText,
    })(SymbolSearchInput)
  ),
  Fallback,
  handleError
);
