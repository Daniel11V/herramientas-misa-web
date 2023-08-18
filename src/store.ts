import { Store, applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import DatabaseReducer, { TDatabaseState } from "./classes/database/reducers";
import PageReducer, { TPageState } from "./classes/page/reducers";
import UserReducer, { TUserState } from "./classes/user/reducers";
import SongReducer, { TSongState } from "./classes/song/reducers";
import AuthorReducer, { TAuthorState } from "./classes/author/reducers";
import RepertoryReducer, {
	TRepertoryState,
} from "./classes/repertory/reducers";

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

export type TStoreState = {
	database: TDatabaseState;
	page: TPageState;
	user: TUserState;
	song: TSongState;
	author: TAuthorState;
	repertory: TRepertoryState;
};

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
