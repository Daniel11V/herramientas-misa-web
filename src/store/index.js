import { applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import CommunityReducer from "./reducers/community";
import UserReducer from "./reducers/user";
import { composeWithDevTools } from 'redux-devtools-extension'

const RootReducer = combineReducers({
    community: CommunityReducer,
    user: UserReducer
})

export default createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk)))