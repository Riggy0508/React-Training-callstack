// import { applyMiddleware, Store } from 'redux';
// import {legacy_createStore as createStore} from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer, { RootState } from './reducers';
// import {configureStore} from '@reduxjs/toolkit';

// const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
//   });
// export default store;

import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer, { RootState } from '../store/reducers';

const store: Store<RootState> = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;

// function configureStore(arg0: { reducer: import("redux").Reducer<{ lotteries: import("./reducers/lotteryReducer").LotteryState; }, import("./actions/lotteryAction").GetLotteriesActions, Partial<{ lotteries: never; }>>; middleware: (getDefaultMiddleware: any) => any; }) {
//   throw new Error('Function not implemented.');
// }
