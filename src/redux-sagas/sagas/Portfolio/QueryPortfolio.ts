import { call, put, takeLatest } from '@redux-saga/core/effects';
import { SYSTEM_TYPE } from 'global';
import { IRequest } from 'interfaces/common';
import { QUERY_CLIENT_CASH_BALANCE, QUERY_PORTFOLIO_LIST } from 'redux-sagas/actions';
import store from 'redux-sagas/store';
import { QUERY_PORTFOLIO_LIST_SUCCESS } from 'screens/Portfolio/TabPortfolio/reducers';
import { METHOD, query } from 'utils/socketApi';

const isCashBalanceDerivatives = (_: QueryClientCashBalance | EnquiryPortfolio[]): _ is QueryClientCashBalance =>
  store.getState().selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES;
const isDerivativesAccount = () => store.getState().selectedAccount?.type === SYSTEM_TYPE.DERIVATIVES;

const queryUnRealizedPortfolio = () => {
  const uri = 'services/fno/clientportfolio';
  const params = {
    accountNo: store.getState().selectedAccount?.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};
const queryClientCashBalance = () => {
  const uri = isDerivativesAccount() ? 'services/fno/queryclientcashbalance' : 'services/eqt/enquiryportfolio';
  const params = {
    [isDerivativesAccount() ? 'accountNo' : 'accountNumber']: store.getState().selectedAccount?.accountNumber,
  };
  return query(global.domainSocket, uri, METHOD.GET, params);
};

function* doQueryUnRealizedPortfolio(request: IRequest<null>) {
  try {
    const response: Res<ClientPortfolio> = yield call(queryUnRealizedPortfolio);
    yield put({
      type: request.response.success,
      payload: response.data,
    });
  } catch (err) {
    console.log(err);
  }
}

function* doQueryClientCashBalance(request: IRequest<null>) {
  try {
    const response: Res<QueryClientCashBalance | EnquiryPortfolio[]> = yield call(queryClientCashBalance);
    const data = response.data;
    let payload: PortfolioInfo = {} as PortfolioInfo;

    if (isCashBalanceDerivatives(data)) {
      payload = {
        netAssetValue: data.accountSummary?.totalEquity!,
        purchasingPower: Math.min(data.cashInformation?.internal?.EE!, data.cashInformation?.exchange?.EE!),
        accountRatio: Math.max(
          data.portfolioAssessment?.internal?.accountRatio!,
          data.portfolioAssessment?.exchange?.accountRatio!
        ),
      };
    } else {
      const [dataEquity] = data;
      payload = {
        netAssetValue: dataEquity.summary?.netAssetValue!,
        purchasingPower: dataEquity.summary?.PP!,
        profitLoss: dataEquity.summary?.profitLoss!,
        accountRatio: dataEquity.summary?.marginRatio!,
        marketValue: dataEquity.summary?.totalStockMarketValue!,
      };
      store.dispatch({
        type: QUERY_PORTFOLIO_LIST_SUCCESS,
        payload: dataEquity.portfolioList,
      });
    }
    yield put({
      type: request.response.success,
      payload: payload,
    });
  } catch (error) {
    console.log(error);
  }
}

export default function* watchPortfolio() {
  yield takeLatest(QUERY_PORTFOLIO_LIST, doQueryUnRealizedPortfolio);
  yield takeLatest(QUERY_CLIENT_CASH_BALANCE, doQueryClientCashBalance);
}
