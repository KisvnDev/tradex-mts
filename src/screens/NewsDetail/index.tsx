import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import { Navigation } from 'react-native-navigation';
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';
import FastImage from 'react-native-fast-image';
import UserInactivity from 'components/UserInactivity';
import { formatDateToDisplay } from 'utils/datetime';
import { INews } from 'interfaces/news';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { IState } from 'redux-sagas/reducers';
import styles from './styles';
import UIText from 'components/UiText';

interface INewsDetailProps extends React.ClassAttributes<NewsDetail> {
  news: INews;
}

class NewsDetail extends React.Component<INewsDetailProps> {
  constructor(props: INewsDetailProps) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidAppear = () => {
    Navigation.mergeOptions('NewsDetail', {
      topBar: {
        title: {
          text: this.props.news.title,
        },
      },
    });
  };

  private onSelectSymbol = (tagName: string) => {};

  render() {
    const tagList = [];

    if (this.props.news && this.props.news.symbolList && this.props.news.symbolList.length > 0) {
      for (let i = 0; i < this.props.news.symbolList.length; i++) {
        const tagName = this.props.news.symbolList[i];
        tagList.push(
          <TouchableOpacity key={i} style={styles.tag} onPress={() => this.onSelectSymbol(tagName)}>
            <UIText allowFontScaling={false} style={styles.tagName}>
              {tagName}
            </UIText>
          </TouchableOpacity>
        );
      }
    }

    let source = null;
    if (this.props.news && this.props.news.source.logoUrl) {
      source = <FastImage resizeMode="cover" source={{ uri: this.props.news.source.logoUrl }} />;
    } else {
      source = <UIText allowFontScaling={false}>{this.props.news.source.name}</UIText>;
    }
    return (
      <UserInactivity>
        <View style={styles.container}>
          <View style={styles.content}>
            {this.props.news.category !== 'TradeX Analysis Report' ? (
              <WebView source={{ uri: this.props.news.link }} />
            ) : (
              <Pdf style={styles.pdf} source={{ uri: this.props.news.link, cache: true }} />
            )}
          </View>
          <View style={styles.bottom}>
            <View style={styles.source}>{source}</View>
            <UIText allowFontScaling={false} style={[styles.timeText]}>
              {formatDateToDisplay(this.props.news.publishTime, 'MMM dd HH:mm', 'yyyyMMddHHmmss')}
            </UIText>
            <View style={styles.tagList}>{tagList}</View>
          </View>
        </View>
      </UserInactivity>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default withErrorBoundary(connect(mapStateToProps)(NewsDetail), Fallback, handleError);
