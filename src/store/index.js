import { applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import CommunityReducer from "./reducers/community";
import UserReducer from "./reducers/user";
import DatabaseReducer from "./reducers/database";
import { composeWithDevTools } from 'redux-devtools-extension'

const RootReducer = combineReducers({
    community: CommunityReducer,
    user: UserReducer,
    database: DatabaseReducer,
})

export default createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk)))