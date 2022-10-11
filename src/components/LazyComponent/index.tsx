import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';

interface ILazyComponentProps extends React.ClassAttributes<LazyComponent> {}

interface ILazyComponentState {
  loading: boolean;
}
class LazyComponent extends React.Component<ILazyComponentProps, ILazyComponentState> {
  constructor(props: ILazyComponentProps) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading === true) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return this.props.children;
  }
}

export default withErrorBoundary(LazyComponent, Fallback, handleError);
