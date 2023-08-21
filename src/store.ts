import { applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import DatabaseReducer from "./classes/database/reducers";
import PageReducer from "./classes/page/reducers";
import UserReducer from "./classes/user/reducers";
import SongReducer from "./classes/song/reducers";
import AuthorReducer, { TAuthorActionTypes } from "./classes/author/reducers";
import RepertoryReducer from "./classes/repertory/reducers";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { TAuthorAction2 } from "./classes/author/actions";

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

const RootReducer = combineReducers({
	database: DatabaseReducer,
	page: PageReducer,
	user: UserReducer,
	song: SongReducer,
	author: AuthorReducer,
	repertory: RepertoryReducer,
});

// export type IRootState = ReturnType<typeof RootReducer>;

const store = createStore(
	RootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);

export default store;

// export type TStoreState = {
// 	database: TDatabaseState;
// 	page: TPageState;
// 	user: TUserState;
// 	song: TSongState;
// 	author: TAuthorState;
// 	repertory: TRepertoryState;
// };

// Infer the `TStoreState` type from the store itself
export type TStoreState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type TDispatch = typeof store.dispatch<TStoreState>;
// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<TStoreState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

const authorDispatch = <T extends TAuthorActionTypes>(
	action: TAuthorAction2<T>
) => dispatch(action);
