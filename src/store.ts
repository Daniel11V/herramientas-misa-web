// import { Dispatch, applyMiddleware, combineReducers, createStore } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import DatabaseReducer from "./classes/database/reducers";
import PageReducer from "./classes/page/reducers";
import UserReducer from "./classes/user/reducers";
import SongReducer from "./classes/song/reducers";
import AuthorReducer from "./classes/author/reducers";
import RepertoryReducer from "./classes/repertory/reducers";
import { thunk } from "redux-thunk";
import { useDispatch } from "react-redux";

// https://typescript.hotexamples.com/examples/redux/-/combineReducers/typescript-combinereducers-function-examples.html
// import { syncHistoryWithStore, routerReducer, routerMiddleware, push, replace } from 'react-router-redux';
// import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { browserHistory } from 'react-router';
// import thunk from 'redux-thunk';
// import promiseMiddleware from 'redux-promise-middleware';

// import CurrentUser from './reducers/authorize/reducer';
// import UsersRepository from './reducers/users/usersReducer';

// const middleware = routerMiddleware(browserHistory);

// let reudcers = combineReducers({
//   CurrentUser,
//   UsersRepository,
//   routing: routerReducer,
// });

// const logger = store => next => action => {
//   console.log('dispatching', action);
//   let result = next(action);
//   console.log('next state', store.getState());
//   return result;
// };

// export var store = createStore<store.IApplicationStore>(reudcers, applyMiddleware(middleware, thunk, promiseMiddleware(), logger));

// export var navigate = (path: string): void => {
//     store.dispatch(replace(path));
// };

// export type IRootState = ReturnType<typeof RootReducer>;
const store = configureStore({
	reducer: {
		database: DatabaseReducer,
		page: PageReducer,
		user: UserReducer,
		song: SongReducer,
		author: AuthorReducer,
		repertory: RepertoryReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
	devTools: import.meta.env.VITE_ENVIRONMENT !== 'prod', // Activa devTools en modo desarrollo
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export const useAppDispatch: () => TAppDispatch = useDispatch;

export default store;

// export type TStoreState = {
// 	database: TDatabaseState;
// 	page: TPageState;
// 	user: TUserState;
// 	song: TSongState;
// 	author: TAuthorState;
// 	repertory: TRepertoryState;
// };

// export type TStoreState = ReturnType<typeof store.getState>;
// export const useAppSelector: TypedUseSelectorHook<TStoreState> = useSelector;

// export type TActionType =
// 	| TAuthorActionType
// 	| TPageActionType
// 	| TRepertoryActionType
// 	| TSongActionType
// 	| TUserActionType;

// export type TSelectedActionPayload = TAuthorSelectedActionPayload &
// 	TPageSelectedActionPayload &
// 	TRepertorySelectedActionPayload &
// 	TSongSelectedActionPayload &
// 	TUserSelectedActionPayload;

// type TSelectedAction<T extends TActionType> =
// 	TSelectedActionPayload[T] extends undefined
// 		? { type: T }
// 		: { type: T; payload: TSelectedActionPayload[T] };

// export type TDispatch = <T extends TActionType>(
// 	action: TSelectedAction<T>
// ) => Dispatch<TSelectedAction<T>>;

// export const useAppDispatch: () => TDispatch = useDispatch;
