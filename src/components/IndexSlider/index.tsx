import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { withErrorBoundary } from 'react-error-boundary';
import { goToIndexList } from 'navigations';
import { handleError } from 'utils/common';
import IndexItem from './IndexItem';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import { getHighlightIndexList } from 'redux-sagas/global-reducers/SymbolList-reducers';
import { ISymbolInfo, IQuerySymbolData } from 'interfaces/market';
import { querySymbolData } from 'redux-sagas/global-actions';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface IIndexSliderProps extends React.ClassAttributes<IndexSlider>, WithTranslation {
  symbolList: ISymbolInfo[];

  querySymbolData(payload: IQuerySymbolData): void;
}

interface IIndexSliderState {
  position: 'start' | 'end' | 'middle';
}

class IndexSlider extends React.Component<IIndexSliderProps, IIndexSliderState> {
  constructor(props: IIndexSliderProps) {
    super(props);
    this.state = {
      position: 'start',
    };

    if (this.props.symbolList && this.props.symbolList.length > 0) {
      this.props.querySymbolData({
        symbolList: this.props.symbolList.map((item) => item.s),
      });
    }
  }

  shouldComponentUpdate(nextProps: IIndexSliderProps, nextState: IIndexSliderState) {
    if (this.props.symbolList !== nextProps.symbolList && nextProps.symbolList && nextProps.symbolList.length > 0) {
      this.props.querySymbolData({
        symbolList: nextProps.symbolList.map((item) => item.s),
      });

      return true;
    }

    if (this.state.position !== nextState.position) {
      return true;
    }

    return false;
  }

  private goToIndexList = () => {
    goToIndexList();
  };

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.x >= event.nativeEvent.contentSize.width - width) {
      this.setState({ position: 'end' });
    } else if (event.nativeEvent.contentOffset.x === 0) {
      this.setState({ position: 'start' });
    } else {
      this.setState({ position: 'middle' });
    }
  };

  render() {
    const { t } = this.props;

    if (this.props.symbolList && this.props.symbolList.length > 0) {
      return (
        <View>
          <FeatherIcon
            style={[styles.icon, styles.iconLeft, this.state.position === 'start' ? styles.hidden : styles.show]}
            name="chevron-left"
          />
          <ScrollView
            style={styles.indexScroll}
            onScroll={(event) => this.onScroll(event)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          >
            {this.props.symbolList.map((value: ISymbolInfo, index: number) => (
              <IndexItem key={index} data={value} />
            ))}

            <TouchableOpacity onPress={this.goToIndexList} style={styles.viewAllSection}>
              <View style={styles.viewAllContainer}>
                <View style={styles.viewAllContent}>
                  <UIText allowFontScaling={false} style={styles.viewAllText}>
                    ...
                  </UIText>
                  <UIText allowFontScaling={false} style={styles.viewAllText}>
                    {t('View all')}
                  </UIText>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
          <FeatherIcon
            style={[styles.icon, styles.iconRight, this.state.position === 'end' ? styles.hidden : styles.show]}
            name="chevron-right"
          />
        </View>
      );
    } else {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
  }
}

const mapStateToProps = (state: IState) => ({
  symbolList: getHighlightIndexList(state),
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      querySymbolData,
    })(IndexSlider)
  ),
  Fallback,
  handleError
);
