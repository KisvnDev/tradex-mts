import { put, takeLatest } from 'redux-saga/effects';
import { IRequest } from 'interfaces/common';
import store from 'redux-sagas/store';
import { ISymbolInfo } from 'interfaces/market';
import { SEARCH_ADD_SYMBOL, SEARCH_REMOVE_SYMBOL, SEARCH_CLEAR } from 'redux-sagas/actions';
import { SEARCH_PICK_LIST } from 'components/SearchPickList/reducers';

function* doAddSymbol(request: IRequest<ISymbolInfo>) {
  try {
    const searchPickList = store.getState().searchPickList;

    const symbol = searchPickList.find((item) => item.s === request.payload.s);
    if (symbol == null) {
      searchPickList.push(request.payload);
      yield put({
        type: SEARCH_PICK_LIST,
        payload: searchPickList,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* doRemoveSymbol(request: IRequest<ISymbolInfo>) {
  try {
    const searchPickList = store.getState().searchPickList;

    const index = searchPickList.findIndex((item) => item.s === request.payload.s);
    if (index >= 0) {
      searchPickList.splice(index, 1);
      yield put({
        type: SEARCH_PICK_LIST,
        payload: searchPickList,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* doClear() {
  try {
    yield put({
      type: SEARCH_PICK_LIST,
      payload: [],
    });
  } catch (error) {
    console.log(error);
  }
}

export function* addSymbol() {
  yield takeLatest(SEARCH_ADD_SYMBOL, doAddSymbol);
}

export function* removeSymbol() {
  yield takeLatest(SEARCH_REMOVE_SYMBOL, doRemoveSymbol);
}

export function* clearSymbol() {
  yield takeLatest(SEARCH_CLEAR, doClear);
}
