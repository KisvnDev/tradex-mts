import React from 'react';
import { ScrollView, TouchableOpacity, View, LayoutChangeEvent, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { width } from 'styles';
import styles from './styles';
import UIText from 'components/UiText';

interface ITabBarProps
  extends React.ClassAttributes<ITabBarProps>,
    WithTranslation,
    SceneRendererProps,
    NavigationState<{ key: string; title: string; abbr?: string; hidden?: boolean }> {
  tabItemStyle?: ViewStyle;

  onChange(index: number): void;
}

interface ITabBarState extends React.ClassAttributes<TabBar> {}

class TabBar extends React.Component<ITabBarProps, ITabBarState> {
  private scrollView: ScrollView | null;
  private xLayout: number[];
  private widthLayout: number[];

  constructor(props: ITabBarProps) {
    super(props);

    this.xLayout = new Array(this.props.routes.length);
    this.widthLayout = new Array(this.props.routes.length);
  }

  shouldComponentUpdate(nextProps: ITabBarProps) {
    if (nextProps.index !== this.props.index) {
      if (this.scrollView && this.xLayout[nextProps.index] != null && this.widthLayout[nextProps.index] != null) {
        let x = this.xLayout[nextProps.index];
        if (x > width / 2 - this.widthLayout[nextProps.index] / 2) {
          x = x - (width / 2 - this.widthLayout[nextProps.index] / 2);
        } else {
          x = 0;
        }
        this.scrollView.scrollTo({ x, y: 0, animated: true });
      }
    }
    return true;
  }

  private onChangeIndex = (index: number) => () => {
    this.props.onChange(index);
  };

  private onLayout = (event: LayoutChangeEvent, index: number) => {
    this.xLayout[index] = event.nativeEvent.layout.x;
    this.widthLayout[index] = event.nativeEvent.layout.width;
  };

  private onLayoutScrollTab = (event: LayoutChangeEvent) => {
    if (this.scrollView && this.xLayout[this.props.index] != null) {
      this.scrollView.scrollTo({ x: this.xLayout[this.props.index], y: 0, animated: true });
    }
  };

  render() {
    const { index } = this.props;

    return (
      <View style={styles.tabBarContainer}>
        <ScrollView
          onLayout={this.onLayoutScrollTab}
          contentContainerStyle={[styles.tabBarContainer, { minWidth: width }]}
          horizontal={true}
          ref={(ref) => (this.scrollView = ref)}
        >
          {this.props.routes.map((route, i) => {
            return route.hidden !== true ? (
              <TouchableOpacity
                onLayout={(event: LayoutChangeEvent) => this.onLayout(event, i)}
                style={[styles.tabItem, index === i && styles.tabActive, this.props.tabItemStyle]}
                key={i}
                onPress={this.onChangeIndex(i)}
              >
                <UIText allowFontScaling={false} style={index === i && styles.tabItemText}>
                  {index === i ? route.title : route.abbr ? route.abbr : route.title}
                </UIText>
              </TouchableOpacity>
            ) : null;
          })}
        </ScrollView>
      </View>
    );
  }
}

export default withErrorBoundary(withTranslation()(TabBar), Fallback, handleError);
