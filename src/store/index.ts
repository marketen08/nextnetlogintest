import { combineReducers, configureStore } from '@reduxjs/toolkit';

// ** Persist
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

// ** Reducers  
import userReducer from './features/user';
import dataReducer from './features/data';
import { api } from './services/api';
import { kpiApi } from './services/kpis';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
    debug: false
}


const combinedReducers = combineReducers({
    [api.reducerPath]: api.reducer,
    [kpiApi.reducerPath]: kpiApi.reducer,
    user: userReducer,
    data: dataReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);
const middlewares = [api.middleware, kpiApi.middleware];

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                warnAfter: 512
            },
            immutableCheck: { warnAfter: 512 },
        }).concat(middlewares),
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch