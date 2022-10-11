import React from 'react';
import {
  Animated,
  ActivityIndicator,
  FlatList,
  ScrollView,
  View,
  ListRenderItemInfo,
  RefreshControl,
} from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import ErrorBoundary from 'react-error-boundary';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import config from 'config';
import { IObject } from 'interfaces/common';
import styles from './styles';
import UIText from 'components/UiText';

export interface ISheetDataColumn {
  label: string;
  width: number;
  element(key: string, rowData: IObject, index: number): React.ReactNode;
}

export interface ISheetDataConfig {
  columnFrozen: number;
  header: ISheetDataColumn[];
}

interface ISheetDataState {
  refreshing: boolean;
}

interface ISheetDataProps extends React.ClassAttributes<SheetData>, WithTranslation {
  config: ISheetDataConfig;
  data: IObject[] | null;
  nextData: IObject[] | null;
  loadMore?: boolean;
  fetchCount?: number;

  requestLoadMore?(): void;

  onRowClick?(rowData: IObject): void;
  onRefreshData?(): void;
}

export class SheetData extends React.Component<ISheetDataProps, ISheetDataState> {
  static defaultProps = {
    fetchCount: config.fetchCount,
  };

  private loading = true;
  private isLoadingMore = true;
  private data: IObject[] = [];
  private headerScrollView: ScrollView;
  private scrollPosition: Animated.Value = new Animated.Value(0);
  private scrollEvent = Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }], {
    useNativeDriver: false,
  });

  private hasMore = false;

  constructor(props: ISheetDataProps) {
    super(props);

    if (props.data != null && props.loadMore !== true) {
      this.loading = false;
      this.data = props.data;

      if (props.data.length < props.fetchCount!) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
    } else {
      this.loading = false;
    }

    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.scrollPosition.addListener((position) => {
      this.headerScrollView.scrollTo({ x: position.value, animated: false });
    });
  }

  shouldComponentUpdate(nextProps: ISheetDataProps) {
    if (this.props.data !== nextProps.data && this.state.refreshing) {
      this.setState({ refreshing: false });
      this.data = nextProps.data as IObject[];
      return true;
    }

    if (this.props.data !== nextProps.data && nextProps.loadMore !== true && !this.state.refreshing) {
      if (nextProps.data != null) {
        this.loading = false;
        this.data = nextProps.data;
        if (nextProps.data.length < nextProps.fetchCount!) {
          this.hasMore = false;
        }
      } else {
        this.hasMore = false;
      }
    } else if (this.props.nextData !== nextProps.nextData && nextProps.loadMore === true) {
      if (nextProps.nextData) {
        this.data = this.data.concat(nextProps.nextData);
        if (nextProps.nextData.length < nextProps.fetchCount!) {
          this.hasMore = false;
        }
        if (config.usingNewKisCore && nextProps.nextData?.length >= config.fetchCount - 1) {
          this.hasMore = true;
        }
      } else {
        this.hasMore = false;
      }
    }
    return true;
  }

  componentDidUpdate(prevProps: ISheetDataProps) {
    if (
      prevProps.data !== null &&
      this.props.data !== null &&
      this.props.data === prevProps.data &&
      this.state.refreshing
    ) {
      this.setState({ refreshing: false });
    }
  }

  private handleScrollEndReached = () => {
    if (!this.loading && this.hasMore === true && this.data?.length > 0) {
      if (this.props.requestLoadMore) {
        this.isLoadingMore = true;
        this.props.requestLoadMore();
      }
    }
  };

  private formatCell(
    key: string,
    properties: ISheetDataColumn,
    rowData: IObject,
    rowIndex: number,
    columnIndex: number,
    borderRight = false
  ) {
    return (
      <View
        key={key}
        style={[
          styles.cell,
          { width: properties.width },
          rowIndex % 2 !== 0 && styles.highlight,
          columnIndex === this.props.config.columnFrozen - 1 && borderRight === true && styles.frozenBorder,
        ]}
      >
        {properties.element(key, rowData, rowIndex)}
      </View>
    );
  }

  private formatColumn = ({ item, index }: ListRenderItemInfo<ISheetDataColumn>) => {
    const cells = [];
    for (let i = 0; i < this.data.length; i++) {
      const rowData = this.data[i];
      cells.push(this.formatCell(`column-${item.label}-${i}`, item, rowData, i, index));
    }
    return <View style={[styles.column]}>{cells}</View>;
  };

  private formatCellHeader(key: string, properties: ISheetDataColumn, frozen = false, borderRight = false) {
    return (
      <View
        key={key}
        style={[
          styles.cell,
          { width: properties.width },
          frozen === true && styles.frozenHeader,
          borderRight === true && styles.frozenBorder,
        ]}
      >
        <UIText allowFontScaling={false} style={styles.header}>
          {this.props.t(properties.label)}
        </UIText>
      </View>
    );
  }

  private formatHeader() {
    const cols = [];
    for (let i = this.props.config.columnFrozen; i < this.props.config.header.length; i++) {
      const item = this.props.config.header[i];
      cols.push(this.formatCellHeader(`frozen-cols-${item.label}-${i}`, item));
    }

    const frozenRow = [];
    for (let i = 0; i < this.props.config.columnFrozen; i++) {
      const item = this.props.config.header[i];
      frozenRow.push(
        this.formatCellHeader(`frozen-row-${item.label}-${i}`, item, true, i === this.props.config.columnFrozen - 1)
      );
    }

    return (
      <View style={[styles.headerContainer]}>
        {frozenRow}
        <ScrollView
          ref={(ref: ScrollView) => (this.headerScrollView = ref)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {cols}
        </ScrollView>
      </View>
    );
  }

  private formatIdentityColumn() {
    const cells = [];
    let frozenWidth = 0;

    for (let i = 0; i < this.props.config.columnFrozen; i++) {
      const items = [];
      const properties = this.props.config.header[i];
      frozenWidth += properties.width;
      for (let k = 0; k < this.data.length; k++) {
        const rowData = this.data[k];
        items.push(this.formatCell(`identity-column-${properties.label}-${k}`, properties, rowData, k, i, true));
      }
      cells.push(
        <View
          key={`identity-column-1-${properties.label}-${i}`}
          style={[i === this.props.config.columnFrozen && styles.frozenBorder]}
        >
          {items}
        </View>
      );
    }

    return <View style={[styles.identity, { width: frozenWidth }]}>{cells}</View>;
  }

  private formatBody() {
    const data: ISheetDataColumn[] = [];

    let frozenWidth = 0;

    for (let i = 0; i < this.props.config.columnFrozen; i++) {
      const properties = this.props.config.header[i];
      frozenWidth += properties.width;
    }

    for (let i = this.props.config.columnFrozen; i < this.props.config.header.length; i++) {
      const item = this.props.config.header[i];
      data.push(item);
    }

    return (
      <View>
        {this.data && this.formatIdentityColumn()}

        {this.data && (
          <FlatList
            style={[styles.body, { marginLeft: frozenWidth }]}
            horizontal={true}
            data={data}
            renderItem={this.formatColumn}
            stickyHeaderIndices={[0]}
            onScroll={this.scrollEvent}
            scrollEventThrottle={16}
            extraData={this.state}
            keyExtractor={(item: ISheetDataColumn, index: number) => index.toString()}
          />
        )}
      </View>
    );
  }

  private formatRowForSheet = ({ item }: ListRenderItemInfo<{ key: string; render: JSX.Element }>) => {
    return item.render;
  };

  private renderFooter = () => {
    if (this.props.data === null && !this.state.refreshing) {
      return (
        <View style={styles.containerError}>
          <UIText style={styles.labelError}>{this.props.t('Error while fetching data, pull to refresh')}</UIText>
        </View>
      );
    }
    if (!this.isLoadingMore || this.hasMore !== true || this.props.loadMore !== true || !this.loading) {
      return null;
    } else {
      return <ActivityIndicator animating size="small" />;
    }
  };

  private handleRefreshData = () => {
    this.setState({ refreshing: true });
    this.hasMore = true;
    this.props?.onRefreshData?.();
  };

  addRowDataToTop = (rowData: IObject) => {
    this.data.unshift(rowData);
    this.setState({});
  };

  render() {
    if (this.loading === true) {
      return <ActivityIndicator />;
    } else {
      const body = this.formatBody();

      const data = [{ key: 'body', render: body }];
      return (
        <ErrorBoundary FallbackComponent={Fallback} onError={handleError}>
          <View style={styles.container}>
            {this.formatHeader()}
            <FlatList
              data={data}
              renderItem={this.formatRowForSheet}
              onEndReached={this.handleScrollEndReached}
              onEndReachedThreshold={0.005}
              ListFooterComponent={this.renderFooter}
              keyExtractor={(item: { key: string }, index: number) => index.toString()}
              nestedScrollEnabled
              refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefreshData} />}
            />
          </View>
        </ErrorBoundary>
      );
    }
  }
}

export default withTranslation(undefined, { withRef: true })(SheetData);
