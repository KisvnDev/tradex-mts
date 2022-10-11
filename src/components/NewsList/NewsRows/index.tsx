import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { withErrorBoundary } from 'react-error-boundary';
import FastImage from 'react-native-fast-image';
import { formatDateToDisplay } from 'utils/datetime';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import { INews } from 'interfaces/news';
import styles from './styles';
import UIText from 'components/UiText';

interface INewsRowProps extends React.ClassAttributes<NewsRow> {
  data: INews;
  style?: StyleProp<ViewStyle>;

  onSelectNewsRow?(): void;
  onSelectSymbol?(symbolCode: string): void;
}

class NewsRow extends Component<INewsRowProps> {
  constructor(props: INewsRowProps) {
    super(props);
  }

  private onSelectNewsRow = () => {
    if (this.props.onSelectNewsRow) {
      this.props.onSelectNewsRow();
    }
  };

  private onSelectSymbol = (symbolCode: string) => {
    if (this.props.onSelectSymbol) {
      this.props.onSelectSymbol(symbolCode);
    }
  };

  render() {
    const tagList = [];
    if (this.props.data.symbolList != null) {
      for (let i = 0; i < this.props.data.symbolList.length; i++) {
        if (i < 5) {
          const tagName = this.props.data.symbolList[i];
          tagList.push(
            <TouchableOpacity key={i} style={styles.tag} onPress={() => this.onSelectSymbol(tagName)}>
              <UIText allowFontScaling={false} style={styles.tagName}>
                {tagName}
              </UIText>
            </TouchableOpacity>
          );
        }
      }
    }

    let source = null;

    if (this.props.data.source.logoUrl != null) {
      source = (
        <FastImage
          style={styles.image}
          source={{
            uri: this.props.data.source.logoUrl,
          }}
        />
      );
    } else {
      source = (
        <UIText allowFontScaling={false} style={styles.sourceText}>
          {this.props.data.source.name}
        </UIText>
      );
    }

    return (
      <View style={[styles.containerRow, this.props.style]}>
        <View style={styles.imageSectionRow}>
          {this.props.data.imgUrl ? (
            <FastImage style={styles.image} source={{ uri: this.props.data.imgUrl }} />
          ) : (
            <FastImage
              style={styles.image}
              source={{ uri: 'https://tradex-vn.s3-ap-southeast-1.amazonaws.com/image/news-placeholder-150x150.jpg' }}
            />
          )}
        </View>

        <View style={styles.contentSectionRow}>
          <View style={styles.titleSection}>
            <TouchableOpacity onPress={this.onSelectNewsRow}>
              <UIText allowFontScaling={false} style={styles.titleText} ellipsizeMode="tail" numberOfLines={2}>
                {this.props.data.title}
              </UIText>
            </TouchableOpacity>
          </View>

          <View style={styles.wrapperDate}>
            <UIText allowFontScaling={false} style={styles.timeText}>
              {formatDateToDisplay(this.props.data.publishTime, 'MMM dd HH:mm', 'yyyyMMddHHmmss')}
            </UIText>
            <View style={styles.source}>{source}</View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.tagContainer}>
              <ScrollView
                style={styles.tagList}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              >
                {tagList}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default withErrorBoundary(NewsRow, Fallback, handleError);
