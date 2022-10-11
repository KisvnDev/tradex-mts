import React from 'react';
import { TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { IFavorite } from 'interfaces/common';
import { Colors } from 'styles';
import styles from './styles';
import FavoriteListPicker from 'components/FavoriteListPicker';
import UIText from 'components/UiText';

interface IFavoritePickerProps extends React.ClassAttributes<FavoritePicker>, WithTranslation {
  selectedFavorite: IFavorite;
}

interface IFavoritePickerState {
  modalVisible: boolean;
}

class FavoritePicker extends React.Component<IFavoritePickerProps, IFavoritePickerState> {
  constructor(props: IFavoritePickerProps) {
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  private onPress = () => {
    this.setState({
      modalVisible: true,
    });
  };

  private closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    if (this.props.selectedFavorite) {
      return (
        <TouchableOpacity style={styles.container} onPress={this.onPress}>
          <UIText allowFontScaling={false} style={styles.favoriteName}>
            {this.props.selectedFavorite.name}
          </UIText>
          <MaterialIcons name="keyboard-arrow-down" size={22} color={Colors.WHITE} style={styles.arrowDown} />
          <FavoriteListPicker modalVisible={this.state.modalVisible} closeModal={this.closeModal} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: IState) => ({
  selectedFavorite: state.selectedFavorite,
});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(FavoritePicker)), Fallback, handleError);
