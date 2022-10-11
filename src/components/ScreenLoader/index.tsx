import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';

interface IScreenLoaderProps extends React.ClassAttributes<ScreenLoader> {
  loader: { loading: boolean };
}

class ScreenLoader extends React.Component<IScreenLoaderProps> {
  constructor(props: IScreenLoaderProps) {
    super(props);
  }

  render() {
    return (
      this.props.loader.loading === true && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )
    );
  }
}

const mapStateToProps = (state: IState) => ({
  loader: state.loader,
});

export default connect(mapStateToProps)(ScreenLoader);
