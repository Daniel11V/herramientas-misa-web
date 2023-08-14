import { Store, applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import DatabaseReducer from "./clases/database/reducers";
import PageReducer from "./clases/page/reducers";
import UserReducer from "./clases/user/reducers";
import SongReducer from "./clases/song/reducers";
import AuthorReducer, { AuthorState } from "./clases/author/reducers";
import RepertoryReducer from "./clases/repertory/reducers";

interface StoreState = {
	database: DatabaseState;
	page: PageState;
	user: UserState;
	song: SongState;
	author: AuthorState;
	repertory: RepertoryState;
};

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

const store = createStore<StoreState>(
	RootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);

export default store;
