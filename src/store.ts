import { combineReducers, configureStore, EntityState, Reducer } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { set, get } from 'lodash-es';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import * as socket from '@/slices/socket';
import * as orders from '@/slices/orders';
import socketSaga from '@/slices/socket/saga';
import ordersSaga from '@/slices/orders/saga';
import { JsonType } from './types';

type ReducerMapType = Record<string, {
  default: Reducer;
  blackList?: string[];
  persist?: boolean;
  initialState: Record<string, unknown> | EntityState<unknown>;
}>;

function* rootSaga(): Generator {
  yield all([
    socketSaga(),
    ordersSaga(),
  ]);
}

const reducerMap: ReducerMapType = {
  socket,
  orders,
};

const [mainWhitelist, mainBlackList] = Object.keys(reducerMap)
  .reduce((acc, key): [string[], string[]] => {
    const { persist, blackList } = reducerMap[key as keyof typeof reducerMap];
    if (persist || blackList) {
      acc[0].push(key);
    } else {
      acc[1].push(key);
    }
    return acc;
  }, [[], []] as [string[], string[]]);

const transform = createTransform(
  null,
  (state: JsonType, key) => {
    const { initialState, blackList = [] } = reducerMap[key as keyof typeof reducerMap];
    blackList.forEach((path) => set(state, path, get(initialState, path)));
    return state;
  },
  { whitelist: mainWhitelist, blacklist: mainBlackList },
);

const persistConfig = {
  key: 'charts',
  storage,
  blacklist: mainBlackList,
  transforms: [transform],
};

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers(Object.keys(reducerMap).reduce((acc, key) => {
  const { default: reducer } = reducerMap[key as keyof typeof reducerMap];
  acc[key as keyof typeof reducerMap] = reducer;
  return acc;
}, {} as Record<string, Reducer>));

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false })
      .concat(sagaMiddleware);
  },
});

persistStore(store);
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;
