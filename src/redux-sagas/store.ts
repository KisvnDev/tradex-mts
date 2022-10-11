import { applyMiddleware, createStore } from 'redux';
import sagaMiddlewareFactory from 'redux-saga';
import { rootReducer } from './reducers';
import sagas from './sagas';

const sagaMiddleware = sagaMiddlewareFactory();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(sagas);

export default store;
