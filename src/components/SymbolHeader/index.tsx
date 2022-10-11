import React from 'react';
import { View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Tooltip from 'rn-tooltip';
import { withErrorBoundary } from 'react-error-boundary';
import { LANG } from 'global';
import { handleError } from 'utils/common';
import Fallback from 'components/Fallback';
import UIText from 'components/UiText';
import SymbolSubHeader from './SymbolSubHeader';
import { reloadMarketData } from 'redux-sagas/global-actions';
import { IState } from 'redux-sagas/reducers';
import { ISymbolInfo } from 'interfaces/market';
import { width, Colors } from 'styles';
import globalStyles from 'styles';
import styles from './styles';

interface ISymbolHeaderProps extends React.ClassAttributes<SymbolHeader>, WithTranslation {
  currentSymbol: ISymbolInfo | null;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  componentId: string;
  parentId?: string;
  hideButton?: boolean;

  onPressButton?(symbol: ISymbolInfo): void;
  reloadMarketData(): void;
}

interface ISymbolHeaderState {
  currentSymbolModalError: boolean;
}

class SymbolHeader extends React.Component<ISymbolHeaderProps, ISymbolHeaderState> {
  constructor(props: ISymbolHeaderProps) {
    super(props);

    this.state = {
      currentSymbolModalError: this.props.currentSymbol == null ? true : false,
    };
  }

  shouldComponentUpdate(nextProps: ISymbolHeaderProps) {
    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      if (nextProps.currentSymbol == null) {
        this.setState({ currentSymbolModalError: true });
      } else {
        this.setState({ currentSymbolModalError: false });
      }
    }
    return true;
  }

  private reloadMarketData = () => {
    this.props.reloadMarketData();
    this.setState({ currentSymbolModalError: false });
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.container}>
        {this.props.currentSymbol ? (
          <View style={styles.subContainer}>
            <View style={styles.headerTop}>
              <View style={styles.headerTopName}>
                <Tooltip
                  width={width - 20}
                  backgroundColor={Colors.LIGHT_BLUE}
                  containerStyle={styles.tooltipContainer}
                  popover={
                    <UIText style={styles.headerTopText} allowFontScaling={false} numberOfLines={2}>
                      {global.lang === LANG.VI ? this.props.currentSymbol.n1 : this.props.currentSymbol.n2}
                    </UIText>
                  }
                >
                  <UIText allowFontScaling={false} ellipsizeMode="tail" numberOfLines={1}>
                    {global.lang === LANG.VI ? this.props.currentSymbol.n1 : this.props.currentSymbol.n2}
                  </UIText>
                </Tooltip>
              </View>
              <View style={styles.marketLabel}>
                <UIText allowFontScaling={false} style={[styles.marketLabel, globalStyles[this.props.currentSymbol.m]]}>
                  {this.props.t(this.props.currentSymbol.m)}
                </UIText>
              </View>
            </View>
            <SymbolSubHeader
              buttonLabel={this.props.buttonLabel}
              buttonDisabled={this.props.buttonDisabled}
              onPressButton={this.props.onPressButton}
              componentId={this.props.componentId}
              parentId={this.props.parentId}
              hideButton={this.props.hideButton}
            />
          </View>
        ) : (
          <ActivityIndicator />
        )}
        <Modal animationType="fade" transparent={true} visible={this.state.currentSymbolModalError}>
          <View style={styles.containerModal}>
            <View style={[styles.bodyModal, styles.buttonSectionModal]}>
              <View style={styles.modalTitleContainer}>
                <UIText allowFontScaling={false} style={styles.modalTitle}>
                  {t('An error occured in market data, press OK to refresh')}
                </UIText>
              </View>

              <TouchableOpacity style={[styles.buttonModal, styles.buttonCancelModal]} onPress={this.reloadMarketData}>
                <UIText allowFontScaling={false} style={styles.buttonTitleCancelModal}>
                  {t('OK')}
                </UIText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
});

export default withErrorBoundary(
  withTranslation()(
    connect(mapStateToProps, {
      reloadMarketData,
    })(SymbolHeader)
  ),
  Fallback,
  handleError
);
