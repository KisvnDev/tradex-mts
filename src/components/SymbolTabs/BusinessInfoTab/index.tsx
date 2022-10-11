import React from 'react';
import { ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withErrorBoundary } from 'react-error-boundary';
import { connect } from 'react-redux';
import { handleError, formatNumber } from 'utils/common';
import Fallback from 'components/Fallback';
import SymbolTabRow from 'components/SymbolTabRow';
import { IObject } from 'interfaces/common';
import { ISymbolInfo, ISymbolData } from 'interfaces/market';
import { IState } from 'redux-sagas/reducers';
import { queryBusinessInfo } from './actions';
import styles from './styles';

interface IBusinessInfoTabProps extends React.ClassAttributes<BusinessInfoTab>, WithTranslation {
  currentSymbol: ISymbolInfo | null;
  symbolData: ISymbolData | null;
  businessInfo: IObject | null;

  queryBusinessInfo(params: IObject): void;
}

interface IBusinessInfoTabState {}

class BusinessInfoTab extends React.Component<IBusinessInfoTabProps, IBusinessInfoTabState> {
  private symbolData: ISymbolData;

  constructor(props: IBusinessInfoTabProps) {
    super(props);

    if (this.props.currentSymbol && global.symbolData[this.props.currentSymbol.s]) {
      this.symbolData = global.symbolData[this.props.currentSymbol.s];
    }

    this.state = {};
  }

  componentDidMount() {
    if (this.props.currentSymbol) {
      this.requestData(this.props.currentSymbol.s);
    }
  }

  shouldComponentUpdate(nextProps: IBusinessInfoTabProps) {
    if (this.props.currentSymbol !== nextProps.currentSymbol) {
      if (nextProps.currentSymbol) {
        if (global.symbolData[nextProps.currentSymbol.s]) {
          this.symbolData = global.symbolData[nextProps.currentSymbol.s];
        }

        this.requestData(nextProps.currentSymbol.s);
      } else {
        delete this.symbolData;
      }
    }

    if (
      this.props.symbolData !== nextProps.symbolData &&
      nextProps.symbolData &&
      nextProps.currentSymbol &&
      nextProps.symbolData.s === nextProps.currentSymbol.s
    ) {
      this.symbolData = { ...this.symbolData, ...nextProps.symbolData };
    }

    return true;
  }

  private requestData = (s: string) => {
    const params = {
      code: s,
    };
    this.props.queryBusinessInfo(params);
  };

  render() {
    const { businessInfo } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <SymbolTabRow
          rowLeft={{
            title: 'Market Capital',
            content: businessInfo ? formatNumber(businessInfo.marketCapital as number, 2) : '',
          }}
        />
        <SymbolTabRow
          rowLeft={{
            title: 'Listed Quantity',
            content: businessInfo ? formatNumber(businessInfo.numberOfShares as number) : '',
          }}
        />
        <SymbolTabRow
          rowLeft={{
            title: 'Foreginer Net Buying',
            content:
              this.symbolData && this.symbolData.fr ? formatNumber(this.symbolData.fr.bv - this.symbolData.fr.sv) : '',
          }}
        />
        <SymbolTabRow
          rowLeft={{ title: 'PER', content: businessInfo ? formatNumber(businessInfo.per as number, 2) : '' }}
        />
        <SymbolTabRow
          rowLeft={{ title: 'EPS', content: businessInfo ? formatNumber(businessInfo.eps as number, 2) : '' }}
        />
        <SymbolTabRow
          rowLeft={{ title: 'PBR', content: businessInfo ? formatNumber(businessInfo.pbr as number, 2) : '' }}
        />
        <SymbolTabRow
          rowLeft={{
            title: 'ROE',
            content: businessInfo ? `${formatNumber((businessInfo.roe as number) * 100, 2)}%` : '',
          }}
        />
        <SymbolTabRow
          rowLeft={{
            title: 'ROA',
            content: businessInfo ? `${formatNumber((businessInfo.roa as number) * 100, 2)}%` : '',
          }}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  currentSymbol: state.currentSymbol,
  symbolData: state.currentSymbolQuote,
  businessInfo: state.businessInfo,
});

export default withErrorBoundary(
  withTranslation()(connect(mapStateToProps, { queryBusinessInfo })(BusinessInfoTab)),
  Fallback,
  handleError
);
