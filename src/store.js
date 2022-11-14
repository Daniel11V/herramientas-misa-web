import { applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension'
import DatabaseReducer from "./clases/database/reducers";
import UserReducer from "./clases/user/reducers";
import SongReducer from "./clases/song/reducers";
import RepertoryReducer from "./clases/repertory/reducers";

const RootReducer = combineReducers({
    database: DatabaseReducer,
    user: UserReducer,
    song: SongReducer,
    repertory: RepertoryReducer,
})

export default createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk)))