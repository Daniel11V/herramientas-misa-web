import { applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension'
import DatabaseReducer from "./clases/database/reducers";
import PageReducer from "./clases/page/reducers";
import UserReducer from "./clases/user/reducers";
import SongReducer from "./clases/song/reducers";
import AuthorReducer from "./clases/author/reducers";
import RepertoryReducer from "./clases/repertory/reducers";

const RootReducer = combineReducers({
    database: DatabaseReducer,
    page: PageReducer,
    user: UserReducer,
    song: SongReducer,
    author: AuthorReducer,
    repertory: RepertoryReducer,
})

export default createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk)))