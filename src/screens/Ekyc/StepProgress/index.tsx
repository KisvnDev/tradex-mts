import React from 'react';
import { View, Image } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import styles from './styles';

interface IEkycStepProgressProps extends React.ClassAttributes<EkycStepProgress>, WithTranslation {
  number: number;
}

interface IEkycStepProgressState {}

class EkycStepProgress extends React.Component<IEkycStepProgressProps, IEkycStepProgressState> {
  private stepIcon: JSX.Element;
  constructor(props: IEkycStepProgressProps) {
    super(props);
    this.state = {};
    switch (this.props.number) {
      case 1:
        this.stepIcon = firstStep;
        break;
      case 3:
        this.stepIcon = thirdStep;
        break;
      case 4:
        this.stepIcon = fourthStep;
        break;
      case 5:
        this.stepIcon = done;
        break;
    }
  }

  render() {
    return <View style={styles.progress}>{this.stepIcon}</View>;
  }
}

const mapStateToProps = () => ({});

export default withErrorBoundary(withTranslation()(connect(mapStateToProps)(EkycStepProgress)), Fallback, handleError);

const firstStep = <Image source={require('../../../../assets/images/kis/step-1.png')} />;
const thirdStep = <Image source={require('../../../../assets/images/kis/step-3.png')} />;
const fourthStep = <Image source={require('../../../../assets/images/kis/step-4.png')} />;
const done = <Image source={require('../../../../assets/images/kis/done.png')} />;
